import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SetWeightsParamsDto {
  @ApiProperty({
    description: 'Netuid',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  netuid: number;

  @ApiProperty({
    description: 'UID',
    example: [0, 1, 2, 3],
  })
  @IsArray()
  @ArrayNotEmpty()
  dests: number[];

  @ApiProperty({
    description: 'Weights',
    example: [1, 2, 3, 4],
  })
  @IsArray()
  @ArrayNotEmpty()
  weights: number[];

  @ApiProperty({
    description: 'Version Key',
    example: 1,
  })
  @IsOptional()
  versionKey: number;

  constructor(partial: Partial<SetWeightsParamsDto>) {
    Object.assign(this, partial);
  }
}
