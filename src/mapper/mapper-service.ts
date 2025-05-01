import { Injectable } from '@nestjs/common';

import { AxonInfoDto, TotalNetworkResponseDto } from '../commons/dto';
import { CheckHotkeyDto } from '../features/check-hotkey/check-hotkey.dto';
import { LatestBlockDto } from '../features/latest-block/latest-block.dto';
import { SubnetMetagraphDto } from '../features/subnet-metagraph/subnet-metagraph.dto';
import {
  AxonInfo,
  BlockInfo,
  SubnetMetagraph,
  TotalNetworksInfo,
} from '../substrate/substrate.interface';
import {
  AxonInfoMapper,
  CheckHotkeyMapper,
  LatestBlockMapper,
  SubnetMetagraphMapper,
  TotalNetworkMapper,
} from './chain';

@Injectable()
export class MapperService {
  constructor(
    private readonly subnetMetagraphMapper: SubnetMetagraphMapper,
    private readonly axonInfoMapper: AxonInfoMapper,
    private readonly totalNetworkMapper: TotalNetworkMapper,
    private readonly latestBlockMapper: LatestBlockMapper,
    private readonly checkHotkeyMapper: CheckHotkeyMapper,
  ) {}

  toSubnetMetagraphDto(subnetMetagraph: SubnetMetagraph): SubnetMetagraphDto {
    return this.subnetMetagraphMapper.toDto(subnetMetagraph);
  }

  toAxonInfoDto(axonInfoArray: AxonInfo[]): AxonInfoDto[] {
    return this.axonInfoMapper.toDto(axonInfoArray);
  }

  toTotalNetworkDto(totalNetworks: TotalNetworksInfo): TotalNetworkResponseDto {
    return this.totalNetworkMapper.toDto(totalNetworks);
  }

  toLatestBlockDto(blockInfo: BlockInfo): LatestBlockDto {
    return this.latestBlockMapper.toDto(blockInfo);
  }

  toCheckHotkeyDto(isHotkeyValid: boolean): CheckHotkeyDto {
    return this.checkHotkeyMapper.toDto(isHotkeyValid);
  }
}
