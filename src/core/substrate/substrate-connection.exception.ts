import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Error codes specific to connection management
export enum SubstrateConnectionErrorCode {
  CONNECTION_FAILED = 1,
  RECONNECTION_FAILED = 2,
  CLIENT_NOT_INITIALIZED = 3,
  WALLET_PATH_NOT_SET = 4,
  WALLET_NAME_NOT_SET = 5,
  WALLET_HOTKEY_NOT_SET = 6,
  KEYRING_PAIR_NOT_SET = 7,
  INVALID_COLDKEY_FORMAT = 8,
  INVALID_HOTKEY_FORMAT = 9,
  FILE_ACCESS_ERROR = 10,
}

// Base connection exception class
export class SubstrateConnectionException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SUBSTRATE_CONNECTION';
    super(statusCode, type, `${errorCategory}.${message}`, stackTrace);
  }
}

// Specific connection exceptions
export class ConnectionFailedException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.SERVICE_UNAVAILABLE,
      String(SubstrateConnectionErrorCode.CONNECTION_FAILED),
      `CONNECTION_FAILED: ${message}`,
      stackTrace,
    );
  }
}

export class ReconnectionFailedException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.SERVICE_UNAVAILABLE,
      String(SubstrateConnectionErrorCode.RECONNECTION_FAILED),
      `RECONNECTION_FAILED: ${message}`,
      stackTrace,
    );
  }
}

export class ClientNotInitializedException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      String(SubstrateConnectionErrorCode.CLIENT_NOT_INITIALIZED),
      `CLIENT_NOT_INITIALIZED: ${message}`,
      stackTrace,
    );
  }
}

export class WalletPathNotSetException extends SubstrateConnectionException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      String(SubstrateConnectionErrorCode.WALLET_PATH_NOT_SET),
      `WALLET_PATH_NOT_SET: Wallet path is not set! Please set the WALLET_PATH in your .env file.`,
    );
  }
}

export class WalletNameNotSetException extends SubstrateConnectionException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      String(SubstrateConnectionErrorCode.WALLET_NAME_NOT_SET),
      `WALLET_NAME_NOT_SET: Wallet name is not set! Please set the WALLET_COLDKEY in your .env file.`,
    );
  }
}

export class WalletHotkeyNotSetException extends SubstrateConnectionException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      String(SubstrateConnectionErrorCode.WALLET_HOTKEY_NOT_SET),
      `WALLET_HOTKEY_NOT_SET: Wallet hotkey is not set! Please set the WALLET_HOTKEY in your .env file.`,
    );
  }
}

export class KeyringPairNotSetException extends SubstrateConnectionException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      String(SubstrateConnectionErrorCode.KEYRING_PAIR_NOT_SET),
      `KEYRING_PAIR_NOT_SET: Keyring pair is not set, please call setKeyringPair() first`,
    );
  }
}

export class InvalidColdkeyFormatException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.BAD_REQUEST,
      String(SubstrateConnectionErrorCode.INVALID_COLDKEY_FORMAT),
      `INVALID_COLDKEY_FORMAT: ${message}`,
      stackTrace,
    );
  }
}

export class InvalidHotkeyFormatException extends SubstrateConnectionException {
  constructor(message: string, stackTrace?: string) {
    super(
      HttpStatus.BAD_REQUEST,
      String(SubstrateConnectionErrorCode.INVALID_HOTKEY_FORMAT),
      `INVALID_HOTKEY_FORMAT: ${message}`,
      stackTrace,
    );
  }
}

export class FileAccessException extends SubstrateConnectionException {
  constructor(filePath: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      String(SubstrateConnectionErrorCode.FILE_ACCESS_ERROR),
      `FILE_ACCESS_ERROR: ${filePath}`,
      stackTrace,
    );
  }
}
