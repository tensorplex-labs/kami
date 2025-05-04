// src/features/subnet-metagraph/exceptions/subnet-metagraph.exceptions.ts
import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error code enum for this domain
export enum CheckHotkeyErrorCode {
  GENERIC_ERROR = 'CHECK_HOTKEY.GENERIC_ERROR',
  FETCH_FAILED = 'CHECK_HOTKEY.FETCH_FAILED',
  NETUID_HOTKEY_MISSING = 'CHECK_HOTKEY.NETUID_HOTKEY_MISSING',
}

// Base exception for this domain
export class CheckHotkeyException extends BaseException {
  constructor(
    errorCode: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(errorCode, message, statusCode, details);
  }
}

export class CheckHotkeyGenericException extends CheckHotkeyException {
  constructor(reason: string, details?: any) {
    super(
      CheckHotkeyErrorCode.GENERIC_ERROR,
      `Error fetching hotkey status: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

// Specific exception types
export class CheckHotkeyFetchException extends CheckHotkeyException {
  constructor(reason: string, details?: any) {
    super(
      CheckHotkeyErrorCode.FETCH_FAILED,
      `Error fetching hotkey status: ${reason}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class CheckHotkeyNetuidHotkeyMissingException extends CheckHotkeyException {
  constructor(details?: any) {
    super(
      CheckHotkeyErrorCode.NETUID_HOTKEY_MISSING,
      'Netuid and hotkey are required',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
