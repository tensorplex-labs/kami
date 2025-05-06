import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import { SubtensorException } from 'src/core/substrate/substrate-client.exception';
import { SubnetHyperparameters } from 'src/features/subnet-hyperparameter/subnet-hyperparameter.interface';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { SubnetHyperparameterException } from './subnet-hyperparameter.exception';

@Injectable()
export class SubnetHyperparameterService {
  private readonly logger = new Logger(SubnetHyperparameterService.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async getSubnetHyperparameters(netuid: number): Promise<SubnetHyperparameters> {
    try {
      const client = await this.substrateConnectionService.getClient();

      const runtimeApiName: string = 'SubnetInfoRuntimeApi';
      const methodName: string = 'get_subnet_hyperparams';
      const encodedParams: Uint8Array = client.registry.createType('u16', netuid).toU8a();

      const response = await this.substrateClientService.queryRuntimeApi(
        runtimeApiName,
        methodName,
        encodedParams,
      );

      const subnetHyperparameters: SubnetHyperparameters = response.toJSON();
      return subnetHyperparameters;
    } catch (error) {
      if (error instanceof SubtensorException) {
        this.logger.error(`Subtensor error: ${error.message}`);
        throw error;
      }
      throw new SubnetHyperparameterException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
