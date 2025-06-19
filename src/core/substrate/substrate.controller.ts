import { ApiResponseDto } from '@app/commons/common-response.dto';
import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { KeyringPairInfoDto } from '@app/commons/dto';
import { LatestBlockNotFoundException } from 'src/features/latest-block/latest-block.exception';
import { LatestBlockService } from 'src/features/latest-block/latest-block.service';

import { Controller, Get, Logger, UseFilters } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { SubstrateHealthCheckDto } from './dto/substrate-health-check.dto';
import { SubstrateRuntimeSpecVersionDto } from './dto/substrate-runtime-spec-version.dto';
import { SubstrateRuntimeVersionNotAvailableException } from './exceptions/substrate-client.exception';
import { SubstrateExceptionFilter } from './exceptions/substrate.exception-filter';
import { SubstrateClientService } from './services/substrate-client.service';
import { SubstrateConnectionService } from './services/substrate-connection.service';

@Controller('substrate')
@UseFilters(SubstrateExceptionFilter)
@ApiTags('substrate')
@ApiExtraModels(
  ApiResponseDto,
  KeyringPairInfoDto,
  SubstrateHealthCheckDto,
  SubstrateRuntimeSpecVersionDto,
)
export class SubstrateController {
  private readonly logger = new Logger(SubstrateController.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
    private readonly latestBlockService: LatestBlockService,
  ) {}

  @Get('available-runtime-apis')
  @ApiOperation({
    summary: 'Get available runtime APIs',
    description: 'Retrieves all available runtime APIs',
  })
  @ApiResponse({
    status: 200,
    description: 'Available runtime APIs retrieved successfully',
  })
  @ApiCodeSamples([pythonSample('docs/python-examples/get_available_runtime_api.py')])
  async getAvailableRuntimeApis() {
    const result = await this.substrateClientService.availableRuntimeApis();
    return result;
  }

  @Get('keyring-pair-info')
  @ApiOperation({
    summary: 'Get keyring pair info',
    description: 'Retrieves the current keyring pair information',
  })
  @ApiOkResponse({
    description: 'Keyring pair info retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(KeyringPairInfoDto) },
          },
        },
      ],
    },
  })
  @ApiCodeSamples([pythonSample('docs/python-examples/get_keyring_pair_info.py')])
  async getKeyringPairInfo() {
    const result = await this.substrateConnectionService.getKeyringPairInfo();
    this.logger.log(`Keyring pair info retrieved successfully: ${JSON.stringify(result)}`);
    return result;
  }

  @Get('runtime-spec-version')
  @ApiOperation({
    summary: 'Get runtime spec version',
    description: 'Retrieves the current runtime spec version',
  })
  @ApiOkResponse({
    description: 'Runtime spec version retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(SubstrateRuntimeSpecVersionDto),
            },
          },
        },
      ],
    },
  })
  async getRuntimeSpecVersion() {
    const result = await this.substrateClientService.getRuntimeSpecVersion();
    return result;
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Checks the health of Kami instance',
  })
  @ApiOkResponse({
    description: 'Kami instance is healthy',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(SubstrateHealthCheckDto),
            },
          },
        },
      ],
    },
  })
  async healthCheck() {
    const runtimeSpecVersionDuringHealthCheck =
      await this.substrateClientService.getRuntimeSpecVersion();

    if (
      runtimeSpecVersionDuringHealthCheck.specVersion !==
      this.substrateClientService.runtimeSpecVersion.specVersion
    ) {
      throw new SubstrateRuntimeVersionNotAvailableException();
    }

    const latestBlock = await this.latestBlockService.getLatestBlock();
    if (!latestBlock) {
      throw new LatestBlockNotFoundException('Latest block not found');
    }

    return new SubstrateHealthCheckDto({
      latestBlock: latestBlock.blockNumber,
      runtimeSpecVersionDuringKamiInitialization:
        this.substrateClientService.runtimeSpecVersion.specVersion,
      runtimeSpecVersionDuringHealthCheck: runtimeSpecVersionDuringHealthCheck.specVersion,
    });
  }
}
