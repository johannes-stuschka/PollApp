import { Component, output } from '@angular/core';

@Component({
  selector: 'app-published-toast',
  templateUrl: './published-toast.html',
  styleUrl: './published-toast.scss',
})
export class PublishedToast {
  closed = output<void>();
}
