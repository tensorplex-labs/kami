import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import { SubnetHyperparameters } from 'src/features/subnet-hyperparameter/subnet-hyperparameter.interface';

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubnetHyperparameterService {
  private readonly logger = new Logger(SubnetHyperparameterService.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async getSubnetHyperparameters(netuid: number): Promise<SubnetHyperparameters> {
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
  }
}
