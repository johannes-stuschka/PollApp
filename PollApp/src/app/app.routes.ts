import { Routes } from '@angular/router';
import { HomePage } from './features/home/home-page/home-page';
import { SurveyDetailPage } from './features/survey-detail/survey-detail-page/survey-detail-page';

/** Pages of the app. The create dialog is an overlay and has no route. */
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'survey/:id', component: SurveyDetailPage },
  { path: '**', redirectTo: '' },
];
