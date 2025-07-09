import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable, Logger } from '@nestjs/common';

import { BlockInfo } from './latest-block.interface';

@Injectable()
export class LatestBlockService {
  private readonly logger = new Logger(LatestBlockService.name);

  constructor(private readonly substrateConnectionService: SubstrateConnectionService) {}

  async getLatestBlock(): Promise<BlockInfo> {
    const client = await this.substrateConnectionService.getClient();

    this.logger.debug(`Retrieving latest block`);
    const blockHead = await client.rpc.chain.getHeader();
    const result: BlockInfo = {
      blockNumber: blockHead.number.toNumber(),
      parentHash: blockHead.parentHash.toHex(),
      stateRoot: blockHead.stateRoot.toHex(),
      extrinsicsRoot: blockHead.extrinsicsRoot.toHex(),
    };
    this.logger.debug(`Latest block: ${JSON.stringify(result)}`);
    return result;
  }
}
