import { SubstrateConnectionException } from 'src/core/substrate/exceptions/substrate-connection.exception';
import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import { SubnetMetagraphException } from 'src/features/subnet-metagraph/subnet-metagraph.exception';
import { SubnetMetagraph } from 'src/features/subnet-metagraph/subnet-metagraph.interface';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubnetMetagraphService {
  private readonly logger = new Logger(SubnetMetagraphService.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) { }

  async getSubnetMetagraph(netuid: number): Promise<SubnetMetagraph> {
    try {
      const client = await this.substrateConnectionService.getClient();

      const runtimeApiName = 'SubnetInfoRuntimeApi';
      const methodName = 'get_metagraph';
      const encodedParams = client.registry.createType('u16', netuid).toU8a();

      const response = await this.substrateClientService.queryRuntimeApi(
        runtimeApiName,
        methodName,
        encodedParams,
      );

      const subnetMetagraph: SubnetMetagraph = response.toJSON();
      return subnetMetagraph;
    } catch (error) {
      if (error instanceof SubstrateConnectionException) {
        throw error;
      }

      if (
        error.message &&
        error.message.includes('API SubnetInfoRuntimeApi not found in runtime metadata')
      ) {
        this.logger.error(
          `🚨 Critical error: ${error.message}. The runtime API is not available. Initiating graceful shutdown...`,
        );

        setTimeout(() => {
          this.logger.log('🛑 Exiting application gracefully due to runtime incompatibility...');
          process.exit(0);
        }, 1000);
      }

      throw new SubnetMetagraphException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
