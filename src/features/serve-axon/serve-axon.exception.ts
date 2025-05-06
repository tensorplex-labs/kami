// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum ServeAxonErrorCode {
  PARAMS_MISSING = '1',
}

// Base exception for this domain
export class ServeAxonException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SERVE_AXON';
    super(statusCode, type, `${errorCategory}.${message}`, stackTrace);
  }
}

// Specific exception types
export class ServeAxonParamsMissingException extends ServeAxonException {
  constructor(stackTrace?: any) {
    super(
      HttpStatus.BAD_REQUEST,
      String(ServeAxonErrorCode.PARAMS_MISSING),
      `PARAMS_MISSING: Serve axon params missing`,
      stackTrace,
    );
  }
}
