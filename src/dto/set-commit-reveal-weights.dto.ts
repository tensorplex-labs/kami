import { ApiProperty } from '@nestjs/swagger';

export class SetCommitRevealWeightsParamsDto {
  @ApiProperty({
    description: 'Netuid',
    example: 1,
  })
  netuid: number;

  @ApiProperty({
    description: 'Commit',
    example: '0x78b67e3f8062eb063934f935e5c79dc47928d594c16ea2841f8225667b4440f4',
  })
  commit: string;

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
  commit: string;
  revealRound: number;
}
