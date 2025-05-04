// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum SetCommitRevealWeightErrorCode {
  GENERIC_ERROR = 'SET_COMMIT_REVEAL_WEIGHT.GENERIC_ERROR',
  PARAMS_MISSING = 'SET_COMMIT_REVEAL_WEIGHT.PARAMS_MISSING',
}

// Base exception for this domain
export class SetCommitRevealWeightException extends BaseException {
  constructor(
    errorCode: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(errorCode, message, statusCode, details);
  }
}

export class SetCommitRevealWeightGenericException extends SetCommitRevealWeightException {
  constructor(reason: string, details?: any) {
    super(
      SetCommitRevealWeightErrorCode.GENERIC_ERROR,
      `Set commit reveal weight error: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

// Specific exception types
export class SetCommitRevealWeightParamsMissingException extends SetCommitRevealWeightException {
  constructor(details?: any) {
    super(
      SetCommitRevealWeightErrorCode.PARAMS_MISSING,
      `Set commit reveal weight params missing`,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
