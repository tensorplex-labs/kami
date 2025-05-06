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

export class CheckHotkeyNetuidHotkeyMissingException extends CheckHotkeyException {
  constructor(stackTrace?: string) {
    super(
      HttpStatus.BAD_REQUEST,
      'NETUID_HOTKEY_MISSING',
      'Netuid and hotkey are required',
      stackTrace,
    );
  }
}
