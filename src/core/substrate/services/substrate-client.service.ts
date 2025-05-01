import { Injectable } from '@nestjs/common';

import { Bytes } from '@polkadot/types';
import {
  RuntimeApiMetadataV15,
  RuntimeApiMethodMetadataV15,
  SiLookupTypeId,
} from '@polkadot/types/interfaces';

import { SubstrateConnectionService } from './substrate-connection.service';

@Injectable()
export class SubstrateClientService {
  constructor(private readonly substrateConnectionService: SubstrateConnectionService) {}

  async queryRuntimeApi(
    runtimeDefName: string,
    methodName: string,
    params: any,
  ): Promise<any | Error> {
    try {
      const client = await this.substrateConnectionService.getClient();
      if (client instanceof Error) {
        throw client;
      }

      const runtimeDef: RuntimeApiMetadataV15 | undefined = client.runtimeMetadata.asV15.apis.find(
        (api: any) => api.name.toString() === runtimeDefName,
      );
      if (!runtimeDef) {
        throw new Error(`API ${runtimeDefName} not found in runtime metadata`);
      }

      const callDef: RuntimeApiMethodMetadataV15 | undefined = runtimeDef.methods.find(
        (method: any) => method.name.toString() === methodName,
      );
      if (!callDef) {
        throw new Error(`Method ${methodName} not found in API ${runtimeDefName}`);
      }

      // const paramTypes = callDef.inputs.map((input: any) => input.type);
      const hexParams: string = Buffer.from(params).toString('hex');

      const outputType: SiLookupTypeId = callDef.output;
      if (!outputType) {
        throw new Error(`Output type not found for method ${methodName}`);
      }

      const resultBytes: Bytes = await client.rpc.state.call(
        [runtimeDefName, methodName].join('_'),
        '0x' + hexParams,
      );

      const typeDef: string = client.registry.createLookupType(outputType);
      try {
        const result: any = client.createType(typeDef, resultBytes);
        return result;
      } catch (error) {
        throw new Error(`Failed to decode result: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Failed to query runtime API: ${error.message}`);
    }
  }

  async availableRuntimeApis() {
    try {
      const client = await this.substrateConnectionService.getClient();
      if (client instanceof Error) {
        throw client;
      }

      const response = client.runtimeMetadata.asV15.apis;

      return response.toJSON();
    } catch (error) {
      throw new Error(`Failed to retrieve available runtime APIs: ${error.message}`);
    }
  }

  async signAndSendTransaction(tx: any): Promise<any> {
    try {
      // Get the keyring pair from the connection service
      const keyringPairInfo = await this.substrateConnectionService.getKeyringPairInfo();

      if (!keyringPairInfo) {
        throw new Error('Failed to get keyring pair information');
      }

      // This is the key part - we need to use the keyringPair property
      const result = await tx.signAndSend(keyringPairInfo.keyringPair);
      return result.toJSON();
    } catch (error) {
      throw new Error(`Failed to sign and send transaction: ${error.message}`);
    }
  }

  async getBlockHash(block: number): Promise<string | Error> {
    try {
      const client = await this.substrateConnectionService.getClient();
      if (client instanceof Error) {
        throw client;
      }
      const blockHash = await client.query.system.blockHash(block);
      if (!blockHash) {
        throw new Error(`Block hash not found for block number ${block}`);
      }
      const blockHashHex = blockHash.toHex();
      return blockHashHex;
    } catch (error) {
      throw new Error(`Failed to retrieve block hash: ${error.message}`);
    }
  }
}
