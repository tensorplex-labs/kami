import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import { SubnetMetagraph } from 'src/features/subnet-metagraph/subnet-metagraph.interface';

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubnetMetagraphService {
  private readonly logger = new Logger(SubnetMetagraphService.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async getSubnetMetagraph(netuid: number): Promise<SubnetMetagraph> {
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
  }
}
