import { BlockInfo } from 'src/features/latest-block/latest-block.interface';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

import Keyring from '@polkadot/keyring';
import { Bytes } from '@polkadot/types';
import {
  RuntimeApiMetadataV15,
  RuntimeApiMethodMetadataV15,
  SiLookupTypeId,
} from '@polkadot/types/interfaces';
import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';

import { SubstrateRuntimeSpecVersionDto } from '../dto/substrate-runtime-spec-version.dto';
import {
  BlockHashNotFoundException,
  InvalidParameterException,
  SubstrateRuntimeVersionNotAvailableException,
} from '../exceptions/substrate-client.exception';
import { SubstrateConnectionService } from './substrate-connection.service';

@Injectable()
export class SubstrateClientService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SubstrateClientService.name);
  private runtimeSpecVersion: SubstrateRuntimeSpecVersionDto;

  constructor(private readonly substrateConnectionService: SubstrateConnectionService) {}

  async onApplicationBootstrap() {
    await this.substrateConnectionService.getClient();
    this.runtimeSpecVersion = await this.getRuntimeSpecVersion();
    this.logger.log(
      `Runtime spec version during Kami initialization: ${this.runtimeSpecVersion.specVersion}`,
    );
  }

  async queryRuntimeApi(runtimeDefName: string, methodName: string, params: any): Promise<any> {
    const client = await this.substrateConnectionService.getClient();

    const runtimeDef: RuntimeApiMetadataV15 | undefined = client.runtimeMetadata.asV15.apis.find(
      (api: any) => api.name.toString() === runtimeDefName,
    );
    if (!runtimeDef) {
      throw new InvalidParameterException(`API ${runtimeDefName} not found in runtime metadata`);
    }

    const callDef: RuntimeApiMethodMetadataV15 | undefined = runtimeDef.methods.find(
      (method: any) => method.name.toString() === methodName,
    );
    if (!callDef) {
      throw new InvalidParameterException(
        `Method ${methodName} not found in API ${runtimeDefName}`,
      );
    }

    const hexParams: string = Buffer.from(params).toString('hex');

    const outputType: SiLookupTypeId = callDef.output;
    if (!outputType) {
      throw new InvalidParameterException(
        `Output type not found for method ${methodName} under ${runtimeDefName}`,
      );
    }

    const resultBytes: Bytes = await client.rpc.state.call(
      [runtimeDefName, methodName].join('_'),
      '0x' + hexParams,
    );

    const typeDef: string = client.registry.createLookupType(outputType);

    const result: any = client.createType(typeDef, resultBytes);
    return result;
  }

  async availableRuntimeApis() {
    const client = await this.substrateConnectionService.getClient();
    const response = client.runtimeMetadata.asV15.apis;
    return response.toJSON();
  }

  async signMessage(message: string): Promise<string> {
    const keyringPairInfo = await this.substrateConnectionService.getKeyringPairInfo();

    const messageU8a = stringToU8a(message);

    const signature = keyringPairInfo.keyringPair.sign(messageU8a);
    const result = u8aToHex(signature);

    return result;
  }

  async verifyMessage(message: string, signature: string, signeeAddress: string): Promise<boolean> {
    const keyring = new Keyring({ type: 'sr25519' });

    const publicKey = keyring.decodeAddress(signeeAddress);

    const signatureU8a = hexToU8a(signature);
    const isValid = signatureVerify(message, signatureU8a, publicKey);

    return isValid.isValid;
  }

  async signAndSendTransaction(tx: any): Promise<any> {
    const keyringPairInfo = await this.substrateConnectionService.getKeyringPairInfo();

    const result = await tx.signAndSend(keyringPairInfo.keyringPair);
    return result.toJSON();
  }

  async getBlockHash(block: number): Promise<string> {
    const client = await this.substrateConnectionService.getClient();
    const blockHash = await client.query.system.blockHash(block);

    if (!blockHash) {
      throw new BlockHashNotFoundException(`Block hash: ${block}`);
    }

    const blockHashHex = blockHash.toHex();
    return blockHashHex;
  }

  async subscribeToFinalizedBlocks(callback: (blockInfo: BlockInfo) => void): Promise<() => void> {
    const client = await this.substrateConnectionService.getClient();

    const unsubscribe = await client.rpc.chain.subscribeFinalizedHeads(header => {
      const blockInfo: BlockInfo = {
        blockNumber: header.number.toNumber(),
        parentHash: header.parentHash.toHex(),
        stateRoot: header.stateRoot.toHex(),
        extrinsicsRoot: header.extrinsicsRoot.toHex(),
      };
      callback(blockInfo);
    });

    return unsubscribe;
  }

  async subscribeToNewBlocks(callback: (blockInfo: BlockInfo) => void): Promise<() => void> {
    const client = await this.substrateConnectionService.getClient();

    const unsubscribe = await client.rpc.chain.subscribeNewHeads(header => {
      const blockInfo: BlockInfo = {
        blockNumber: header.number.toNumber(),
        parentHash: header.parentHash.toHex(),
        stateRoot: header.stateRoot.toHex(),
        extrinsicsRoot: header.extrinsicsRoot.toHex(),
      };
      callback(blockInfo);
    });

    return unsubscribe;
  }

  async subscribeToBlocks(
    finalised: boolean,
    callback: (blockInfo: BlockInfo) => void,
  ): Promise<() => void> {
    if (finalised) {
      return this.subscribeToFinalizedBlocks(callback);
    } else {
      return this.subscribeToNewBlocks(callback);
    }
  }

  async getRuntimeSpecVersion(): Promise<SubstrateRuntimeSpecVersionDto> {
    const client = await this.substrateConnectionService.getClient();

    const runtimeVersion = await client.rpc.state.getRuntimeVersion();

    if (!runtimeVersion) {
      throw new SubstrateRuntimeVersionNotAvailableException();
    }

    this.logger.log(`Current runtime spec version: ${runtimeVersion.specVersion}`);

    const runtimeSpecVersion = new SubstrateRuntimeSpecVersionDto({
      specVersion: runtimeVersion.specVersion.toNumber(),
    });

    if (this.runtimeSpecVersion) {
      this.logger.log(
        `Runtime spec version during Kami initialization: ${this.runtimeSpecVersion.specVersion}`,
      );
      this.logger.log(
        `Is Runtime spec version different from Kami initialization? ${runtimeSpecVersion.specVersion !== this.runtimeSpecVersion.specVersion}`,
      );
    }

    return runtimeSpecVersion;
  }
}
