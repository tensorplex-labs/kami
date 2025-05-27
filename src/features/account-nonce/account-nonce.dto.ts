import { ApiProperty } from '@nestjs/swagger';

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
