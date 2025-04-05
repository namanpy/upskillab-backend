import { HttpStatus } from '@nestjs/common';
import { ref } from 'process';

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

  COURSE_ALREADY_EXISTS: {
    code: HttpStatus.CONFLICT,
    reference: 7,
    message: 'Course already exists',
  },

  COURSE_NOT_FOUND: {
    code: HttpStatus.NOT_FOUND,
    reference: 8,
    message: 'Course not found',
  },
  LANGUAGE_ALREADY_EXISTS: {
    code: 409,
    reference: 9,
    message: 'Language with this code already exists',
  },
  LANGUAGE_NOT_FOUND: {
    code: 404,
    reference: 10,
    message: 'Language not found',
  },
  ORDER_NOT_FOUND: {
    reference: 11,
    code: 404,
    message: 'Order not found',
  },
  PAYMENT_NOT_FOUND: {
    code: 404,
    reference: 12,
    message: 'Payment not found',
  },
  BATCH_NOT_FOUND: {
    code: 400,
    reference: 13,
    message: 'Batch not found',
  },
  BATCH_NOT_ACTIVE: {
    code: 400,
    reference: 14,
    message: 'Batch is not active',
  },
  BATCH_FULL: {
    code: 400,
    reference: 15,
    message: 'Batch is full',
  },
  USER_ALREADY_EXISTS: {
    code: HttpStatus.CONFLICT,
    reference: 16,
    message: 'User already exists',
  },
  ALREADY_REGISTERED_FOR_COURSE: {
    code: HttpStatus.CONFLICT,
    reference: 17,
    message: 'Already registered for course',
  },
};
