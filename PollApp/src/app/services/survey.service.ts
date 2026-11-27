import { Injectable, computed, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey, byEndDate, isPast } from '../models/survey';

const ENDING_SOON_COUNT = 3;
const VOTED_KEY = 'pollapp-voted';

interface SurveyRow {
  id: number;
  title: string;
  category: string;
  description: string | null;
  end_date: string | null;
  questions: { text: string; allowMultiple: boolean; answers: string[] }[];
}

interface VoteCountRow {
  survey_id: number;
  question_index: number;
  answer_index: number;
  votes: number;
}

function readVotedIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem(VOTED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function voteCount(counts: VoteCountRow[], surveyId: number, q: number, a: number): number {
  const row = counts.find(
    (c) => c.survey_id === surveyId && c.question_index === q && c.answer_index === a,
  );
  return row?.votes ?? 0;
}

/** Database row + vote counts → Survey for the UI. */
function toSurvey(row: SurveyRow, counts: VoteCountRow[]): Survey {
  const votes = (q: number, a: number) => voteCount(counts, row.id, q, a);
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description ?? undefined,
    endDate: row.end_date ?? undefined,
    questions: row.questions.map((question, q) => ({
      text: question.text,
      allowMultiple: question.allowMultiple,
      answers: question.answers.map((text, a) => ({ text, votes: votes(q, a) })),
    })),
  };
}

/** Survey from the UI → database row (votes live in their own table). */
function toRow(survey: Omit<Survey, 'id'>): Omit<SurveyRow, 'id'> {
  return {
    title: survey.title,
    category: survey.category,
    description: survey.description ?? null,
    end_date: survey.endDate ?? null,
    questions: survey.questions.map((question) => ({
      text: question.text,
      allowMultiple: question.allowMultiple,
      answers: question.answers.map((answer) => answer.text),
    })),
  };
}

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  surveys = signal<Survey[]>([]);
  isLoaded = signal(false);

  sortedSurveys = computed(() => [...this.surveys()].sort(byEndDate));

  endingSoon = computed(() =>
    this.sortedSurveys()
      .filter((survey) => survey.endDate && !isPast(survey))
      .slice(0, ENDING_SOON_COUNT),
  );

  /** Surveys this browser already voted in, so nobody votes twice. */
  private votedIds = signal<number[]>(readVotedIds());

  constructor() {
    this.load();
    // shortcut: reloads everything on each new survey/vote, fine for a few hundred surveys; switch to patching single rows if it gets slow.
    this.supabase
      .channel('pollapp')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'surveys' }, () =>
        this.load(),
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, () =>
        this.load(),
      )
      .subscribe();
  }

  async load(): Promise<void> {
    const [surveys, counts] = await Promise.all([
      this.supabase.from('surveys').select('id, title, category, description, end_date, questions'),
      this.supabase.from('vote_counts').select('*'),
    ]);
    if (surveys.error || counts.error) {
      console.error('Could not load surveys', surveys.error ?? counts.error);
      return;
    }
    this.surveys.set(
      (surveys.data as SurveyRow[]).map((row) => toSurvey(row, counts.data as VoteCountRow[])),
    );
    this.isLoaded.set(true);
  }

  hasVoted(id: number): boolean {
    return this.votedIds().includes(id);
  }

  getById(id: number): Survey | undefined {
    return this.surveys().find((survey) => survey.id === id);
  }

  /** Saves the survey and returns its new id. */
  async create(survey: Omit<Survey, 'id'>): Promise<number> {
    const { data, error } = await this.supabase
      .from('surveys')
      .insert(toRow(survey))
      .select('id')
      .single();
    if (error) throw error;
    await this.load();
    return data.id;
  }

  /** selections[questionIndex] = indexes of the chosen answers. */
  async vote(surveyId: number, selections: number[][]): Promise<void> {
    const rows = selections.flatMap((answers, questionIndex) =>
      (answers ?? []).map((answerIndex) => ({
        survey_id: surveyId,
        question_index: questionIndex,
        answer_index: answerIndex,
      })),
    );
    const { error } = await this.supabase.from('votes').insert(rows);
    if (error) throw error;
    this.votedIds.update((ids) => [...ids, surveyId]);
    localStorage.setItem(VOTED_KEY, JSON.stringify(this.votedIds()));
    await this.load();
  }
}
