import { ApiResponseDto } from '@app/commons/common-response.dto';
import { DomainValidationPipe } from '@app/commons/utils/domain-validation.pipe';
import { SubstrateExceptionFilter } from 'src/core/substrate/exceptions/substrate.exception-filter';

import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseFilters } from '@nestjs/common';
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
import {
  SignMessageParamsInvalidException,
  VerifyMessageParamsInvalidException,
} from './sign-message.exception';
import { SignMessageExceptionFilter } from './sign-message.exception-filter';
import { SignMessageMapper, VerifyMessageMapper } from './sign-message.mapper';
import { SignMessageService } from './sign-message.service';

@Controller('substrate')
@UseFilters(SignMessageExceptionFilter, SubstrateExceptionFilter)
@ApiTags('substrate')
@ApiExtraModels(ApiResponseDto, SignMessageResponseDto, VerifyMessageResponseDto)
export class SignMessageController {
  private readonly logger = new Logger(SignMessageController.name);

  constructor(
    private readonly signMessageService: SignMessageService,
    private readonly signMessageMapper: SignMessageMapper,
    private readonly verifyMessageMapper: VerifyMessageMapper,
  ) {}

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
  async signMessage(
    @Body(new DomainValidationPipe(SignMessageParamsInvalidException))
    callParams: SignMessageParamDto,
  ) {
    this.logger.log(`Signing message with keyring pair..`);

    const signature = await this.signMessageService.signMessage(callParams.message);

    this.logger.log(`Signed Message: ${signature}`);
    return this.signMessageMapper.toDto(signature);
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
  async verifyMessage(
    @Body(new DomainValidationPipe(VerifyMessageParamsInvalidException))
    callParams: VerifyMessageParamDto,
  ) {
    this.logger.log(`Verifying message with keyring pair..`);

    const isValid = await this.signMessageService.verifyMessage(callParams);

    this.logger.log(`Signature validity: ${isValid}`);
    return this.verifyMessageMapper.toDto(isValid);
  }
}
