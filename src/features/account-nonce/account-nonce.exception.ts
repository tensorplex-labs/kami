import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

export class AccountNonceException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'ACCOUNT_NONCE';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

export class AccountNonceUnknownErrorException extends AccountNonceException {
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

export class AccountNonceParamsInvalidException extends AccountNonceException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_INVALID', message, stackTrace);
  }
}
