import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FilterCriteria } from '../../model/filter-criteria.model';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
})
export class FilterListComponent implements OnChanges {
  /**
   * Input Fields
   */
  @Input() appliedFilters: FilterCriteria[] = [];

  /**
   * Output Fields
   */
  @Output() filterCancelled = new EventEmitter<FilterCriteria>();

  /**
   * Life Cycle Methods
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appliedFilters']?.currentValue) {
      this.appliedFilters = changes['appliedFilters'].currentValue;
    }
  }

  /**
   * Event Listeners
   */
  onCancelFilter(filter: FilterCriteria): void {
    this.filterCancelled.emit(filter);
  }
}
