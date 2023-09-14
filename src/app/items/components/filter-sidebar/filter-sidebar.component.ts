import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterCriteria } from '../../model/filter-criteria.model';
import { ColumnTypes } from '../../model/column-types.model';
import { AllowedDataTypes } from '../../model/data-types.enum';
import { ITEM_CONSTANTS } from '../../constants/items-constants';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss'],
})
export class FilterSidebarComponent implements OnInit, OnChanges {
  /**
   * Input Fields
   */
  @Input() columns: string[] = [];
  @Input() columnDataTypes: ColumnTypes = {};

  /**
   * Output Fields
   */
  @Output() filterApplied = new EventEmitter<FilterCriteria>();

  /**
   * Class level Fields
   */

  filterForm: FormGroup = new FormGroup({});
  availableOperators: string[] = [];
  selectedOptionType: string | undefined;

  /**
   * Constructor
   */

  constructor(private formBuilder: FormBuilder) {}

  /**
   * Life Cycle Methods
   */

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      columnName: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']?.currentValue) {
      this.columns = changes['columns'].currentValue;
    }
    if (changes['columnDataTypes']?.currentValue) {
      this.columnDataTypes = changes['columnDataTypes'].currentValue;
    }
  }

  /**
   * Event Listeners
   */

  onAddFilter(): void {
    const filterCriteria: FilterCriteria = this.filterForm.value;
    this.filterApplied.emit(filterCriteria);
    this.onClearFilter();
  }

  onClearFilter(): void {
    this.filterForm.reset();
  }

  onColumnNameOptionChange(): void {
    //reset the rest of the form once the column name selection has changed
    this.filterForm.get('operator')?.reset();
    this.filterForm.get('value')?.reset();

    const selectedColumnNameValue: string = this.filterForm.get('columnName')
      ?.value as string;

    //depending on selected, reset the options for operator form field
    if (selectedColumnNameValue) {
      switch (this.columnDataTypes[selectedColumnNameValue]) {
        case AllowedDataTypes.STRING:
          this.selectedOptionType = AllowedDataTypes.STRING;
          this.availableOperators = ITEM_CONSTANTS.STRING_OPERATORS;
          break;
        case AllowedDataTypes.NUMBER:
          this.selectedOptionType = AllowedDataTypes.NUMBER;
          this.availableOperators = ITEM_CONSTANTS.NUMBER_OPERATORS;
          break;
        default:
          this.selectedOptionType = undefined;
          this.availableOperators = [];
      }
    }
  }
}
