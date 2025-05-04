import { SubtensorException } from 'src/core/substrate/substrate-client.exception';

import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SubnetHyperparamsDto, SubnetHyperparamsResponseDto } from './subnet-hyperparameter.dto';
import {
  SubnetHyperparameterGenericException,
  SubnetHyperparameterNotFoundException,
} from './subnet-hyperparameter.exception';
import { SubnetHyperparameterMapper } from './subnet-hyperparameter.mapper';
import { SubnetHyperparameterService } from './subnet-hyperparameter.service';

@Controller('chain')
@ApiTags('subnet')
export class SubnetHyperparameterController {
  private readonly logger = new Logger(SubnetHyperparameterController.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // ms

  constructor(
    private readonly subnetHyperparameterService: SubnetHyperparameterService,
    private readonly subnetHyperparameterMapper: SubnetHyperparameterMapper,
  ) {}

  @Get('subnet-hyperparameter/:netuid')
  @ApiOperation({
    summary: 'Get subnet hyperparameter',
    description: 'Retrieves all subnet hyperparameter information by netuid',
  })
  @ApiParam({
    name: 'netuid',
    type: Number,
    description: 'Network UID',
  })
  @ApiResponse({
    status: 200,
    description: 'Subnet hyperparameter retrieved successfully',
    type: SubnetHyperparamsResponseDto,
  })
  async getSubnetHyperparams(
    @Param() params: SubnetHyperparamsDto,
  ): Promise<SubnetHyperparamsResponseDto> {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < this.maxRetries) {
      try {
        this.logger.log(
          `Attempt ${retries + 1} of ${this.maxRetries}: Getting subnet hyperparameter for netuid: ${params.netuid}`,
        );
        const result = await this.subnetHyperparameterService.getSubnetHyperparameters(
          params.netuid,
        );

        if (!result) {
          throw new SubnetHyperparameterNotFoundException('Subnet hyperparameter not found');
        }

        const subnetHyperparameterDto = this.subnetHyperparameterMapper.toDto(result);

        this.logger.log(`Subnet hyperparameter for netuid ${params.netuid} retrieved successfully`);
        return subnetHyperparameterDto;
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
          if (error instanceof SubnetHyperparameterNotFoundException) {
            throw error;
          }
          if (error instanceof SubtensorException) {
            throw error;
          }
          break;
        }
      }
    }

    // After max retries or non-connection error
    this.logger.error(`Failed to get subnet hyperparameter: ${lastError?.message}`);
    if (lastError instanceof SubnetHyperparameterNotFoundException) {
      throw lastError;
    }
    if (lastError instanceof SubtensorException) {
      throw lastError;
    }
    throw new SubnetHyperparameterGenericException(
      lastError?.message || 'Failed to get subnet hyperparameter',
      { originalError: lastError },
    );
  }
}
