import { ApiResponseDto } from '@app/commons/common-response.dto';
import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';
import {
  AccountNonceException,
  AccountNonceFetchException,
} from 'src/features/account-nonce/account-nonce.exception';

import { Controller, Get, HttpStatus, Logger, Param, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { AccountNonceDto } from './account-nonce.dto';
import { AccountNonceMapper } from './account-nonce.mapper';
import { AccountNonceService } from './account-nonce.service';

@Controller('substrate')
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
  async getAccountNonce(@Param('account') account: string) {
    try {
      this.logger.log(`Getting account nonce`);

      const accountNonce = await this.accountNonceService.getAccountNonce(account);

      this.logger.log(`Account nonce: ${accountNonce}`);
      return this.accountNonceMapper.toDto(accountNonce);
    } catch (error) {
      this.logger.error(`Error getting account nonce: ${error.message}`);
      if (error instanceof AccountNonceException) {
        throw error;
      }
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new AccountNonceException(
        HttpStatus.BAD_REQUEST,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
