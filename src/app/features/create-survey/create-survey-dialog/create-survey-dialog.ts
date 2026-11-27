import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CATEGORIES, Survey, today } from '../../../models/survey';
import { SurveyService } from '../../../services/survey.service';
import { CategoryDropdown } from '../../../shared/category-dropdown/category-dropdown';
import { CreateDialogService } from '../create-dialog.service';
import { PublishedToast } from '../published-toast/published-toast';
import { QuestionEditor } from '../question-editor/question-editor';
import { MAX_LENGTH, questionForm, requiredText } from '../question-form';

/**
 * Overlay to create a new survey (User Story 3).
 * Required: name, category, questions with all answers. Optional: end date, description.
 */
@Component({
  selector: 'app-create-survey-dialog',
  templateUrl: './create-survey-dialog.html',
  styleUrl: './create-survey-dialog.scss',
  imports: [ReactiveFormsModule, CategoryDropdown, QuestionEditor, PublishedToast],
})
export class CreateSurveyDialog {
  /** Closes the dialog. */
  private dialog = inject(CreateDialogService);
  /** Saves the new survey. */
  private surveyService = inject(SurveyService);
  /** Navigates to the new survey after publishing. */
  private router = inject(Router);

  /** Options of the category dropdown. */
  categories = CATEGORIES;
  /** Character limits of the text fields (maxlength + counter). */
  maxLength = MAX_LENGTH;
  /** Earliest selectable end date ('YYYY-MM-DD'). */
  today = today();
  /** `true` after a successful publish; shows the confirmation toast. */
  isPublished = signal(false);
  /** `true` while the survey is being saved; blocks a second click on Publish. */
  isSaving = signal(false);
  /** Id of the published survey, used to open it after the toast closes. */
  private publishedId?: number;

  /** The whole form; Publish looks disabled while it is invalid, a click then shows every error. */
  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [...requiredText, Validators.maxLength(MAX_LENGTH.title)],
    }),
    category: new FormControl('', { nonNullable: true, validators: Validators.required }),
    endDate: new FormControl('', { nonNullable: true }),
    description: new FormControl('', {
      nonNullable: true,
      validators: Validators.maxLength(MAX_LENGTH.description),
    }),
    questions: new FormArray([questionForm()]),
  });

  /** Shortcut to the questions of the form. */
  get questions() {
    return this.form.controls.questions;
  }

  /** Closes the dialog without saving. */
  cancel() {
    this.dialog.isOpen.set(false);
  }

  /**
   * Empties a text field (trash icon next to it).
   *
   * @param name - The field to clear.
   */
  clearField(name: 'title' | 'endDate' | 'description') {
    this.form.controls[name].setValue('');
  }

  /**
   * Takes over the category picked in the dropdown.
   *
   * @param category - The chosen category.
   */
  selectCategory(category: string) {
    this.form.controls.category.setValue(category);
  }

  /** Adds an empty question below the existing ones. */
  addQuestion() {
    this.questions.push(questionForm());
  }

  /**
   * Removes a question. Question 1 can't be removed, its delete button only clears its fields.
   *
   * @param index - Index of the question.
   */
  removeQuestion(index: number) {
    if (index > 0) {
      this.questions.removeAt(index);
      return;
    }
    const first = this.questions.at(0);
    first.controls.text.setValue('');
    first.controls.answers.controls.forEach((answer) => answer.setValue(''));
  }

  /**
   * Saves the survey and shows the confirmation toast. On an error the form keeps its values.
   * If fields are missing, it only marks all fields as touched so their error texts appear.
   */
  async publish() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isSaving() || this.isPublished()) return;
    this.isSaving.set(true);
    try {
      this.publishedId = await this.surveyService.create(this.formToSurvey());
      this.isPublished.set(true);
    } catch (error) {
      // The form keeps its values, so the user can simply try again.
      console.error('Could not publish survey', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Turns the form values into a survey: trims texts and drops empty optional fields.
   *
   * @returns The new survey without id.
   */
  private formToSurvey(): Omit<Survey, 'id'> {
    const { title, category, endDate, description, questions } = this.form.getRawValue();
    return {
      title: title.trim(),
      category,
      endDate: endDate || undefined,
      description: description.trim() || undefined,
      questions: questions.map((question) => ({
        text: question.text.trim(),
        allowMultiple: question.allowMultiple,
        answers: question.answers.map((text) => ({ text: text.trim(), votes: 0 })),
      })),
    };
  }

  /** Closes the toast and the dialog and opens the new survey (Figma note). */
  closeToast() {
    this.dialog.isOpen.set(false);
    this.router.navigate(['/survey', this.publishedId]);
  }
}
