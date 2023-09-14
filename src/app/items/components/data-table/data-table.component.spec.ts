import { DataTableComponent } from './data-table.component';

const items = [
  { id: 1, name: 'John', age: 30, email: 'john@example.com', country: 'USA' },
];
const columns = ['id', 'name', 'age', 'email', 'country'];

describe('DataTableComponent', () => {
  it('mounts', () => {
    cy.mount(DataTableComponent);
  });

  it('should display data in the table', () => {
    // Mount the DataTableComponent with the columns input
    cy.mount(DataTableComponent, {
      componentProperties: { tableData: items, columns: columns },
    });

    //validate the table rows
    cy.get('table')
      .find('tr')
      .should('have.length', items.length + 1); // +1 for the header row
  });
});
