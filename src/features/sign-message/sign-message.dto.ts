import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignMessageResponseDto {
  @ApiProperty({
    description: 'The signature of the signed message against keyring pair.',
    example: `string`,
  })
  signature: string;

  constructor(partial: Partial<SignMessageResponseDto>) {
    Object.assign(this, partial);
  }
}

export class SignMessageParamDto {
  @ApiProperty({
    description: 'The signature of the signed message against keyring pair.',
    example: `string`,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  constructor(partial: Partial<SignMessageParamDto>) {
    Object.assign(this, partial);
  }
}

export class VerifyMessageResponseDto {
  @ApiProperty({
    description: 'If signature is valid.',
    example: `boolean`,
  })
  valid: boolean;

  constructor(partial: Partial<VerifyMessageResponseDto>) {
    Object.assign(this, partial);
  }
}

export class VerifyMessageParamDto {
  @ApiProperty({
    description: 'The message that is crafted for the signature to verify against.',
    example: `string`,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description:
      'The signature that is crafted for message to verify against in hex, will be converted to u8a during verification.',
    example: `string`,
  })
  @IsNotEmpty()
  @IsString()
  signature: string;

  @ApiProperty({
    description: 'Wallet public key in ss58 address format.',
    example: `string`,
  })
  @IsNotEmpty()
  @IsString()
  signeeAddress: string;

  constructor(partial: Partial<VerifyMessageParamDto>) {
    Object.assign(this, partial);
  }
}
