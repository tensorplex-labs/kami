import { ApiProperty } from '@nestjs/swagger';

export class AxonCallParamsDto {
  @ApiProperty({
    description: 'Version',
    example: 0,
  })
  version: number;

  @ApiProperty({
    title: 'IP',
    description: 'Decimal representation of the IP address',
    example: '2240446049',
  })
  ip: number;

  @ApiProperty({
    description: 'Port',
    example: 8888,
  })
  port: number;

  @ApiProperty({
    description: 'IP Type (v4 or v6)',
    example: 4,
  })
  ipType: number;

  @ApiProperty({
    description: 'Netuid',
    example: 2,
  })
  netuid: number;

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

  constructor(partial: Partial<AxonCallParamsDto>) {
    Object.assign(this, partial);
  }
}
