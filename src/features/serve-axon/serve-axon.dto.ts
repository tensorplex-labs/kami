import { IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AxonCallParamsDto {
  @ApiProperty({
    description: 'Version',
    example: 0,
  })
  @IsOptional()
  version: number;

  @ApiProperty({
    title: 'IP',
    description: 'Decimal representation of the IP address',
    example: '2240446049',
  })
  @IsInt()
  @IsNotEmpty()
  ip: number;

  @ApiProperty({
    description: 'Port',
    example: 8888,
  })
  @IsInt()
  port: number;

  @ApiProperty({
    description: 'IP Type (v4 or v6)',
    example: 4,
  })
  @IsNotEmpty()
  @IsIn([4, 6], { message: 'IP type must be either 4 or 6' })
  ipType: number;

  @ApiProperty({
    description: 'Netuid',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  netuid: number;

  @ApiProperty({
    description: 'Protocol',
    example: 4,
  })
  @IsIn([4, 6], { message: 'Protocol must be either 4 or 6' })
  protocol: number;

  @ApiProperty({
    description: 'Placeholder 1',
    example: 0,
  })
  @IsOptional()
  placeholder1: number;

  @ApiProperty({
    description: 'Placeholder 2',
    example: 0,
  })
  @IsOptional()
  placeholder2: number;

  constructor(partial: Partial<AxonCallParamsDto>) {
    Object.assign(this, partial);
  }
}
