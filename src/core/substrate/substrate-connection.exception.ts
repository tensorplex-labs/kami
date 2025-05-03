import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error codes specific to connection management
export enum SubstrateConnectionErrorCode {
  CONNECTION_FAILED = 'SUBSTRATE_CONNECTION.CONNECTION_FAILED',
  RECONNECTION_FAILED = 'SUBSTRATE_CONNECTION.RECONNECTION_FAILED',
  CLIENT_NOT_INITIALIZED = 'SUBSTRATE_CONNECTION.CLIENT_NOT_INITIALIZED',
  WALLET_PATH_NOT_SET = 'SUBSTRATE_CONNECTION.WALLET_PATH_NOT_SET',
  WALLET_NAME_NOT_SET = 'SUBSTRATE_CONNECTION.WALLET_NAME_NOT_SET',
  WALLET_HOTKEY_NOT_SET = 'SUBSTRATE_CONNECTION.WALLET_HOTKEY_NOT_SET',
  KEYRING_PAIR_NOT_SET = 'SUBSTRATE_CONNECTION.KEYRING_PAIR_NOT_SET',
  INVALID_COLDKEY_FORMAT = 'SUBSTRATE_CONNECTION.INVALID_COLDKEY_FORMAT',
  INVALID_HOTKEY_FORMAT = 'SUBSTRATE_CONNECTION.INVALID_HOTKEY_FORMAT',
  FILE_ACCESS_ERROR = 'SUBSTRATE_CONNECTION.FILE_ACCESS_ERROR',
}

// Base connection exception class
export class SubstrateConnectionException extends BaseException {
  constructor(
    errorCode: string,
    errorMessage: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(errorCode, errorMessage, statusCode, details);
  }
}

// Specific connection exceptions
export class ConnectionFailedException extends SubstrateConnectionException {
  constructor(reason: string, details?: any) {
    super(
      SubstrateConnectionErrorCode.CONNECTION_FAILED,
      `Failed to connect to Substrate node on ${details?.nodeUrl}: ${reason}`,
      HttpStatus.SERVICE_UNAVAILABLE,
      details,
    );
  }
}

export class ReconnectionFailedException extends SubstrateConnectionException {
  constructor(reason: string, details?: any) {
    super(
      SubstrateConnectionErrorCode.RECONNECTION_FAILED,
      `Failed to reconnect to Substrate node on ${details?.nodeUrl}: ${reason}`,
      HttpStatus.SERVICE_UNAVAILABLE,
      details,
    );
  }
}

export class ClientNotInitializedException extends SubstrateConnectionException {
  constructor(details?: any) {
    super(
      SubstrateConnectionErrorCode.CLIENT_NOT_INITIALIZED,
      'Substrate client is not initialized',
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class WalletPathNotSetException extends SubstrateConnectionException {
  constructor(details?: any) {
    super(
      SubstrateConnectionErrorCode.WALLET_PATH_NOT_SET,
      'Wallet path is not set! Please set the BITTENSOR_DIR in your .env file.',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class WalletNameNotSetException extends SubstrateConnectionException {
  constructor(details?: any) {
    super(
      SubstrateConnectionErrorCode.WALLET_NAME_NOT_SET,
      'Wallet name is not set! Please set the WALLET_COLDKEY in your .env file.',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class WalletHotkeyNotSetException extends SubstrateConnectionException {
  constructor(details?: any) {
    super(
      SubstrateConnectionErrorCode.WALLET_HOTKEY_NOT_SET,
      'Wallet hotkey is not set! Please set the WALLET_HOTKEY in your .env file.',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class KeyringPairNotSetException extends SubstrateConnectionException {
  constructor(details?: any) {
    super(
      SubstrateConnectionErrorCode.KEYRING_PAIR_NOT_SET,
      'Keyring pair is not set, please call setKeyringPair() first',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class InvalidColdkeyFormatException extends SubstrateConnectionException {
  constructor(details?: any) {
    super(
      SubstrateConnectionErrorCode.INVALID_COLDKEY_FORMAT,
      'Invalid coldkey format: missing ss58Address',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class InvalidHotkeyFormatException extends SubstrateConnectionException {
  constructor(details?: any) {
    super(
      SubstrateConnectionErrorCode.INVALID_HOTKEY_FORMAT,
      'Invalid hotkey format: missing secretPhrase',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class FileAccessException extends SubstrateConnectionException {
  constructor(filePath: string, details?: any) {
    super(
      SubstrateConnectionErrorCode.FILE_ACCESS_ERROR,
      `Could not access file: ${filePath}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}
