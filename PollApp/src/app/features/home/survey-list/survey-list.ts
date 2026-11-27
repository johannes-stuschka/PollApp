import { Component, computed, input, signal } from '@angular/core';
import { CATEGORIES, Survey, isPast } from '../../../models/survey';
import { CategoryDropdown } from '../../../shared/category-dropdown/category-dropdown';
import { SurveyListItem } from '../survey-list-item/survey-list-item';

const ALL_SURVEYS = 'All Surveys';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
  imports: [CategoryDropdown, SurveyListItem],
})
export class SurveyList {
  surveys = input.required<Survey[]>();

  categories = [ALL_SURVEYS, ...CATEGORIES];
  activeTab = signal<'active' | 'past'>('active');
  /** Empty string means "All Surveys". */
  selectedCategory = signal('');

  filteredSurveys = computed(() =>
    this.surveys().filter(
      (survey) =>
        isPast(survey) === (this.activeTab() === 'past') &&
        (!this.selectedCategory() || survey.category === this.selectedCategory()),
    ),
  );

  selectTab(tab: 'active' | 'past') {
    this.activeTab.set(tab);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category === ALL_SURVEYS ? '' : category);
  }
}
