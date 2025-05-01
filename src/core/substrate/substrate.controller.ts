import { TransformInterceptor } from '@app/commons/common-response.dto';

import { Controller, Get, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SubstrateClientService } from './services/substrate-client.service';

@Controller('substrate')
@ApiTags('substrate')
@UseInterceptors(TransformInterceptor)
export class SubstrateController {
  constructor(private readonly substrateClientService: SubstrateClientService) {}

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
}
