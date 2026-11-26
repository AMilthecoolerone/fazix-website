import { readDoc, updateDoc, newId } from '@/lib/store';
import { clampText } from '@/lib/session';
import {
  APPLICATION_STATUSES,
  HAS_OPTIONS,
  QUESTION_TYPES,
  STATUS_LABEL,
  allQuestions,
  isVisible,
  slugify,
  validateAnswer,
  type Answers,
  type Application,
  type ApplicationStatus,
  type FormSection,
  type Job,
  type JobStatus,
  type Question,
  type QuestionType,
} from '@/lib/careerForm';

export type { Job, Application } from '@/lib/careerForm';

const JOBS_KEY = 'jobs';
const APPS_KEY = 'job-applications';
const TYPES = QUESTION_TYPES.map((t) => t.type);

const list = (v: unknown, max: number, len: number): string[] =>
  (Array.isArray(v) ? v : []).map((x) => clampText(x, len)).filter(Boolean).slice(0, max);
const num = (v: unknown): number | undefined => (v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? undefined : Number(v));

/** Converts jobs saved by the first version (flat `questions`, `type`, `description`). */
function migrate(raw: Record<string, unknown>): Job {
  if (Array.isArray(raw.sections)) return raw as unknown as Job;
  const oldTypes: Record<string, QuestionType> = { short: 'short_text', long: 'long_text', number: 'number', url: 'url', select: 'dropdown', checkbox: 'consent' };
  const questions = (Array.isArray(raw.questions) ? raw.questions : []).map((q: Record<string, unknown>) => ({
    ...(q as object),
    type: oldTypes[q.type as string] || 'short_text',
  })) as Question[];
  return {
    ...(raw as object),
    slug: slugify(String(raw.title || 'job')) + '-' + String(raw.id).slice(-4),
    employmentType: String(raw.type || 'Volunteer'),
    commitment: '',
    about: String(raw.description || ''),
    responsibilities: [],
    requirements: (raw.requirements as string[]) || [],
    niceToHave: [],
    perks: [],
    closesAt: null,
    requireDiscord: false,
    sections: [{ id: 'sec_main', title: 'Application', questions }],
  } as unknown as Job;
}

export async function listJobs(): Promise<Job[]> {
  const jobs = await readDoc<Record<string, unknown>[]>(JOBS_KEY, []);
  return jobs.map(migrate);
}

export async function getJob(id: string): Promise<Job | null> {
  return (await listJobs()).find((j) => j.id === id) ?? null;
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  return (await listJobs()).find((j) => j.slug === slug) ?? null;
}

function sanitizeQuestion(raw: Record<string, unknown>): Question | null {
  const type = TYPES.includes(raw?.type as QuestionType) ? (raw.type as QuestionType) : 'short_text';
  const label = clampText(raw?.label, 300);
  if (!label) return null;
  const q: Question = {
    id: clampText(raw.id, 40) || newId('q'),
    type,
    label,
    help: clampText(raw.help, 300) || undefined,
    placeholder: clampText(raw.placeholder, 120) || undefined,
    required: Boolean(raw.required),
    showIf: null,
  };
  if (HAS_OPTIONS.includes(type)) q.options = Array.from(new Set(list(raw.options, 30, 100)));
  if (type === 'number' || type === 'scale') {
    q.min = num(raw.min);
    q.max = num(raw.max);
  }
  if (type === 'scale') {
    q.min = Math.max(0, Math.min(1, q.min ?? 1));
    q.max = Math.max(3, Math.min(10, q.max ?? 5));
  }
  if (type === 'short_text' || type === 'long_text') q.maxLength = num(raw.maxLength) ? Math.min(type === 'short_text' ? 200 : 4000, Math.max(10, num(raw.maxLength)!)) : undefined;
  const cond = raw.showIf as { questionId?: unknown; equals?: unknown } | null;
  if (cond && cond.questionId && cond.equals) q.showIf = { questionId: clampText(cond.questionId, 40), equals: clampText(cond.equals, 100) };
  return q;
}

/** Validates and normalises job input from the dashboard. */
export function sanitizeJob(raw: Record<string, unknown>) {
  const sections: FormSection[] = (Array.isArray(raw.sections) ? raw.sections : []).slice(0, 12).map((s: Record<string, unknown>) => ({
    id: clampText(s?.id, 40) || newId('sec'),
    title: clampText(s?.title, 120) || 'Questions',
    description: clampText(s?.description, 500) || undefined,
    questions: (Array.isArray(s?.questions) ? s.questions : [])
      .slice(0, 40)
      .map(sanitizeQuestion)
      .filter((q): q is Question => q !== null),
  }));
  // Drop conditions that point at a missing question or one that comes later.
  const order = sections.flatMap((s) => s.questions.map((q) => q.id));
  for (const s of sections)
    for (const q of s.questions)
      if (q.showIf && !(order.indexOf(q.showIf.questionId) > -1 && order.indexOf(q.showIf.questionId) < order.indexOf(q.id))) q.showIf = null;

  const closes = clampText(raw.closesAt, 40);
  return {
    title: clampText(raw.title, 120),
    slug: slugify(clampText(raw.slug, 80) || clampText(raw.title, 120)),
    department: clampText(raw.department, 60) || 'General',
    employmentType: clampText(raw.employmentType, 60) || 'Volunteer',
    location: clampText(raw.location, 60) || 'Remote',
    commitment: clampText(raw.commitment, 80),
    summary: clampText(raw.summary, 300),
    about: clampText(raw.about, 8000),
    responsibilities: list(raw.responsibilities, 20, 300),
    requirements: list(raw.requirements, 20, 300),
    niceToHave: list(raw.niceToHave, 20, 300),
    perks: list(raw.perks, 20, 300),
    status: (['open', 'closed', 'draft'] as const).includes(raw.status as JobStatus) ? (raw.status as JobStatus) : 'draft',
    closesAt: closes && !Number.isNaN(Date.parse(closes)) ? new Date(closes).toISOString() : null,
    requireDiscord: Boolean(raw.requireDiscord),
    sections,
  };
}

