import { BaseException, KamiBaseExceptionFilter } from '@app/commons/exceptions/base.exception';
import {
  BlockHashNotFoundException,
  SS58AddressInvalidChecksumException,
  SS58AddressInvalidLengthException,
  SubtensorErrorCode,
  SubtensorException,
  UnknownBlockStateAlreadyDiscardedException,
} from 'src/core/substrate/exceptions/substrate-client.exception';

import { Catch, HttpStatus } from '@nestjs/common';

import {
  ConnectionFailedException,
  SubstrateConnectionException,
} from './substrate-connection.exception';

@Catch(Error)
export class SubstrateExceptionFilter extends KamiBaseExceptionFilter {
  protected mapException(error: Error): any {
    const message = error.message.toLowerCase();
    const stack = error.stack;

    this.logger.debug(`🔍 Mapping error: "${message}"`);

    this.handleSubtensorError(error);

    // Known error patterns
    if (
      message.includes('WebSocket is not connected') ||
      stack?.includes('WebSocket is not connected')
    ) {
      return new ConnectionFailedException(error.message, error.stack);
    }

    if (message.includes('Unable to retrieve header and parent from supplied hash'.toLowerCase())) {
      return new BlockHashNotFoundException(error.message, error.stack);
    }

    if (message.includes('Invalid decoded address length'.toLowerCase())) {
      return new SS58AddressInvalidLengthException(error.message, error.stack);
    }

    if (message.includes('Invalid decoded address checksum'.toLowerCase())) {
      return new SS58AddressInvalidChecksumException(error.message, error.stack);
    }

    if (
      message.includes(
        '4003: Client error: Api called for an unknown Block: State already discarded'.toLowerCase(),
      )
    ) {
      return new UnknownBlockStateAlreadyDiscardedException(error.message, error.stack);
    }

    // If it's already a domain exception, return as-is
    if (error instanceof SubstrateConnectionException) {
      this.logger.log(`✅ Mapped to domain exception: ${error.constructor.name}`);
      return error;
    }

    if (error instanceof SubtensorException) {
      this.logger.log(`✅ Mapped to SubtensorException`);
      return error;
    }

    if (error instanceof BaseException) {
      throw error;
    }

    // Catch all
    this.logger.log(`⚠️ Mapped to: Generic SubstrateConnectionException (unknown error)`);
    return new SubstrateConnectionException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'UNKNOWN_ERROR',
      `Unknown error: ${error.message}`,
      error.stack,
    );
  }

  /**
   * Handles Subtensor-specific errors from blockchain responses
   */
  private handleSubtensorError(error: any): any {
    if (error?.data && typeof error.data == 'string') {
      const match = error.data.match(/Custom error: (\d+)/);
      if (match && match[1]) {
        const errorCode = parseInt(match[1], 10);
        throw new SubtensorException(errorCode as SubtensorErrorCode);
      }
    }
    if (error?.message && typeof error.message == 'string') {
      const match = error.message.match(/Custom error: (\d+)/);
      if (match && match[1]) {
        const errorCode = parseInt(match[1], 10);
        throw new SubtensorException(errorCode as SubtensorErrorCode);
      }

      if (error.message.includes(`Priority is too low`)) {
        throw new SubtensorException(
          SubtensorErrorCode.TRANSACTION_PRIORITY_TOO_LOW,
          error.message,
          error.stack,
        );
      }
    }
  }
}
