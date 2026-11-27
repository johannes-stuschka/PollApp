import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey, deadlineLabel } from '../../../models/survey';

/** One entry of the survey list with category, title and deadline; links to the detail view. */
@Component({
  selector: 'app-survey-list-item',
  templateUrl: './survey-list-item.html',
  styleUrl: './survey-list-item.scss',
  imports: [RouterLink],
})
export class SurveyListItem {
  /** The survey shown in this entry. */
  survey = input.required<Survey>();
  /** Text of the deadline badge, e.g. "Ends in 2 Days" or "Ended on 22.11.2026". */
  deadlineLabel = computed(() => deadlineLabel(this.survey()));
}
