import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

export class AccountNonceException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'ACCOUNT_NONCE';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

// Specific exception types
export class AccountNonceFetchException extends AccountNonceException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'FETCH_FAILED',
      `Error fetching account nonce: ${message}`,
      stackTrace,
    );
  }
}

export class AccountNonceSS58AddressNotFoundException extends AccountNonceException {
  constructor(stackTrace?: string) {
    super(
      HttpStatus.BAD_REQUEST,
      'SS58_ADDRESS_NOT_FOUND',
      'Invalid decoded address checksum',
      stackTrace,
    );
  }
}

export class AccountNonceSS58AddressIncorrectFormatException extends AccountNonceException {
  constructor(stackTrace?: string) {
    super(
      HttpStatus.BAD_REQUEST,
      'SS58_ADDRESS_INCORRECT_FORMAT',
      'Invalid decoded address length',
      stackTrace,
    );
  }
}
