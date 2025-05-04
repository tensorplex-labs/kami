import { TransformInterceptor } from '@app/commons/common-response.dto';
import { SubtensorException } from 'src/core/substrate/substrate-client.exception';

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
import { LatestBlockGenericException } from './latest-block.exception';
import { LatestBlockMapper } from './latest-block.mapper';
import { LatestBlockService } from './latest-block.service';

@Controller('chain')
@ApiTags('substrate')
@UseInterceptors(TransformInterceptor)
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
    type: LatestBlockDto,
  })
  async getLatestBlock() {
    try {
      // this.logger.debug('Fetching latest block');
      const block = await this.latestBlockService.getLatestBlock();

      return this.latestBlockMapper.toDto(block);
    } catch (error) {
      this.logger.error(`Error fetching latest block: ${error.message}`);
      if (error instanceof SubtensorException) {
        throw error;
      }

      throw new LatestBlockGenericException(error.message, { originalError: error });
    }
  }
}
