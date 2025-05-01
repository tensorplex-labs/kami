import { Global, Logger, Module } from '@nestjs/common';

import { SubstrateClientService } from './services/substrate-client.service';
import { SubstrateConnectionService } from './services/substrate-connection.service';
import { SubstrateConfig } from './substrate-config.interface';
import { SubstrateController } from './substrate.controller';

@Global()
@Module({
  providers: [
    {
      provide: SubstrateConnectionService,
      useFactory: () => {
        const config: SubstrateConfig = {
          nodeUrl: process.env.SUBTENSOR_NETWORK || 'wss://lite.sub.latent.to:443',
          timeout: process.env.SUBTENSOR_TIMEOUT ? parseInt(process.env.SUBTENSOR_TIMEOUT) : 30000,
          maxRetries: process.env.SUBTENSOR_MAX_RETRIES
            ? parseInt(process.env.SUBTENSOR_MAX_RETRIES)
            : 3,
        };
        return new SubstrateConnectionService(
          config,
          process.env.BITTENSOR_DIR || undefined,
          process.env.WALLET_COLDKEY || undefined,
          process.env.WALLET_HOTKEY || undefined,
        );
      },
    },
    {
      provide: SubstrateClientService,
      useFactory: (substrateConnectionService: SubstrateConnectionService) => {
        return new SubstrateClientService(substrateConnectionService);
      },
      inject: [SubstrateConnectionService],
    },
    Logger,
  ],
  controllers: [SubstrateController],
  exports: [SubstrateClientService, SubstrateConnectionService],
})
export class SubstrateModule {}
