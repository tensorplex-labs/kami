import { ApiResponseDto } from '@app/commons/common-response.dto';
import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { DomainValidationPipe } from '@app/commons/utils/domain-validation.pipe';
import { SubstrateExceptionFilter } from 'src/core/substrate/exceptions/substrate.exception-filter';

import { Controller, Get, Logger, Param, UseFilters } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { SubnetHyperparamsDto, SubnetHyperparamsResponseDto } from './subnet-hyperparameter.dto';
import {
  SubnetHyperparameterNotFoundException,
  SubnetHyperparameterParamsInvalidException,
} from './subnet-hyperparameter.exception';
import { SubnetHyperparameterExceptionFilter } from './subnet-hyperparameter.exception-filter';
import { SubnetHyperparameterMapper } from './subnet-hyperparameter.mapper';
import { SubnetHyperparameterService } from './subnet-hyperparameter.service';

@Controller('chain')
@UseFilters(SubnetHyperparameterExceptionFilter, SubstrateExceptionFilter)
@ApiTags('subnet')
@ApiExtraModels(ApiResponseDto, SubnetHyperparamsResponseDto)
export class SubnetHyperparameterController {
  private readonly logger = new Logger(SubnetHyperparameterController.name);

  constructor(
    private readonly subnetHyperparameterService: SubnetHyperparameterService,
    private readonly subnetHyperparameterMapper: SubnetHyperparameterMapper,
  ) {}

  @Get('subnet-hyperparameters/:netuid')
  @ApiOperation({
    summary: 'Get subnet hyperparameter',
    description: 'Retrieves all subnet hyperparameter information by netuid',
  })
  @ApiParam({
    name: 'netuid',
    type: Number,
    description: 'Network UID',
  })
  @ApiOkResponse({
    description: 'Subnet hyperparameter retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(SubnetHyperparamsResponseDto) },
          },
        },
      ],
    },
  })
  @ApiCodeSamples([pythonSample('docs/python-examples/get_subnet_hyperparameters.py')])
  async getSubnetHyperparams(
    @Param(new DomainValidationPipe(SubnetHyperparameterParamsInvalidException))
    param: SubnetHyperparamsDto,
  ) {
    const netuid = param.netuid;
    this.logger.log(`Getting subnet hyperparameter for netuid: ${netuid}`);
    const result = await this.subnetHyperparameterService.getSubnetHyperparameters(netuid);

    if (!result) {
      throw new SubnetHyperparameterNotFoundException(
        `Subnet hyperparameter not found for netuid: ${netuid}`,
      );
    }

    const subnetHyperparameterDto = this.subnetHyperparameterMapper.toDto(result);

    this.logger.log(`Subnet hyperparameter for netuid ${netuid} retrieved successfully`);
    return subnetHyperparameterDto;
  }
}
