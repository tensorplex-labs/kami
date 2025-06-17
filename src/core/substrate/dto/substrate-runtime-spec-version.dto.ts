import { ApiProperty } from '@nestjs/swagger';

export class SubstrateRuntimeSpecVersionDto {
  @ApiProperty({
    description: 'Spec version',
    example: 1,
  })
  specVersion: number;

  constructor(partial: Partial<SubstrateRuntimeSpecVersionDto>) {
    Object.assign(this, partial);
  }
}
