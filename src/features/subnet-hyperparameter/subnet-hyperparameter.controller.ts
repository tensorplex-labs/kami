import { TransformInterceptor } from '@app/commons/common-response.dto';

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

import { SubnetHyperparamsDto, SubnetHyperparamsResponseDto } from './subnet-hyperparameter.dto';
import { SubnetHyperparameterMapper } from './subnet-hyperparameter.mapper';
import { SubnetHyperparameterService } from './subnet-hyperparameter.service';

@Controller('chain')
@ApiTags('subnet')
@UseInterceptors(TransformInterceptor)
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

        // Check if the result is an Error
        if (result instanceof Error) {
          throw result;
        }

        if (!result) {
          throw new HttpException('Subnet hyperparameter not found', HttpStatus.NOT_FOUND);
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
          break;
        }
      }
    }

    // After max retries or non-connection error
    this.logger.error(`Failed to get subnet hyperparameter: ${lastError?.message}`);
    throw new HttpException(
      lastError?.message || 'Failed to get subnet hyperparameter',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
