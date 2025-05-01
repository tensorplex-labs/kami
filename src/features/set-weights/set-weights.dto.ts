import { ApiProperty } from '@nestjs/swagger';

export class SetWeightsParamsDto {
  @ApiProperty({
    description: 'Netuid',
    example: 1,
  })
  netuid: number;

  @ApiProperty({
    description: 'UID',
    example: [0, 1, 2, 3],
  })
  dests: number[];

  @ApiProperty({
    description: 'Weights',
    example: [1, 2, 3, 4],
  })
  weights: number[];

  @ApiProperty({
    description: 'Version Key',
    example: 1,
  })
  versionKey: number;

  constructor(partial: Partial<SetWeightsParamsDto>) {
    Object.assign(this, partial);
  }
}
