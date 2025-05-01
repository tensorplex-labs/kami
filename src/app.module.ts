import { Module } from '@nestjs/common';

import { SubstrateModule } from './core/substrate/substrate.module';
import { CheckHotkeyModule } from './features/check-hotkey/check-hotkey.module';
import { LatestBlockModule } from './features/latest-block/latest-block.module';
import { ServeAxonModule } from './features/serve-axon/serve-axon.module';
import { SetCommitRevealWeightsModule } from './features/set-commit-reveal-weights/set-commit-reveal-weights.module';
import { SetWeightsModule } from './features/set-weights/set-weights.module';
import { SubnetHyperparameterModule } from './features/subnet-hyperparameter/subnet-hyperparameter.module';
import { SubnetMetagraphModule } from './features/subnet-metagraph/subnet-metagraph.module';

@Module({
  imports: [
    SubstrateModule,
    SubnetMetagraphModule,
    ServeAxonModule,
    CheckHotkeyModule,
    SubnetHyperparameterModule,
    LatestBlockModule,
    SetWeightsModule,
    SetCommitRevealWeightsModule,
  ],
})
export class AppModule {}
