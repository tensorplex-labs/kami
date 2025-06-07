import { Injectable, Logger, UseFilters } from '@nestjs/common';

import Keyring from '@polkadot/keyring';
import { Bytes } from '@polkadot/types';
import {
  RuntimeApiMetadataV15,
  RuntimeApiMethodMetadataV15,
  SiLookupTypeId,
} from '@polkadot/types/interfaces';
import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';

import {
  BlockHashNotFoundException,
  InvalidParameterException,
} from '../exceptions/substrate-client.exception';
import { SubstrateConnectionService } from './substrate-connection.service';

@Injectable()
export class SubstrateClientService {
  private readonly logger = new Logger(SubstrateClientService.name);

  constructor(private readonly substrateConnectionService: SubstrateConnectionService) {}

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
}
