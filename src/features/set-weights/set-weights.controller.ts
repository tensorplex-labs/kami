import { ApiResponseDto } from '@app/commons/common-response.dto';
import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { DomainValidationPipe } from '@app/commons/utils/domain-validation.pipe';
import { SubstrateExceptionFilter } from 'src/core/substrate/exceptions/substrate.exception-filter';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { SetWeightsCallParams } from './set-weights.call-params.interface';
import { SetWeightsParamsDto } from './set-weights.dto';
import { SetWeightsParamsInvalidException } from './set-weights.exception';
import { SetWeightsExceptionFilter } from './set-weights.exception-filter';
import { SetWeightsService } from './set-weights.service';

@Controller('chain')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(SetWeightsExceptionFilter, SubstrateExceptionFilter)
@ApiTags('subnet')
@ApiExtraModels(ApiResponseDto)
export class SetWeightsController {
  private readonly logger = new Logger(SetWeightsController.name);
  constructor(private readonly setWeightsService: SetWeightsService) {}

  @Post('set-weights')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Set weights',
    description: 'Must setup Bittensor wallet in env',
  })
  @ApiBody({
    type: SetWeightsParamsDto,
  })
  @ApiOkResponse({
    description: 'Operation completed successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              type: 'string',
              description: 'Extrinsic hash',
              example: '0xce230ef4308b4073e448a4b92ea7ebf40385568ebe93598b6cde7cc3658dc499',
            },
          },
        },
      ],
    },
  })
  @ApiCodeSamples([pythonSample('docs/python-examples/set_weights.py')])
  async setWeights(
    @Body(new DomainValidationPipe(SetWeightsParamsInvalidException))
    callParams: SetWeightsParamsDto,
  ) {
    const setWeightsCallParams: SetWeightsCallParams = {
      netuid: callParams.netuid,
      dests: callParams.dests,
      weights: callParams.weights,
      versionKey: callParams.versionKey,
    };
    this.logger.log(`Setting weights with params: ${JSON.stringify(setWeightsCallParams)}`);
    const result = await this.setWeightsService.setWeights(setWeightsCallParams);
    this.logger.log(`Weights set with result: ${JSON.stringify(result)}`);
    return result;
  }
}
