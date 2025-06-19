import { BaseException } from '@app/commons/exceptions/base.exception';

import { HttpStatus } from '@nestjs/common';

// Existing error codes from Subtensor
export enum SubtensorErrorCode {
  COLD_KEY_IN_SWAP_SCHEDULE = 0,
  STAKE_AMOUNT_TOO_LOW = 1,
  BALANCE_TOO_LOW = 2,
  SUBNET_DOESNT_EXIST = 3,
  HOTKEY_ACCOUNT_DOESNT_EXIST = 4,
  NOT_ENOUGH_STAKE_TO_WITHDRAW = 5,
  RATE_LIMIT_EXCEEDED = 6,
  INSUFFICIENT_LIQUIDITY = 7,
  SLIPPAGE_TOO_HIGH = 8,
  TRANSFER_DISALLOWED = 9,
  HOTKEY_NOT_REGISTERED_IN_NETWORK = 10,
  INVALID_IP_ADDRESS = 11,
  SERVING_RATE_LIMIT_EXCEEDED = 12,
  INVALID_PORT = 13,
  TRANSACTION_PRIORITY_TOO_LOW = 14,
  BAD_REQUEST = 255,
}

// Base exception for substrate client operations
export class SubstrateClientException extends BaseException {
  constructor(statusCode: HttpStatus, type: string, message: string, stackTrace?: string) {
    const errorCategory = 'SUBSTRATE_CLIENT';
    super(statusCode, `${errorCategory}.${type}`, message, stackTrace);
  }
}

// Error details for Subtensor
interface SubtensorErrorDetails {
  code: SubtensorErrorCode;
  name: string;
  description: string;
}

// Get error details helper function
function getSubtensorErrorDetails(type: SubtensorErrorCode): SubtensorErrorDetails {
  switch (type) {
    case SubtensorErrorCode.COLD_KEY_IN_SWAP_SCHEDULE:
      return {
        code: type,
        name: 'ColdKeyInSwapSchedule',
        description: 'Your coldkey is set to be swapped. No transfer operations are possible.',
      };
    case SubtensorErrorCode.STAKE_AMOUNT_TOO_LOW:
      return {
        code: type,
        name: 'StakeAmountTooLow',
        description:
          'The amount you are staking/unstaking/moving is below the minimum TAO equivalent (0.0005 TAO).',
      };
    case SubtensorErrorCode.BALANCE_TOO_LOW:
      return {
        code: type,
        name: 'BalanceTooLow',
        description: 'The amount of stake you have is less than you have requested.',
      };
    case SubtensorErrorCode.SUBNET_DOESNT_EXIST:
      return {
        code: type,
        name: 'SubnetDoesntExist',
        description: 'This subnet does not exist.',
      };
    case SubtensorErrorCode.HOTKEY_ACCOUNT_DOESNT_EXIST:
      return {
        code: type,
        name: 'HotkeyAccountDoesntExist',
        description: 'Hotkey is not registered on Bittensor network.',
      };
    case SubtensorErrorCode.NOT_ENOUGH_STAKE_TO_WITHDRAW:
      return {
        code: type,
        name: 'NotEnoughStakeToWithdraw',
        description:
          'You do not have enough TAO equivalent stake to remove/move/transfer, including the unstake fee.',
      };
    case SubtensorErrorCode.RATE_LIMIT_EXCEEDED:
      return {
        code: type,
        name: 'RateLimitExceeded',
        description: 'Too many transactions submitted (other than Axon serve/publish extrinsic).',
      };
    case SubtensorErrorCode.INSUFFICIENT_LIQUIDITY:
      return {
        code: type,
        name: 'InsufficientLiquidity',
        description: "The subnet's pool does not have sufficient liquidity for this transaction.",
      };
    case SubtensorErrorCode.SLIPPAGE_TOO_HIGH:
      return {
        code: type,
        name: 'SlippageTooHigh',
        description: 'The slippage exceeds your limit. Try reducing the transaction amount.',
      };
    case SubtensorErrorCode.TRANSFER_DISALLOWED:
      return {
        code: type,
        name: 'TransferDisallowed',
        description: 'This subnet does not allow stake transfer.',
      };
    case SubtensorErrorCode.HOTKEY_NOT_REGISTERED_IN_NETWORK:
      return {
        code: type,
        name: 'HotKeyNotRegisteredInNetwork',
        description: 'The hotkey is not registered in the selected subnet.',
      };
    case SubtensorErrorCode.INVALID_IP_ADDRESS:
      return {
        code: type,
        name: 'InvalidIpAddress',
        description: 'Axon connection info cannot be parsed into a valid IP address.',
      };
    case SubtensorErrorCode.SERVING_RATE_LIMIT_EXCEEDED:
      return {
        code: type,
        name: 'ServingRateLimitExceeded',
        description: 'Rate limit exceeded for axon serve/publish extrinsic.',
      };
    case SubtensorErrorCode.INVALID_PORT:
      return {
        code: type,
        name: 'InvalidPort',
        description: 'Axon connection info cannot be parsed into a valid port.',
      };
    case SubtensorErrorCode.BAD_REQUEST:
      return {
        code: type,
        name: 'BadRequest',
        description: 'Unclassified error.',
      };
    case SubtensorErrorCode.TRANSACTION_PRIORITY_TOO_LOW:
      return {
        code: type,
        name: 'TransactionPriorityTooLow',
        description:
          'The transaction priority has too low priority to replace another transaction already in the pool. Please try again later.',
      };
    default:
      return {
        code: SubtensorErrorCode.BAD_REQUEST,
        name: 'UnknownError',
        description: `Unknown Subtensor error code: ${type}`,
      };
  }
}

