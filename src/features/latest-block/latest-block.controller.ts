import { ApiResponseDto } from '@app/commons/common-response.dto';
import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { SubstrateExceptionFilter } from 'src/core/substrate/exceptions/substrate.exception-filter';

import { Controller, Get, Logger, UseFilters } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { LatestBlockDto } from './latest-block.dto';
import { LatestBlockExceptionFilter } from './latest-block.exception-filter';
import { LatestBlockMapper } from './latest-block.mapper';
import { LatestBlockService } from './latest-block.service';

@Controller('chain')
@UseFilters(LatestBlockExceptionFilter, SubstrateExceptionFilter)
@ApiTags('substrate')
@ApiExtraModels(ApiResponseDto, LatestBlockDto)
export class LatestBlockController {
  private readonly logger = new Logger(LatestBlockController.name);

  constructor(
    private readonly latestBlockService: LatestBlockService,
    private readonly latestBlockMapper: LatestBlockMapper,
  ) {}

  @Get('latest-block')
  @ApiOperation({
    summary: 'Get latest block',
    description: 'Retrieves the latest block from the blockchain',
  })
  @ApiOkResponse({
    description: 'Latest block retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(LatestBlockDto) },
          },
        },
      ],
    },
  })
  @ApiCodeSamples([pythonSample('docs/python-examples/get_latest_block.py')])
  async getLatestBlock() {
    this.logger.debug('Fetching latest block');
    const block = await this.latestBlockService.getLatestBlock();

    return this.latestBlockMapper.toDto(block);
  }
}
