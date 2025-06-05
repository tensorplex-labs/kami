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
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { SetCommitRevealWeightParamsInvalidException } from './set-commit-reveal-weight.exception';
import { SetCommitRevealWeightExceptionFilter } from './set-commit-reveal-weight.exception-filter';
import { CommitRevealWeightsCallParams } from './set-commit-reveal-weights.call-params.interface';
import { SetCommitRevealWeightsParamsDto } from './set-commit-reveal-weights.dto';
import { SetCommitRevealWeightsService } from './set-commit-reveal-weights.service';

@Controller('chain')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(SetCommitRevealWeightExceptionFilter, SubstrateExceptionFilter)
@ApiTags('subnet')
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
  async setCommitRevealWeights(
    @Body(new DomainValidationPipe(SetCommitRevealWeightParamsInvalidException))
    callParams: SetCommitRevealWeightsParamsDto,
  ) {
    const setCommitRevealWeightsCallParams: CommitRevealWeightsCallParams = {
      netuid: callParams.netuid,
      commit: callParams.commit,
      revealRound: callParams.revealRound,
    };
    this.logger.log(`Setting commit reveal weights with params: ${JSON.stringify(callParams)}`);
    const result = await this.setCommitRevealWeightsService.setCommitRevealWeights(
      setCommitRevealWeightsCallParams,
    );
    return result;
  }
}
