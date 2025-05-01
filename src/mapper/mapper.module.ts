import { Module } from '@nestjs/common';

import {
  AxonInfoMapper,
  CheckHotkeyMapper,
  LatestBlockMapper,
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
    LatestBlockMapper,
    CheckHotkeyMapper,
  ],
  exports: [MapperService],
})
export class MapperModule {}
