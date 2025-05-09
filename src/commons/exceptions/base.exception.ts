import { Request, Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { IApiResponse } from '../common-response.interface';

// Base exception class that aligns with the ApiResponse error structure
export class BaseException extends HttpException {
  constructor(
    statusCode: HttpStatus,
    public readonly type: string,
    public readonly message: string,
    public readonly stackTrace?: string,
  ) {
    super(
      {
        type,
        message,
        stackTrace,
      },
      statusCode,
    );
  }
}

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BaseExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse: IApiResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      data: null,
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    };

    if (exception instanceof BaseException) {
      const exceptionResponse = exception.getResponse() as any;

      errorResponse.statusCode = exception.getStatus();
      errorResponse.error = {
        type: exceptionResponse.type,
        message: exceptionResponse.message,
        stackTrace: exceptionResponse.stackTrace,
      };

      this.logger.warn(
        `Domain Exception for route: [${request?.url}] [${exceptionResponse.type}] ${exceptionResponse.message}`,
        exception.stack,
      );
    } else if (exception instanceof HttpException) {
      // Standard NestJS HTTP exceptions
      const exceptionResponse = exception.getResponse() as any;
      const status = exception.getStatus();

      errorResponse.statusCode = status;
      errorResponse.error = {
        type: `HTTP_${status}`,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse.message || 'HTTP exception occurred',
        stackTrace:
          typeof exceptionResponse === 'object' && exceptionResponse !== null
            ? exceptionResponse.message
              ? { ...exceptionResponse, message: undefined }
              : exceptionResponse
            : undefined,
      };

      this.logger.warn(
        `HTTP Exception for route: [${request?.url}] ${errorResponse.error?.message}`,
        exception.stack,
      );
    } else if (exception instanceof Error) {
      // Standard JS errors
      errorResponse.error = {
        type: 'INTERNAL_ERROR',
        message: exception.message || 'An unexpected error occurred',
      };

      this.logger.error(
        `Unexpected Error for route: [${request?.url}] ${exception.message}`,
        exception.stack,
      );
    } else {
      // Unknown exceptions (not Error instances)
      this.logger.error(
        `Unknown Exception for route: [${request?.url}] ${JSON.stringify(exception)}`,
      );
    }

    // Return the formatted error response
    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
