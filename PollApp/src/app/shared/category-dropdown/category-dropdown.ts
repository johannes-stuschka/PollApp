import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.html',
  styleUrl: './category-dropdown.scss',
})
export class CategoryDropdown {
  label = input.required<string>();
  categories = input.required<string[]>();
  selected = input('');
  selectedChange = output<string>();

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((open) => !open);
  }

  select(category: string) {
    this.selectedChange.emit(category);
    this.isOpen.set(false);
  }
}
