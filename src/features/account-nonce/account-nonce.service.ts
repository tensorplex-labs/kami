import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';
import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import {
  AccountNonceException,
  AccountNonceSS58AddressIncorrectFormatException,
  AccountNonceSS58AddressNotFoundException,
} from 'src/features/account-nonce/account-nonce.exception';

import { Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AccountNonceService {
  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async getAccountNonce(account: string): Promise<number> {
    try {
      const client = await this.substrateConnectionService.getClient();

      const runtimeApiName = 'AccountNonceApi';
      const methodName = 'account_nonce';
      const encodedParams = client.registry.createType('SpCoreCryptoAccountId32', account).toU8a();

      const response = await this.substrateClientService.queryRuntimeApi(
        runtimeApiName,
        methodName,
        encodedParams,
      );

      const accountNonce: number = response.toJSON() as number;
      Logger.log(`Account nonce for ${account}: ${accountNonce}`);
      return accountNonce;
    } catch (error) {
      if (error.message.includes('Invalid decoded address checksum')) {
        throw new AccountNonceSS58AddressNotFoundException();
      }

      if (error.message.includes('Invalid decoded address length')) {
        throw new AccountNonceSS58AddressIncorrectFormatException();
      }

      if (error instanceof SubtensorException) {
        throw error;
      }

      throw new AccountNonceException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
