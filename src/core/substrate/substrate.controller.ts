import { TransformInterceptor } from '@app/commons/common-response.dto';

import { Controller, Get, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SubstrateClientService } from './services/substrate-client.service';
import { SubstrateConnectionService } from './services/substrate-connection.service';

@Controller('substrate')
@ApiTags('substrate')
@UseInterceptors(TransformInterceptor)
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}