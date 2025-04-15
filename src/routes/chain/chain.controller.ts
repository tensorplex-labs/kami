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
    return neurons;
  }

  @Get('latest-block')
  async getLatestBlock() {
    const block = await this.chainService.getLatestBlock();
    return block;
  }

  @Get('nonce/:walletAddress')
  async getNonce(@Param('walletAddress') walletAddress: string) {
    const nonce = await this.chainService.getNonce(walletAddress);
    return nonce;
  }

  @Get('currentWalletInfo')
  async getCurrentWalletinfo() {
    const walletInfo = await this.chainService.getCurrentWalletInfo();
    return walletInfo;
  }

  @Post('serveAxon')
  @HttpCode(HttpStatus.CREATED)
  async serveAxon(@Body(ValidationPipe) callParams: AxonCallParams) {
    console.log('callParams @ controller:', callParams);
    const result = await this.chainService.serveAxon(callParams);
    return result;
  }
}
