import { Injectable } from '@nestjs/common';

import { AxonInfo } from 'src/substrate/substrate.interface';
import { AxonInfoDto } from '../dto';

@Injectable()
export class AxonInfoMapper {
  toDto(axonInfoArray: AxonInfo[]): AxonInfoDto[] {
    return axonInfoArray.map(
      (axon) =>
        new AxonInfoDto({
          block: axon.block,
          version: axon.version,
          ip: axon.ip,
          port: axon.port,
          ipType: axon.ipType,
          protocol: axon.protocol,
          placeholder1: axon.placeholder1,
          placeholder2: axon.placeholder2,
        }),
    );
  }
}