// Subtensor-specific exception handling
export class SubtensorException extends SubstrateClientException {
  constructor(error: SubtensorErrorCode, customMessage?: string, stackTrace?: string) {
    const subTensorErrorDetails = getSubtensorErrorDetails(error);
    const message = subTensorErrorDetails.description || customMessage || '';
    const errorCategory = 'SUBTENSOR';

    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      `${errorCategory}.${subTensorErrorDetails.name}`,
      message,
      stackTrace,
    );
  }
}

// Additional client operation exceptions
export class TransactionFailedException extends SubstrateClientException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'TRANSACTION_FAILED', message, stackTrace);
  }
}

export class QueryFailedException extends SubstrateClientException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'QUERY_FAILED', message, stackTrace);
  }
}

export class InvalidParameterException extends SubstrateClientException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'INVALID_PARAMETER', message, stackTrace);
  }
}

export class OperationTimeoutException extends SubstrateClientException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.REQUEST_TIMEOUT, 'OPERATION_TIMEOUT', message, stackTrace);
  }
}

export class BlockHashNotFoundException extends SubstrateClientException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'BLOCK_HASH_NOT_FOUND', message, stackTrace);
  }
}

export class UnknownBlockStateAlreadyDiscardedException extends SubstrateClientException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'BLOCK_DISCARDED', message, stackTrace);
  }
}

export class SS58AddressInvalidLengthException extends SubstrateClientException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'SS58_ADDRESS_INVALID_LENGTH', message, stackTrace);
  }
}

export class SS58AddressInvalidChecksumException extends SubstrateClientException {
  constructor(message: string, stackTrace?: string) {
    super(HttpStatus.BAD_REQUEST, 'SS58_ADDRESS_INVALID_CHECKSUM', message, stackTrace);
  }
}

export class SubstrateRuntimeVersionNotAvailableException extends SubstrateClientException {
  constructor(message?: string, stackTrace?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'SUBSTRATE_RUNTIME_VERSION_NOT_AVAILABLE',
      message || 'Substrate runtime version not available',
      stackTrace,
    );
  }
}
