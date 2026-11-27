import { Injectable, signal } from '@angular/core';

/** Opens and closes the create survey dialog from anywhere in the app (overlay, no route). */
@Injectable({ providedIn: 'root' })
export class CreateDialogService {
  /** `true` while the dialog is shown. */
  isOpen = signal(false);
}
