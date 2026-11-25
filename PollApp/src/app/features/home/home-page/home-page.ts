import { Component, inject } from '@angular/core';
import { Hero } from '../hero/hero';
import { SurveyService } from '../../../services/survey.service';
import { HighlightCard } from '../highlight-card/highlight-card';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [Hero, HighlightCard],
})
export class HomePage {
  surveyService = inject(SurveyService);

  surveys() {
    this.surveyService.surveys;
  }
}
