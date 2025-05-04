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
    public readonly errorCode: string,
    public readonly errorMessage: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly details?: any,
  ) {
    super(
      {
        errorCode,
        errorMessage,
        details,
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
    const now = Date.now();

    // Create a response that strictly follows ApiResponse interface
    const errorResponse: IApiResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        errorMessage: 'Internal server error',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        path: request?.url,
        executionTime: Date.now() - now,
      },
    };

    // Custom handling based on exception type
    if (exception instanceof BaseException) {
      // Our custom base exception
      const exceptionResponse = exception.getResponse() as any;

      errorResponse.statusCode = exception.getStatus();
      errorResponse.error = {
        code: exceptionResponse.errorCode,
        errorMessage: exceptionResponse.errorMessage,
        details: exceptionResponse.details,
      };

      this.logger.warn(
        `Domain Exception for route: [${request?.url}] [${exceptionResponse.errorCode}] ${exceptionResponse.errorMessage}`,
        exception.stack,
      );
    } else if (exception instanceof HttpException) {
      // Standard NestJS HTTP exceptions
      const exceptionResponse = exception.getResponse() as any;
      const status = exception.getStatus();

      errorResponse.statusCode = status;
      errorResponse.error = {
        code: `HTTP_${status}`,
        errorMessage:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse.errorMessage || 'HTTP exception occurred',
        details:
          typeof exceptionResponse === 'object' && exceptionResponse !== null
            ? exceptionResponse.errorMessage
              ? { ...exceptionResponse, errorMessage: undefined }
              : exceptionResponse
            : undefined,
      };

      this.logger.warn(
        `HTTP Exception for route: [${request?.url}] ${errorResponse.error?.errorMessage}`,
        exception.stack,
      );
    } else if (exception instanceof Error) {
      // Standard JS errors
      errorResponse.error = {
        code: 'INTERNAL_ERROR',
        errorMessage: exception.message || 'An unexpected error occurred',
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
