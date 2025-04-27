import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TransformInterceptor } from '../../commons/common-response.dto';
import {
  AxonCallParams,
  SetWeightsCallParams,
} from '../../substrate/substrate.call-params.interface';
import { SubnetHyperparamsDto, SubnetHyperparamsResponseDto } from '../dto/subnet-hyperparams.dto';
import { SubnetMetagraphDto } from '../dto/subnet-metagraph.dto';
import { SubnetMetagraphMapper } from '../mappers/subnet-metagraph.mapper';
import { ChainException } from './chain.exceptions';
import { ChainService } from './chain.service';

@ApiTags('chain')
@Controller('chain')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
export class ChainController {
  constructor(
    private readonly chainService: ChainService,
    private readonly subnetMetagraphMapper: SubnetMetagraphMapper,
  ) {}

  @Get('subnet-hyperparameters/:netuid')
  @ApiOperation({
    summary: 'Get subnet hyperparameters by subnet netuid',
    description: 'Retrieves all hyperparameters for a specific subnet identified by netuid',
  })
  @ApiParam({
    name: 'netuid',
    description: 'Subnet UID',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiOkResponse({
    description: 'Subnet hyperparameters retrieved successfully',
    type: SubnetHyperparamsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid netuid parameter',
  })
  @ApiNotFoundResponse({
    description: 'Subnet not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during blockchain communication',
  })
  async getSubnetHyperparams(
    @Param() params: SubnetHyperparamsDto,
  ): Promise<SubnetHyperparamsResponseDto> {
    try {
      const subnetHyperparams = await this.chainService.getSubnetHyperparameters(params.netuid);
      return subnetHyperparams as SubnetHyperparamsResponseDto;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('subnet-metagraph/:netuid')
  @ApiOperation({
    summary: 'Get subnet metagraph by subnet netuid',
    description: 'Retrieves the metagraph for a specific subnet',
  })
  @ApiParam({
    name: 'netuid',
    description: 'Subnet UID',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiOkResponse({
    description: 'Subnet metagraph retrieved successfully',
    type: SubnetMetagraphDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid netuid parameter',
  })
  @ApiNotFoundResponse({
    description: 'Subnet not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during blockchain communication',
  })
  async getSubnetMetagraph(@Param('netuid') netuid: number) {
    try {
      const subnetMetagraph = await this.chainService.getSubnetMetagraph(netuid);
      if (subnetMetagraph instanceof Error) {
        throw subnetMetagraph;
      }
      return this.subnetMetagraphMapper.toDto(subnetMetagraph);
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('total-networks')
  async getTotalNetworks() {
    try {
      const totalNetworks = await this.chainService.getTotalNetworks();
      return totalNetworks;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('latest-block')
  async getLatestBlock() {
    try {
      const block = await this.chainService.getLatestBlock();
      return block;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('nonce/:walletAddress')
  async getNonce(@Param('walletAddress') walletAddress: string) {
    try {
      const nonce = await this.chainService.getNonce(walletAddress);
      return nonce;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('current-wallet-info')
  async getCurrentWalletinfo() {
    try {
      const walletInfo = await this.chainService.getCurrentWalletInfo();
      return walletInfo;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('check-hotkey')
  async checkHotkey(
    @Query('netuid') netuid: number,
    @Query('hotkey') hotkey: string,
    @Query('block') block?: number,
  ) {
    try {
      if (!netuid || !hotkey) {
        throw new ChainException('netuid and hotkey are required', HttpStatus.BAD_REQUEST);
      }
      let isHotkeyValid: boolean | Error = false;
      if (block) {
        isHotkeyValid = await this.chainService.checkHotkey(netuid, hotkey, block);
        return { isHotkeyValid };
      } else {
        isHotkeyValid = await this.chainService.checkHotkey(netuid, hotkey);
      }
      return { isHotkeyValid };
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('serve-axon')
  @HttpCode(HttpStatus.CREATED)
  async serveAxon(@Body(ValidationPipe) callParams: AxonCallParams) {
    try {
      const result = await this.chainService.serveAxon(callParams);
      return result;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('set-weights')
  @HttpCode(HttpStatus.CREATED)
  async setWeights(@Body(ValidationPipe) callParams: SetWeightsCallParams) {
    try {
      const result = await this.chainService.setWeights(callParams);
      return result;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
