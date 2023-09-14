import { AllowedOperators } from '../model/allowed-operators.enum';

export const ITEM_CONSTANTS = {
  STRING_OPERATORS: [
    AllowedOperators.EQUALS,
    AllowedOperators.NOT_EQUALS,
    AllowedOperators.CONTAINS,
    AllowedOperators.DOES_NOT_CONTAIN,
  ],

  NUMBER_OPERATORS: [
    AllowedOperators.EQUALS,
    AllowedOperators.NOT_EQUALS,
    AllowedOperators.LESS_THAN,
    AllowedOperators.LESS_THAN_OR_EQUAL_TO,
    AllowedOperators.GREATER_THAN,
    AllowedOperators.GREATER_THAN_OR_EQUAL_TO,
  ],

  PAGINATION_SETUP: {
    PAGE_SIZE: 2,
    CURRENT_PAGE: 1,
    TOTAL_PAGES: 0,
  },
};
