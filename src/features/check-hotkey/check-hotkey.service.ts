import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CheckHotkeyService {
  private readonly logger = new Logger(CheckHotkeyService.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async checkHotkey(netuid: number, hotkey: string, block?: number): Promise<boolean | Error> {
    try {
      const client = await this.substrateConnectionService.getClient();

      if (client instanceof Error) {
        throw client;
      }

      let response = null;

      if (block) {
        const getBlockHash: string | Error = await this.substrateClientService.getBlockHash(block);
        if (getBlockHash instanceof Error) {
          throw new Error(`Failed to get block hash: ${getBlockHash.message}`);
        }
        const blockApi = await client.at(getBlockHash);
        response = await blockApi.query.subtensorModule.isNetworkMember(hotkey, netuid);
      } else {
        response = await client.query.subtensorModule.isNetworkMember(hotkey, netuid);
      }

      if (response == null) {
        throw new Error('Failed to retrieve hotkey');
      }

      const isHotkey: boolean = response.toJSON() as boolean;

      return isHotkey;
    } catch (error) {
      throw error;
    }
  }
}
