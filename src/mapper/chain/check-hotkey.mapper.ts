import { CheckHotkeyDto } from 'src/dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckHotkeyMapper {
  toDto(isHotkeyValid: boolean): CheckHotkeyDto {
    return new CheckHotkeyDto({
      isHotkeyValid: isHotkeyValid,
    });
  }
}
