import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import { LatestBlockException } from './latest-block.exception';
import { LatestBlockUnknownErrorException } from './latest-block.exception';

@Catch(Error)
export class LatestBlockExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): LatestBlockException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic LatestBlockException (unknown error)`);
    return new LatestBlockUnknownErrorException(error.message, error.stack);
  }
}
