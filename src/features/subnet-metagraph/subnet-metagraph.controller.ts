import { SubtensorException } from 'src/core/substrate/substrate-client.exception';
import { SubnetMetagraphDto } from 'src/features/subnet-metagraph/subnet-metagraph.dto';
import { SubnetMetagraphMapper } from 'src/features/subnet-metagraph/subnet-metagraph.mapper';

import { Controller, Get, HttpStatus, Logger, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ConnectionFailedException } from '../../core/substrate/substrate-connection.exception';
import {
  InvalidSubnetIdException,
  SubnetMetagraphException,
  SubnetMetagraphFetchException,
  SubnetMetagraphNotFoundException,
} from './subnet-metagraph.exception';
import { SubnetMetagraphService } from './subnet-metagraph.service';

@Controller('chain')
@ApiTags('subnet')
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
    // Validate the netuid parameter
    if (isNaN(netuid) || netuid < 0) {
      throw new InvalidSubnetIdException(netuid);
    }

    let retries = 0;
    let lastError: Error | null = null;

    while (retries < this.maxRetries) {
      try {
        this.logger.log(
          `Attempt ${retries + 1} of ${this.maxRetries}: Getting subnet metagraph for netuid: ${netuid}`,
        );
        const result = await this.subnetMetagraphService.getSubnetMetagraph(netuid);

        if (!result) {
          throw new SubnetMetagraphNotFoundException(netuid);
        }

        const subnetMetagraphDto = this.subnetMetagraphMapper.toDto(result);

        this.logger.log(`Subnet metagraph for netuid ${netuid} retrieved successfully`);
        return subnetMetagraphDto;
      } catch (error) {
        lastError = error;

        // If it's already one of our domain-specific exceptions, no need to retry
        if (
          error instanceof SubnetMetagraphNotFoundException ||
          error instanceof InvalidSubnetIdException ||
          error instanceof SubtensorException
        ) {
          throw error;
        }

        // Only retry connection errors
        if (
          error instanceof ConnectionFailedException ||
          error.message?.includes('Client is not connected') ||
          error.message?.includes('Failed to connect')
        ) {
          retries++;
          this.logger.warn(`Retrying connection (${retries}/${this.maxRetries}): ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        } else {
          // For other errors, wrap in a domain-specific exception and break
          throw new SubnetMetagraphException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'UNKNOWN',
            error.message,
            error.stack,
          );
        }
      }
    }

    // After max retries, throw a more specific connection exception
    this.logger.error(
      `Failed to get subnet metagraph after ${this.maxRetries} retries: ${lastError?.message}`,
    );
    if (
      lastError instanceof SubnetMetagraphNotFoundException ||
      lastError instanceof InvalidSubnetIdException ||
      lastError instanceof SubtensorException
    ) {
      throw lastError;
    }
    throw new SubnetMetagraphException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'UNKNOWN',
      lastError?.message || 'Failed to get subnet metagraph',
      lastError?.stack,
    );
  }
}
