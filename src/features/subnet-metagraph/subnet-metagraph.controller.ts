import { TransformInterceptor } from '@app/commons/common-response.dto';
import { SubnetMetagraphDto } from 'src/features/subnet-metagraph/subnet-metagraph.dto';
import { SubnetMetagraphMapper } from 'src/features/subnet-metagraph/subnet-metagraph.mapper';

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SubnetMetagraphService } from './subnet-metagraph.service';

@Controller('chain')
@ApiTags('subnet')
@UseInterceptors(TransformInterceptor)
export class SubnetMetagraphController {
  private readonly logger = new Logger(SubnetMetagraphController.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // ms

  constructor(
    private readonly subnetMetagraphService: SubnetMetagraphService,
    private readonly subnetMetagraphMapper: SubnetMetagraphMapper,
  ) {}

  @Get('subnet-metagraph/:netuid')
  @ApiOperation({
    summary: 'Get subnet metagraph',
    description: 'Retrieves all subnet metagraph information by netuid',
  })
  @ApiParam({
    name: 'netuid',
    type: Number,
    description: 'Network UID',
  })
  @ApiResponse({
    status: 200,
    description: 'Subnet metagraph retrieved successfully',
    type: SubnetMetagraphDto,
  })
  async getSubnetMetagraph(@Param('netuid') netuid: number) {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < this.maxRetries) {
      try {
        this.logger.log(
          `Attempt ${retries + 1} of ${this.maxRetries}: Getting subnet metagraph for netuid: ${netuid}`,
        );
        const result = await this.subnetMetagraphService.getSubnetMetagraph(netuid);

        // Check if the result is an Error
        if (result instanceof Error) {
          throw result;
        }

        if (!result) {
          throw new HttpException('Subnet metagraph not found', HttpStatus.NOT_FOUND);
        }

        const subnetMetagraphDto = this.subnetMetagraphMapper.toDto(result);

        this.logger.log(`Subnet metagraph for netuid ${netuid} retrieved successfully`);
        return subnetMetagraphDto;
      } catch (error) {
        lastError = error;

        // Only retry connection errors
        if (
          error.message?.includes('Client is not connected') ||
          error.message?.includes('Failed to connect')
        ) {
          retries++;
          this.logger.warn(`Retrying connection (${retries}/${this.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        } else {
          // For other errors, break immediately
          break;
        }
      }
    }

    // After max retries or non-connection error
    this.logger.error(`Failed to get subnet metagraph: ${lastError?.message}`);
    throw new HttpException(
      lastError?.message || 'Failed to get subnet metagraph',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
