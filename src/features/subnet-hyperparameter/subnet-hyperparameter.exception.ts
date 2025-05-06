// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Base exception for this domain
export class SubnetHyperparameterException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SUBNET_HYPERPARAMETER';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

export class SubnetHyperparameterNotFoundException extends SubnetHyperparameterException {
  constructor(stackTrace?: string) {
    super(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND',
      'Subnet hyperparameter not found',
      stackTrace,
    );
  }
}

export class SubnetHyperparameterFetchException extends SubnetHyperparameterException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'FETCH_FAILED',
      message,
      stackTrace,
    );
  }
}
