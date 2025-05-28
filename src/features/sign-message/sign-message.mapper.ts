import { plainToClass } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { SignMessageResponseDto, VerifyMessageResponseDto } from './sign-message.dto';

@Injectable()
export class SignMessageMapper {
  toDto(signature: string): SignMessageResponseDto {
    return plainToClass(SignMessageResponseDto, {
      signature: signature,
    });
  }
}

@Injectable()
export class VerifyMessageMapper {
  toDto(valid: boolean): VerifyMessageResponseDto {
    return plainToClass(VerifyMessageResponseDto, {
      valid: valid,
    });
  }
}
