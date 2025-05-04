import { ChainException } from '@app/routes/chain/chain.exceptions';

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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TransformInterceptor } from '../../commons/common-response.dto';
import {
  SetCommitRevealWeightGenericException,
  SetCommitRevealWeightParamsMissingException,
} from './set-commit-reveal-weight.exception';
import { CommitRevealWeightsCallParams } from './set-commit-reveal-weights.call-params.interface';
import { SetCommitRevealWeightsParamsDto } from './set-commit-reveal-weights.dto';
import { SetCommitRevealWeightsService } from './set-commit-reveal-weights.service';

@Controller('chain')
@ApiTags('subnet')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
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
      throw new SetCommitRevealWeightGenericException(error.message, { originalError: error });
    }
  }
}
