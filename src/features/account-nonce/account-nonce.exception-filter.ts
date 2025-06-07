import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import {
  AccountNonceException,
  AccountNonceSS58AddressIncorrectFormatException,
  AccountNonceSS58AddressNotFoundException,
  AccountNonceUnknownErrorException,
} from './account-nonce.exception';

@Catch(Error)
export class AccountNonceExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): AccountNonceException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Known error patterns
    if (message.includes('invalid decoded address checksum')) {
      return new AccountNonceSS58AddressNotFoundException(error.stack);
    }

    if (message.includes('invalid decoded address length')) {
      return new AccountNonceSS58AddressIncorrectFormatException(error.stack);
    }

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic AccountNonceException (unknown error)`);
    return new AccountNonceUnknownErrorException(error.message, error.stack);
  }
}
