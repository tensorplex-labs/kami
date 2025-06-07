import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable } from '@nestjs/common';

import { CheckHotkeyFetchException } from './check-hotkey.exception';

@Injectable()
export class CheckHotkeyService {
  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async checkHotkey(netuid: number, hotkey: string, block?: number): Promise<boolean> {
    const client = await this.substrateConnectionService.getClient();

    let response = null;

    if (block) {
      const getBlockHash: string = await this.substrateClientService.getBlockHash(block);

      const blockApi = await client.at(getBlockHash);
      response = await blockApi.query.subtensorModule.isNetworkMember(hotkey, netuid);
    } else {
      response = await client.query.subtensorModule.isNetworkMember(hotkey, netuid);
    }

    if (response == null) {
      throw new CheckHotkeyFetchException('No response');
    }

    const isHotkey: boolean = response.toJSON() as boolean;

    return isHotkey;
  }
}
