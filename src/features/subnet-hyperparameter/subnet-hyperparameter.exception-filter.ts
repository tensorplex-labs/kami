import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import {
  SubnetHyperparameterException,
  SubnetHyperparameterUnknownException,
} from './subnet-hyperparameter.exception';

@Catch(Error)
export class SubnetHyperparameterExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): SubnetHyperparameterException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic SubnetHyperparameterException (unknown error)`);
    return new SubnetHyperparameterUnknownException(error.message, error.stack);
  }
}
