import { plainToClass } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { AxonInfoDto } from '../../commons/dto';
import { AxonInfo } from '../../substrate/substrate.interface';

@Injectable()
export class AxonInfoMapper {
  toDto(axonInfoArray: AxonInfo[]): AxonInfoDto[] {
    return axonInfoArray.map(axon =>
      plainToClass(AxonInfoDto, {
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
