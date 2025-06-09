import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import {
  SubnetMetagraphException,
  SubnetMetagraphUnknownException,
} from './subnet-metagraph.exception';

@Catch(Error)
export class SubnetMetagraphExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): SubnetMetagraphException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic SubnetMetagraphException (unknown error)`);
    return new SubnetMetagraphUnknownException(error.message, error.stack);
  }
}
