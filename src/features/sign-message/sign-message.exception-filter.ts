import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import { SignMessageException, SignMessageUnknownException } from './sign-message.exception';

@Catch(Error)
export class SignMessageExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): SignMessageException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic SignMessageException (unknown error)`);
    return new SignMessageUnknownException(error.message, error.stack);
  }
}
