import {
  HttpStatus,
  HttpCode,
  ValidationPipe,
  Controller,
  Get,
  Param,
  UseInterceptors,
  Post,
  Body,
  Query,
  ClassSerializerInterceptor,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChainService } from './chain.service';
import { ChainException } from './chain.exceptions';
import { TransformInterceptor } from '../../commons/common-response.dto';
import {
  AxonCallParams,
  SetWeightsCallParams,
} from '../../substrate/substrate.call-params.interface';
import { SubnetHyperparamsDto, SubnetHyperparamsResponseDto } from '../dto/subnet-hyperparams.dto';
import { SubnetMetagraphMapper } from '../mappers/subnet-metagraph.mapper';

@ApiTags('chain')
@Controller('chain')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
export class ChainController {
  constructor(
    private readonly chainService: ChainService,
    private readonly subnetMetagraphMapper: SubnetMetagraphMapper,
    private readonly logger: Logger,
  ) {}

  @Get('subnet-hyperparameters/:netuid')
  @ApiOperation({
    summary: 'Get subnet hyperparameters',
    description: 'Retrieves all hyperparameters for a specific subnet identified by netuid',
  })
  @ApiParam({
    name: 'netuid',
    description: 'Network UID identifying the subnet',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Subnet hyperparameters retrieved successfully',
    type: SubnetHyperparamsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid netuid parameter',
  })
  @ApiResponse({
    status: 404,
    description: 'Subnet not found',
  })
  @ApiResponse({
    status: 500,
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
      return this.subnetMetagraphMapper.toDto(subnetMetagraph);
    } catch (error) {
      this.logger.error(`Error fetching subnet metagraph: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('total-networks')
  async getTotalNetworks() {
    try {
      this.logger.log('Fetching total networks');
      const totalNetworks = await this.chainService.getTotalNetworks();
      return totalNetworks;
    } catch (error) {
      this.logger.error(`Error fetching total networks: ${error.message}`);
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('latest-block')
  async getLatestBlock() {
    try {
      this.logger.log('Fetching latest block');
      const block = await this.chainService.getLatestBlock();
      return block;
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
        return { isHotkeyValid };
      } else {
        isHotkeyValid = await this.chainService.checkHotkey(netuid, hotkey);
      }
      return { isHotkeyValid };
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
}
