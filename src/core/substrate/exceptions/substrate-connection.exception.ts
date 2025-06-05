import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Base connection exception class
export class SubstrateConnectionException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SUBSTRATE_CONNECTION';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

// Specific connection exceptions
export class ConnectionFailedException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.SERVICE_UNAVAILABLE, 'CONNECTION_FAILED', message, stackTrace);
  }
}

export class ReconnectionFailedException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.SERVICE_UNAVAILABLE, 'RECONNECTION_FAILED', message, stackTrace);
  }
}

export class ClientNotInitializedException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'CLIENT_NOT_INITIALIZED', message, stackTrace);
  }
}

export class WalletPathNotSetException extends SubstrateConnectionException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'WALLET_PATH_NOT_SET',
      'Wallet path is not set! Please set the WALLET_PATH in your .env file.',
    );
  }
}

export class WalletNameNotSetException extends SubstrateConnectionException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'WALLET_NAME_NOT_SET',
      'Wallet name is not set! Please set the WALLET_COLDKEY in your .env file.',
    );
  }
}

export class WalletHotkeyNotSetException extends SubstrateConnectionException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'WALLET_HOTKEY_NOT_SET',
      'Wallet hotkey is not set! Please set the WALLET_HOTKEY in your .env file.',
    );
  }
}

export class KeyringPairNotSetException extends SubstrateConnectionException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'KEYRING_PAIR_NOT_SET',
      'Keyring pair is not set, please call setKeyringPair() first',
    );
  }
}

export class InvalidColdkeyFormatException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'INVALID_COLDKEY_FORMAT', message, stackTrace);
  }
}

export class InvalidHotkeyFormatException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'INVALID_HOTKEY_FORMAT', message, stackTrace);
  }
}

export class FileAccessException extends SubstrateConnectionException {
  constructor(filePath: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'FILE_ACCESS_ERROR',
      `Failed to access file: ${filePath}`,
      stackTrace,
    );
  }
}
