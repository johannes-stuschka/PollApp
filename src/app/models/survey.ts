/** One answer option of a question, with its current number of votes. */
export interface Answer {
  /** Text shown next to the checkbox, e.g. "Half a day". */
  text: string;
  /** How many participants chose this answer. */
  votes: number;
}

/** A question of a survey with its answer options. */
export interface Question {
  /** The question itself, e.g. "Which date would work best for you?". */
  text: string;
  /** `true` if participants may pick more than one answer. */
  allowMultiple: boolean;
  /** Answer options in display order (A, B, C, …). */
  answers: Answer[];
}

/** A survey as the UI uses it. */
export interface Survey {
  /** Unique id from the database, used in the URL `#/survey/:id`. */
  id: number;
  /** One of {@link CATEGORIES}. */
  category: string;
  /** Survey name shown on cards and in the detail view. */
  title: string;
  /** Optional describing text. */
  description?: string;
  /** Last day of the survey as 'YYYY-MM-DD'. Without it the survey never ends. */
  endDate?: string;
  /** At least one question. */
  questions: Question[];
}

/** All categories a survey can belong to (Figma "Drop down & menu"). */
export const CATEGORIES = [
  'Team Activities',
  'Health & Wellness',
  'Gaming & Entertainment',
  'Education & Learning',
  'Lifestyle & Preferences',
  'Technology & Innovation',
];

/**
 * Returns a local date as 'YYYY-MM-DD', comparable with {@link Survey.endDate} as a string.
 *
 * @param offsetDays - Days to add to today, negative for the past.
 * @returns The date, e.g. '2026-11-27'.
 */
export function today(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Tells whether a survey is closed. The end date itself is still an open day.
 *
 * @param survey - The survey to check.
 * @returns `true` if the end date lies before today.
 */
export function isPast(survey: Survey): boolean {
  return !!survey.endDate && survey.endDate < today();
}

/**
 * Sort compare function: surveys with an end date first (earliest first), open-ended ones last.
 *
 * @param a - First survey.
 * @param b - Second survey.
 * @returns Negative, zero or positive like any `Array.sort` compare function.
 */
export function byEndDate(a: Survey, b: Survey): number {
  return (a.endDate ?? '9999-12-31').localeCompare(b.endDate ?? '9999-12-31');
}

/**
 * Builds the text of the deadline badge on cards and list items.
 *
 * @param survey - The survey to label.
 * @returns "Ends today", "Ends in 1 Day", "Ends in 3 Days", "Ended on DD.MM.YYYY" or "No end date".
 */
export function deadlineLabel(survey: Survey): string {
  if (!survey.endDate) return 'No end date';
  const [year, month, day] = survey.endDate.split('-');
  if (isPast(survey)) return `Ended on ${day}.${month}.${year}`;
  const days = Math.round((Date.parse(survey.endDate) - Date.parse(today())) / 86_400_000);
  if (days === 0) return 'Ends today';
  return `Ends in ${days} ${days === 1 ? 'Day' : 'Days'}`;
}
