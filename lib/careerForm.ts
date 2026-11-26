/**
 * Careers: job posting + application form model. Client-safe (no server imports) so the
 * public form, the dashboard builder and the API all share one set of rules.
 */

export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'url'
  | 'number'
  | 'date'
  | 'yes_no'
  | 'single_choice'
  | 'multi_choice'
  | 'dropdown'
  | 'scale'
  | 'consent';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  help?: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // single_choice, multi_choice, dropdown
  min?: number; // number, scale
  max?: number; // number, scale
  maxLength?: number; // short_text, long_text
  showIf?: { questionId: string; equals: string } | null;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export type JobStatus = 'draft' | 'open' | 'closed';

export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  employmentType: string;
  location: string;
  commitment: string; // e.g. "5–10 hours a week"
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  perks: string[];
  status: JobStatus;
  closesAt: string | null;
  requireDiscord: boolean;
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export type ApplicationStatus = 'new' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
export const APPLICATION_STATUSES: ApplicationStatus[] = ['new', 'reviewing', 'interview', 'accepted', 'rejected'];
export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  interview: 'Interview',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  applicant: { name: string; discord: string; email?: string; discordId?: string; avatarUrl?: string };
  answers: { questionId: string; section: string; label: string; type: QuestionType; value: AnswerValue }[];
  status: ApplicationStatus;
  rating: number | null;
  staffNotes: string;
  history: { at: string; by: string; action: string }[];
  createdAt: string;
  updatedAt: string;
}

export const QUESTION_TYPES: { type: QuestionType; label: string; hint: string }[] = [
  { type: 'short_text', label: 'Short answer', hint: 'One line of text' },
  { type: 'long_text', label: 'Paragraph', hint: 'Longer written answer' },
  { type: 'single_choice', label: 'Single choice', hint: 'Pick one option' },
  { type: 'multi_choice', label: 'Multiple choice', hint: 'Pick any options' },
  { type: 'dropdown', label: 'Dropdown', hint: 'Pick one from a list' },
  { type: 'yes_no', label: 'Yes / No', hint: 'Simple yes or no' },
  { type: 'scale', label: 'Scale', hint: 'Rate from 1 to N' },
  { type: 'number', label: 'Number', hint: 'Age, hours, MMR…' },
  { type: 'date', label: 'Date', hint: 'Birthday, start date…' },
  { type: 'url', label: 'Link', hint: 'Portfolio, tracker, socials' },
  { type: 'email', label: 'Email', hint: 'Email address' },
  { type: 'consent', label: 'Agreement', hint: 'Checkbox they must tick' },
];
export const TYPE_LABEL = Object.fromEntries(QUESTION_TYPES.map((q) => [q.type, q.label])) as Record<QuestionType, string>;
export const HAS_OPTIONS: QuestionType[] = ['single_choice', 'multi_choice', 'dropdown'];
/** Question types another question can depend on ("only show if"). */
export const CONDITION_SOURCES: QuestionType[] = ['yes_no', 'single_choice', 'dropdown'];

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'job'
  );
}

export function isJobAcceptingApplications(job: Pick<Job, 'status' | 'closesAt'>): boolean {
  return job.status === 'open' && (!job.closesAt || new Date(job.closesAt).getTime() > Date.now());
}

export function conditionOptions(q: Question): string[] {
  return q.type === 'yes_no' ? ['Yes', 'No'] : q.options || [];
}

export function isVisible(q: Question, answers: Answers, all: Question[]): boolean {
  if (!q.showIf) return true;
  const source = all.find((x) => x.id === q.showIf!.questionId);
  if (!source || !isVisible(source, answers, all)) return false;
  return answers[source.id] === q.showIf.equals;
}

export function allQuestions(job: Pick<Job, 'sections'>): Question[] {
  return job.sections.flatMap((s) => s.questions);
}

function isEmpty(v: AnswerValue | undefined): boolean {
  return v === undefined || (Array.isArray(v) ? v.length === 0 : v.trim() === '');
}

