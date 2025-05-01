import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable, Logger } from '@nestjs/common';

import { CommitRevealWeightsCallParams } from './set-commit-reveal-weights.call-params.interface';

@Injectable()
export class SetCommitRevealWeightsService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async setCommitRevealWeights(CallParams: CommitRevealWeightsCallParams): Promise<any | Error> {
    try {
      const client = await this.substrateConnectionService.getClient();
      if (client instanceof Error) {
        throw client;
      }
      const setCommitRevealWeightsTx = client.tx.subtensorModule.commitCrv3Weights(
        CallParams.netuid,
        CallParams.commit,
        CallParams.revealRound,
      );

      const result =
        await this.substrateClientService.signAndSendTransaction(setCommitRevealWeightsTx);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
