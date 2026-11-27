export interface Answer {
  text: string;
  votes: number;
}

export interface Question {
  text: string;
  allowMultiple: boolean;
  answers: Answer[];
}

export interface Survey {
  id: number;
  category: string;
  title: string;
  description?: string;
  /** Last day of the survey as 'YYYY-MM-DD'. */
  endDate?: string;
  questions: Question[];
}

export const CATEGORIES = [
  'Team Activities',
  'Health & Wellness',
  'Gaming & Entertainment',
  'Education & Learning',
  'Lifestyle & Preferences',
  'Technology & Innovation',
];

/** Today as 'YYYY-MM-DD' in local time, comparable with endDate as a string. */
export function today(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isPast(survey: Survey): boolean {
  return !!survey.endDate && survey.endDate < today();
}

/** Surveys with an end date first (earliest first), open-ended ones last. */
export function byEndDate(a: Survey, b: Survey): number {
  return (a.endDate ?? '9999-12-31').localeCompare(b.endDate ?? '9999-12-31');
}

export function deadlineLabel(survey: Survey): string {
  if (!survey.endDate) return 'No end date';
  const [year, month, day] = survey.endDate.split('-');
  if (isPast(survey)) return `Ended on ${day}.${month}.${year}`;
  const days = Math.round((Date.parse(survey.endDate) - Date.parse(today())) / 86_400_000);
  if (days === 0) return 'Ends today';
  return `Ends in ${days} ${days === 1 ? 'Day' : 'Days'}`;
}
