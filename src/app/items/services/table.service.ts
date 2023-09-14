import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataItem } from 'src/app/model/data-item.model';
import { HttpService } from 'src/app/services/http.service';
import { FilterCriteria } from '../model/filter-criteria.model';
import { AllowedOperators } from '../model/allowed-operators.enum';
import { AllowedDataTypes } from '../model/data-types.enum';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  /**
   * Private Fields
   */
  private rawData: DataItem[] = [];
  private columns: string[] = [];
  private columnDataTypes: { [key: string]: string } = {};

  /**
   * Public Getters
   */
  get columnList(): string[] {
    return this.columns;
  }
  get columnNameAndItsDataTypeList(): { [key: string]: string } {
    return this.columnDataTypes;
  }

  /**
   * Behaviour Subjects & Observables
   */
  private viewItems = new BehaviorSubject<DataItem[]>([]);
  viewItems$: Observable<DataItem[]> = this.viewItems.asObservable();

  /**
   * Constructor
   */
  constructor(private httpService: HttpService) {
    this.loadData();
  }

  /**
   * Public Methods
   */
  applyFilters(filters: FilterCriteria[]): void {
    let filteredData: DataItem[] = [...this.rawData];
    filters.forEach((filter: FilterCriteria) => {
      filteredData = this.applyFilter(filteredData, filter);
    });
    this.viewItems.next(filteredData);
  }

  getPaginatedTableData(
    items: DataItem[],
    pageSize: number,
    currentPage: number
  ): DataItem[] {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }

  /**
   * Private Methods
   */
  private loadData(): void {
    this.httpService.getItems().subscribe({
      next: (data: DataItem[]) => {
        this.getDynamicColumnsAndTypesFromRawData(data);
        this.rawData = Object.values(data);
        this.viewItems.next(this.rawData);
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
  }

  private getDynamicColumnsAndTypesFromRawData(items: DataItem[]): void {
    // Iterate through the object's keys
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        Object.entries(items[key]).forEach(([column, value]) => {
          if (
            typeof value === AllowedDataTypes.STRING ||
            typeof value === AllowedDataTypes.NUMBER
          ) {
            this.columnDataTypes[column] = typeof value;
            this.columns.push(column);
          }
        });
        break; // Stop the loop after finding the first key
      }
    }
  }

  private applyFilter(items: DataItem[], filter: FilterCriteria): DataItem[] {
    return items.filter((item: DataItem) => {
      const value = item[filter?.columnName];
      const filterValue: string | number = filter?.value;
      switch (filter?.operator) {
        case AllowedOperators.EQUALS:
          return value === filterValue;
        case AllowedOperators.NOT_EQUALS:
          return value !== filterValue;
        case AllowedOperators.CONTAINS:
          return value.includes(filterValue);
        case AllowedOperators.DOES_NOT_CONTAIN:
          return !value.includes(filterValue);
        case AllowedOperators.LESS_THAN:
          return value < filterValue;
        case AllowedOperators.GREATER_THAN:
          return value > filterValue;
        case AllowedOperators.LESS_THAN_OR_EQUAL_TO:
          return value <= filterValue;
        case AllowedOperators.GREATER_THAN_OR_EQUAL_TO:
          return value >= filterValue;
        default:
          return true;
      }
    });
  }
}
