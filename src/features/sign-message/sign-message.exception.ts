import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

export class SignMessageException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SIGN_MESSAGE';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}
