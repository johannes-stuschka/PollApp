import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export const MIN_ANSWERS = 2;
export const MAX_ANSWERS = 6;

export type QuestionForm = FormGroup<{
  text: FormControl<string>;
  allowMultiple: FormControl<boolean>;
  answers: FormArray<FormControl<string>>;
}>;

export function answerControl(): FormControl<string> {
  return new FormControl('', { nonNullable: true, validators: Validators.required });
}

export function questionForm(): QuestionForm {
  return new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: Validators.required }),
    allowMultiple: new FormControl(false, { nonNullable: true }),
    answers: new FormArray(Array.from({ length: MIN_ANSWERS }, answerControl)),
  });
}
