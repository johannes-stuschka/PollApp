import { Component, input } from '@angular/core';
import { Survey } from '../../../models/survey';
import { HighlightCard } from '../highlight-card/highlight-card';

@Component({
  selector: 'app-ending-soon',
  templateUrl: './ending-soon.html',
  styleUrl: './ending-soon.scss',
  imports: [HighlightCard],
})
export class EndingSoon {
  surveys = input.required<Survey[]>();
}
