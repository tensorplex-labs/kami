import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ChainService } from './chain.service';
import { TransformInterceptor } from '../commons/common-response.dto';

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
}
