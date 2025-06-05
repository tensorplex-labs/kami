// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Base exception for this domain
export class LatestBlockException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'LATEST_BLOCK';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

export class LatestBlockUnknownErrorException extends LatestBlockException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'UNKNOWN_ERROR', message, stackTrace);
  }
}

// Specific exception types
export class LatestBlockNotFoundException extends LatestBlockException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.NOT_FOUND, 'NOT_FOUND', `Latest block not found: ${message}`, stackTrace);
  }
}

export class LatestBlockFetchException extends LatestBlockException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'FETCH_FAILED',
      `Failed to fetch latest block: ${message}`,
      stackTrace,
    );
  }
}
