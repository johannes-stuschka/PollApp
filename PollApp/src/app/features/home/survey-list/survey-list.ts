import { Component, computed, input, signal } from '@angular/core';
import { CATEGORIES, Survey, isPast } from '../../../models/survey';
import { CategoryDropdown } from '../../../shared/category-dropdown/category-dropdown';
import { SurveyListItem } from '../survey-list-item/survey-list-item';

/** Dropdown option that resets the category filter. */
const ALL_SURVEYS = 'All Surveys';

/** List of all surveys with active/past tabs and a category filter (User Story 2). */
@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
  imports: [CategoryDropdown, SurveyListItem],
})
export class SurveyList {
  /** All surveys, already sorted by end date. */
  surveys = input.required<Survey[]>();

  /** Dropdown options: "All Surveys" followed by every category. */
  categories = [ALL_SURVEYS, ...CATEGORIES];
  /** Selected tab: running or closed surveys. */
  activeTab = signal<'active' | 'past'>('active');
  /** Selected category; an empty string means "All Surveys". */
  selectedCategory = signal('');

  /** Surveys of the selected tab, narrowed down to the selected category. */
  filteredSurveys = computed(() =>
    this.surveys().filter(
      (survey) =>
        isPast(survey) === (this.activeTab() === 'past') &&
        (!this.selectedCategory() || survey.category === this.selectedCategory()),
    ),
  );

  /**
   * Switches between running and closed surveys.
   *
   * @param tab - `'active'` for running, `'past'` for closed surveys.
   */
  selectTab(tab: 'active' | 'past') {
    this.activeTab.set(tab);
  }

  /**
   * Filters the list by category.
   *
   * @param category - A category, or "All Surveys" to show every category again.
   */
  selectCategory(category: string) {
    this.selectedCategory.set(category === ALL_SURVEYS ? '' : category);
  }
}
