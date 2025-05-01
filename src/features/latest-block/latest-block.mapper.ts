import { plainToClass } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { LatestBlockDto } from './latest-block.dto';
import { BlockInfo } from './latest-block.interface';

@Injectable()
export class LatestBlockMapper {
  toDto(blockInfo: BlockInfo): LatestBlockDto {
    return plainToClass(LatestBlockDto, {
      parentHash: blockInfo.parentHash,
      blockNumber: blockInfo.blockNumber,
      stateRoot: blockInfo.stateRoot,
      extrinsicsRoot: blockInfo.extrinsicsRoot,
    });
  }
}
