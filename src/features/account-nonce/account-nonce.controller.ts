import { ApiResponseDto } from '@app/commons/common-response.dto';
import { DomainValidationPipe } from '@app/commons/utils/domain-validation.pipe';
import { SubstrateExceptionFilter } from 'src/core/substrate/exceptions/substrate.exception-filter';

import { Controller, Get, Logger, Param, UseFilters } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { AccountNonceDto, AccountNonceParamsDto } from './account-nonce.dto';
import { AccountNonceParamsInvalidException } from './account-nonce.exception';
import { AccountNonceExceptionFilter } from './account-nonce.exception-filter';
import { AccountNonceMapper } from './account-nonce.mapper';
import { AccountNonceService } from './account-nonce.service';

@Controller('substrate')
@UseFilters(AccountNonceExceptionFilter, SubstrateExceptionFilter)
@ApiTags('substrate')
@ApiExtraModels(ApiResponseDto, AccountNonceDto)
export class AccountNonceController {
  private readonly logger = new Logger(AccountNonceController.name);

  constructor(
    private readonly accountNonceService: AccountNonceService,
    private readonly accountNonceMapper: AccountNonceMapper,
  ) {}

  @Get('account-nonce/:account')
  @ApiOperation({
    summary: 'Get the nonce of an account',
    description: 'Get the nonce of an account',
  })
  @ApiParam({
    name: 'account',
    description: 'SS58 Address',
    type: 'string',
    example: '5E4z3h9yVhmQyCFWNbY9BPpwhx4xFiPwq3eeqmBgVF6KULde',
    required: true,
  })
  @ApiOkResponse({
    description: 'Successfully checked hotkey on metagraph',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(AccountNonceDto) },
          },
        },
      ],
    },
  })
  async getAccountNonce(
    @Param(new DomainValidationPipe(AccountNonceParamsInvalidException))
    param: AccountNonceParamsDto,
  ) {
    const account = param.account;
    this.logger.log(`Getting account nonce for ${account}`);
    const accountNonce = await this.accountNonceService.getAccountNonce(account);
    this.logger.log(`Account nonce: ${accountNonce}`);
    return this.accountNonceMapper.toDto(accountNonce);
  }
}
