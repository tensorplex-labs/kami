import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AccountNonceParamsDto {
  @ApiProperty({
    description: 'The SS58 address',
    example: '5E4z3h9yVhmQyCFWNbY9BPpwhx4xFiPwq3eeqmBgVF6KULde',
  })
  @IsString()
  @IsNotEmpty()
  account: string;
}

export class AccountNonceDto {
  @ApiProperty({
    description: 'The nonce of the SS58 address',
    example: 1,
  })
  accountNonce: number;

  constructor(partial: Partial<AccountNonceDto>) {
    Object.assign(this, partial);
  }
}
