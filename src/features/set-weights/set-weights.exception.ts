// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum SetWeightsErrorCode {
  GENERIC_ERROR = 'SET_WEIGHTS.GENERIC_ERROR',
  PARAMS_MISSING = 'SET_WEIGHTS.PARAMS_MISSING',
}

// Base exception for this domain
export class SetWeightsException extends BaseException {
  constructor(
    errorCode: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(errorCode, message, statusCode, details);
  }
}

export class SetWeightsGenericException extends SetWeightsException {
  constructor(reason: string, details?: any) {
    super(
      SetWeightsErrorCode.GENERIC_ERROR,
      `Set weights error: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

// Specific exception types
export class SetWeightsParamsMissingException extends SetWeightsException {
  constructor(details?: any) {
    super(
      SetWeightsErrorCode.PARAMS_MISSING,
      `Set weights params missing`,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
