import { IpToString } from '@app/decorators';

import { ApiProperty } from '@nestjs/swagger';

export class AxonInfoDto {
  @ApiProperty({
    description: 'Block',
    example: 0,
  })
  block: number;

  @ApiProperty({
    description: 'Version',
    example: 0,
  })
  version: number;

  @ApiProperty({
    description: 'IP',
    example: 0,
  })
  @IpToString()
  ip: number;

  @ApiProperty({
    description: 'Port',
    example: 0,
  })
  port: number;

  @ApiProperty({
    description: 'IP Type (v4 or v6)',
    example: 4,
  })
  ipType: number;

  @ApiProperty({
    description: 'Protocol',
    example: 4,
  })
  protocol: number;

  @ApiProperty({
    description: 'Placeholder 1',
    example: 0,
  })
  placeholder1: number;

  @ApiProperty({
    description: 'Placeholder 2',
    example: 0,
  })
  placeholder2: number;

  constructor(partial: Partial<AxonInfoDto>) {
    Object.assign(this, partial);
  }
}
