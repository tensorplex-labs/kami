import { SubtensorException } from 'src/core/substrate/exceptions/substrate-client.exception';
import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { SetCommitRevealWeightException } from './set-commit-reveal-weight.exception';
import { CommitRevealWeightsCallParams } from './set-commit-reveal-weights.call-params.interface';

@Injectable()
export class SetCommitRevealWeightsService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async setCommitRevealWeights(CallParams: CommitRevealWeightsCallParams): Promise<string> {
    try {
      const client = await this.substrateConnectionService.getClient();

      const setCommitRevealWeightsTx = client!.tx.subtensorModule.commitCrv3Weights(
        CallParams.netuid,
        CallParams.commit,
        CallParams.revealRound,
      );

      this.logger.log(`Commit Reveal Call Data: ${setCommitRevealWeightsTx.method.toHex()}`)
      this.logger.log(`Commit Reveal Call Hash: ${setCommitRevealWeightsTx.method.hash.toHex()}`)

      const result = await this.substrateClientService.signAndSendTransaction(setCommitRevealWeightsTx);

      return result;
    } catch (error) {
      if (error instanceof SubtensorException) {
        throw error;
      }
      throw new SetCommitRevealWeightException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
