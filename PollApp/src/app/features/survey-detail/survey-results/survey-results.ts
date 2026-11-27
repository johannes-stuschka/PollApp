import { Component, computed, input, signal } from '@angular/core';
import { Answer, Question } from '../../../models/survey';

@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.html',
  styleUrl: './survey-results.scss',
})
export class SurveyResults {
  questions = input.required<Question[]>();

  /** Only used on mobile, where the results are collapsible. */
  isOpen = signal(false);

  hasVotes = computed(() =>
    this.questions().some((question) => question.answers.some((answer) => answer.votes > 0)),
  );

  toggle() {
    this.isOpen.update((open) => !open);
  }

  percent(question: Question, answer: Answer): number {
    const total = question.answers.reduce((sum, a) => sum + a.votes, 0);
    return total ? Math.round((answer.votes / total) * 100) : 0;
  }
}
