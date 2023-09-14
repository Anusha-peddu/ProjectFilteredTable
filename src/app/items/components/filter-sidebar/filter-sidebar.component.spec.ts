import { TestBed } from '@angular/core/testing';
import { FilterSidebarComponent } from './filter-sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';

const columns = ['id', 'name', 'age', 'email', 'country'];

const columnDataTypes = {
  id: 'number',
  name: 'string',
  age: 'number',
  email: 'string',
  country: 'string',
};

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
    cy.mount(FilterSidebarComponent);
  });

  it('should display data in the table', () => {
    // Mount the FilterListComponent with the columns input
    cy.mount(FilterSidebarComponent, {
      componentProperties: {
        columnDataTypes: columnDataTypes,
        columns: columns,
      },
    });
    cy.get('[data-testid="filter-sidebar"]').should('be.visible');
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
    // Mount the FilterListComponent with the columns input
    cy.mount(FilterSidebarComponent, {
      componentProperties: {
        columnDataTypes: columnDataTypes,
        columns: columns,
      },
    });
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
    // Mount the FilterListComponent with the columns input
    cy.mount(FilterSidebarComponent, {
      componentProperties: {
        columnDataTypes: columnDataTypes,
        columns: columns,
      },
    });
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
    // Mount the FilterListComponent with the columns input
    cy.mount(FilterSidebarComponent, {
      componentProperties: {
        columnDataTypes: columnDataTypes,
        columns: columns,
      },
    });
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
  });

  it('should validate apply filter buttons - Cancel filter', () => {
    // Mount the FilterListComponent with the columns input
    cy.mount(FilterSidebarComponent, {
      componentProperties: {
        columnDataTypes: columnDataTypes,
        columns: columns,
      },
    });
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
});
