import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey, deadlineLabel } from '../../../models/survey';

/** Large card of an ending soon survey; links to its detail view. */
@Component({
  selector: 'app-highlight-card',
  templateUrl: 'highlight-card.html',
  styleUrl: 'highlight-card.scss',
  imports: [RouterLink],
})
export class HighlightCard {
  /** The survey shown on the card. */
  survey = input.required<Survey>();
  /** Text of the deadline badge, e.g. "Ends in 2 Days". */
  deadlineLabel = computed(() => deadlineLabel(this.survey()));
}
