import { Injectable, Logger } from '@nestjs/common';

import { Bytes } from '@polkadot/types';
import {
  RuntimeApiMetadataV15,
  RuntimeApiMethodMetadataV15,
  SiLookupTypeId,
} from '@polkadot/types/interfaces';

import {
  BlockHashNotFoundException,
  InvalidParameterException,
  OperationTimeoutException,
  QueryFailedException,
  SubtensorErrorCode,
  SubtensorException,
  TransactionFailedException,
} from '../substrate-client.exception';
import { ClientNotInitializedException } from '../substrate-connection.exception';
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
        throw new SubtensorException(SubtensorErrorCode.TRANSACTION_PRIORITY_TOO_LOW);
      }
    }
    // If we couldn't parse a specific error, throw a generic exception with original error details
    throw new SubtensorException(
      SubtensorErrorCode.BAD_REQUEST,
      error.message || 'Unknown substrate error',
      { originalError: error },
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
        throw new QueryFailedException(`Failed to decode result: ${error.message}`, {
          originalError: error,
        });
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
        {
          originalError: error,
        },
      );
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
      // throw new TransactionFailedException(
      //   `Failed to sign and send transaction: ${error.message}`,
      //   {
      //     originalError: error,
      //   },
      // );
    }
  }

  async getBlockHash(block: number): Promise<string> {
    try {
      const client = await this.substrateConnectionService.getClient();
      const blockHash = await client.query.system.blockHash(block);

      if (!blockHash) {
        throw new BlockHashNotFoundException(block);
      }

      const blockHashHex = blockHash.toHex();
      return blockHashHex;
    } catch (error) {
      this.logger.error(`Failed to retrieve block hash: ${error.message}`, error.stack);

      if (error instanceof BlockHashNotFoundException) {
        throw error;
      }


      this.handleSubtensorError(error);
      // throw new QueryFailedException(`Failed to retrieve block hash: ${error.message}`, {
      //   originalError: error,
      // });
    }
  }
}
