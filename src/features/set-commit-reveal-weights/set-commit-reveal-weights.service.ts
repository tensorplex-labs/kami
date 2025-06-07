import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable, Logger } from '@nestjs/common';

import { SetCommitRevealWeightsParamsDto } from './set-commit-reveal-weights.dto';

@Injectable()
export class SetCommitRevealWeightsService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async setCommitRevealWeights(CallParams: SetCommitRevealWeightsParamsDto): Promise<string> {
    const client = await this.substrateConnectionService.getClient();

    const hexCommitString = '0x' + CallParams.commit;

    const setCommitRevealWeightsTx = client.tx.subtensorModule.commitCrv3Weights(
      CallParams.netuid,
      hexCommitString,
      CallParams.revealRound,
    );

    this.logger.log(`Commit Reveal Call Data: ${setCommitRevealWeightsTx.method.toHex()}`);
    this.logger.log(`Commit Reveal Call Hash: ${setCommitRevealWeightsTx.method.hash.toHex()}`);

    const result =
      await this.substrateClientService.signAndSendTransaction(setCommitRevealWeightsTx);

    return result;
  }
}
