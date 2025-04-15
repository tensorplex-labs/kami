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
} from './substrate.interface';
import { getKeyringPair } from './substrate.utils';
import path from 'path';

export class Substrate {
  protected readonly logger = new Logger(this.constructor.name);
  protected config: SubstrateConfig;
  protected connectionStatus: ConnectionStatus = { isConnected: false };
  protected keyringPairInfo: KeyringPairInfo | null;
  protected walletName: string;
  protected walletHotkey: string;
  protected walletPath: string;

  private client: ApiPromise | null;

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

  async getCurrentWalletInfo(): Promise<WalletInfo> {
    if (!this.keyringPairInfo) {
      throw new Error('Keyring pair is not set, please call setKeyringPair() first');
    }
    const walletInfo: WalletInfo = {
      coldkey: this.keyringPairInfo.walletColdkey,
      hotkey: this.keyringPairInfo.keyringPair.address,
    };
    return walletInfo;
  }

  async setKeyringPair() {
    this.keyringPairInfo = await getKeyringPair(
      this.walletPath,
      this.walletName,
      this.walletHotkey,
    );
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

  async getNonce(walletAddress: string): Promise<NonceInfo> {
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
  }

  async burnedRegister(netuid: number, hotkey: string): Promise<any> {
    if (!this.client) {
      throw new Error('Client is not connected');
    }
    if (!this.keyringPairInfo) {
      throw new Error('Keyring pair is not set, please call setKeyringPair() first');
    }

    const register = this.client.tx.subtensorModule.burnedRegister(netuid, hotkey);

    const hash = await register.signAndSend(this.keyringPairInfo.keyringPair);

    const response = {
      hash: hash.toHex(),
    };

    return response;
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
  ): Promise<any> {
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

    const hash = await axonTx.signAndSend(this.keyringPairInfo.keyringPair);

    const response = {
      hash: hash.toHex(),
    };

    return response;
  }
}

// async function main() {
//   const substrate = new Substrate({
//     nodeUrl: 'ws://localhost:9944',
//   });
//   await substrate.connect();
//
//   const blockInfo = await substrate.getLatestBlock();
//   console.log('Latest Block:', blockInfo);
//
//   const walletName = 'localnet-miner-1';
//   const walletHotkey = 'miner-2';
//   const walletPath: string = '$HOME/.bittensor/wallets'.replace('$HOME', process.env.HOME || '');
//
//   const walletFilePath = `${walletPath}/${walletName}/hotkeys/${walletHotkey}`;
//   try {
//     await fs.promises.access(walletFilePath, fs.constants.R_OK);
//   } catch (error) {
//     throw new Error(`File not found: ${walletFilePath}`);
//   }
//
//   const fileContent = await fs.promises.readFile(walletFilePath, 'utf-8');
//   const jsonContent = JSON.parse(fileContent);
//   console.log('Wallet JSON:', jsonContent);
//
//   const keyring: Keyring = new Keyring({ type: 'sr25519' });
//   const hotkey: KeyringPair = keyring.addFromMnemonic(jsonContent.secretPhrase);
//
//   const nonce = await substrate.getNonce(hotkey.address);
//   console.log('Nonce:', nonce);
//   // const register = await substrate.burnedRegister(2, hotkey.address, hotkey);
//   // console.log('Register Response:', register);
// }
//
// main().catch((error) => {
//   console.error('Error:', error);
// });
