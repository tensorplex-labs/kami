import { error } from 'console';
import {
  AxonCallParamsDto,
  BlockInfoDto,
  SubnetHyperparamsDto,
  SubnetHyperparamsResponseDto,
  SubnetMetagraphDto,
  TotalNetworkResponseDto,
} from 'src/dto';
import { MapperService } from 'src/mapper/mapper-service';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TransformInterceptor } from '../../commons/common-response.dto';
import {
  AxonCallParams,
  CommitRevealWeightsCallParams,
  SetWeightsCallParams,
} from '../../substrate/substrate.call-params.interface';
import { ChainException } from './chain.exceptions';
import { ChainService } from './chain.service';

@ApiTags('chain')
@Controller('chain')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
export class ChainController {
  constructor(
    private readonly chainService: ChainService,
    private readonly mapperService: MapperService,
    private readonly logger: Logger,
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
      this.logger.log(`Fetching subnet hyperparameters for netuid: ${params.netuid}`);
      const subnetHyperparams = await this.chainService.getSubnetHyperparameters(params.netuid);
      return subnetHyperparams as SubnetHyperparamsResponseDto;
    } catch (error) {
      this.logger.error(`Error fetching subnet hyperparameters: ${error.message}`);
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
      if (!netuid) {
        throw new ChainException('netuid is required', HttpStatus.BAD_REQUEST);
      }
      this.logger.log(`Fetching subnet metagraph for netuid: ${netuid}`);
      const subnetMetagraph = await this.chainService.getSubnetMetagraph(netuid);
      if (subnetMetagraph instanceof Error) {
        throw subnetMetagraph;
      }
      if (!subnetMetagraph) {
        throw new ChainException('Subnet metagraph not found', HttpStatus.NOT_FOUND);
      }
      return this.mapperService.toSubnetMetagraphDto(subnetMetagraph);
    } catch (error) {
      this.logger.error(`Error fetching subnet metagraph: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('total-networks')
  @ApiOperation({
    summary: 'Get total networks',
    description: 'Retrieves the total number of subnets (including the root subnet)',
  })
  @ApiOkResponse({
    description: 'Total networks retrieved successfully',
    type: TotalNetworkResponseDto,
  })
  async getTotalNetworks() {
    try {
      this.logger.log('Fetching total networks');
      const totalNetworks = await this.chainService.getTotalNetworks();
      return this.mapperService.toTotalNetworkDto(totalNetworks);
    } catch (error) {
      this.logger.error(`Error fetching total networks: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('latest-block')
  @ApiOperation({
    summary: 'Get latest block',
    description: 'Retrieves the latest block from the blockchain',
  })
  @ApiOkResponse({
    description: 'Latest block retrieved successfully',
    type: BlockInfoDto,
  })
  async getLatestBlock() {
    try {
      // this.logger.log('Fetching latest block');
      const block = await this.chainService.getLatestBlock();
      if (block instanceof Error) {
        throw block;
      }
      return this.mapperService.toBlockInfoDto(block);
    } catch (error) {
      this.logger.error(`Error fetching latest block: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('nonce/:walletAddress')
  async getNonce(@Param('walletAddress') walletAddress: string) {
    try {
      if (!walletAddress) {
        throw new ChainException('walletAddress is required', HttpStatus.BAD_REQUEST);
      }
      this.logger.log(`Fetching nonce for wallet address: ${walletAddress}`);
      const nonce = await this.chainService.getNonce(walletAddress);
      return nonce;
    } catch (error) {
      this.logger.error(`Error fetching nonce: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('current-wallet-info')
  async getCurrentWalletinfo() {
    try {
      this.logger.log('Fetching current wallet info');
      const walletInfo = await this.chainService.getCurrentWalletInfo();
      return walletInfo;
    } catch (error) {
      this.logger.error(`Error fetching current wallet info: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('check-hotkey')
  @ApiQuery({
    name: 'netuid',
    description: 'Subnet UID',
    type: 'number',
    example: 52,
    required: true,
  })
  @ApiQuery({
    name: 'hotkey',
    description: 'Hotkey',
    type: 'string',
    example: '5E4z3h9yVhmQyCFWNbY9BPpwhx4xFiPwq3eeqmBgVF6KULde',
    required: true,
  })
  @ApiQuery({
    name: 'block',
    description: 'Block',
    type: 'number',
    required: false,
  })
  async checkHotkey(
    @Query('netuid') netuid: number,
    @Query('hotkey') hotkey: string,
    @Query('block') block?: number,
  ) {
    try {
      if (!netuid || !hotkey) {
        throw new ChainException('netuid and hotkey are required', HttpStatus.BAD_REQUEST);
      }
      this.logger.log(`Checking hotkey for netuid: ${netuid}, hotkey: ${hotkey}`);

      let isHotkeyValid: boolean | Error = false;
      if (block) {
        isHotkeyValid = await this.chainService.checkHotkey(netuid, hotkey, block);
        if (isHotkeyValid instanceof Error) {
          throw isHotkeyValid;
        }
        return this.mapperService.toCheckHotkeyDto(isHotkeyValid);
      } else {
        isHotkeyValid = await this.chainService.checkHotkey(netuid, hotkey);
        if (isHotkeyValid instanceof Error) {
          throw isHotkeyValid;
        }
        return this.mapperService.toCheckHotkeyDto(isHotkeyValid);
      }
    } catch (error) {
      this.logger.error(`Error checking hotkey: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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
        throw new ChainException('AxonCallParams is required', HttpStatus.BAD_REQUEST);
      }
      this.logger.log(`Serving axon with params: ${JSON.stringify(callParams)}`);
      const result = await this.chainService.serveAxon(callParams);
      return result;
    } catch (error) {
      this.logger.error(`Error serving axon: ${error.message}`);
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
      if (!callParams) {
        throw new ChainException('SetWeightsCallParams is required', HttpStatus.BAD_REQUEST);
      }
      this.logger.log(`Setting weights with params: ${JSON.stringify(callParams)}`);
      const result = await this.chainService.setWeights(callParams);
      return result;
    } catch (error) {
      this.logger.error(`Error setting weights: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('set-commit-reveal-weights')
  @HttpCode(HttpStatus.CREATED)
  async setCommitRevealWeights(@Body(ValidationPipe) callParams: CommitRevealWeightsCallParams) {
    try {
      if (!callParams) {
        throw new ChainException('SetWeightsCallParams is required', HttpStatus.BAD_REQUEST);
      }
      this.logger.log(`Setting weights with params: ${JSON.stringify(callParams)}`);
      const result = await this.chainService.setCommitRevealWeights(callParams);
      return result;
    } catch (error) {
      this.logger.error(`Error setting weights: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
