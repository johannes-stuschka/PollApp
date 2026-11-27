import { Component, output } from '@angular/core';

/** Confirmation overlay "Your survey is now published!" after publishing. */
@Component({
  selector: 'app-published-toast',
  templateUrl: './published-toast.html',
  styleUrl: './published-toast.scss',
})
export class PublishedToast {
  /** Emits when the toast is closed (X button or click on the backdrop). */
  closed = output<void>();
}
