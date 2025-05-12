import { ApiProperty } from '@nestjs/swagger';

export class KeyringPairDto {
  @ApiProperty({
    description: 'Hotkey',
    example: '5E4z3h9yVhmQyCFWNbY9BPpwhx4xFiPwq3eeqmBgVF6KULde',
  })
  address: string;

  @ApiProperty({
    description: 'Raw Address',
  })
  addressRaw: Record<string, number>;

  @ApiProperty({
    description: 'Is locked',
    example: true,
  })
  isLocked: boolean;

  @ApiProperty({
    description: 'Metadata',
  })
  meta: [string, any];

  @ApiProperty({
    description: 'Public key',
  })
  publicKey: Record<string, number>;

  @ApiProperty({
    description: 'Type',
    example: 'sr25519',
  })
  type: string;

  constructor(partial: Partial<KeyringPairDto>) {
    Object.assign(this, partial);
  }
}

export class KeyringPairInfoDto {
  @ApiProperty({
    description: 'The keyring pair',
    type: KeyringPairDto,
  })
  keyringPair: KeyringPairDto;

  @ApiProperty({
    description: 'The wallet coldkey',
    example: '5DSsZGwBuYHRDA7HzdZUVBhKKpZpJKcf7rTd9y5Gz1SQyo9V',
  })
  walletColdkey: string;

  constructor(partial: Partial<KeyringPairInfoDto>) {
    Object.assign(this, partial);
  }
}
