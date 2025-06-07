import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountNonceService {
  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async getAccountNonce(account: string): Promise<number> {
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
  }
}
