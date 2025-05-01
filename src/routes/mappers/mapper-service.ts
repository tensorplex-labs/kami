import { Injectable } from '@nestjs/common';

import { AxonInfoDto } from '../../commons/dto';
import { SubnetMetagraphDto } from '../../features/subnet-metagraph/subnet-metagraph.dto';
import { SubnetMetagraphMapper } from '../../features/subnet-metagraph/subnet-metagraph.mapper';
import { AxonInfoMapper } from '../../mapper/chain/axon-info.mapper';
import { AxonInfo, SubnetMetagraph } from '../../substrate/substrate.interface';

@Injectable()
export class MappersService {
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
