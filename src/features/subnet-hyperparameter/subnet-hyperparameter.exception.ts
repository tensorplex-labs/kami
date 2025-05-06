// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum SubnetHyperparameterErrorCode {
  NOT_FOUND = 1,
  FETCH_FAILED = 2,
}

// Base exception for this domain
export class SubnetHyperparameterException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SUBNET_HYPERPARAMETER';
    super(statusCode, type, `${errorCategory}.${message}`, stackTrace);
  }
}

export class SubnetHyperparameterNotFoundException extends SubnetHyperparameterException {
  constructor(stackTrace?: string) {
    super(
      HttpStatus.NOT_FOUND,
      String(SubnetHyperparameterErrorCode.NOT_FOUND),
      `NOT_FOUND: Subnet hyperparameter not found`,
      stackTrace,
    );
  }
}

export class SubnetHyperparameterFetchException extends SubnetHyperparameterException {
  constructor(reason: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      String(SubnetHyperparameterErrorCode.FETCH_FAILED),
      `FETCH_FAILED: ${reason}`,
      stackTrace,
    );
  }
}
