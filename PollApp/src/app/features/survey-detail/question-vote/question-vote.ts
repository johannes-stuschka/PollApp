import { Component, input, output, signal } from '@angular/core';
import { Question } from '../../../models/survey';

@Component({
  selector: 'app-question-vote',
  templateUrl: './question-vote.html',
  styleUrl: './question-vote.scss',
})
export class QuestionVote {
  question = input.required<Question>();
  number = input.required<number>();
  disabled = input(false);
  selectionChange = output<number[]>();

  selected = signal<number[]>([]);

  isSelected(index: number) {
    return this.selected().includes(index);
  }

  toggleAnswer(index: number) {
    if (this.disabled()) return;
    const current = this.selected();
    let next: number[];
    if (current.includes(index)) {
      next = current.filter((i) => i !== index);
    } else {
      next = this.question().allowMultiple ? [...current, index] : [index];
    }
    this.selected.set(next);
    this.selectionChange.emit(next);
  }
}
