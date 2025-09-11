import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import {
  SetTimelockedWeightException,
  SetTimelockedWeightUnknownException,
} from './set-timelocked-weight.exception';

@Catch(Error)
export class SetTimelockedWeightExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): SetTimelockedWeightException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic SetTimelockedWeightException (unknown error)`);
    return new SetTimelockedWeightUnknownException(error.message, error.stack);
  }
}
