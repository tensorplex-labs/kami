import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsInt } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SetCommitRevealWeightsParamsDto {
  @ApiProperty({
    description: 'Netuid',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  netuid: number;

  @ApiProperty({
    description: 'Commit',
    example:
      "b'\x82\x84\x14\xb7\xf7\x9f\x02\xd97\x94\xaakD\x0b\xfa3o\x15\xdfY\xc8\x0b\x16\xc6\xe6\x07s=\xa4f\xcd\xb8\...00AES_GCM_",
  })
  @IsNotEmpty()
  commit: Buffer;

  @ApiProperty({
    description: 'Reveal Round',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  revealRound: number;

  constructor(partial: Partial<SetCommitRevealWeightsParamsDto>) {
    Object.assign(this, partial);
  }
}
