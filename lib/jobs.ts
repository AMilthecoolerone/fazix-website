import { readDoc, updateDoc, newId } from '@/lib/store';
import { clampText } from '@/lib/session';

export type QuestionType = 'short' | 'long' | 'number' | 'url' | 'select' | 'checkbox';

export interface JobQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: string[]; // select only
  placeholder?: string;
}

export type JobStatus = 'open' | 'closed' | 'draft';

export interface Job {
  id: string;
  title: string;
  department: string; // e.g. Esports, Content, Staff
  type: string; // e.g. Volunteer, Part-time
  location: string;
  summary: string;
  description: string;
  requirements: string[];
  questions: JobQuestion[];
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type ApplicationStatus = 'new' | 'reviewing' | 'interview' | 'accepted' | 'rejected';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicant: { name: string; discord: string; email?: string; discordId?: string; avatarUrl?: string };
  answers: { questionId: string; label: string; value: string }[];
  status: ApplicationStatus;
  staffNotes: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const JOBS_KEY = 'jobs';
const APPS_KEY = 'job-applications';

export const QUESTION_TYPES: QuestionType[] = ['short', 'long', 'number', 'url', 'select', 'checkbox'];
export const APPLICATION_STATUSES: ApplicationStatus[] = ['new', 'reviewing', 'interview', 'accepted', 'rejected'];

export async function listJobs(opts: { publicOnly?: boolean } = {}): Promise<Job[]> {
  const jobs = await readDoc<Job[]>(JOBS_KEY, []);
  return opts.publicOnly ? jobs.filter((j) => j.status === 'open') : jobs;
}

export async function getJob(id: string): Promise<Job | null> {
  return (await listJobs()).find((j) => j.id === id) ?? null;
}

/** Validates and normalises untrusted job input from the dashboard. */
export function sanitizeJob(raw: Record<string, unknown>): Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> {
  const questions = Array.isArray(raw.questions) ? raw.questions.slice(0, 30) : [];
  return {
    title: clampText(raw.title, 120),
    department: clampText(raw.department, 60) || 'General',
    type: clampText(raw.type, 60) || 'Volunteer',
    location: clampText(raw.location, 60) || 'Remote',
    summary: clampText(raw.summary, 300),
    description: clampText(raw.description, 8000),
    requirements: (Array.isArray(raw.requirements) ? raw.requirements : [])
      .map((r) => clampText(r, 200))
      .filter(Boolean)
      .slice(0, 20),
    status: (['open', 'closed', 'draft'] as const).includes(raw.status as JobStatus) ? (raw.status as JobStatus) : 'draft',
    questions: questions
      .map((q: Record<string, unknown>) => {
        const type = QUESTION_TYPES.includes(q?.type as QuestionType) ? (q.type as QuestionType) : 'short';
        const options =
          type === 'select'
            ? (Array.isArray(q.options) ? q.options : []).map((o) => clampText(o, 80)).filter(Boolean).slice(0, 20)
            : undefined;
        return {
          id: clampText(q?.id, 40) || newId('q'),
          label: clampText(q?.label, 200),
          type,
          required: Boolean(q?.required),
          options,
          placeholder: clampText(q?.placeholder, 120) || undefined,
        };
      })
      .filter((q) => q.label),
  };
}

export async function createJob(input: ReturnType<typeof sanitizeJob>, by: string): Promise<Job> {
  const now = new Date().toISOString();
  const job: Job = { ...input, id: newId('job'), createdAt: now, updatedAt: now, createdBy: by };
  await updateDoc<Job[], void>(JOBS_KEY, [], (jobs) => {
    jobs.unshift(job);
  });
  return job;
}

export async function updateJob(id: string, input: Partial<ReturnType<typeof sanitizeJob>>): Promise<Job | null> {
  return updateDoc<Job[], Job | null>(JOBS_KEY, [], (jobs) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return null;
    Object.assign(job, input, { updatedAt: new Date().toISOString() });
    return job;
  });
}

export async function deleteJob(id: string): Promise<boolean> {
  return updateDoc<Job[], boolean>(JOBS_KEY, [], (jobs) => {
    const i = jobs.findIndex((j) => j.id === id);
    if (i === -1) return false;
    jobs.splice(i, 1);
    return true;
  });
}

/** Checks answers against the job's questions. Returns an error message or the cleaned answers. */
export function validateAnswers(job: Job, raw: unknown): { error: string } | { answers: JobApplication['answers'] } {
  const given = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const answers: JobApplication['answers'] = [];
  for (const q of job.questions) {
    const value = q.type === 'checkbox' ? (given[q.id] === true || given[q.id] === 'true' ? 'Yes' : 'No') : clampText(given[q.id], q.type === 'long' ? 4000 : 500);
    if (q.required && (q.type === 'checkbox' ? value !== 'Yes' : !value)) return { error: `"${q.label}" is required.` };
    if (value && q.type === 'number' && Number.isNaN(Number(value))) return { error: `"${q.label}" must be a number.` };
    if (value && q.type === 'url' && !/^https?:\/\/\S+$/i.test(value)) return { error: `"${q.label}" must be a link starting with https://` };
    if (value && q.type === 'select' && !(q.options || []).includes(value)) return { error: `Pick a valid option for "${q.label}".` };
    answers.push({ questionId: q.id, label: q.label, value });
  }
  return { answers };
}

export async function listApplications(jobId?: string): Promise<JobApplication[]> {
  const apps = await readDoc<JobApplication[]>(APPS_KEY, []);
  return jobId ? apps.filter((a) => a.jobId === jobId) : apps;
}

export async function addApplication(app: Omit<JobApplication, 'id' | 'status' | 'staffNotes' | 'createdAt' | 'updatedAt'>): Promise<JobApplication> {
  const now = new Date().toISOString();
  const full: JobApplication = { ...app, id: newId('app'), status: 'new', staffNotes: '', createdAt: now, updatedAt: now };
  await updateDoc<JobApplication[], void>(APPS_KEY, [], (apps) => {
    apps.unshift(full);
  });
  return full;
}

export async function updateApplication(
  id: string,
  patch: { status?: ApplicationStatus; staffNotes?: string },
  by: string
): Promise<JobApplication | null> {
  return updateDoc<JobApplication[], JobApplication | null>(APPS_KEY, [], (apps) => {
    const app = apps.find((a) => a.id === id);
    if (!app) return null;
    if (patch.status && APPLICATION_STATUSES.includes(patch.status)) app.status = patch.status;
    if (typeof patch.staffNotes === 'string') app.staffNotes = patch.staffNotes.slice(0, 4000);
    app.reviewedBy = by;
    app.updatedAt = new Date().toISOString();
    return app;
  });
}

export async function deleteApplication(id: string): Promise<boolean> {
  return updateDoc<JobApplication[], boolean>(APPS_KEY, [], (apps) => {
    const i = apps.findIndex((a) => a.id === id);
    if (i === -1) return false;
    apps.splice(i, 1);
    return true;
  });
}
