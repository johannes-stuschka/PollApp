import { Component, input, output, signal } from '@angular/core';
import { Question } from '../../../models/survey';

/** One question with its answer checkboxes in the detail view. */
@Component({
  selector: 'app-question-vote',
  templateUrl: './question-vote.html',
  styleUrl: './question-vote.scss',
})
export class QuestionVote {
  /** The question to answer. */
  question = input.required<Question>();
  /** Position of the question, shown as "1.", "2.", … */
  number = input.required<number>();
  /** `true` for closed or already answered surveys: answers can't be clicked. */
  disabled = input(false);
  /** Emits the indexes of the chosen answers after every click. */
  selectionChange = output<number[]>();

  /** Indexes of the currently chosen answers. */
  selected = signal<number[]>([]);

  /**
   * Tells whether an answer is chosen.
   *
   * @param index - Index of the answer.
   * @returns `true` if its checkbox is checked.
   */
  isSelected(index: number) {
    return this.selected().includes(index);
  }

  /**
   * Checks or unchecks an answer. Single choice questions keep only the last clicked answer.
   *
   * @param index - Index of the clicked answer.
   */
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
