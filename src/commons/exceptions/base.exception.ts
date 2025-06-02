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

@Catch(Error)
export class KamiBaseExceptionFilter implements ExceptionFilter {
  protected readonly logger = new Logger(this.constructor.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.debug(`🔍 ${this.constructor.name} caught: ${exception?.constructor?.name}`);

    const mappedException = this.mapException(exception);

    this.sendErrorResponse(mappedException, response, request);
  }

  // Implement this method for domain-specific filters
  protected mapException(exception: unknown): BaseException {
    if (exception instanceof BaseException) {
      this.logger.debug(`✅ Already a BaseException: ${exception.constructor.name}`);
      return exception;
    }

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;
      const status = exception.getStatus();

      return new BaseException(
        status,
        `HTTP_${status}`,
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || 'HTTP exception occurred',
        exception.stack,
      );
    }

    if (exception instanceof Error) {
      return new BaseException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_ERROR',
        exception.message || 'An unexpected error occurred',
        exception.stack,
      );
    }

    // Unknown exceptions
    return new BaseException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'UNKNOWN_ERROR',
      'An unknown error occurred',
      undefined,
    );
  }

  protected sendErrorResponse(
    exception: BaseException,
    response: Response,
    request: Request,
  ): void {
    const exceptionResponse = exception.getResponse() as any;
    const status = exception.getStatus();

    this.logger.warn(
      `🔥 ${this.constructor.name} Exception for route: [${request?.url}] [${exceptionResponse.type}] ${exceptionResponse.message}`,
      exception.stack,
    );

    const errorResponse: IApiResponse = {
      statusCode: status,
      success: false,
      data: null,
      error: {
        type: exceptionResponse.type,
        message: exceptionResponse.message,
        stackTrace: exceptionResponse.stackTrace,
      },
    };

    this.logger.debug(`📤 Sending error response: ${JSON.stringify(errorResponse, null, 2)}`);
    response.status(status).json(errorResponse);
  }
}
