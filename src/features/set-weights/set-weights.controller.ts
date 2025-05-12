import { ApiResponseDto } from '@app/commons/common-response.dto';
import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
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
import { SetWeightsException, SetWeightsParamsMissingException } from './set-weights.exception';
import { SetWeightsService } from './set-weights.service';

@Controller('chain')
@ApiTags('subnet')
@UseInterceptors(ClassSerializerInterceptor)
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
  async setWeights(@Body(ValidationPipe) callParams: SetWeightsCallParams) {
    try {
      if (!callParams) {
        throw new SetWeightsParamsMissingException();
      }

      this.logger.log(`Setting weights with params: ${JSON.stringify(callParams)}`);
      const result = await this.setWeightsService.setWeights(callParams);
      this.logger.log(`Weights set with result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error setting weights: ${error.message}`);
      if (error instanceof SetWeightsParamsMissingException) {
        throw error;
      }
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new SetWeightsException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
