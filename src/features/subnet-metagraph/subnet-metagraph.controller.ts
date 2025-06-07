import { ApiResponseDto, ErrorDto } from '@app/commons/common-response.dto';
import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { DomainValidationPipe } from '@app/commons/utils/domain-validation.pipe';
import { SubstrateExceptionFilter } from 'src/core/substrate/exceptions/substrate.exception-filter';
import {
  SubnetMetagraphDto,
  SubnetMetagraphParamsDto,
} from 'src/features/subnet-metagraph/subnet-metagraph.dto';
import { SubnetMetagraphMapper } from 'src/features/subnet-metagraph/subnet-metagraph.mapper';

import { Controller, Get, Logger, Param, UseFilters } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  SubnetMetagraphNotFoundException,
  SubnetMetagraphParamsInvalidException,
} from './subnet-metagraph.exception';
import { SubnetMetagraphExceptionFilter } from './subnet-metagraph.exception-filter';
import { SubnetMetagraphService } from './subnet-metagraph.service';

@Controller('chain')
@UseFilters(SubnetMetagraphExceptionFilter, SubstrateExceptionFilter)
@ApiTags('subnet')
@ApiExtraModels(ApiResponseDto, SubnetMetagraphDto)
export class SubnetMetagraphController {
  private readonly logger = new Logger(SubnetMetagraphController.name);

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
  @ApiOkResponse({
    description: 'Subnet metagraph retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(SubnetMetagraphDto) },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Subnet metagraph not found',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            error: { $ref: getSchemaPath(ErrorDto) },
          },
        },
      ],
    },
  })
  @ApiCodeSamples([pythonSample('docs/python-examples/get_subnet_metagraph.py')])
  async getSubnetMetagraph(
    @Param(new DomainValidationPipe(SubnetMetagraphParamsInvalidException))
    param: SubnetMetagraphParamsDto,
  ) {
    const netuid = param.netuid;
    this.logger.log(`Getting subnet metagraph for netuid: ${netuid}`);
    const result = await this.subnetMetagraphService.getSubnetMetagraph(netuid);

    if (!result) {
      throw new SubnetMetagraphNotFoundException(netuid);
    }

    const subnetMetagraphDto = this.subnetMetagraphMapper.toDto(result);

    this.logger.log(`Subnet metagraph for netuid ${netuid} retrieved successfully`);
    return subnetMetagraphDto;
  }
}
