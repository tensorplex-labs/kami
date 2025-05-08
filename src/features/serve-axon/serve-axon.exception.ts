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

// Specific exception types
export class ServeAxonParamsMissingException extends ServeAxonException {
  constructor(stackTrace?: any) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_MISSING', 'Serve axon params missing', stackTrace);
  }
}
