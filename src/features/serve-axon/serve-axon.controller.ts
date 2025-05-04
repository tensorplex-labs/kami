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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TransformInterceptor } from '../../commons/common-response.dto';
import { AxonCallParams } from './serve-axon.call-params.interface';
import { AxonCallParamsDto } from './serve-axon.dto';
import { ServeAxonGenericException, ServeAxonParamsMissingException } from './serve-axon.exception';
import { ServeAxonService } from './serve-axon.service';

@ApiTags('subnet')
@Controller('chain')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
export class ServeAxonController {
  private readonly logger = new Logger(ServeAxonController.name);
  constructor(private readonly serveAxonService: ServeAxonService) {}

  @Post('serve-axon')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Serve axon',
    description: 'Must setup Bittensor wallet in env',
  })
  @ApiBody({
    type: AxonCallParamsDto,
  })
  async serveAxon(@Body(ValidationPipe) callParams: AxonCallParams) {
    try {
      if (!callParams) {
        throw new ServeAxonParamsMissingException();
      }

      this.logger.log(`Serving axon with params: ${JSON.stringify(callParams)}`);
      const result = await this.serveAxonService.serveAxon(callParams);
      this.logger.log(`Axon served with result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error serving axon: ${error.message}`);
      if (error instanceof ServeAxonParamsMissingException) {
        throw error;
      }

      if (error instanceof SubtensorException) {
        throw error;
      }

      throw new ServeAxonGenericException(error.message, { originalError: error });
    }
  }
}