/** Returns an error message for one answer, or null when it's fine. */
export function validateAnswer(q: Question, value: AnswerValue | undefined): string | null {
  if (q.type === 'consent') return q.required && value !== 'Yes' ? 'Please tick this box to continue.' : null;
  if (isEmpty(value)) return q.required ? 'This question is required.' : null;
  const v = value as AnswerValue;
  const s = Array.isArray(v) ? '' : v.trim();
  switch (q.type) {
    case 'short_text':
    case 'long_text': {
      const limit = q.maxLength || (q.type === 'short_text' ? 200 : 4000);
      return s.length > limit ? `Keep it under ${limit} characters.` : null;
    }
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? null : 'Enter a valid email address.';
    case 'url':
      return /^https?:\/\/[^\s.]+\.\S+$/i.test(s) ? null : 'Enter a full link starting with https://';
    case 'number': {
      const n = Number(s);
      if (Number.isNaN(n)) return 'Enter a number.';
      if (q.min !== undefined && n < q.min) return `Must be ${q.min} or more.`;
      if (q.max !== undefined && n > q.max) return `Must be ${q.max} or less.`;
      return null;
    }
    case 'date':
      return Number.isNaN(Date.parse(s)) ? 'Enter a valid date.' : null;
    case 'yes_no':
      return s === 'Yes' || s === 'No' ? null : 'Choose yes or no.';
    case 'single_choice':
    case 'dropdown':
      return (q.options || []).includes(s) ? null : 'Choose one of the options.';
    case 'multi_choice':
      return Array.isArray(v) && v.every((x) => (q.options || []).includes(x)) ? null : 'Choose from the options.';
    case 'scale': {
      const n = Number(s);
      const min = q.min ?? 1;
      const max = q.max ?? 5;
      return Number.isInteger(n) && n >= min && n <= max ? null : `Choose a value from ${min} to ${max}.`;
    }
  }
  return null;
}

/** Validates the visible questions of one section. */
export function validateSection(section: FormSection, answers: Answers, all: Question[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const q of section.questions) {
    if (!isVisible(q, answers, all)) continue;
    const err = validateAnswer(q, answers[q.id]);
    if (err) errors[q.id] = err;
  }
  return errors;
}

export function formatAnswer(value: AnswerValue | undefined): string {
  if (value === undefined) return '';
  return Array.isArray(value) ? value.join(', ') : value;
}

// ---------- Templates ----------

type QuestionSeed = Omit<Question, 'id' | 'required'> & { required?: boolean; key?: string; showIfKey?: { key: string; equals: string } };
type SectionSeed = { title: string; description?: string; questions: QuestionSeed[] };

function build(sections: SectionSeed[]): FormSection[] {
  const ids: Record<string, string> = {};
  return sections.map((s) => ({
    id: uid('sec'),
    title: s.title,
    description: s.description,
    questions: s.questions.map(({ key, showIfKey, ...q }) => {
      const id = uid('q');
      if (key) ids[key] = id;
      return {
        ...q,
        id,
        required: q.required ?? true,
        showIf: showIfKey && ids[showIfKey.key] ? { questionId: ids[showIfKey.key], equals: showIfKey.equals } : null,
      };
    }),
  }));
}

const ABOUT_YOU: SectionSeed = {
  title: 'About you',
  questions: [
    { type: 'number', label: 'How old are you?', min: 13, max: 99 },
    { type: 'dropdown', label: 'Where are you based?', options: ['Germany', 'Austria', 'Switzerland', 'Rest of EU', 'UK', 'North America', 'Other'] },
    { type: 'multi_choice', label: 'Which languages do you speak?', options: ['German', 'English', 'French', 'Spanish', 'Other'] },
  ],
};

const AGREEMENT: SectionSeed = {
  title: 'Last step',
  questions: [
    { type: 'long_text', label: 'Anything else you want us to know?', required: false, maxLength: 1000 },
    { type: 'consent', label: 'I confirm my answers are true and I agree to FAZIX storing them to review my application.' },
  ],
};

export interface JobTemplate {
  id: string;
  name: string;
  description: string;
  job: Partial<Job>;
  sections: () => FormSection[];
}

