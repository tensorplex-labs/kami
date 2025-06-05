import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CheckHotkeyParamsDto {
  @ApiProperty({
    description: 'Subnet UID',
    example: 52,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  netuid: number;

  @ApiProperty({
    description: 'Hotkey',
    example: '5E4z3h9yVhmQyCFWNbY9BPpwhx4xFiPwq3eeqmBgVF6KULde',
  })
  @IsNotEmpty()
  @IsString()
  hotkey: string;

  @ApiProperty({
    description: 'Block',
    example: 1000000,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  block?: number;
}

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
