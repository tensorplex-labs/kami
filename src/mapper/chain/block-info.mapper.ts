import { BlockInfoDto } from 'src/dto';
import { BlockInfo } from 'src/substrate/substrate.interface';

import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockInfoMapper {
  toDto(blockInfo: BlockInfo): BlockInfoDto {
    return new BlockInfoDto({
      parentHash: blockInfo.parentHash,
      blockNumber: blockInfo.blockNumber,
      stateRoot: blockInfo.stateRoot,
      extrinsicsRoot: blockInfo.extrinsicsRoot,
    });
  }
}
