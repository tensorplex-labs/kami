import { Injectable, Logger } from '@nestjs/common';
import { Substrate } from '../../substrate/substrate';
import { NeuronInfo, BlockInfo, NonceInfo, WalletInfo } from '../../substrate/substrate.interface';
import { AxonCallParams } from '../../substrate/substrate.call-params.interface';

@Injectable()
export class ChainService {
  private readonly logger = new Logger(ChainService.name);
  private substrate: Substrate;

  constructor() {
    this.substrate = new Substrate(
      {
        nodeUrl: process.env.SUBTENSOR_NETWORK || 'wss://lite.sub.latent.to:443',
        timeout: 30000,
        maxRetries: 3,
      },
      process.env.WALLET_PATH ||
        '$HOME/.bittensor/wallets'.replace('$HOME', process.env.HOME || ''),
      process.env.WALLET_COLDKEY || 'default',
      process.env.WALLET_HOTKEY || 'default',
    );
    this.substrate.connect();
    this.substrate.setKeyringPair();
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
      this.logger.log('Retrieving latest block...');
      const block = await this.substrate.getLatestBlock();
      return block;
    } catch (error) {
      this.logger.error(`Failed to retrieve latest block: ${error.message}`);
    }
  }

  async getNonce(walletAddress: string): Promise<NonceInfo | undefined> {
    try {
      this.logger.log(`Retrieving nonce for wallet: ${walletAddress}...`);
      const nonce = await this.substrate.getNonce(walletAddress);
      return nonce;
    } catch (error) {
      this.logger.error(`Failed to retrieve nonce: ${error.message}`);
    }
  }

  async getCurrentWalletInfo(): Promise<WalletInfo | undefined> {
    try {
      this.logger.log('Retrieving current wallet info...');
      const walletInfo = await this.substrate.getCurrentWalletInfo();
      return walletInfo;
    } catch (error) {
      this.logger.error(`Failed to retrieve wallet info: ${error.message}`);
    }
  }

  async serveAxon(callParams: AxonCallParams): Promise<any> {
    try {
      this.logger.log('Submitting serve axon...');
      const { netuid, ip, port, ipType, protocol, placeholder1, placeholder2, version } =
        callParams;

      const result = await this.substrate.serveAxon(
        netuid,
        version,
        ip,
        port,
        ipType,
        protocol,
        placeholder1,
        placeholder2,
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to submit serve axon: ${error.message}`);
    }
  }
}
