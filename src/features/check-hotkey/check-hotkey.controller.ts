import { TransformInterceptor } from '@app/commons/common-response.dto';

import { Controller, Get, HttpStatus, Logger, Query, UseInterceptors } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  CheckHotkeyException,
  CheckHotkeyGenericException,
  CheckHotkeyNetuidHotkeyMissingException,
} from './check-hotkey.exception';
import { CheckHotkeyMapper } from './check-hotkey.mapper';
import { CheckHotkeyService } from './check-hotkey.service';

@Controller('chain')
@ApiTags('subnet')
@UseInterceptors(TransformInterceptor)
export class CheckHotkeyController {
  private readonly logger = new Logger(CheckHotkeyController.name);

  constructor(
    private readonly checkHotkeyService: CheckHotkeyService,
    private readonly checkHotkeyMapper: CheckHotkeyMapper,
  ) {}

  @Get('check-hotkey')
  @ApiQuery({
    name: 'netuid',
    description: 'Subnet UID',
    type: 'number',
    example: 52,
    required: true,
  })
  @ApiQuery({
    name: 'hotkey',
    description: 'Hotkey',
    type: 'string',
    example: '5E4z3h9yVhmQyCFWNbY9BPpwhx4xFiPwq3eeqmBgVF6KULde',
    required: true,
  })
  @ApiQuery({
    name: 'block',
    description: 'Block',
    type: 'number',
    required: false,
  })
  async checkHotkey(
    @Query('netuid') netuid: number,
    @Query('hotkey') hotkey: string,
    @Query('block') block?: number,
  ) {
    try {
      if (!netuid || !hotkey) {
        throw new CheckHotkeyNetuidHotkeyMissingException();
      }
      this.logger.log(`Checking hotkey for netuid: ${netuid}, hotkey: ${hotkey}`);

      let isHotkeyValid: boolean = false;
      if (block) {
        isHotkeyValid = await this.checkHotkeyService.checkHotkey(netuid, hotkey, block);

        this.logger.log(`Hotkey ${hotkey} is valid: ${isHotkeyValid}`);
        return this.checkHotkeyMapper.toDto(isHotkeyValid);
      } else {
        isHotkeyValid = await this.checkHotkeyService.checkHotkey(netuid, hotkey);

        this.logger.log(`Hotkey ${hotkey} is valid: ${isHotkeyValid}`);
        return this.checkHotkeyMapper.toDto(isHotkeyValid);
      }
    } catch (error) {
      this.logger.error(`Error checking hotkey: ${error.message}`);
      if (error instanceof CheckHotkeyNetuidHotkeyMissingException) {
        throw error;
      }
      throw new CheckHotkeyGenericException(error.message, { originalError: error });
    }
  }
}
