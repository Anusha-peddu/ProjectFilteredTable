import { Injectable } from '@angular/core';
import { FilterCriteria } from '../model/filter-criteria.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  /**
   * Private Fields
   */
  private appliedFilters: FilterCriteria[] = [];

  /**
   * Public Getters
   */
  get filterList(): FilterCriteria[] {
    return this.appliedFilters;
  }

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Public Methods
   */
  addFilter(filter: FilterCriteria): void {
    this.appliedFilters.push(filter);
  }

  removeFilter(filter: FilterCriteria): void {
    const index = this.appliedFilters.indexOf(filter);
    if (index !== -1) {
      this.appliedFilters.splice(index, 1);
    }
  }
}
