import { HttpStatus } from '@nestjs/common';

export const ERROR = {
  UNAUTHORIZED: {
    code: HttpStatus.UNAUTHORIZED,
    reference: 1,
    message: 'Unauthorized to perform this action',
  },

  BAD_REQUEST: {
    code: HttpStatus.BAD_REQUEST,
    reference: 2,
    message: 'Bad request',
  },

  INVALID_CREDENTIALS: {
    code: HttpStatus.UNAUTHORIZED,
    reference: 3,
    message: 'Invalid username or password entered',
  },

  CATEGORY_ALREADY_EXISTS: {
    code: HttpStatus.CONFLICT,
    reference: 4,
    message: 'Category already exists',
  },

  CATEGORY_NOT_FOUND: {
    code: HttpStatus.NOT_FOUND,
    reference: 5,
    message: 'Category not found',
  },
  USER_NOT_FOUND: {
    code: HttpStatus.NOT_FOUND,
    reference: 6,
    message: 'User not found',
  },
};
