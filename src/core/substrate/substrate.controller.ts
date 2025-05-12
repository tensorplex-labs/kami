import { ApiResponseDto } from '@app/commons/common-response.dto';
import { ApiCodeSamples, pythonSample } from '@app/commons/decorators/api-code-examples.decorator';
import { KeyringPairInfoDto } from '@app/commons/dto';

import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  FileAccessException,
  InvalidColdkeyFormatException,
  InvalidHotkeyFormatException,
  WalletHotkeyNotSetException,
  WalletNameNotSetException,
  WalletPathNotSetException,
} from './exceptions/substrate-connection.exception';
import { SubstrateClientService } from './services/substrate-client.service';
import { SubstrateConnectionService } from './services/substrate-connection.service';

@Controller('substrate')
@ApiTags('substrate')
@ApiExtraModels(ApiResponseDto, KeyringPairInfoDto)
export class SubstrateController {
  private readonly logger = new Logger(SubstrateController.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
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
    try {
      const result = await this.substrateClientService.availableRuntimeApis();
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    try {
      const result = await this.substrateConnectionService.getKeyringPairInfo();
      this.logger.log(`Keyring pair info retrieved successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      if (
        error instanceof WalletPathNotSetException ||
        error instanceof WalletNameNotSetException ||
        error instanceof WalletHotkeyNotSetException ||
        error instanceof InvalidColdkeyFormatException ||
        error instanceof InvalidHotkeyFormatException ||
        error instanceof FileAccessException
      ) {
        throw error;
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
