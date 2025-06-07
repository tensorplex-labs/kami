// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Base exception for this domain
export class ServeAxonException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SERVE_AXON';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

export class ServeAxonUnknownErrorException extends ServeAxonException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'UNKNOWN_ERROR',
      `Unknown error: ${message}`,
      stackTrace,
    );
  }
}

// Specific exception types
export class ServeAxonParamsInvalidException extends ServeAxonException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_INVALID', message, stackTrace);
  }
}
