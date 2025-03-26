import { HttpStatus } from '@nestjs/common';

export const ERROR = {
  UNAUTHORIZED: {
    code: HttpStatus.UNAUTHORIZED,
    reference: 1,
    message: 'Unauthorized to perform this action',
  },

  CATEGORY_ALREADY_EXISTS: {
    code: HttpStatus.CONFLICT,
    reference: 2,
    message: "Category doesn't exist",
  },

  CATEGORY_NOT_FOUND: {
    code: HttpStatus.NOT_FOUND,
    reference: 3,
    message: 'Category not found',
  },
};
