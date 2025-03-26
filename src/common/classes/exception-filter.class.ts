import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { CustomError } from './error.class';
import { ValidationError } from 'class-validator';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof CustomError) {
      response.status(exception.code).json({
        reference: exception.reference,
        message: exception.message,
      });
    } else if (exception instanceof ValidationError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        reference: 0,
        message: exception.value,
        data: exception,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        reference: 1,
        message: 'Internal Server Error',
      });
    }
  }
}
