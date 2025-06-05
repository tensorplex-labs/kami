import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import { SetWeightsException, SetWeightsUnknownException } from './set-weights.exception';

@Catch(Error)
export class SetWeightsExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): SetWeightsException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic SetWeightsException (unknown error)`);
    return new SetWeightsUnknownException(error.message, error.stack);
  }
}
