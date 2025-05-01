import { HttpException, HttpStatus } from '@nestjs/common';

export class SubstrateException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        statusCode,
        message,
        error: 'Error in substrate service',
      },
      statusCode,
    );
  }
}

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

export class SubtensorException extends SubstrateException {
  constructor(error: SubtensorErrorCode, customMessage?: string) {
    const errorDetails = getSubtensorErrorDetails(error);
    const message = customMessage || errorDetails.description;

    super(message, HttpStatus.BAD_REQUEST);
  }
}

interface SubtensorErrorDetails {
  code: SubtensorErrorCode;
  name: string;
  description: string;
}

function getSubtensorErrorDetails(errorCode: SubtensorErrorCode): SubtensorErrorDetails {
  switch (errorCode) {
    case SubtensorErrorCode.COLD_KEY_IN_SWAP_SCHEDULE:
      return {
        code: errorCode,
        name: 'ColdKeyInSwapSchedule',
        description: 'Your coldkey is set to be swapped. No transfer operations are possible.',
      };
    case SubtensorErrorCode.STAKE_AMOUNT_TOO_LOW:
      return {
        code: errorCode,
        name: 'StakeAmountTooLow',
        description:
          'The amount you are staking/unstaking/moving is below the minimum TAO equivalent (0.0005 TAO).',
      };
    case SubtensorErrorCode.BALANCE_TOO_LOW:
      return {
        code: errorCode,
        name: 'BalanceTooLow',
        description: 'The amount of stake you have is less than you have requested.',
      };
    case SubtensorErrorCode.SUBNET_DOESNT_EXIST:
      return {
        code: errorCode,
        name: 'SubnetDoesntExist',
        description: 'This subnet does not exist.',
      };
    case SubtensorErrorCode.HOTKEY_ACCOUNT_DOESNT_EXIST:
      return {
        code: errorCode,
        name: 'HotkeyAccountDoesntExist',
        description: 'Hotkey is not registered on Bittensor network.',
      };
    case SubtensorErrorCode.NOT_ENOUGH_STAKE_TO_WITHDRAW:
      return {
        code: errorCode,
        name: 'NotEnoughStakeToWithdraw',
        description:
          'You do not have enough TAO equivalent stake to remove/move/transfer, including the unstake fee.',
      };
    case SubtensorErrorCode.RATE_LIMIT_EXCEEDED:
      return {
        code: errorCode,
        name: 'RateLimitExceeded',
        description: 'Too many transactions submitted (other than Axon serve/publish extrinsic).',
      };
    case SubtensorErrorCode.INSUFFICIENT_LIQUIDITY:
      return {
        code: errorCode,
        name: 'InsufficientLiquidity',
        description: "The subnet's pool does not have sufficient liquidity for this transaction.",
      };
    case SubtensorErrorCode.SLIPPAGE_TOO_HIGH:
      return {
        code: errorCode,
        name: 'SlippageTooHigh',
        description: 'The slippage exceeds your limit. Try reducing the transaction amount.',
      };
    case SubtensorErrorCode.TRANSFER_DISALLOWED:
      return {
        code: errorCode,
        name: 'TransferDisallowed',
        description: 'This subnet does not allow stake transfer.',
      };
    case SubtensorErrorCode.HOTKEY_NOT_REGISTERED_IN_NETWORK:
      return {
        code: errorCode,
        name: 'HotKeyNotRegisteredInNetwork',
        description: 'The hotkey is not registered in the selected subnet.',
      };
    case SubtensorErrorCode.INVALID_IP_ADDRESS:
      return {
        code: errorCode,
        name: 'InvalidIpAddress',
        description: 'Axon connection info cannot be parsed into a valid IP address.',
      };
    case SubtensorErrorCode.SERVING_RATE_LIMIT_EXCEEDED:
      return {
        code: errorCode,
        name: 'ServingRateLimitExceeded',
        description: 'Rate limit exceeded for axon serve/publish extrinsic.',
      };
    case SubtensorErrorCode.INVALID_PORT:
      return {
        code: errorCode,
        name: 'InvalidPort',
        description: 'Axon connection info cannot be parsed into a valid port.',
      };
    case SubtensorErrorCode.BAD_REQUEST:
      return {
        code: errorCode,
        name: 'BadRequest',
        description: 'Unclassified error.',
      };
    case SubtensorErrorCode.TRANSACTION_PRIORITY_TOO_LOW:
      return {
        code: errorCode,
        name: 'TransactionPriorityTooLow',
        description:
          'The transaction priority has too low priority to replace another transaction already in the pool. Please try again later.',
      };
    default:
      return {
        code: SubtensorErrorCode.BAD_REQUEST,
        name: 'UnknownError',
        description: `Unknown Subtensor error code: ${errorCode}`,
      };
  }
}
