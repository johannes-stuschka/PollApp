import { Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAX_ANSWERS, MIN_ANSWERS, QuestionForm, answerControl } from '../question-form';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.html',
  styleUrl: './question-editor.scss',
  imports: [ReactiveFormsModule],
})
export class QuestionEditor {
  group = input.required<QuestionForm>();
  number = input.required<number>();
  remove = output<void>();

  answers = computed(() => this.group().controls.answers);

  addAnswer() {
    if (this.answers().length < MAX_ANSWERS) this.answers().push(answerControl());
  }

  /** The first two answer fields always stay; deleting them only clears the text. */
  removeAnswer(index: number) {
    if (this.answers().length > MIN_ANSWERS) this.answers().removeAt(index);
    else this.answers().at(index).setValue('');
  }
}
