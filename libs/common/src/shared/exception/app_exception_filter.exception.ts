import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import e, { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { ResponseFormat } from '../response/response_format';

/*
 The AppExceptionFilter class is used to handle all 
 errors or crash in the app globally.
 */

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    console.error(exception);
    
    if (exception instanceof HttpException) {
      ResponseFormat.handleErrorResponse(
        request,
        response,
        exception.getResponse(),
        exception.getStatus(),
      );
    } else if (
      exception.name === 'JsonWebTokenError' ||
      exception.name === 'TokenExpiredError'
    ) {
      ResponseFormat.handleErrorResponse(
        request,
        response,
        exception.message,
        400,
      );
    } else if (exception.name === 'CastError') {
      ResponseFormat.handleErrorResponse(
        request,
        response,
        exception.message,
        400,
      );
    } else if (exception instanceof MongoError) {
      const error = exception as MongoError;
      if (error.code == 11000) {
        ResponseFormat.handleErrorResponse(
          request,
          response,
          'User exists already',
          400,
        );
      }
    } else {
      ResponseFormat.handleErrorResponse(
        request,
        response,
        exception.message,
        400,
      );
    }
  }
}
