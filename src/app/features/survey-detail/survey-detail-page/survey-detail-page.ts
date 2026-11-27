import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPast } from '../../../models/survey';
import { SurveyService } from '../../../services/survey.service';
import { CreateDialogService } from '../../create-survey/create-dialog.service';
import { QuestionVote } from '../question-vote/question-vote';
import { SurveyResults } from '../survey-results/survey-results';

/** Detail view of a survey: vote on the left, live results on the right (User Stories 4 and 5). */
@Component({
  selector: 'app-survey-detail-page',
  templateUrl: './survey-detail-page.html',
  styleUrl: './survey-detail-page.scss',
  imports: [DatePipe, RouterLink, QuestionVote, SurveyResults],
})
export class SurveyDetailPage {
  /** Provides the survey and saves votes. */
  private surveyService = inject(SurveyService);
  /** Opens the create survey dialog from the header button. */
  private dialog = inject(CreateDialogService);

  /** Route parameter :id, bound by withComponentInputBinding(). */
  id = input.required<string>();

  /** The survey of this page, `undefined` while loading or if the id doesn't exist. */
  survey = computed(() => this.surveyService.getById(Number(this.id())));
  /** `true` if the survey has ended or this browser already voted: answers are read-only. */
  isClosed = computed(() => {
    const survey = this.survey();
    return !survey || isPast(survey) || this.surveyService.hasVoted(survey.id);
  });

  /** Chosen answer indexes per question, collected until "Complete survey" is pressed. */
  private selections: number[][] = [];
  /** `true` after Complete was pressed while a question had no answer; shows the hint. */
  isMissingAnswers = signal(false);

  /** Shows the create survey dialog. */
  openCreateDialog() {
    this.dialog.isOpen.set(true);
  }

  /**
   * Stores the current choice of one question.
   *
   * @param questionIndex - Index of the question.
   * @param answers - Indexes of the chosen answers.
   */
  setAnswers(questionIndex: number, answers: number[]) {
    this.selections[questionIndex] = answers;
  }

  /**
   * Sends the chosen answers. Every question needs at least one answer, otherwise it shows a hint.
   * Does nothing if the survey is closed. On an error the choices stay, so the user can try again.
   */
  async completeSurvey() {
    const survey = this.survey();
    if (!survey || this.isClosed()) return;
    const allAnswered = survey.questions.every((_, i) => this.selections[i]?.length);
    this.isMissingAnswers.set(!allAnswered);
    if (!allAnswered) return;
    try {
      await this.surveyService.vote(survey.id, this.selections);
      this.selections = [];
    } catch (error) {
      // Selections stay, so the user can press Complete again.
      console.error('Could not save vote', error);
    }
  }
}
