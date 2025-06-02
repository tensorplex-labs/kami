import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import { ServeAxonException, ServeAxonUnknownErrorException } from './serve-axon.exception';

@Catch(Error)
export class ServeAxonExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): ServeAxonException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic ServeAxonException (unknown error)`);
    return new ServeAxonUnknownErrorException(error.message, error.stack);
  }
}
