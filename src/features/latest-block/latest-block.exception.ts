// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum LatestBlockErrorCode {
  NOT_FOUND = 'LATEST_BLOCK.NOT_FOUND',
  FETCH_FAILED = 'LATEST_BLOCK.FETCH_FAILED',
}

// Base exception for this domain
export class LatestBlockException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'LATEST_BLOCK';
    super(statusCode, type, `${errorCategory}.${message}`, stackTrace);
  }
}

// Specific exception types
export class LatestBlockNotFoundException extends LatestBlockException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.NOT_FOUND,
      String(LatestBlockErrorCode.NOT_FOUND),
      `NOT_FOUND: Latest block not found: ${message}`,
      stackTrace,
    );
  }
}

export class LatestBlockFetchException extends LatestBlockException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      String(LatestBlockErrorCode.FETCH_FAILED),
      `FETCH_FAILED: Failed to fetch latest block: ${message}`,
      stackTrace,
    );
  }
}
