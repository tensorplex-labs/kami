import { Module } from '@nestjs/common';

import { AxonInfoMapper } from './chain/axon-info.mapper';
import { SubnetMetagraphMapper } from './chain/subnet-metagraph.mapper';
import { MapperService } from './mapper-service';

@Module({
  providers: [MapperService, SubnetMetagraphMapper, AxonInfoMapper],
  exports: [MapperService],
})
export class MapperModule {}
