import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';

import { Controller, Get, HttpStatus, Logger, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  CheckHotkeyException,
  CheckHotkeyNetuidHotkeyMissingException,
} from './check-hotkey.exception';
import { CheckHotkeyMapper } from './check-hotkey.mapper';
import { CheckHotkeyService } from './check-hotkey.service';

@Controller('chain')
@ApiTags('subnet')
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
  @ApiCodeSamples([pythonSample('docs/python-examples/check_hotkey.py')])
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
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new CheckHotkeyException(HttpStatus.BAD_REQUEST, 'UNKNOWN', error.message, error.stack);
    }
  }
}
