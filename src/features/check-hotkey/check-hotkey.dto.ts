import { ApiProperty } from '@nestjs/swagger';

export class CheckHotkeyDto {
  @ApiProperty({
    description: 'Whether the hotkey is registered on the subnet',
    example: true,
  })
  isHotkeyValid: boolean;

  constructor(partial: Partial<CheckHotkeyDto>) {
    Object.assign(this, partial);
  }
}
