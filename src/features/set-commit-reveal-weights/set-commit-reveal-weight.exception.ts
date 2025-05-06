// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum SetCommitRevealWeightErrorCode {
  PARAMS_MISSING = '1',
}

// Base exception for this domain
export class SetCommitRevealWeightException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SET_COMMIT_REVEAL_WEIGHT';
    super(statusCode, type, `${errorCategory}.${message}`, stackTrace);
  }
}

// Specific exception types
export class SetCommitRevealWeightParamsMissingException extends SetCommitRevealWeightException {
  constructor(stackTrace?: any) {
    super(
      HttpStatus.BAD_REQUEST,
      String(SetCommitRevealWeightErrorCode.PARAMS_MISSING),
      `PARAMS_MISSING: Set commit reveal weight params missing`,
      stackTrace,
    );
  }
}
