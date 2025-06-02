import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';
import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';

import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { VerifyMessageParamDto } from './sign-message.dto';
import { SignMessageException } from './sign-message.exception';

@Injectable()
export class SignMessageService {
  constructor(private readonly substrateClientService: SubstrateClientService) {}

  async signMessage(message: string): Promise<string> {
    const client = this.substrateClientService;
    const signature = await client.signMessage(message);

    return signature;
  }

  async verifyMessage(callParams: VerifyMessageParamDto): Promise<boolean> {
    const client = this.substrateClientService;

    const isValid = await client.verifyMessage(
      callParams.message,
      callParams.signature,
      callParams.signeeAddress,
    );

    return isValid;
  }
}
