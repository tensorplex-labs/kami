import { HttpException, HttpStatus } from '@nestjs/common';

export class ChainException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        statusCode,
        message,
        error: 'Error in chain service',
      },
      statusCode,
    );
  }
}

export class ConnectionException extends ChainException {
  constructor(message: string = 'Failed to connect to blockchain') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class NotFoundException extends ChainException {
  constructor(resource: string) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

export class WalletException extends ChainException {
  constructor(message: string = 'Wallet operation failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
