import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateDialogService } from './features/create-survey/create-dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('PollApp');
  dialog = inject(CreateDialogService);
}
