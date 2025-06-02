import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

export class SignMessageException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SIGN_MESSAGE';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

export class SignMessageUnknownException extends SignMessageException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'UNKNOWN_ERROR', message, stackTrace);
  }
}

export class SignMessageParamsInvalidException extends SignMessageException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_INVALID', message, stackTrace);
  }
}

export class VerifyMessageParamsInvalidException extends SignMessageException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'PARAMS_INVALID', message, stackTrace);
  }
}
