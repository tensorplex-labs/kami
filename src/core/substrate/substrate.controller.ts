import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SubstrateClientService } from './services/substrate-client.service';
import { SubstrateConnectionService } from './services/substrate-connection.service';
import {
  WalletPathNotSetException,
  WalletNameNotSetException,
  WalletHotkeyNotSetException,
  InvalidColdkeyFormatException,
  InvalidHotkeyFormatException,
  FileAccessException,
} from './substrate-connection.exception';

@Controller('substrate')
@ApiTags('substrate')
export class SubstrateController {
  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  @Get('available-runtime-apis')
  @ApiOperation({
    summary: 'Get available runtime APIs',
    description: 'Retrieves all available runtime APIs',
  })
  @ApiResponse({
    status: 200,
    description: 'Available runtime APIs retrieved successfully',
  })
  async getAvailableRuntimeApis() {
    try {
      const result = await this.substrateClientService.availableRuntimeApis();
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('keyring-pair-info')
  @ApiOperation({
    summary: 'Get keyring pair info',
    description: 'Retrieves the current keyring pair information',
  })
  @ApiResponse({
    status: 200,
    description: 'Keyring pair info retrieved successfully',
  })
  async getKeyringPairInfo() {
    try {
      const result = await this.substrateConnectionService.getKeyringPairInfo();
      return result;
    } catch (error) {
      if (
        error instanceof WalletPathNotSetException ||
        error instanceof WalletNameNotSetException ||
        error instanceof WalletHotkeyNotSetException ||
        error instanceof InvalidColdkeyFormatException ||
        error instanceof InvalidHotkeyFormatException ||
        error instanceof FileAccessException
      ) {
        throw error;
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
