import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveyService } from '../../../services/survey.service';
import { EndingSoon } from '../ending-soon/ending-soon';
import { Hero } from '../hero/hero';
import { SurveyList } from '../survey-list/survey-list';

/** Home screen: hero, "Ending soon surveys" and the list of all surveys. */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [RouterLink, Hero, EndingSoon, SurveyList],
})
export class HomePage {
  /** Provides the surveys for both sections. */
  surveyService = inject(SurveyService);
}
