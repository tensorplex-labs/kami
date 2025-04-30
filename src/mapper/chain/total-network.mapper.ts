import { TotalNetworkResponseDto } from 'src/dto';
import { TotalNetworksInfo } from 'src/substrate/substrate.interface';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TotalNetworkMapper {
  toDto(totalNetwork: TotalNetworksInfo): TotalNetworkResponseDto {
    return new TotalNetworkResponseDto({
      totalNetwork: totalNetwork.totalNetworks,
    });
  }
}
