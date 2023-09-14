export const ROOT_URL = 'http://localhost:4200';
export const ITEMS_URL = 'http://localhost:4200/items';


describe('Data Table With Filter And Pagination Spec', () => {
  it('should validate the ROOT_URL matches the items', () => {
    cy.visit(ROOT_URL);

    //validate the url routed to items
    cy.url().should('eq', ITEMS_URL);

    //validate that by default filter toggle button , pagination and data table should exists
    cy.get('[data-testId="items-continer"]').should('exist');
    cy.get('[data-testid="filter-toggle-button"]').should('exist');
    cy.get('.pagination').should('exist');
    cy.get('[data-testid="filter-table-data"]').should('exist');
  });

  it('should validate the filter side bar is open when filter toggle button is clicked', () => {
    cy.visit(ROOT_URL);

    //validate the url routed to items
    cy.url().should('eq', ITEMS_URL);

    //validate the filter side bar section is not visible by default
    cy.get('[data-testid="filter-sidebar"]').should('not.be.visible');

    //click on toggle button
    cy.get('[data-testid="filter-toggle-button"]').should('exist').click();

    //validate side bar is visible once filter button is toggled
    cy.get('[data-testid="filter-sidebar"]').should('be.visible');

    //click on toggle button again
    cy.get('[data-testid="filter-toggle-button"]').should('exist').click();

    //validate the filter side bar section is not visible
    cy.get('[data-testid="filter-sidebar"]').should('not.be.visible');

    //validate the pagination section and data table are available irrespective of toggle button
    cy.get('.pagination').should('exist');
    cy.get('[data-testid="filter-table-data"]').should('exist');
  });

  it('should validate the number of pages, item column names and their values in data table with response from API', () => {
    // Mock a GET request to a specific ROOT_URL with sample data
    cy.intercept('GET', 'http://localhost:4200/assets/table_data.json', {
      fixture: 'items.json',
    }).as('items');

    cy.visit(ROOT_URL);

    //validate the url routed to items
    cy.url().should('eq', ITEMS_URL);

    cy.wait('@items');

    //validating table columns- values
    cy.get('[data-testid="item-list-column-0"]').contains('id');
    cy.get('[data-testid="item-list-column-1"]').contains('name');
    cy.get('[data-testid="item-list-column-2"]').contains('age');
    cy.get('[data-testid="item-list-column-3"]').contains('email');
    cy.get('[data-testid="item-list-column-4"]').contains('country');

    //validate that the page is 2
    cy.get('[data-testid="item-list-values"]')
      .find('tr')
      .then((row) => {
        expect(row.length).eq(2);
      });

    //validate table item values
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-0"]'
    ).contains('1');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-0"]'
    ).contains('2');
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-1"]'
    ).contains('John Doe');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-1"]'
    ).contains('Jane Smith');

    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-2"]'
    ).contains('30');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-2"]'
    ).contains('28');

    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-3"]'
    ).contains('johndoe@example.com');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-3"]'
    ).contains('janesmith@example.com');

    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-4"]'
    ).contains('USA');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-4"]'
    ).contains('Canada');
  });

  it('should validate pagination previous and next buttons and current page dropdown', () => {
    // Mock a GET request to a specific ROOT_URL with sample data
    cy.intercept('GET', 'http://localhost:4200/assets/table_data.json', {
      fixture: 'items.json',
    }).as('items');

    cy.visit(ROOT_URL);

    //validate the url routed to items
    cy.url().should('eq', ITEMS_URL);

    cy.wait('@items');

    //validate data on first page before going to next page
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-0"]'
    ).contains('1');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-0"]'
    ).contains('2');

    //previous button on pagination should be disabled for the first page
    cy.get('[data-testid="pagination-previous-button"]').should('be.disabled');

    //click on next page
    cy.get('[data-testid="pagination-next-button"]').should('exist').click();

    //validate data on first page before going to next page
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-0"]'
    ).contains('3');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-0"]'
    ).contains('4');

    //previous button on pagination should be enabled for the second page
    cy.get('[data-testid="pagination-previous-button"]')
      .should('not.be.disabled')
      .click();

    //validate data on first page after going to previous page on click of previous button
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-0"]'
    ).contains('1');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-0"]'
    ).contains('2');

    //previous button on pagination should be disabled for the first page
    cy.get('[data-testid="pagination-previous-button"]').should('be.disabled');

    //validate the current page dropdown to have value 1
    cy.get('[data-testid="pagination-current-page-dropdown"]').should(
      'have.value',
      '1'
    );
    cy.get('[data-testid="pagination-current-page-dropdown"]').select('3');

    //validate the current page dropdown to have value 3
    cy.get('[data-testid="pagination-current-page-dropdown"]').should(
      'have.value',
      '3'
    );

    //validate data on first page after going to previous page on click of previous button
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-0"]'
    ).contains('5');
  });

  it('should validate apply filter- column name dropdown', () => {
    // Mock a GET request to a specific ROOT_URL with sample data
    cy.intercept('GET', 'http://localhost:4200/assets/table_data.json', {
      fixture: 'items.json',
    }).as('items');

    cy.visit(ROOT_URL);

    cy.wait('@items');

    //click on filter button
    cy.get('[data-testid="filter-toggle-button"]').should('exist').click();

    //validate labels for filter side bar section
    cy.get('[data-testid="column-name-selection"] > label').contains(
      'Column Name'
    );
    cy.get('[data-testid="operator-selection"] > label').contains('Operator');
    cy.get('[data-testid="apply-filter"]').contains('Apply Filter');
    cy.get('[data-testid="cancel-filter"]').contains('Clear Filter');

    //validate value input field doesnt exist
    cy.get('[data-testid="value-field"]').should('not.exist');

    //select column Name dropdown options
    cy.get('[data-testid="column-name-selection"]')
      .find('select')
      .get('option')
      .contains('id');
    cy.get('[data-testid="column-name-selection"]')
      .find('select')
      .get('option')
      .contains('name');
    cy.get('[data-testid="column-name-selection"]')
      .find('select')
      .get('option')
      .contains('age');
    cy.get('[data-testid="column-name-selection"]')
      .find('select')
      .get('option')
      .contains('email');
    cy.get('[data-testid="column-name-selection"]')
      .find('select')
      .get('option')
      .contains('country');
  });

  it('should validate apply filter- operator dropdown', () => {
    // Mock a GET request to a specific ROOT_URL with sample data
    cy.intercept('GET', 'http://localhost:4200/assets/table_data.json', {
      fixture: 'items.json',
    }).as('items');

    cy.visit(ROOT_URL);

    cy.wait('@items');

    //click on filter button
    cy.get('[data-testid="filter-toggle-button"]').should('exist').click();

    //select column Name dropdown options
    cy.get('[data-testid="column-name-selection"]').find('select').select('id');

    //validate options when selected column name has number as type
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('equals');
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('not equals');
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('less than');
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('greater than');
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('less than equal to');
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('greater than equal to');

    //select column Name dropdown options
    cy.get('[data-testid="column-name-selection"]')
      .find('select')
      .select('name');

    //change the selection from id to name which has string as datatype and vallidate the options for operator
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('equals');
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('not equals');
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('contains');
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .get('option')
      .contains('does not contain');
  });

  it('should validate apply filter- value input field', () => {
    // Mock a GET request to a specific ROOT_URL with sample data
    cy.intercept('GET', 'http://localhost:4200/assets/table_data.json', {
      fixture: 'items.json',
    }).as('items');

    cy.visit(ROOT_URL);

    cy.wait('@items');

    //click on filter button
    cy.get('[data-testid="filter-toggle-button"]').should('exist').click();

    //select column Name dropdown options
    cy.get('[data-testid="column-name-selection"]').find('select').select('id');

    //validate input value field exists
    cy.get('[data-testid="value-number-field"]').should('exist');

    //validate text input value field does not exists
    cy.get('[data-testid="value-text-field"]').should('not.exist');

    //type string into input field
    cy.get('[data-testid="value-number-field"]').type('asd');

    //input should remain unachanges as it should only accept numbers
    cy.get('[data-testid="value-number-field"]').should('have.value', '');

    //type number into input field
    cy.get('[data-testid="value-number-field"]').type('123');

    //input should remain unachanges as it should only accept numbers
    cy.get('[data-testid="value-number-field"]').should('have.value', '123');

    //change select column Name dropdown option
    cy.get('[data-testid="column-name-selection"]')
      .find('select')
      .select('name');

    //validate number input value field does not exists
    cy.get('[data-testid="value-number-field"]').should('not.exist');

    //validate text input value field does exists
    cy.get('[data-testid="value-text-field"]').should('exist');

    //type string into input field
    cy.get('[data-testid="value-text-field"]').type('asd');

    //input should have string input
    cy.get('[data-testid="value-text-field"]').should('have.value', 'asd');
  });

  it('should validate apply filter buttons - Apply filter', () => {
    // Mock a GET request to a specific ROOT_URL with sample data
    cy.intercept('GET', 'http://localhost:4200/assets/table_data.json', {
      fixture: 'items.json',
    }).as('items');

    cy.visit(ROOT_URL);

    cy.wait('@items');

    //click on filter button
    cy.get('[data-testid="filter-toggle-button"]').should('exist').click();

    cy.get('[data-testid="apply-filter"]').should('be.disabled');

    //select column Name dropdown options
    cy.get('[data-testid="column-name-selection"]').find('select').select('id');

    cy.get('[data-testid="apply-filter"]').should('be.disabled');
    //select operator
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .select('equals');

    cy.get('[data-testid="apply-filter"]').should('be.disabled');

    //type string into input field
    cy.get('[data-testid="value-number-field"]').type('1');

    //validate apply filter button is not disabled
    cy.get('[data-testid="apply-filter"]').should('not.be.disabled').click();

    //validate the filter added to applied filter list
    cy.get('[data-testid="applied-filters-0"]').contains('id equals 1');

    //validate the data table to have filtered value
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-0"]'
    ).contains('1');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-0"]'
    ).should('not.exist');

    cy.get('[data-testid="pagination-previous-button"]').should('be.disabled');
    cy.get('[data-testid="pagination-next-button"]').should('be.disabled');
  });

  it('should validate apply filter buttons - Cancel filter', () => {
    // Mock a GET request to a specific ROOT_URL with sample data
    cy.intercept('GET', 'http://localhost:4200/assets/table_data.json', {
      fixture: 'items.json',
    }).as('items');

    cy.visit(ROOT_URL);

    cy.wait('@items');

    //click on filter button
    cy.get('[data-testid="filter-toggle-button"]').should('exist').click();

    cy.get('[data-testid="apply-filter"]').should('be.disabled');

    //select column Name dropdown options
    cy.get('[data-testid="column-name-selection"]').find('select').select('id');

    cy.get('[data-testid="apply-filter"]').should('be.disabled');
    //select operator
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .select('equals');

    //type string into input field
    cy.get('[data-testid="value-number-field"]').type('1');

    //click on cancel filter
    cy.get('[data-testid="cancel-filter"]').should('exist').click();

    //validate the form to be reset
    cy.get('[data-testid="column-name-selection"]')
      .find('select')
      .should('have.value', null);
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .should('have.value', null);
    cy.get('[data-testid="value-number-field"]').should('have.value', '');
  });

  it('should validate the cancel buton on applied filter should remove the filter on data table', () => {
    // Mock a GET request to a specific ROOT_URL with sample data
    cy.intercept('GET', 'http://localhost:4200/assets/table_data.json', {
      fixture: 'items.json',
    }).as('items');

    cy.visit(ROOT_URL);

    cy.wait('@items');

    //click on filter button
    cy.get('[data-testid="filter-toggle-button"]').should('exist').click();

    cy.get('[data-testid="apply-filter"]').should('be.disabled');

    //select column Name dropdown options
    cy.get('[data-testid="column-name-selection"]').find('select').select('id');

    cy.get('[data-testid="apply-filter"]').should('be.disabled');
    //select operator
    cy.get('[data-testid="operator-selection"]')
      .find('select')
      .select('equals');

    cy.get('[data-testid="apply-filter"]').should('be.disabled');

    //type string into input field
    cy.get('[data-testid="value-number-field"]').type('1');

    //validate apply filter button is not disabled
    cy.get('[data-testid="apply-filter"]').should('not.be.disabled').click();

    //validate the filter added to applied filter list
    cy.get('[data-testid="applied-filters-0"]').contains('id equals 1');

    //validate the data table to have filtered value
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-0"]'
    ).contains('1');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-0"]'
    ).should('not.exist');

    cy.get('[data-testid="pagination-previous-button"]').should('be.disabled');
    cy.get('[data-testid="pagination-next-button"]').should('be.disabled');

    cy.get('[data-testid="applied-filter-cancel-0"]').click();

    //validate the data table to have removed the filter
    cy.get(
      '[data-testid="item-list-0"] > [data-testid="item-list-data-0"]'
    ).contains('1');
    cy.get(
      '[data-testid="item-list-1"] > [data-testid="item-list-data-0"]'
    ).contains('2');

    cy.get('[data-testid="pagination-previous-button"]').should('be.disabled');
    cy.get('[data-testid="pagination-next-button"]').should('not.be.disabled');
  });
});
