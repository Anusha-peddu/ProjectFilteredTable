import { FilterListComponent } from './filter-list.component';

const filters = [
  { columnName: 'id', operator: 'less than', value: '10' },
  { columnName: 'currency', operator: 'equals', value: 'GBP' },
];

describe('FilterListComponent', () => {
  it('mounts', () => {
    cy.mount(FilterListComponent);
  });

  it('should display applied filters', () => {
    // Mount the FilterListComponent with the appliedFilters input
    cy.mount(FilterListComponent, {
      componentProperties: { appliedFilters: filters },
    });

    //validate the filters
    cy.get('[data-testid="applied-filters-list"]')
      .find('div')
      .should('have.length', filters.length);

    cy.get('[data-testid="applied-filters-0"]').contains('id less than 10');
    cy.get('[data-testid="applied-filters-1"]').contains('currency equals GBP');
  });
});
