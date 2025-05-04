// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum LatestBlockErrorCode {
  GENERIC_ERROR = 'LATEST_BLOCK.GENERIC_ERROR',
  NOT_FOUND = 'LATEST_BLOCK.NOT_FOUND',
  FETCH_FAILED = 'LATEST_BLOCK.FETCH_FAILED',
}

// Base exception for this domain
export class LatestBlockException extends BaseException {
  constructor(
    errorCode: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(errorCode, message, statusCode, details);
  }
}

export class LatestBlockGenericException extends LatestBlockException {
  constructor(reason: string, details?: any) {
    super(
      LatestBlockErrorCode.GENERIC_ERROR,
      `Latest block error: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

// Specific exception types
export class LatestBlockNotFoundException extends LatestBlockException {
  constructor(reason: string, details?: any) {
    super(
      LatestBlockErrorCode.NOT_FOUND,
      `Latest block not found: ${reason}`,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

export class LatestBlockFetchException extends LatestBlockException {
  constructor(reason: string, details?: any) {
    super(
      LatestBlockErrorCode.FETCH_FAILED,
      `Failed to fetch latest block: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}
