import { Injectable, Logger } from '@nestjs/common';
import { Substrate } from '../../substrate/substrate';
import {
  NeuronInfo,
  BlockInfo,
  NonceInfo,
  WalletInfo,
  SubnetHyperparameters,
} from '../../substrate/substrate.interface';
import {
  AxonCallParams,
  SetWeightsCallParams,
} from '../../substrate/substrate.call-params.interface';

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
      process.env.BITTENSOR_DIR || '$HOME/.bittensor'.replace('$HOME', process.env.HOME || ''),
      process.env.WALLET_COLDKEY || '',
      process.env.WALLET_HOTKEY || '',
    );
    this.substrate.connect();

    // if WALLET_COLDKEY and WALLET_HOTKEY are provided, set the keyring pair for signing txn for miner/validator
    if (process.env.WALLET_COLKDEY != '' && process.env.WALLET_HOTKEY != '') {
      this.substrate.setKeyringPair();
    }
  }

  private async ensureConnection() {
    if (!this.substrate.client || !this.substrate.client.isConnected) {
      await this.substrate.connect();
    }
  }

  async retrieveNeurons(netuid: number): Promise<NeuronInfo[] | Error> {
    try {
      await this.ensureConnection();
      const neurons: NeuronInfo[] | Error = await this.substrate.getNeuronsInfo(netuid);
      if (neurons instanceof Error) {
        this.logger.error(`Failed to retrieve neurons: ${neurons.message}`);
        return neurons;
      }

      if (neurons.length > 0) {
        this.logger.log(`Successfully retrieved ${neurons.length} neurons.`);
      } else {
        this.logger.warn(`No neurons found for netuid: ${netuid}`);
      }
      return neurons as NeuronInfo[];
    } catch (error) {
      throw error;
    }
  }

  private async getTotalNetworksInt(): Promise<number | Error> {
    try {
      await this.ensureConnection();
      const totalNetworks = await this.substrate.getTotalNetworks();

      if (totalNetworks instanceof Error) {
        this.logger.error(`Failed to retrieve total networks: ${totalNetworks.message}`);
        return totalNetworks;
      }
      const totalNetworksInt = totalNetworks.totalNetworks;

      return totalNetworksInt;
    } catch (error) {
      throw error;
    }
  }

  async getSubnetHyperparameters(netuid: number): Promise<SubnetHyperparameters | Error> {
    try {
      await this.ensureConnection();
      const totalNetworks = await this.getTotalNetworksInt();
      if (totalNetworks instanceof Error) {
        this.logger.error(`Failed to retrieve total networks: ${totalNetworks.message}`);
        return totalNetworks;
      }

      if (netuid > totalNetworks) {
        throw new Error(`Invalid netuid: ${netuid}. It should be less than ${totalNetworks}`);
      }

      const subnetParams: SubnetHyperparameters | Error =
        await this.substrate.getSubnetHyperparameters(netuid);
      if (subnetParams instanceof Error) {
        return subnetParams;
      }
      return subnetParams;
    } catch (error) {
      throw error;
    }
  }

  async getLatestBlock(): Promise<BlockInfo | Error> {
    try {
      await this.ensureConnection();
      const block = await this.substrate.getLatestBlock();
      return block;
    } catch (error) {
      throw error;
    }
  }

  async getNonce(walletAddress: string): Promise<NonceInfo | Error> {
    try {
      await this.ensureConnection();
      const nonce = await this.substrate.getNonce(walletAddress);
      return nonce;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentWalletInfo(): Promise<WalletInfo | Error> {
    try {
      await this.ensureConnection();
      const walletInfo = await this.substrate.getCurrentWalletInfo();
      return walletInfo;
    } catch (error) {
      throw error;
    }
  }

  async getTotalNetworks(): Promise<any | Error> {
    try {
      await this.ensureConnection();
      const totalNetworks = await this.substrate.getTotalNetworks();
      return totalNetworks;
    } catch (error) {
      throw error;
    }
  }

  async serveAxon(callParams: AxonCallParams): Promise<any | Error> {
    try {
      await this.ensureConnection();
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
      throw error;
    }
  }
  async setWeights(CallParams: SetWeightsCallParams): Promise<any | Error> {
    try {
      await this.ensureConnection();
      const { netuid, dests, weights, versionKey } = CallParams;

      const result = await this.substrate.setWeights(netuid, dests, weights, versionKey);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
