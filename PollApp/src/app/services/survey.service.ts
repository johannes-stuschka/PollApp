import { Injectable, computed, signal } from '@angular/core';
import { Survey, byEndDate, isPast, today } from '../models/survey';

const ENDING_SOON_COUNT = 3;
const VOTED_KEY = 'pollapp-voted';

function readVotedIds(): number[] {
  try {
    return JSON.parse(localStorage.getItem(VOTED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function answers(...texts: string[]) {
  return texts.map((text) => ({ text, votes: 0 }));
}

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  // shortcut: in-memory demo data, replaced by a real database later
  surveys = signal<Survey[]>([
    {
      id: 1,
      category: 'Team Activities',
      title: 'Let’s Plan the Next Team Event Together',
      description:
        'We want to create team activities that everyone will enjoy – share your preferences and ideas in our survey to help us plan better experiences together.',
      endDate: today(1),
      questions: [
        {
          text: 'Which date would work best for you?',
          allowMultiple: true,
          answers: answers('19.09.2025, Friday', '10.10.2025, Friday', '11.10.2025, Saturday', '31.10.2025, Friday'),
        },
        {
          text: 'How long would you prefer the event to last?',
          allowMultiple: false,
          answers: answers('Half a day', 'Full day', 'Evening only'),
        },
      ],
    },
    {
      id: 2,
      category: 'Health & Wellness',
      title: 'Healthier future: Fit & wellness survey!',
      endDate: today(2),
      questions: [
        {
          text: 'How often do you exercise per week?',
          allowMultiple: false,
          answers: answers('Never', '1–2 times', '3–4 times', '5 times or more'),
        },
      ],
    },
    {
      id: 3,
      category: 'Gaming & Entertainment',
      title: 'Gaming habits and favorite games!',
      endDate: today(3),
      questions: [
        {
          text: 'Which genres do you play?',
          allowMultiple: true,
          answers: answers('Strategy', 'Shooter', 'Puzzle', 'Sports'),
        },
      ],
    },
    {
      id: 4,
      category: 'Lifestyle & Preferences',
      title: 'Coffee or tea in the office?',
      endDate: today(-5),
      questions: [
        {
          text: 'What do you drink most?',
          allowMultiple: false,
          answers: [
            { text: 'Coffee', votes: 12 },
            { text: 'Tea', votes: 7 },
            { text: 'Water', votes: 3 },
          ],
        },
      ],
    },
  ]);

  sortedSurveys = computed(() => [...this.surveys()].sort(byEndDate));

  endingSoon = computed(() =>
    this.sortedSurveys()
      .filter((survey) => survey.endDate && !isPast(survey))
      .slice(0, ENDING_SOON_COUNT),
  );

  /** Surveys this browser already voted in, so nobody votes twice. */
  private votedIds = signal<number[]>(readVotedIds());

  hasVoted(id: number): boolean {
    return this.votedIds().includes(id);
  }

  getById(id: number): Survey | undefined {
    return this.surveys().find((survey) => survey.id === id);
  }

  /** Adds the survey and returns its new id. */
  async create(survey: Omit<Survey, 'id'>): Promise<number> {
    const id = Math.max(0, ...this.surveys().map((s) => s.id)) + 1;
    this.surveys.update((surveys) => [...surveys, { ...survey, id }]);
    return id;
  }

  /** selections[questionIndex] = indexes of the chosen answers. */
  async vote(surveyId: number, selections: number[][]): Promise<void> {
    this.votedIds.update((ids) => [...ids, surveyId]);
    localStorage.setItem(VOTED_KEY, JSON.stringify(this.votedIds()));
    this.surveys.update((surveys) =>
      surveys.map((survey) => (survey.id === surveyId ? addVotes(survey, selections) : survey)),
    );
  }
}

function addVotes(survey: Survey, selections: number[][]): Survey {
  return {
    ...survey,
    questions: survey.questions.map((question, q) => ({
      ...question,
      answers: question.answers.map((answer, a) => ({
        ...answer,
        votes: answer.votes + (selections[q]?.includes(a) ? 1 : 0),
      })),
    })),
  };
}
