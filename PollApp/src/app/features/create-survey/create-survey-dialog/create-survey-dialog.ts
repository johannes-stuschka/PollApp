import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CATEGORIES, Survey, today } from '../../../models/survey';
import { SurveyService } from '../../../services/survey.service';
import { CategoryDropdown } from '../../../shared/category-dropdown/category-dropdown';
import { CreateDialogService } from '../create-dialog.service';
import { PublishedToast } from '../published-toast/published-toast';
import { QuestionEditor } from '../question-editor/question-editor';
import { questionForm } from '../question-form';

@Component({
  selector: 'app-create-survey-dialog',
  templateUrl: './create-survey-dialog.html',
  styleUrl: './create-survey-dialog.scss',
  imports: [ReactiveFormsModule, CategoryDropdown, QuestionEditor, PublishedToast],
})
export class CreateSurveyDialog {
  private dialog = inject(CreateDialogService);
  private surveyService = inject(SurveyService);
  private router = inject(Router);

  categories = CATEGORIES;
  today = today();
  isPublished = signal(false);
  isSaving = signal(false);
  private publishedId?: number;

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    category: new FormControl('', { nonNullable: true, validators: Validators.required }),
    endDate: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    questions: new FormArray([questionForm()]),
  });

  get questions() {
    return this.form.controls.questions;
  }

  cancel() {
    this.dialog.isOpen.set(false);
  }

  clearField(name: 'title' | 'endDate' | 'description') {
    this.form.controls[name].setValue('');
  }

  selectCategory(category: string) {
    this.form.controls.category.setValue(category);
  }

  addQuestion() {
    this.questions.push(questionForm());
  }

  /** Question 1 can't be removed, its delete button only clears its fields. */
  removeQuestion(index: number) {
    if (index > 0) {
      this.questions.removeAt(index);
      return;
    }
    const first = this.questions.at(0);
    first.controls.text.setValue('');
    first.controls.answers.controls.forEach((answer) => answer.setValue(''));
  }

  async publish() {
    if (this.form.invalid || this.isSaving() || this.isPublished()) return;
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

  closeToast() {
    this.dialog.isOpen.set(false);
    this.router.navigate(['/survey', this.publishedId]);
  }
}
