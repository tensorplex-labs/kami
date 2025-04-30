import { Module } from '@nestjs/common';

import {
  AxonInfoMapper,
  BlockInfoMapper,
  CheckHotkeyMapper,
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
    CheckHotkeyMapper,
  ],
  exports: [MapperService],
})
export class MapperModule {}
