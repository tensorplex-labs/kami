import {
  AxonInfoDto,
  BlockInfoDto,
  CheckHotkeyDto,
  SubnetMetagraphDto,
  TotalNetworkResponseDto,
} from 'src/dto';
import {
  AxonInfo,
  BlockInfo,
  SubnetMetagraph,
  TotalNetworksInfo,
} from 'src/substrate/substrate.interface';

import { Injectable } from '@nestjs/common';

import {
  AxonInfoMapper,
  BlockInfoMapper,
  CheckHotkeyMapper,
  SubnetMetagraphMapper,
  TotalNetworkMapper,
} from './chain';

@Injectable()
export class MapperService {
  constructor(
    private readonly subnetMetagraphMapper: SubnetMetagraphMapper,
    private readonly axonInfoMapper: AxonInfoMapper,
    private readonly totalNetworkMapper: TotalNetworkMapper,
    private readonly blockInfoMapper: BlockInfoMapper,
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

  toBlockInfoDto(blockInfo: BlockInfo): BlockInfoDto {
    return this.blockInfoMapper.toDto(blockInfo);
  }

  toCheckHotkeyDto(isHotkeyValid: boolean): CheckHotkeyDto {
    return this.checkHotkeyMapper.toDto(isHotkeyValid);
  }
}