export const JOB_TEMPLATES: JobTemplate[] = [
  {
    id: 'staff',
    name: 'Staff / Moderator',
    description: 'Discord moderation, support tickets, community',
    job: {
      title: 'Discord Moderator',
      department: 'Staff',
      employmentType: 'Volunteer',
      commitment: '5–10 hours a week',
      summary: 'Keep the FAZIX Discord friendly, safe and active.',
      responsibilities: ['Moderate chat and voice channels', 'Answer support tickets', 'Help run community events'],
      requirements: ['Active on Discord most days', 'Calm and fair when things get heated', '16 or older'],
      perks: ['Staff role and access to the staff team', 'Experience in a growing esports org'],
    },
    sections: () =>
      build([
        ABOUT_YOU,
        {
          title: 'Experience',
          questions: [
            { key: 'modExp', type: 'yes_no', label: 'Have you moderated a Discord server before?' },
            { type: 'long_text', label: 'Which servers, how big were they, and what did you do there?', showIfKey: { key: 'modExp', equals: 'Yes' } },
            { type: 'scale', label: 'How well do you know Discord permissions and bots?', min: 1, max: 5 },
            { type: 'number', label: 'How many hours a week can you give?', min: 1, max: 60 },
          ],
        },
        {
          title: 'Scenarios',
          description: 'No wrong answers. We want to see how you think.',
          questions: [
            { type: 'long_text', label: 'Two members start arguing in general chat and it gets personal. What do you do?' },
            { type: 'long_text', label: 'Someone reports another staff member for abusing their role. How do you handle it?' },
          ],
        },
        AGREEMENT,
      ]),
  },
  {
    id: 'content',
    name: 'Content Creator / Editor',
    description: 'Video editing, graphics, social media',
    job: {
      title: 'Video Editor',
      department: 'Content',
      employmentType: 'Volunteer',
      commitment: '3–6 hours a week',
      summary: 'Turn our matches and streams into highlights people want to watch.',
      responsibilities: ['Edit highlight videos and shorts', 'Work with the social media team on posting'],
      requirements: ['A portfolio of edits', 'Premiere Pro, DaVinci Resolve or After Effects'],
      perks: ['Credit on every video', 'Access to raw match footage'],
    },
    sections: () =>
      build([
        ABOUT_YOU,
        {
          title: 'Your work',
          questions: [
            { type: 'url', label: 'Link to your portfolio or best edit' },
            { type: 'multi_choice', label: 'Which software do you use?', options: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'CapCut', 'Photoshop', 'Other'] },
            { type: 'single_choice', label: 'What do you want to make most?', options: ['Long-form highlights', 'Shorts / TikToks', 'Thumbnails & graphics', 'A mix'] },
            { type: 'number', label: 'How many hours a week can you give?', min: 1, max: 60 },
          ],
        },
        AGREEMENT,
      ]),
  },
  {
    id: 'coach',
    name: 'Coach / Analyst',
    description: 'Replay review, strategy, team management',
    job: {
      title: 'Academy Coach',
      department: 'Esports',
      employmentType: 'Volunteer',
      commitment: '3 evenings a week',
      summary: 'Help our academy roster improve through replay review and structured practice.',
      responsibilities: ['Run replay reviews', 'Plan scrims and practice blocks', 'Give players clear feedback'],
      requirements: ['Grand Champion or higher, or proven coaching results', 'Good communication in English or German'],
      perks: ['Coach role on a competitive roster', 'Path to coaching the main team'],
    },
    sections: () =>
      build([
        ABOUT_YOU,
        {
          title: 'Rocket League',
          questions: [
            { type: 'dropdown', label: 'Highest rank (3v3)', options: ['Champion', 'Grand Champion 1', 'Grand Champion 2', 'Grand Champion 3', 'Supersonic Legend'] },
            { type: 'url', label: 'RL Tracker link' },
            { key: 'coached', type: 'yes_no', label: 'Have you coached a team before?' },
            { type: 'long_text', label: 'Which teams, and what results did you get?', showIfKey: { key: 'coached', equals: 'Yes' } },
            { type: 'long_text', label: 'How would you run a replay review after a lost series?' },
          ],
        },
        AGREEMENT,
      ]),
  },
  {
    id: 'player',
    name: 'Player tryout',
    description: 'Competitive roster tryouts',
    job: {
      title: 'Academy Player Tryout',
      department: 'Esports',
      employmentType: 'Tryout',
      commitment: 'Scrims 3–4 evenings a week',
      summary: 'We are looking for hungry players to join the FAZIX Academy.',
      requirements: ['Grand Champion 2 or higher', 'Available for evening scrims (CET)'],
      perks: ['Structured practice with a coach', 'Tournament entries paid by FAZIX'],
    },
    sections: () =>
      build([
        ABOUT_YOU,
        {
          title: 'Competitive',
          questions: [
            { type: 'short_text', label: 'In-game name' },
            { type: 'url', label: 'RL Tracker link' },
            { type: 'dropdown', label: 'Highest rank (3v3)', options: ['Grand Champion 1', 'Grand Champion 2', 'Grand Champion 3', 'Supersonic Legend'] },
            { type: 'single_choice', label: 'Preferred role', options: ['First man / striker', 'Second man / playmaker', 'Third man / anchor', 'Flexible'] },
            { type: 'long_text', label: 'Teams and tournaments you have played', required: false },
          ],
        },
        AGREEMENT,
      ]),
  },
];

export function blankSections(): FormSection[] {
  return build([{ title: 'About you', questions: [{ type: 'long_text', label: 'Why do you want to join FAZIX?' }] }, AGREEMENT]);
}
