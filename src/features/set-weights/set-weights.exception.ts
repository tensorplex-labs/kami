// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Base exception for this domain
export class SetWeightsException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SET_WEIGHTS';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

export class SetWeightsUnknownException extends SetWeightsException {
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
export class SetWeightsParamsInvalidException extends SetWeightsException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_INVALID', message, stackTrace);
  }
}
