import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateDialogService } from './features/create-survey/create-dialog.service';
import { CreateSurveyDialog } from './features/create-survey/create-survey-dialog/create-survey-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateSurveyDialog,],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('PollApp');
  dialog = inject(CreateDialogService);
}
