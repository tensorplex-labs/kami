import { Module } from '@nestjs/common';

import {
  AxonInfoMapper,
  BlockInfoMapper,
  SubnetMetagraphMapper,
  TotalNetworkMapper,
} from './chain';
import { MapperService } from './mapper-service';

@Module({
  providers: [
    MapperService,
    SubnetMetagraphMapper,
    AxonInfoMapper,
    TotalNetworkMapper,
    BlockInfoMapper,
  ],
  exports: [MapperService],
})
export class MapperModule {}
