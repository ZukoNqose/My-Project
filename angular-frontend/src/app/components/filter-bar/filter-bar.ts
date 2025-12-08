import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {
  @Input() currentFilter: FilterType = 'all';
  @Output() filterChange = new EventEmitter<FilterType>();
  
  filters: FilterType[] = ['all', 'active', 'completed'];

  onFilterChange(filter: FilterType) {
    this.filterChange.emit(filter);
  }
}