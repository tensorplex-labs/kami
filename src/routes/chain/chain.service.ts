import { Injectable, Logger } from '@nestjs/common';
import { Substrate } from '../../substrate/substrate';
import { NeuronInfo, BlockInfo } from '../../substrate/substrate.interface';

@Injectable()
export class ChainService {
  private readonly logger = new Logger(ChainService.name);
  private substrate: Substrate;

  constructor() {
    this.substrate = new Substrate({
      nodeUrl: 'wss://subtensor.tensorplex.ai',
      timeout: 30000,
      maxRetries: 3,
    });
    this.substrate.connect();
  }

  async retrieveNeurons(netuid: number): Promise<NeuronInfo[] | undefined> {
    try {
      const neurons: NeuronInfo[] = await this.substrate.getNeuronsInfo(netuid);

      if (neurons.length > 0) {
        this.logger.log(`Successfully retrieved ${neurons.length} neurons.`);
      } else {
        this.logger.warn(`No neurons found for netuid: ${netuid}`);
      }
      return neurons as NeuronInfo[];
    } catch (error) {
      this.logger.error(`Failed to retrieve neurons: ${error.message}`);
    }
  }

  async getLatestBlock(): Promise<BlockInfo | undefined> {
    try {
      const block = await this.substrate.getLatestBlock();
      return block;
    } catch (error) {
      this.logger.error(`Failed to retrieve latest block: ${error.message}`);
    }
  }
}
