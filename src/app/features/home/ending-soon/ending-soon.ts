import { Component, input } from '@angular/core';
import { Survey } from '../../../models/survey';
import { HighlightCard } from '../highlight-card/highlight-card';

/** Row of highlight cards for the surveys that end next (User Story 1). */
@Component({
  selector: 'app-ending-soon',
  templateUrl: './ending-soon.html',
  styleUrl: './ending-soon.scss',
  imports: [HighlightCard],
})
export class EndingSoon {
  /** Surveys to show, already sorted by end date. */
  surveys = input.required<Survey[]>();
}
