import { plainToClass } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { AccountNonceDto } from './account-nonce.dto';

@Injectable()
export class AccountNonceMapper {
  toDto(accountNonce: number): AccountNonceDto {
    return plainToClass(AccountNonceDto, {
      accountNonce: accountNonce,
    });
  }
}
