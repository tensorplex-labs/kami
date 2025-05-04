import { SubtensorException } from 'src/core/substrate/substrate-client.exception';

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
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  SetCommitRevealWeightGenericException,
  SetCommitRevealWeightParamsMissingException,
} from './set-commit-reveal-weight.exception';
import { CommitRevealWeightsCallParams } from './set-commit-reveal-weights.call-params.interface';
import { SetCommitRevealWeightsParamsDto } from './set-commit-reveal-weights.dto';
import { SetCommitRevealWeightsService } from './set-commit-reveal-weights.service';

@Controller('chain')
@ApiTags('subnet')
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
  @ApiOkResponse({
    description: 'Commit reveal weights set successfully',
    example: '0xfd5e598f4640ced068e88ed8b1d3d367ea30bb7af00c93f99ff90e3020037973',
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
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new SetCommitRevealWeightGenericException(error.message, { originalError: error });
    }
  }
}
