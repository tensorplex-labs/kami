import { plainToClass } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { TotalNetworkResponseDto } from '../../commons/dto';
import { TotalNetworksInfo } from '../../substrate/substrate.interface';

@Injectable()
export class TotalNetworkMapper {
  toDto(totalNetwork: TotalNetworksInfo): TotalNetworkResponseDto {
    return plainToClass(TotalNetworkResponseDto, {
      totalNetwork: totalNetwork.totalNetworks,
    });
  }
}
