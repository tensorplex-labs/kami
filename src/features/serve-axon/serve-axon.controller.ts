import { ApiResponseDto } from '@app/commons/common-response.dto';
import { pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { ApiCodeSamples } from '@app/commons/decorators/api-code-examples.decorator';
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

import { AxonCallParamsDto } from './serve-axon.dto';
import { ServeAxonParamsInvalidException } from './serve-axon.exception';
import { ServeAxonExceptionFilter } from './serve-axon.exception-filter';
import { ServeAxonService } from './serve-axon.service';

@ApiTags('subnet')
@Controller('chain')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(ServeAxonExceptionFilter, SubstrateExceptionFilter)
@ApiExtraModels(ApiResponseDto)
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
  @ApiCodeSamples([pythonSample('docs/python-examples/serve_axons.py')])
  async serveAxon(
    @Body(new DomainValidationPipe(ServeAxonParamsInvalidException))
    callParams: AxonCallParamsDto,
  ) {
    this.logger.log(`Serving axon with params: ${JSON.stringify(callParams)}`);
    const result = await this.serveAxonService.serveAxon(callParams);
    this.logger.log(`Axon served with result: ${JSON.stringify(result)}`);
    return result;
  }
}
