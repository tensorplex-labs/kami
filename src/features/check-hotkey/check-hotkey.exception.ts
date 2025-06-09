// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Base exception for this domain
export class CheckHotkeyException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'CHECK_HOTKEY';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

export class CheckHotkeyUnknownErrorException extends CheckHotkeyException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'UNKNOWN_ERROR',
      `Unknown error: ${message}`,
      stackTrace,
    );
  }
}

// Specific exception types
export class CheckHotkeyFetchException extends CheckHotkeyException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'FETCH_FAILED',
      `Error fetching hotkey status: ${message}`,
      stackTrace,
    );
  }
}

export class CheckHotkeyBlockNotFoundException extends CheckHotkeyException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'BLOCK_NOT_FOUND',
      `Block not found: ${message}`,
      stackTrace,
    );
  }
}

export class CheckHotkeyParamsInvalidException extends CheckHotkeyException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_INVALID', message, stackTrace);
  }
}
