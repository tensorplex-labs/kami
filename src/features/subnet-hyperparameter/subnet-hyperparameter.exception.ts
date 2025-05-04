// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum SubnetHyperparameterErrorCode {
  GENERIC_ERROR = 'SUBNET_HYPERPARAMETER.GENERIC_ERROR',
  NOT_FOUND = 'SUBNET_HYPERPARAMETER.NOT_FOUND',
  FETCH_FAILED = 'SUBNET_HYPERPARAMETER.FETCH_FAILED',
}

// Base exception for this domain
export class SubnetHyperparameterException extends BaseException {
  constructor(
    errorCode: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(errorCode, message, statusCode, details);
  }
}

export class SubnetHyperparameterGenericException extends SubnetHyperparameterException {
  constructor(reason: string, details?: any) {
    super(
      SubnetHyperparameterErrorCode.GENERIC_ERROR,
      `Subnet hyperparameter error: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class SubnetHyperparameterNotFoundException extends SubnetHyperparameterException {
  constructor(reason: string, details?: any) {
    super(
      SubnetHyperparameterErrorCode.NOT_FOUND,
      `Subnet hyperparameter not found: ${reason}`,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
