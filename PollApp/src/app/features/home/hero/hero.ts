import { Component, inject } from '@angular/core';
import { CreateDialogService } from '../../create-survey/create-dialog.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  dialog = inject(CreateDialogService);

  openCreateDialog() {
    this.dialog.isOpen.set(true);
  }
}