import { ApiProperty } from '@nestjs/swagger';

export class SubstrateRuntimeSpecVersionDto {
  @ApiProperty({
    description: 'Spec version',
    example: 273,
  })
  specVersion: number;

  constructor(partial: Partial<SubstrateRuntimeSpecVersionDto>) {
    Object.assign(this, partial);
  }
}
