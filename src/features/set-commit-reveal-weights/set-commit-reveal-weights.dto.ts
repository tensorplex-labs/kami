import { ApiProperty } from '@nestjs/swagger';

export class SetCommitRevealWeightsParamsDto {
  @ApiProperty({
    description: 'Netuid',
    example: 1,
  })
  netuid: number;

  @ApiProperty({
    description: 'Commit',
    example: "0x78b67e3f8062eb063934f935e5c79dc47928d594c16ea2841f8225667b4440f4 or b'\x82\x84\x14\xb7\xf7\x9f\x02\xd97\x94\xaakD\x0b\xfa3o\x15\xdfY\xc8\x0b\x16\xc6\xe6\x07s=\xa4f\xcd\xb8\...00AES_GCM_",
  })
  commit: string | Buffer;

  @ApiProperty({
    description: 'Reveal Round',
    example: 1,
  })
  revealRound: number;

  constructor(partial: Partial<SetCommitRevealWeightsParamsDto>) {
    Object.assign(this, partial);
  }
}

export interface CommitRevealWeightsCallParams {
  netuid: number;
  commit: Buffer | string; // TODO: Remove string once verified Buffer is the right one
  revealRound: number;
}
