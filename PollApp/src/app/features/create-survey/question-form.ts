import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

/** Every question starts with (and keeps at least) this many answer fields. */
export const MIN_ANSWERS = 2;
/** Most answer fields a question can have (Figma: "You can add up to 6 answer fields."). */
export const MAX_ANSWERS = 6;

/** Typed form group of one question in the create dialog. */
export type QuestionForm = FormGroup<{
  /** The question text (required). */
  text: FormControl<string>;
  /** "Allow multiple answers." checkbox. */
  allowMultiple: FormControl<boolean>;
  /** One required control per answer field. */
  answers: FormArray<FormControl<string>>;
}>;

/**
 * Creates the control for one answer field.
 *
 * @returns An empty, required control.
 */
export function answerControl(): FormControl<string> {
  return new FormControl('', { nonNullable: true, validators: Validators.required });
}

/**
 * Creates the form group for a new, empty question.
 *
 * @returns A question with {@link MIN_ANSWERS} empty answer fields.
 */
export function questionForm(): QuestionForm {
  return new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: Validators.required }),
    allowMultiple: new FormControl(false, { nonNullable: true }),
    answers: new FormArray(Array.from({ length: MIN_ANSWERS }, answerControl)),
  });
}
