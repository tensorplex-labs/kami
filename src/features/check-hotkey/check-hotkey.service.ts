import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';

import { Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { CheckHotkeyException, CheckHotkeyFetchException } from './check-hotkey.exception';

@Injectable()
export class CheckHotkeyService {
  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async checkHotkey(netuid: number, hotkey: string, block?: number): Promise<boolean> {
    try {
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
    } catch (error) {
      if (error instanceof CheckHotkeyFetchException) {
        throw error;
      }
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new CheckHotkeyException(HttpStatus.BAD_REQUEST, 'UNKNOWN', error.message, error.stack);
    }
  }
}
