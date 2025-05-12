import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';

import { Controller, Get, HttpStatus, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LatestBlockDto } from './latest-block.dto';
import { LatestBlockException } from './latest-block.exception';
import { LatestBlockMapper } from './latest-block.mapper';
import { LatestBlockService } from './latest-block.service';

@Controller('chain')
@ApiTags('substrate')
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
  @ApiCodeSamples([pythonSample('docs/python-examples/get_latest_block.py')])
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

      throw new LatestBlockException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
