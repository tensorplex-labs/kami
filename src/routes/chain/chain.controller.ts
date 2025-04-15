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
import { TransformInterceptor } from '../../commons/common-response.dto';
import { AxonCallParams } from '../../substrate/substrate.call-params.interface';

@Controller('chain')
@UseInterceptors(TransformInterceptor)
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Get('neurons/:netuid')
  async getNeurons(@Param('netuid') netuid: number) {
    const neurons = await this.chainService.retrieveNeurons(netuid);
    if (!neurons) {
      return {
        statusCode: 400,
        error: 'Neurons not found',
      };
    }
    return neurons;
  }

  @Get('subnetHyperparams/:netuid')
  async getSubnetHyperparams(@Param('netuid') netuid: number) {
    const subnetHyperparams = await this.chainService.getSubnetHyperparameters(netuid);
    if (!subnetHyperparams) {
      return {
        statusCode: 400,
        error: 'Subnet hyperparameters not found',
      };
    }
    return subnetHyperparams;
  }

  @Get('latest-block')
  async getLatestBlock() {
    const block = await this.chainService.getLatestBlock();
    if (!block) {
      return {
        statusCode: 400,
        error: 'Latest block not found',
      };
    }
    return block;
  }

  @Get('nonce/:walletAddress')
  async getNonce(@Param('walletAddress') walletAddress: string) {
    const nonce = await this.chainService.getNonce(walletAddress);
    if (!nonce) {
      return {
        statusCode: 400,
        error: 'Nonce not found',
      };
    }
    return nonce;
  }

  @Get('currentWalletInfo')
  async getCurrentWalletinfo() {
    const walletInfo = await this.chainService.getCurrentWalletInfo();
    if (!walletInfo) {
      return {
        statusCode: 400,
        error: 'Wallet info not found',
      };
    }
    return walletInfo;
  }

  @Post('serveAxon')
  @HttpCode(HttpStatus.CREATED)
  async serveAxon(@Body(ValidationPipe) callParams: AxonCallParams) {
    const result = await this.chainService.serveAxon(callParams);
    if (!result) {
      return {
        statusCode: 400,
        error: 'Axon call failed',
      };
    }
    return result;
  }
}
