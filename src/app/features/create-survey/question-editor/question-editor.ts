import { Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAX_ANSWERS, MAX_LENGTH, MIN_ANSWERS, QuestionForm, answerControl } from '../question-form';

/** Editor for one question in the create dialog: question text, answers and the multiple choice switch. */
@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.html',
  styleUrl: './question-editor.scss',
  imports: [ReactiveFormsModule],
})
export class QuestionEditor {
  /** Form group of this question, owned by the dialog. */
  group = input.required<QuestionForm>();
  /** Position of the question, shown as "1.", "2.", … */
  number = input.required<number>();
  /** Emits when the trash icon of the question is clicked. */
  remove = output<void>();
  /** Character limits of the question and answer fields. */
  maxLength = MAX_LENGTH;

  /** The answer controls of this question. */
  answers = computed(() => this.group().controls.answers);

  /** Adds an empty answer field, up to {@link MAX_ANSWERS}. */
  addAnswer() {
    if (this.answers().length < MAX_ANSWERS) this.answers().push(answerControl());
  }

  /**
   * Removes an answer field. The first {@link MIN_ANSWERS} fields always stay; deleting them only clears the text.
   *
   * @param index - Index of the answer.
   */
  removeAnswer(index: number) {
    if (this.answers().length > MIN_ANSWERS) this.answers().removeAt(index);
    else this.answers().at(index).setValue('');
  }
}
