import { Component, inject } from '@angular/core';
import { CreateDialogService } from '../../create-survey/create-dialog.service';

/** Intro section of the home page with headline, "New survey" button and the hover visual. */
@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  /** Opens the create survey dialog. */
  dialog = inject(CreateDialogService);

  /** Shows the create survey dialog (User Story 3). */
  openCreateDialog() {
    this.dialog.isOpen.set(true);
  }
}
