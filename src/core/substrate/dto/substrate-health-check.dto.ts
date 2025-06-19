import { ApiProperty } from '@nestjs/swagger';

export class SubstrateHealthCheckDto {
  @ApiProperty({
    description: 'Latest block',
    example: 1,
  })
  latestBlock: number;

  @ApiProperty({
    description: 'Runtime spec version during Kami initialization',
    example: 273,
  })
  runtimeSpecVersionDuringKamiInitialization: number;

  @ApiProperty({
    description: 'Runtime spec version during health check',
    example: 273,
  })
  runtimeSpecVersionDuringHealthCheck: number;

  constructor(partial: Partial<SubstrateHealthCheckDto>) {
    Object.assign(this, partial);
  }
}
