// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum SubnetMetagraphErrorCode {
  GENERIC_ERROR = 'SUBNET_METAGRAPH.GENERIC_ERROR',
  NOT_FOUND = 'SUBNET_METAGRAPH.NOT_FOUND', // TODO: There is another error code on subtensor level, to discuss how to handle this
  INVALID_SUBNET_ID = 'SUBNET_METAGRAPH.INVALID_SUBNET_ID',
  FETCH_FAILED = 'SUBNET_METAGRAPH.FETCH_FAILED',
  VALIDATION_ERROR = 'SUBNET_METAGRAPH.VALIDATION_ERROR',
  PERMISSION_DENIED = 'SUBNET_METAGRAPH.PERMISSION_DENIED',
}

// Base exception for this domain
export class SubnetMetagraphException extends BaseException {
  constructor(
    errorCode: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(errorCode, message, statusCode, details);
  }
}

export class SubnetMetagraphGenericException extends SubnetMetagraphException {
  constructor(reason: string, details?: any) {
    super(
      SubnetMetagraphErrorCode.GENERIC_ERROR,
      `Subnet metagraph error: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

// Specific exception types
export class SubnetMetagraphNotFoundException extends SubnetMetagraphException {
  constructor(subnetId?: string | number, details?: any) {
    const message = subnetId
      ? `Subnet metagraph with ID ${subnetId} not found`
      : 'Subnet metagraph not found';

    super(SubnetMetagraphErrorCode.NOT_FOUND, message, HttpStatus.NOT_FOUND, details);
  }
}

export class InvalidSubnetIdException extends SubnetMetagraphException {
  constructor(subnetId: string | number, details?: any) {
    super(
      SubnetMetagraphErrorCode.INVALID_SUBNET_ID,
      `Invalid subnet ID: ${subnetId}`,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class SubnetMetagraphFetchException extends SubnetMetagraphException {
  constructor(reason: string, details?: any) {
    super(
      SubnetMetagraphErrorCode.FETCH_FAILED,
      `Failed to fetch subnet metagraph: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class SubnetMetagraphValidationException extends SubnetMetagraphException {
  constructor(reason: string, details?: any) {
    super(
      SubnetMetagraphErrorCode.VALIDATION_ERROR,
      `Subnet metagraph validation error: ${reason}`,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class SubnetMetagraphPermissionException extends SubnetMetagraphException {
  constructor(action: string, details?: any) {
    super(
      SubnetMetagraphErrorCode.PERMISSION_DENIED,
      `Permission denied for subnet metagraph action: ${action}`,
      HttpStatus.FORBIDDEN,
      details,
    );
  }
}
