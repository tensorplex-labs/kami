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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SetWeightsCallParams } from './set-weights.call-params.interface';
import { SetWeightsParamsDto } from './set-weights.dto';
import { SetWeightsException, SetWeightsParamsMissingException } from './set-weights.exception';
import { SetWeightsService } from './set-weights.service';

@Controller('chain')
@ApiTags('subnet')
@UseInterceptors(ClassSerializerInterceptor)
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
  @ApiResponse({
    description: 'Commit hash (To be used for Commit Reveal)',
    example: '0x8141db6ceb557923a25fe19255adb17e4576013942da669855ac2f831e582cce',
  })
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
