import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateDialogService } from './features/create-survey/create-dialog.service';
import { CreateSurveyDialog } from './features/create-survey/create-survey-dialog/create-survey-dialog';

/** Root component: renders the current page and, on top of it, the create survey dialog. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateSurveyDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Name of the app. */
  protected readonly title = signal('PollApp');
  /** Tells the template whether to show the create dialog. */
  dialog = inject(CreateDialogService);
}
