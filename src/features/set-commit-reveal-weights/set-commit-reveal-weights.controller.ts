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

import {
  SetCommitRevealWeightException,
  SetCommitRevealWeightParamsMissingException,
} from './set-commit-reveal-weight.exception';
import { CommitRevealWeightsCallParams } from './set-commit-reveal-weights.call-params.interface';
import { SetCommitRevealWeightsParamsDto } from './set-commit-reveal-weights.dto';
import { SetCommitRevealWeightsService } from './set-commit-reveal-weights.service';

@Controller('chain')
@ApiTags('subnet')
@UseInterceptors(ClassSerializerInterceptor)
@ApiExtraModels(ApiResponseDto)
export class SetCommitRevealWeightsController {
  private readonly logger = new Logger(SetCommitRevealWeightsController.name);
  constructor(private readonly setCommitRevealWeightsService: SetCommitRevealWeightsService) {}

  @Post('set-commit-reveal-weights')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Set commit reveal weights',
    description: 'Must setup Bittensor wallet in env',
  })
  @ApiBody({
    type: SetCommitRevealWeightsParamsDto,
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
  async setCommitRevealWeights(@Body(ValidationPipe) callParams: CommitRevealWeightsCallParams) {
    try {
      if (!callParams) {
        throw new SetCommitRevealWeightParamsMissingException();
      }
      this.logger.log(`Setting commit reveal weights with params: ${JSON.stringify(callParams)}`);
      const result = await this.setCommitRevealWeightsService.setCommitRevealWeights(callParams);
      return result;
    } catch (error) {
      this.logger.error(`Error setting commit reveal weights: ${error.message}`);
      if (error instanceof SetCommitRevealWeightParamsMissingException) {
        throw error;
      }
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new SetCommitRevealWeightException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
