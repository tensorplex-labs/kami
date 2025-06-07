import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import {
  SetCommitRevealWeightException,
  SetCommitRevealWeightUnknownException,
} from './set-commit-reveal-weight.exception';

@Catch(Error)
export class SetCommitRevealWeightExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): SetCommitRevealWeightException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic SetCommitRevealWeightException (unknown error)`);
    return new SetCommitRevealWeightUnknownException(error.message, error.stack);
  }
}
