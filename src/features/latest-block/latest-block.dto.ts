import { ApiProperty } from '@nestjs/swagger';

export class LatestBlockDto {
  @ApiProperty({
    description: 'The parent hash of the block',
    example: '0x56a255a1ed8eb98fde76ba92692f1272197464fe40b4bc938f9cc3ae3dea9bb7',
  })
  parentHash: string;

  @ApiProperty({
    description: 'The block number of the block',
    example: 42069,
  })
  blockNumber: number;

  @ApiProperty({
    description: 'The state root of the block',
    example: '0xc95e11b40425b3c3bd6302eba0ffa32e572102d287fc4cf7ebe6a38a950ddc89',
  })
  stateRoot: string;

  @ApiProperty({
    description: 'The extrinsics root of the block',
    example: '0xe846ab1234bd62370a6b4197c3bedd1a9f0b29920b54756154ec53db4cd494fe',
  })
  extrinsicsRoot: string;

  constructor(partial: Partial<LatestBlockDto>) {
    Object.assign(this, partial);
  }
}
