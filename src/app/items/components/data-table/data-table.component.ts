import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataItem } from 'src/app/model/data-item.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnChanges {
  /**
   * Input Fields
   *
   */
  @Input() tableData: DataItem[] = [];
  @Input() columns: string[] = [];

  /**
   * Life Cycle Methods
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']?.currentValue) {
      this.columns = changes['columns'].currentValue;
    }
    if (changes['tableData']?.currentValue) {
      this.tableData = changes['tableData'].currentValue;
    }
  }
}
