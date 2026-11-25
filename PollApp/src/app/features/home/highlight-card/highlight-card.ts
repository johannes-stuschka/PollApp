import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../../models/survey';

@Component({
  selector: 'app-highlight-card',
  templateUrl: 'highlight-card.html',
  styleUrl: 'highlight-card.scss',
  imports: [RouterLink],
})
export class HighlightCard {
  survey = input.required<Survey>();
}
