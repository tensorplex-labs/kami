import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable, Logger } from '@nestjs/common';

import { SetTimelockedWeightsParamsDto } from './set-timelocked-weights.dto';

@Injectable()
export class SetTimelockedWeightsService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async setTimelockedWeights(CallParams: SetTimelockedWeightsParamsDto): Promise<string> {
    const client = await this.substrateConnectionService.getClient();

    const hexCommitString = '0x' + CallParams.commit;

    const setTimelockedWeightsTx = client.tx.subtensorModule.commitTimelockedWeights(
      CallParams.netuid,
      hexCommitString,
      CallParams.revealRound,
      CallParams.commitRevealVersion,
    );

    this.logger.log(`Timelocked Reveal Call Data: ${setTimelockedWeightsTx.method.toHex()}`);
    this.logger.log(`Timelocked Reveal Call Hash: ${setTimelockedWeightsTx.method.hash.toHex()}`);

    const result =
      await this.substrateClientService.signAndSendTransaction(setTimelockedWeightsTx);

    return result;
  }
}
