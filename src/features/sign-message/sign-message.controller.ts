import { ApiResponseDto } from '@app/commons/common-response.dto';
import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
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
  SignMessageParamDto,
  SignMessageResponseDto,
  VerifyMessageParamDto,
  VerifyMessageResponseDto,
} from './sign-message.dto';
import { SignMessageException } from './sign-message.exception';
import { SignMessageMapper, VerifyMessageMapper } from './sign-message.mapper';
import { SignMessageService } from './sign-message.service';

@Controller('substrate')
@ApiTags('substrate')
@ApiExtraModels(ApiResponseDto, SignMessageResponseDto, VerifyMessageResponseDto)
export class SignMessageController {
  private readonly logger = new Logger(SignMessageController.name);

  constructor(
    private readonly signMessageService: SignMessageService,
    private readonly signMessageMapper: SignMessageMapper,
    private readonly verifyMessageMapper: VerifyMessageMapper,
  ) { }

  @Post('sign-message/sign')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Sign a message.',
    description: 'Sign a message with a keyring pair.',
  })
  @ApiBody({
    type: SignMessageParamDto,
  })
  @ApiOkResponse({
    description: 'Message signed successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(SignMessageResponseDto) },
          },
        },
      ],
    },
  })
  async signMessage(@Body(ValidationPipe) callParams: SignMessageParamDto) {
    try {
      this.logger.log(`Signing message with keyring pair..`);

      const signature = await this.signMessageService.signMessage(callParams.message);

      this.logger.log(`Signed Message: ${signature}`);
      return this.signMessageMapper.toDto(signature);
    } catch (error) {
      this.logger.error(`Error getting account nonce: ${error.message}`);
      if (error instanceof SignMessageException) {
        throw error;
      }
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new SignMessageException(HttpStatus.BAD_REQUEST, 'UNKNOWN', error.message, error.stack);
    }
  }

  @Post('sign-message/verify')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Verify a signature.',
    description: 'Verify a signature with a keyring pair.',
  })
  @ApiBody({
    type: VerifyMessageParamDto,
  })
  @ApiOkResponse({
    description: 'Signature verified successfully.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(VerifyMessageResponseDto) },
          },
        },
      ],
    },
  })
  async verifyMessage(@Body(ValidationPipe) callParams: VerifyMessageParamDto) {
    try {
      this.logger.log(`Verifying message with keyring pair..`);

      const isValid = await this.signMessageService.verifyMessage(callParams);

      this.logger.log(`Signature validity: ${isValid}`);
      return this.verifyMessageMapper.toDto(isValid);
    } catch (error) {
      this.logger.error(`Error getting account nonce: ${error.message}`);
      if (error instanceof SignMessageException) {
        throw error;
      }
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new SignMessageException(HttpStatus.BAD_REQUEST, 'UNKNOWN', error.message, error.stack);
    }
  }
}
