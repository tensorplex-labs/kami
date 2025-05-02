import { TransformInterceptor } from '@app/commons/common-response.dto';
import { ChainException } from '@app/routes/chain/chain.exceptions';

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LatestBlockDto } from './latest-block.dto';
import { LatestBlockMapper } from './latest-block.mapper';
import { LatestBlockService } from './latest-block.service';

@Controller('chain')
@ApiTags('substrate')
@UseInterceptors(TransformInterceptor)
export class LatestBlockController {
  private readonly logger = new Logger(LatestBlockController.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // ms

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
    type: LatestBlockDto,
  })
  async getLatestBlock() {
    try {
      // this.logger.debug('Fetching latest block');
      const block = await this.latestBlockService.getLatestBlock();
      if (block instanceof Error) {
        throw block;
      }
      return this.latestBlockMapper.toDto(block);
    } catch (error) {
      this.logger.error(`Error fetching latest block: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
