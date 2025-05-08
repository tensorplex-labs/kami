// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Base exception for this domain
export class SubnetMetagraphException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SUBNET_METAGRAPH';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

// Specific exception types
export class SubnetMetagraphNotFoundException extends SubnetMetagraphException {
  constructor(subnetId?: string | number, stackTrace?: string) {
    const message = subnetId
      ? `Subnet metagraph with ID ${subnetId} not found`
      : 'Subnet metagraph not found';

    super(HttpStatus.NOT_FOUND, 'NOT_FOUND', message, stackTrace);
  }
}

export class InvalidSubnetIdException extends SubnetMetagraphException {
  constructor(subnetId: string | number, stackTrace?: string) {
    const message = `Invalid subnet ID: ${subnetId}`;
    super(HttpStatus.BAD_REQUEST, 'INVALID_SUBNET_ID', message, stackTrace);
  }
}

export class SubnetMetagraphFetchException extends SubnetMetagraphException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'FETCH_FAILED', message, stackTrace);
  }
}

export class SubnetMetagraphValidationException extends SubnetMetagraphException {
  constructor(reason: string, stackTrace?: string) {
    const message = `Subnet metagraph validation error: ${reason}`;
    super(HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', message, stackTrace);
  }
}

export class SubnetMetagraphPermissionException extends SubnetMetagraphException {
  constructor(action: string, stackTrace?: string) {
    const message = `Permission denied for subnet metagraph action: ${action}`;
    super(HttpStatus.FORBIDDEN, 'PERMISSION_DENIED', message, stackTrace);
  }
}
