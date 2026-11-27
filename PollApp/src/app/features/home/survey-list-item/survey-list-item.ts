import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey, deadlineLabel } from '../../../models/survey';

@Component({
  selector: 'app-survey-list-item',
  templateUrl: './survey-list-item.html',
  styleUrl: './survey-list-item.scss',
  imports: [RouterLink],
})
export class SurveyListItem {
  survey = input.required<Survey>();
  deadlineLabel = computed(() => deadlineLabel(this.survey()));
}
