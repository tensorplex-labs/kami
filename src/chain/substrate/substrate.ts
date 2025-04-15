import { Logger } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  RuntimeApiMetadataV15,
  RuntimeApiMethodMetadataV15,
  SiLookupTypeId,
} from '@polkadot/types/interfaces';
import { Bytes } from '@polkadot/types';
import { SubstrateConfig, ConnectionStatus, NeuronInfo, BlockInfo } from './substrate.interface';

export class Substrate {
  protected readonly logger = new Logger(this.constructor.name);
  protected config: SubstrateConfig;
  protected client: ApiPromise | null;
  protected connectionStatus: ConnectionStatus = { isConnected: false };

  constructor(config: SubstrateConfig) {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      ...config,
    };
    this.client = null;
  }

  async connect(): Promise<ConnectionStatus> {
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
    if (this.client) {
      this.client.disconnect();
    }
    this.connectionStatus.isConnected = false;
    return this.connect();
  }

  async queryRuntimeApi(method: string, params: string): Promise<any> {
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
      this.logger.error(`Failed to decode result: ${error.message}`);
      throw new Error(`Failed to decode result: ${error.message}`);
    }
  }

  async getNeuronsInfo(netuid: number): Promise<NeuronInfo[]> {
    if (!this.client) {
      throw new Error('Client is not connected');
    }

    const runtimeCall: string = 'NeuronInfoRuntimeApi_get_neurons';
    const encodedParams: Uint8Array = this.client.registry.createType('u16', netuid).toU8a();
    const hexParams: string = Buffer.from(encodedParams).toString('hex');

    const response = await this.queryRuntimeApi(runtimeCall, '0x' + hexParams);

    const neuronInfo: NeuronInfo[] = response.toJSON();

    return neuronInfo as NeuronInfo[];
  }

  async getLatestBlock(): Promise<BlockInfo> {
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
  }
}

// const substrate = new Substrate({
//   nodeUrl: 'wss://subtensor.tensorplex.ai',
//   timeout: 30000,
//   maxRetries: 3,
// });
//
// (async () => {
//   try {
//     await substrate.connect();
//
//     // const neuron = await substrate.getNeuronInfo(52);
//
//     while (true) {
//       const block = await substrate.getLatestBlock();
//       console.log('Latest Block:', block);
//       await new Promise((resolve) => setTimeout(resolve, 12000));
//     }
//
//   } catch (error) {
//     console.error('Error connecting to Substrate:', error);
//   }
// })();
