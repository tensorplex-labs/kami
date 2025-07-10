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

    if (message.includes('API SubnetInfoRuntimeApi not found in runtime metadata'.toLowerCase())) {
      this.logger.error(
        `🚨 Critical error: ${message}. The runtime API is not available. Initiating graceful shutdown...`,
      );

      setTimeout(() => {
        this.logger.log('🛑 Exiting application gracefully due to runtime incompatibility...');
        process.exit(0);
      }, 1000);
    }

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic SubnetMetagraphException (unknown error)`);
    return new SubnetMetagraphUnknownException(error.message, error.stack);
  }
}
