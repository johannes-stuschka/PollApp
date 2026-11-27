import { Component, input, output, signal } from '@angular/core';

/** Dropdown to pick a category; used for the list filter and in the create dialog. */
@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.html',
  styleUrl: './category-dropdown.scss',
})
export class CategoryDropdown {
  /** Text of the toggle button, e.g. "Sort by categories". */
  label = input.required<string>();
  /** Options shown in the menu. */
  categories = input.required<string[]>();
  /** Currently selected option, shown below the closed dropdown. */
  selected = input('');
  /** Emits the option the user clicked. */
  selectedChange = output<string>();

  /** `true` while the menu is open. */
  isOpen = signal(false);

  /** Opens or closes the menu. */
  toggle() {
    this.isOpen.update((open) => !open);
  }

  /**
   * Reports the chosen option and closes the menu.
   *
   * @param category - The clicked option.
   */
  select(category: string) {
    this.selectedChange.emit(category);
    this.isOpen.set(false);
  }
}
