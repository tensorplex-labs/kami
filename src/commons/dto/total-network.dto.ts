import { ApiProperty } from '@nestjs/swagger';

export class TotalNetworkResponseDto {
  @ApiProperty({
    description: 'Total number of subnets (including the root subnet)',
    example: 100,
  })
  totalNetwork: number;

  constructor(partial: Partial<TotalNetworkResponseDto>) {
    Object.assign(this, partial);
  }
}
