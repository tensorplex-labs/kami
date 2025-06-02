import { KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';

import { Catch } from '@nestjs/common';

import {
  CheckHotkeyBlockNotFoundException,
  CheckHotkeyException,
  CheckHotkeyUnknownErrorException,
} from './check-hotkey.exception';

@Catch(Error)
export class CheckHotkeyExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): CheckHotkeyException {
    const message = error.message.toLowerCase();

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    if (message.includes('Unable to retrieve header and parent from supplied hash'.toLowerCase())) {
      return new CheckHotkeyBlockNotFoundException(error.message, error.stack);
    }

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic CheckHotkeyExceptionFilter (unknown error)`);
    return new CheckHotkeyUnknownErrorException(error.message, error.stack);
  }
}
