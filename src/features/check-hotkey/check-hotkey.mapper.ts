import { plainToClass } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { CheckHotkeyDto } from './check-hotkey.dto';

@Injectable()
export class CheckHotkeyMapper {
  toDto(isHotkeyValid: boolean): CheckHotkeyDto {
    return plainToClass(CheckHotkeyDto, {
      isHotkeyValid: isHotkeyValid,
    });
  }
}
