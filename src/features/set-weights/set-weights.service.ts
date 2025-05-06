import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import { SubtensorException } from 'src/core/substrate/substrate-client.exception';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { SetWeightsCallParams } from './set-weights.call-params.interface';
import { SetWeightsException } from './set-weights.exception';

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
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new SetWeightsException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
