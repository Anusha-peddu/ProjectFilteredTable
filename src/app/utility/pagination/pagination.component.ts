import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  /**
   * Input Fields
   */
  @Input() pageSize: number = 1;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 1;

  /**
   * Output Fields
   */
  @Output() pageChange = new EventEmitter<number>();

  /**
   * Class Level Fields
   */
  pageForm: FormGroup = new FormGroup({});

  /**
   * Getters And Setters
   */

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get selectedPageValue(): number {
    return this.pageForm.get('selectedPage')?.value;
  }

  set selectedPageValue(value: number) {
    this.pageForm.get('selectedPage')?.setValue(value);
  }

  /**
   * Constructor
   */

  constructor(private fb: FormBuilder) {}

  /**
   * Life Cycle Methods
   */
  ngOnInit(): void {
    this.pageForm = this.fb.group({
      selectedPage: [this.currentPage],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSize']?.currentValue) {
      this.pageSize = changes['pageSize']?.currentValue;
    }
    if (changes['currentPage']?.currentValue) {
      this.currentPage = changes['currentPage']?.currentValue;
      this.selectedPageValue = this.currentPage;
    }
    if (changes['totalItems']?.currentValue) {
      this.totalItems = changes['totalItems']?.currentValue;
    }
  }

  /**
   * Event Listeners
   */
  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      const pageNumber: number = ++this.currentPage;
      this.pageChange.emit(pageNumber);
      this.selectedPageValue = pageNumber;
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      const pageNumber: number = --this.currentPage;
      this.pageChange.emit(pageNumber);
      this.selectedPageValue = pageNumber;
    }
  }

  onPageChange(): void {
    const selectedPage = this.selectedPageValue;
    if (selectedPage >= 1 && selectedPage <= this.totalPages) {
      this.pageChange.emit(selectedPage);
    }
  }
}
