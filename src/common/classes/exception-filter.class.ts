import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { CustomError } from './error.class';

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
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        reference: 1,
        message: 'Internal Server Error',
      });
    }
  }
}
