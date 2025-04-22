import { Logger } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  RuntimeApiMetadataV15,
  RuntimeApiMethodMetadataV15,
  SiLookupTypeId,
} from '@polkadot/types/interfaces';
import { Bytes } from '@polkadot/types';
import {
  SubstrateConfig,
  ConnectionStatus,
  NeuronInfo,
  NonceInfo,
  BlockInfo,
  KeyringPairInfo,
  WalletInfo,
  ExtrinsicResponse, // TODO: Refactor this to a more specific type for those submitting extrinsics.
  SubnetHyperparameters,
  TotalNetworksInfo,
  SubnetMetagraph,
} from './substrate.interface';
import { SubtensorException, SubtensorErrorCode } from './substrate.exceptions';
import { getKeyringPair } from './substrate.utils';
import * as path from 'path';

export class Substrate {
  protected readonly logger = new Logger(this.constructor.name);
  protected config: SubstrateConfig;
  protected connectionStatus: ConnectionStatus = { isConnected: false };
  protected keyringPairInfo: KeyringPairInfo | null;
  protected walletName: string | undefined;
  protected walletHotkey: string | undefined;
  protected walletPath: string | undefined;

  public client: ApiPromise | null;

  constructor(
    config: SubstrateConfig,
    walletPath?: string,
    walletName?: string,
    walletHotkey?: string,
  ) {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      ...config,
    };
    this.client = null;
    this.keyringPairInfo = null;
    this.walletName = walletName || 'default';
    this.walletHotkey = walletHotkey || 'default';
    this.walletPath = walletPath || path.join(process.env.HOME || '', '.bittensor/wallets');
  }

  private handleSubtensorError(error: any): Error {
    if (error?.data && typeof error.data == 'string') {
      const match = error.data.match(/Custom error: (\d+)/);
      if (match && match[1]) {
      }
      const errorCode = parseInt(match[1], 10);
      throw new SubtensorException(errorCode as SubtensorErrorCode);
    } else {
      throw error;
    }
  }

  async getCurrentWalletInfo(): Promise<WalletInfo | Error> {
    try {
      if (!this.keyringPairInfo) {
        throw new Error('Keyring pair is not set, please call setKeyringPair() first');
      }
      const walletInfo: WalletInfo = {
        coldkey: this.keyringPairInfo.walletColdkey,
        hotkey: this.keyringPairInfo.keyringPair.address,
      };
      return walletInfo;
    } catch (error) {
      this.logger.error(`Failed to get current wallet info: ${error.message}`);
      throw new Error(`Failed to get current wallet info: ${error.message}`);
    }
  }

  async setKeyringPair() {
    try {
      this.logger.log(`Setting keyring pair for wallet: ${this.walletName}`);
      if (!this.walletPath) {
        throw new Error('Wallet path is not set');
      }
      const correctedWalletPath = this.walletPath.replace('$HOME', process.env.HOME || '');
      this.keyringPairInfo = await getKeyringPair(
        correctedWalletPath,
        this.walletName,
        this.walletHotkey,
      );
    } catch (error) {
      this.logger.error(`Failed to set keyring pair: ${error.message}`);
      throw new Error(`Failed to set keyring pair: ${error.message}`);
    }
  }

  async connect(): Promise<ConnectionStatus | Error> {
    try {
      this.logger.log(`Connecting to ${this.config.nodeUrl}...`);

      await new Promise((resolve) => setTimeout(resolve, 500));
      this.client = new ApiPromise({ provider: new WsProvider(this.config.nodeUrl) });

      await this.client.isReady;
      this.logger.log('Connected to Substrate node!');

      this.connectionStatus = {
        isConnected: true,
        lastConnected: new Date(),
        chainId: 'Bittensor Mainnet',
      };
      return this.connectionStatus;
    } catch (error) {
      this.logger.error(`Failed to connect: ${error.message}`);
      this.connectionStatus = { isConnected: false };
      throw error;
    }
  }

  async reconnect() {
    try {
      if (this.client) {
        this.client.disconnect();
      }
      this.connectionStatus.isConnected = false;
      return this.connect();
    } catch (error) {
      this.logger.error(`Failed to reconnect: ${error.message}`);
      throw error;
    }
  }

  async queryRuntimeApi(method: string, params: string, block?: number): Promise<any | Error> {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }

      const split: number = method.indexOf('_');
      const apiName: string = method.slice(0, split);
      const methodName: string = method.slice(split + 1);

      const runtimeDef: RuntimeApiMetadataV15 | undefined =
        this.client.runtimeMetadata.asV15.apis.find((api: any) => api.name.toString() === apiName);
      if (!runtimeDef) {
        throw new Error(`API ${apiName} not found in runtime metadata`);
      }

      const callDef: RuntimeApiMethodMetadataV15 | undefined = runtimeDef.methods.find(
        (method: any) => method.name.toString() === methodName,
      );
      if (!callDef) {
        throw new Error(`Method ${methodName} not found in API ${apiName}`);
      }

      const outputType: SiLookupTypeId = callDef.output;
      if (!outputType) {
        throw new Error(`Output type not found for method ${methodName}`);
      }

      // const paramTypes = callDef.inputs.map((input: any) => input.type);

      const resultBytes: Bytes = await this.client.rpc.state.call(method, params);

      const typeDef: string = this.client.registry.createLookupType(outputType);
      try {
        const result: any = this.client.createType(typeDef, resultBytes);
        return result;
      } catch (error) {
        throw new Error(`Failed to decode result: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Failed to query runtime API: ${error.message}`);
    }
  }

  async getSubnetHyperparameters(netuid: number): Promise<SubnetHyperparameters | Error> {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }
      const runtimeCall: string = 'SubnetInfoRuntimeApi_get_subnet_hyperparams';
      const encodedParams: Uint8Array = this.client.registry.createType('u16', netuid).toU8a();
      const hexParams: string = Buffer.from(encodedParams).toString('hex');

      const response = await this.queryRuntimeApi(runtimeCall, '0x' + hexParams);

      const subnetParams: SubnetHyperparameters = response.toJSON();

      return subnetParams;
    } catch (error) {
      throw new Error(`Failed to retrieve subnet hyperparameters: ${error.message}`);
    }
  }

  async getSubnetMetagraph(netuid: number): Promise<SubnetMetagraph | Error> {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }

      const runtimeCall: string = 'SubnetInfoRuntimeApi_get_metagraph';
      const encodedParams: Uint8Array = this.client.registry.createType('u16', netuid).toU8a();
      const hexParams: string = Buffer.from(encodedParams).toString('hex');

      const response = await this.queryRuntimeApi(runtimeCall, '0x' + hexParams);

      const subnetParams: SubnetMetagraph = response.toJSON();

      return subnetParams;
    } catch (error) {
      this.logger.error(`Failed to retrieve subnet metagraph: ${error.message}`);
      throw new Error(`Failed to retrieve subnet metagraph: ${error.message}`);
    }
  }

  async getNeuronsInfo(netuid: number): Promise<NeuronInfo[] | Error> {
    try {
      this.logger.log(`Retrieving neurons for netuid: ${netuid}...`);
      if (!this.client) {
        throw new Error('Client is not connected');
      }

      const runtimeCall: string = 'NeuronInfoRuntimeApi_get_neurons';
      const encodedParams: Uint8Array = this.client.registry.createType('u16', netuid).toU8a();
      const hexParams: string = Buffer.from(encodedParams).toString('hex');

      const response = await this.queryRuntimeApi(runtimeCall, '0x' + hexParams);

      const neuronInfo: NeuronInfo[] = response.toJSON();

      return neuronInfo;
    } catch (error) {
      throw new Error(`Failed to retrieve neurons: ${error.message}`);
    }
  }

  async getLatestBlock(): Promise<BlockInfo | Error> {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }
      const blockHead = await this.client.rpc.chain.getHeader();
      const result: BlockInfo = {
        blockNumber: blockHead.number.toNumber(),
        parentHash: blockHead.parentHash.toHex(),
        stateRoot: blockHead.stateRoot.toHex(),
        extrinsicsRoot: blockHead.extrinsicsRoot.toHex(),
      };
      return result;
    } catch (error) {
      throw new Error(`Failed to retrieve latest block: ${error.message}`);
    }
  }

  async getNonce(walletAddress: string): Promise<NonceInfo> {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }
      const response = await this.client.query.system.account(walletAddress);

      if (response == null) {
        throw new Error(`Account ${walletAddress} not found`);
      }

      const accountData = response.toJSON() as {
        nonce: number;
        consumers: number;
        providers: number;
        sufficients: number;
        data: {
          free: number;
          reserved: number;
          frozen: number;
          flags: string;
        };
      };

      const nonceInfo: NonceInfo = {
        nonce: accountData.nonce,
        consumers: accountData.consumers,
        providers: accountData.providers,
        sufficients: accountData.sufficients,
        data: {
          free: accountData.data.free,
          reserved: accountData.data.reserved,
          frozen: accountData.data.frozen,
          flags: accountData.data.flags,
        },
      };
      return nonceInfo;
    } catch (error) {
      throw new Error(`Failed to retrieve nonce: ${error.message}`);
    }
  }

  async getTotalNetworks(): Promise<TotalNetworksInfo | Error> {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }

      const response = await this.client.query.subtensorModule.totalNetworks();
      if (response == null) {
        throw new Error('Failed to retrieve total subnets');
      }

      const totalNetworks: TotalNetworksInfo = {
        totalNetworks: +response.toString(),
      };

      return totalNetworks;
    } catch (error) {
      throw new Error(`Failed to retrieve total subnets: ${error.message}`);
    }
  }

  async burnedRegister(netuid: number): Promise<any | Error> {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }
      if (!this.keyringPairInfo) {
        throw new Error('Keyring pair is not set, please call setKeyringPair() first');
      }

      const unsub = await this.client.tx.subtensorModule
        .burnedRegister(netuid, this.walletHotkey)
        .signAndSend(this.keyringPairInfo.keyringPair, (result) => {
          console.log(`Current status is: ${result.status}`);
          console.log(`Result: ${result.toHuman()}`);
          if (result.status.isInBlock) {
          } else if (result.status.isFinalized) {
            this.logger.log(`Transaction finalized in block: ${result.status.asFinalized}`);
            unsub();
          } else if (result.isError) {
            this.logger.error(`Error: ${result.toHuman()}`);
            unsub();
            this.handleSubtensorError(result);
          }
        });

      return unsub;
    } catch (error) {
      this.handleSubtensorError(error);
    }
  }

  async serveAxon(
    netuid: number,
    version: number,
    ip: number,
    port: number,
    ipType: number,
    protocol: number,
    placeholder1: number,
    placeholder2: number,
  ): Promise<any | Error> {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }
      if (!this.keyringPairInfo) {
        throw new Error('Keyring pair is not set, please call setKeyringPair() first');
      }

      const axonTx = this.client.tx.subtensorModule.serveAxon(
        netuid,
        version,
        ip,
        port,
        ipType,
        protocol,
        placeholder1,
        placeholder2,
      );

      const result = await axonTx.signAndSend(this.keyringPairInfo.keyringPair);
      return result.toJSON();
    } catch (error) {
      this.handleSubtensorError(error);
    }
  }

  async setWeights(netuid: number, dests: number[], weights: number[], versionKey: number) {
    try {
      if (!this.client) {
        throw new Error('Client is not connected');
      }

      if (!this.keyringPairInfo) {
        throw new Error('Keyring pair is not set, please call setKeyringPair() first');
      }

      const setWeightsTx = this.client.tx.subtensorModule.setWeights(
        netuid,
        dests,
        weights,
        versionKey,
      );

      const result = await setWeightsTx.signAndSend(this.keyringPairInfo.keyringPair);

      return result.toJSON();
    } catch (error) {
      this.handleSubtensorError(error);
    }
  }
}
