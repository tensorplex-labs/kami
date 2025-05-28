import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { BaseExceptionFilter } from './commons/exceptions/base.exception';
import { TransformInterceptor } from './commons/transform.interceptor';
import { KamiConfigModule } from './core/kami-config/kami-config.module';
import { SubstrateModule } from './core/substrate/substrate.module';
import { AccountNonceModule } from './features/account-nonce/account-nonce.module';
import { CheckHotkeyModule } from './features/check-hotkey/check-hotkey.module';
import { LatestBlockModule } from './features/latest-block/latest-block.module';
import { ServeAxonModule } from './features/serve-axon/serve-axon.module';
import { SetCommitRevealWeightsModule } from './features/set-commit-reveal-weights/set-commit-reveal-weights.module';
import { SetWeightsModule } from './features/set-weights/set-weights.module';
import { SignMessageModule } from './features/sign-message/sign-message.module';
import { SubnetHyperparameterModule } from './features/subnet-hyperparameter/subnet-hyperparameter.module';
import { SubnetMetagraphModule } from './features/subnet-metagraph/subnet-metagraph.module';

@Module({
  imports: [
    SubstrateModule,
    SubnetMetagraphModule,
    SubnetHyperparameterModule,
    ServeAxonModule,
    SetWeightsModule,
    SetCommitRevealWeightsModule,
    LatestBlockModule,
    CheckHotkeyModule,
    AccountNonceModule,
    SignMessageModule,
    KamiConfigModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BaseExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
