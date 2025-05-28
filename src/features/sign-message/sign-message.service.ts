import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';
import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';

import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { VerifyMessageParamDto } from './sign-message.dto';
import { SignMessageException } from './sign-message.exception';

@Injectable()
export class SignMessageService {
  constructor(private readonly substrateClientService: SubstrateClientService) { }

  async signMessage(message: string): Promise<string> {
    try {
      const client = this.substrateClientService;
      const signature = await client.signMessage(message);

      return signature;
    } catch (error) {
      if (error instanceof SubtensorException) {
        throw error;
      }

      throw new SignMessageException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }

  async verifyMessage(callParams: VerifyMessageParamDto): Promise<boolean> {
    try {
      const client = this.substrateClientService;

      const isValid = await client.verifyMessage(
        callParams.message,
        callParams.signature,
        callParams.signeeAddress,
      );

      return isValid;
    } catch (error) {
      if (error instanceof SubtensorException) {
        throw error;
      }

      throw new SignMessageException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
