import { Component, computed, input, signal } from '@angular/core';
import { Answer, Question } from '../../../models/survey';

/** Live results ("Survey results LIVE") with one bar per answer; an accordion on mobile. */
@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.html',
  styleUrl: './survey-results.scss',
})
export class SurveyResults {
  /** Questions with their current vote counts. */
  questions = input.required<Question[]>();

  /** Only used on mobile, where the results are collapsible. */
  isOpen = signal(false);

  /** `false` until the first vote, then the "no answers yet" hint disappears. */
  hasVotes = computed(() =>
    this.questions().some((question) => question.answers.some((answer) => answer.votes > 0)),
  );

  /** Opens or closes the results on mobile ("See results" / "Close results"). */
  toggle() {
    this.isOpen.update((open) => !open);
  }

  /**
   * Calculates an answer's share of all votes of its question.
   *
   * @param question - The question the answer belongs to.
   * @param answer - The answer to calculate.
   * @returns Rounded percentage from 0 to 100; 0 if the question has no votes yet.
   */
  percent(question: Question, answer: Answer): number {
    const total = question.answers.reduce((sum, a) => sum + a.votes, 0);
    return total ? Math.round((answer.votes / total) * 100) : 0;
  }
}
