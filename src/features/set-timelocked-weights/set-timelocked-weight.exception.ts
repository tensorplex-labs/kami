// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Base exception for this domain
export class SetTimelockedWeightException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SET_TIMELOCKED_WEIGHT';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

export class SetTimelockedWeightUnknownException extends SetTimelockedWeightException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'UNKNOWN_ERROR', message, stackTrace);
  }
}

// Specific exception types
export class SetTimelockedWeightParamsInvalidException extends SetTimelockedWeightException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_INVALID', message, stackTrace);
  }
}
