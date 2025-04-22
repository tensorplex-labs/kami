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
} from '@nestjs/common';
import { ChainService } from './chain.service';
import { ChainException } from './chain.exceptions';
import { TransformInterceptor } from '../../commons/common-response.dto';
import {
  AxonCallParams,
  SetWeightsCallParams,
} from '../../substrate/substrate.call-params.interface';

@Controller('chain') 
@UseInterceptors(TransformInterceptor)
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Get('neurons/:netuid')
  async getNeurons(@Param('netuid') netuid: number) {
    try {
      const neurons = await this.chainService.retrieveNeurons(netuid);
      return neurons;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('subnet-hyperparameters/:netuid')
  async getSubnetHyperparams(@Param('netuid') netuid: number) {
    try {
      const subnetHyperparams = await this.chainService.getSubnetHyperparameters(netuid);
      return subnetHyperparams;
    } catch (error) {
      if (error instanceof ChainException) {
        throw error;
      }
      throw new ChainException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('subnet-metagraph/:netuid')
  async getSubnetMetagraph(@Param('netuid') netuid: number) {
    try {
      const subnetMetagraph = await this.chainService.getSubnetMetagraph(netuid);
      return subnetMetagraph;
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
