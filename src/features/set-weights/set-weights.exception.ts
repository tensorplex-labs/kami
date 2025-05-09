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

// Specific exception types
export class SetWeightsParamsMissingException extends SetWeightsException {
  constructor(stackTrace?: any) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_MISSING', 'Set weights params missing', stackTrace);
  }
}
