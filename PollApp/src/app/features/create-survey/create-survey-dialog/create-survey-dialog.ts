import { Component, inject } from '@angular/core';
import { CreateDialogService } from '../../create-survey/create-dialog.service';

@Component({
  selector: 'app-create-survey-dialog',
  templateUrl: './create-survey-dialog.html',
  styleUrl: './create-survey-dialog.scss',
})
export class CreateSurveyDialog {
  dialog = inject(CreateDialogService);
  
  cancel() {
    this.dialog.isOpen.set(false);
  }
}
