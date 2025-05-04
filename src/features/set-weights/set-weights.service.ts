import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable, Logger } from '@nestjs/common';

import { SetWeightsCallParams } from './set-weights.call-params.interface';
import { SetWeightsGenericException } from './set-weights.exception';

@Injectable()
export class SetWeightsService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async setWeights(CallParams: SetWeightsCallParams): Promise<any> {
    try {
      const client = await this.substrateConnectionService.getClient();
      const setWeightsTx = client.tx.subtensorModule.setWeights(
        CallParams.netuid,
        CallParams.dests,
        CallParams.weights,
        CallParams.versionKey,
      );

      const result = await this.substrateClientService.signAndSendTransaction(setWeightsTx);

      return result;
    } catch (error) {
      throw new SetWeightsGenericException(error.message, { originalError: error });
    }
  }
}
