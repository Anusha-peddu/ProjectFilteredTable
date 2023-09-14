import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterCriteria } from './model/filter-criteria.model';
import { DataItem } from '../model/data-item.model';
import { ColumnTypes } from './model/column-types.model';
import { TableService } from './services/table.service';
import { FilterService } from './services/filter.service';
import { ITEM_CONSTANTS } from './constants/items-constants';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit, OnDestroy {
  /**
   * Class Level Fields
   */
  tableData: DataItem[] = [];
  rawTableData: DataItem[] = [];

  columns: string[] = [];
  columnDataTypes: ColumnTypes = {};

  appliedFilters: FilterCriteria[] = [];
  isLoading: boolean = true;
  isFilterVisible: boolean = false;

  pageSize: number = ITEM_CONSTANTS.PAGINATION_SETUP.PAGE_SIZE;
  currentPage: number = ITEM_CONSTANTS.PAGINATION_SETUP.CURRENT_PAGE;
  totalItems: number = ITEM_CONSTANTS.PAGINATION_SETUP.TOTAL_PAGES;

  /**
   * Subscription
   */
  itemsSubscription: Subscription = new Subscription();

  /**
   * constructor
   */
  constructor(
    private tableService: TableService,
    private filterService: FilterService
  ) {}

  /**
   * Life Cycle Methods
   */
  ngOnInit(): void {
    this.addListenerOnItemsChange();
  }

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();
  }

  /**
   * Event Listeners
   */

  onAddNewFilter(filterCriteria: FilterCriteria): void {
    this.setLoader(true);
    this.tableData = [];
    this.filterService.addFilter(filterCriteria);
    this.applyFiltersOnItems();
  }

  onCancelFilter(filterCriteria: FilterCriteria): void {
    this.setLoader(true);
    this.tableData = [];
    this.filterService.removeFilter(filterCriteria);
    this.applyFiltersOnItems();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.tableData = this.tableService.getPaginatedTableData(
      this.rawTableData,
      this.pageSize,
      this.currentPage
    );
  }

  onToggleFilterSection(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  /**
   * Private Methods
   */

  private addListenerOnItemsChange(): void {
    this.itemsSubscription.add(
      this.tableService.viewItems$
        .pipe(
          map((items: DataItem[]) => {
            this.rawTableData = items;
            this.totalItems = items.length;
            this.resetCurrentPage();
            return this.tableService.getPaginatedTableData(
              items,
              this.pageSize,
              this.currentPage
            );
          })
        )
        .subscribe({
          next: (items: DataItem[]) => {
            this.columnDataTypes =
              this.tableService.columnNameAndItsDataTypeList;
            this.columns = this.tableService.columnList;
            this.tableData = items;
            this.setLoader(false);
          },
          error: (err: Error) => {
            console.error(err);
            this.setLoader(false);
          },
        })
    );
  }

  private applyFiltersOnItems(): void {
    this.resetCurrentPage();
    const filters = this.filterService.filterList;
    this.tableService.applyFilters(filters);
    this.appliedFilters = filters;
  }

  private setLoader(isOnLoad: boolean): void {
    this.isLoading = isOnLoad;
  }

  private resetCurrentPage(): void {
    this.currentPage = ITEM_CONSTANTS.PAGINATION_SETUP.CURRENT_PAGE;
  }
}