function uniqueSlug(slug: string, jobs: Job[], selfId?: string): string {
  let s = slug;
  let n = 2;
  while (jobs.some((j) => j.slug === s && j.id !== selfId)) s = `${slug}-${n++}`;
  return s;
}

export async function createJob(input: ReturnType<typeof sanitizeJob>, by: string): Promise<Job> {
  const now = new Date().toISOString();
  return updateDoc<Record<string, unknown>[], Job>(JOBS_KEY, [], (raw) => {
    const jobs = raw.map(migrate);
    const job: Job = { ...input, slug: uniqueSlug(input.slug, jobs), id: newId('job'), createdAt: now, updatedAt: now, createdBy: by };
    raw.unshift(job as unknown as Record<string, unknown>);
    return job;
  });
}

export async function updateJob(id: string, input: ReturnType<typeof sanitizeJob>): Promise<Job | null> {
  return updateDoc<Record<string, unknown>[], Job | null>(JOBS_KEY, [], (raw) => {
    const jobs = raw.map(migrate);
    const i = jobs.findIndex((j) => j.id === id);
    if (i === -1) return null;
    const job: Job = { ...jobs[i], ...input, slug: uniqueSlug(input.slug, jobs, id), updatedAt: new Date().toISOString() };
    raw[i] = job as unknown as Record<string, unknown>;
    return job;
  });
}

export async function deleteJob(id: string): Promise<boolean> {
  return updateDoc<Record<string, unknown>[], boolean>(JOBS_KEY, [], (raw) => {
    const i = raw.findIndex((j) => j.id === id);
    if (i === -1) return false;
    raw.splice(i, 1);
    return true;
  });
}

/** Checks a submission against the job's form. Hidden questions are dropped. */
export function checkSubmission(job: Job, raw: unknown): { error: string } | { answers: Application['answers'] } {
  const given = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const answers: Answers = {};
  for (const q of allQuestions(job)) {
    const v = given[q.id];
    if (q.type === 'multi_choice') answers[q.id] = Array.isArray(v) ? v.map((x) => clampText(x, 100)).filter(Boolean).slice(0, 30) : [];
    else if (typeof v === 'string' || typeof v === 'number') answers[q.id] = clampText(String(v), 4000);
  }
  const all = allQuestions(job);
  const out: Application['answers'] = [];
  for (const s of job.sections) {
    for (const q of s.questions) {
      if (!isVisible(q, answers, all)) continue;
      const err = validateAnswer(q, answers[q.id]);
      if (err) return { error: `${q.label}: ${err}` };
      out.push({ questionId: q.id, section: s.title, label: q.label, type: q.type, value: answers[q.id] ?? '' });
    }
  }
  return { answers: out };
}

export async function listApplications(jobId?: string): Promise<Application[]> {
  const apps = await readDoc<Application[]>(APPS_KEY, []);
  const norm = apps.map((a) => ({ rating: null, history: [], ...a }));
  return jobId ? norm.filter((a) => a.jobId === jobId) : norm;
}

export async function hasApplied(jobId: string, discordId: string): Promise<boolean> {
  return (await listApplications(jobId)).some((a) => a.applicant.discordId === discordId);
}

export async function addApplication(app: Pick<Application, 'jobId' | 'jobTitle' | 'applicant' | 'answers'>): Promise<Application> {
  const now = new Date().toISOString();
  const full: Application = { ...app, id: newId('app'), status: 'new', rating: null, staffNotes: '', history: [{ at: now, by: app.applicant.name, action: 'Applied' }], createdAt: now, updatedAt: now };
  await updateDoc<Application[], void>(APPS_KEY, [], (apps) => {
    apps.unshift(full);
  });
  return full;
}

export async function updateApplication(
  id: string,
  patch: { status?: unknown; staffNotes?: unknown; rating?: unknown },
  by: string
): Promise<Application | null> {
  return updateDoc<Application[], Application | null>(APPS_KEY, [], (apps) => {
    const app = apps.find((a) => a.id === id);
    if (!app) return null;
    app.history ||= [];
    const now = new Date().toISOString();
    if (APPLICATION_STATUSES.includes(patch.status as ApplicationStatus) && patch.status !== app.status) {
      app.status = patch.status as ApplicationStatus;
      app.history.push({ at: now, by, action: `Moved to ${STATUS_LABEL[app.status]}` });
    }
    if (typeof patch.staffNotes === 'string' && patch.staffNotes !== app.staffNotes) {
      app.staffNotes = patch.staffNotes.slice(0, 4000);
      app.history.push({ at: now, by, action: 'Updated notes' });
    }
    if (patch.rating === null || (Number.isInteger(patch.rating) && (patch.rating as number) >= 1 && (patch.rating as number) <= 5)) {
      if (patch.rating !== app.rating) {
        app.rating = patch.rating as number | null;
        app.history.push({ at: now, by, action: app.rating ? `Rated ${app.rating}/5` : 'Cleared rating' });
      }
    }
    app.history = app.history.slice(-50);
    app.updatedAt = now;
    return app;
  });
}

export async function deleteApplication(id: string): Promise<boolean> {
  return updateDoc<Application[], boolean>(APPS_KEY, [], (apps) => {
    const i = apps.findIndex((a) => a.id === id);
    if (i === -1) return false;
    apps.splice(i, 1);
    return true;
  });
}
