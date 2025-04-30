import { AxonInfoDto, SubnetMetagraphDto } from 'src/dto';
import { AxonInfo, SubnetMetagraph } from 'src/substrate/substrate.interface';

import { Injectable } from '@nestjs/common';

import { AxonInfoMapper } from './chain/axon-info.mapper';
import { SubnetMetagraphMapper } from './chain/subnet-metagraph.mapper';

@Injectable()
export class MapperService {
  constructor(
    private readonly subnetMetagraphMapper: SubnetMetagraphMapper,
    private readonly axonInfoMapper: AxonInfoMapper,
  ) {}

  toSubnetMetagraphDto(subnetMetagraph: SubnetMetagraph): SubnetMetagraphDto {
    return this.subnetMetagraphMapper.toDto(subnetMetagraph);
  }

  toAxonInfoDto(axonInfoArray: AxonInfo[]): AxonInfoDto[] {
    return this.axonInfoMapper.toDto(axonInfoArray);
  }
}
