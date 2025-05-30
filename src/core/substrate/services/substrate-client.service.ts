import { Injectable, Logger } from '@nestjs/common';

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
  QueryFailedException,
  SubtensorErrorCode,
  SubtensorException,
} from '../exceptions/substrate-client.exception';
import { ClientNotInitializedException } from '../exceptions/substrate-connection.exception';
import { SubstrateConnectionService } from './substrate-connection.service';

@Injectable()
export class SubstrateClientService {
  private readonly logger = new Logger(SubstrateClientService.name);

  constructor(private readonly substrateConnectionService: SubstrateConnectionService) {}

  /**
   * Handles Subtensor-specific errors from blockchain responses
   */
  private handleSubtensorError(error: any): never {
    if (error?.data && typeof error.data == 'string') {
      const match = error.data.match(/Custom error: (\d+)/);
      if (match && match[1]) {
        const errorCode = parseInt(match[1], 10);
        throw new SubtensorException(errorCode as SubtensorErrorCode);
      }
    }
    if (error?.message && typeof error.message == 'string') {
      if (error.message.includes(`Priority is too low`)) {
        throw new SubtensorException(
          SubtensorErrorCode.TRANSACTION_PRIORITY_TOO_LOW,
          error.message,
          error.stack,
        );
      }
    }
    // If we couldn't parse a specific error, throw a generic exception with original error details
    throw new SubtensorException(
      SubtensorErrorCode.BAD_REQUEST,
      error.message || 'Unknown substrate error',
      error.stack,
    );
  }

  async queryRuntimeApi(runtimeDefName: string, methodName: string, params: any): Promise<any> {
    try {
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
      try {
        const result: any = client.createType(typeDef, resultBytes);
        return result;
      } catch (error) {
        throw new QueryFailedException(error.message, error.stack);
      }
    } catch (error) {
      this.logger.error(`Failed to query runtime API: ${error.message}`, error.stack);

      if (
        error instanceof SubtensorException ||
        error instanceof InvalidParameterException ||
        error instanceof QueryFailedException
      ) {
        throw error;
      }

      this.handleSubtensorError(error);
    }
  }

  async availableRuntimeApis() {
    try {
      const client = await this.substrateConnectionService.getClient();
      const response = client.runtimeMetadata.asV15.apis;
      return response.toJSON();
    } catch (error) {
      this.logger.error(`Failed to retrieve available runtime APIs: ${error.message}`, error.stack);

      if (error instanceof SubtensorException || error instanceof ClientNotInitializedException) {
        throw error;
      }

      throw new QueryFailedException(
        `Failed to retrieve available runtime APIs: ${error.message}`,
        error.stack,
      );
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      const keyringPairInfo = await this.substrateConnectionService.getKeyringPairInfo();

      const messageU8a = stringToU8a(message);

      const signature = keyringPairInfo.keyringPair.sign(messageU8a);
      const result = u8aToHex(signature);

      return result;
    } catch (error) {
      this.logger.error(`Failed to sign message: ${error.message}`, error.stack);

      this.handleSubtensorError(error);
    }
  }

  async verifyMessage(message: string, signature: string, signeeAddress: string): Promise<boolean> {
    try {
      const keyring = new Keyring({ type: 'sr25519' });

      const publicKey = keyring.decodeAddress(signeeAddress);

      const signatureU8a = hexToU8a(signature);
      const isValid = signatureVerify(message, signatureU8a, publicKey);

      return isValid.isValid;
    } catch (error) {
      this.logger.error(`Failed to verify signature: ${error.message}`, error.stack);

      this.handleSubtensorError(error);
    }
  }

  async signAndSendTransaction(tx: any): Promise<any> {
    try {
      // Get the keyring pair from the connection service
      const keyringPairInfo = await this.substrateConnectionService.getKeyringPairInfo();

      // This is the key part - we need to use the keyringPair property
      const result = await tx.signAndSend(keyringPairInfo.keyringPair);
      return result.toJSON();
    } catch (error) {
      this.logger.error(`Failed to sign and send transaction: ${error.message}`, error.stack);

      this.handleSubtensorError(error);
    }
  }

  async getBlockHash(block: number): Promise<string> {
    try {
      const client = await this.substrateConnectionService.getClient();
      const blockHash = await client.query.system.blockHash(block);

      if (!blockHash) {
        throw new BlockHashNotFoundException(`Block hash: ${block}`);
      }

      const blockHashHex = blockHash.toHex();
      return blockHashHex;
    } catch (error) {
      this.logger.error(`Failed to retrieve block hash: ${error.message}`, error.stack);

      if (error instanceof BlockHashNotFoundException) {
        throw error;
      }

      this.handleSubtensorError(error);
    }
  }
}
