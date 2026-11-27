import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPast } from '../../../models/survey';
import { SurveyService } from '../../../services/survey.service';
import { CreateDialogService } from '../../create-survey/create-dialog.service';
import { QuestionVote } from '../question-vote/question-vote';
import { SurveyResults } from '../survey-results/survey-results';

@Component({
  selector: 'app-survey-detail-page',
  templateUrl: './survey-detail-page.html',
  styleUrl: './survey-detail-page.scss',
  imports: [DatePipe, RouterLink, QuestionVote, SurveyResults],
})
export class SurveyDetailPage {
  private surveyService = inject(SurveyService);
  private dialog = inject(CreateDialogService);

  /** Route parameter :id, bound by withComponentInputBinding(). */
  id = input.required<string>();

  survey = computed(() => this.surveyService.getById(Number(this.id())));
  isClosed = computed(() => {
    const survey = this.survey();
    return !survey || isPast(survey) || this.surveyService.hasVoted(survey.id);
  });

  private selections: number[][] = [];

  openCreateDialog() {
    this.dialog.isOpen.set(true);
  }

  setAnswers(questionIndex: number, answers: number[]) {
    this.selections[questionIndex] = answers;
  }

  async completeSurvey() {
    const survey = this.survey();
    if (!survey || this.isClosed() || !this.selections.some((answers) => answers?.length)) return;
    try {
      await this.surveyService.vote(survey.id, this.selections);
      this.selections = [];
    } catch (error) {
      // Selections stay, so the user can press Complete again.
      console.error('Could not save vote', error);
    }
  }
}
