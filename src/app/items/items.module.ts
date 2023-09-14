import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { UtilityModule } from '../utility/utility.module';

@NgModule({
  declarations: [
    ItemsComponent,
    DataTableComponent,
    FilterSidebarComponent,
    FilterListComponent,
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    ReactiveFormsModule,
    UtilityModule,
  ],
})
export class ItemsModule {}
