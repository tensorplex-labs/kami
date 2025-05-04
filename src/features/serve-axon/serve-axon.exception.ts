// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum ServeAxonErrorCode {
  GENERIC_ERROR = 'SERVE_AXON.GENERIC_ERROR',
  PARAMS_MISSING = 'SERVE_AXON.PARAMS_MISSING',
}

// Base exception for this domain
export class ServeAxonException extends BaseException {
  constructor(
    errorCode: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(errorCode, message, statusCode, details);
  }
}

export class ServeAxonGenericException extends ServeAxonException {
  constructor(reason: string, details?: any) {
    super(
      ServeAxonErrorCode.GENERIC_ERROR,
      `Serve axon error: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

// Specific exception types
export class ServeAxonParamsMissingException extends ServeAxonException {
  constructor(details?: any) {
    super(
      ServeAxonErrorCode.PARAMS_MISSING,
      `Serve axon params missing`,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
