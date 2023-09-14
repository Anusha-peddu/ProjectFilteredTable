import { PaginationComponent } from './pagination.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { createOutputSpy } from 'cypress/angular';

describe('FilterListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('mounts', () => {
    cy.mount(PaginationComponent);
  });

  it('should validate visibility pagination button and page dropdown with correct value when multiple page exists', () => {
    cy.mount(PaginationComponent, {
      componentProperties: { pageSize: 10, currentPage: 2, totalItems: 24 },
    });
    cy.get('[data-testid="pagination-previous-button"]')
      .should('not.be.disabled')
      .contains('Previous');
    cy.get('[data-testid="pagination-next-button"]')
      .should('not.be.disabled')
      .contains('Next');
    cy.get('[data-testid="pagination-current-page-dropdown"]').contains('2');
  });

  it('should validate visibility pagination buttons when only page is there', () => {
    cy.mount(PaginationComponent, {
      componentProperties: { pageSize: 10, currentPage: 1, totalItems: 8 },
    });
    cy.get('[data-testid="pagination-previous-button"]').should('be.disabled');
    cy.get('[data-testid="pagination-next-button"]').should('be.disabled');
    cy.get('[data-testid="pagination-current-page-dropdown"]').contains('1');
  });

  it('should validate that click of next button emits the next page value', () => {
    cy.mount(PaginationComponent, {
      componentProperties: {
        pageSize: 2,
        currentPage: 1,
        totalItems: 8,
        pageChange: createOutputSpy('changeSpy'),
      },
    });
    cy.get('[data-testid="pagination-previous-button"]').should('be.disabled');
    cy.get('[data-testid="pagination-current-page-dropdown"]').contains('1');
    cy.get('[data-testid="pagination-next-button"]')
      .should('not.be.disabled')
      .click();
    cy.get('@changeSpy').should('have.been.calledWith', 2);
  });

  it('should validate that the change of page dropdown emits the page selected', () => {
    cy.mount(PaginationComponent, {
      componentProperties: {
        pageSize: 2,
        currentPage: 1,
        totalItems: 8,
        pageChange: createOutputSpy('changeSpy'),
      },
    });

    cy.get('[data-testid="pagination-current-page-dropdown"]').contains('1');
    cy.get('[data-testid="pagination-current-page-dropdown"]').select('3');

    cy.get('@changeSpy').should('have.been.calledWith', '3');
  });
});
