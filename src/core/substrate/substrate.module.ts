import { Global, Logger, Module } from '@nestjs/common';

import { KamiConfigModule } from '../kami-config/kami-config.module';
import { SubstrateClientService } from './services/substrate-client.service';
import { SubstrateConnectionService } from './services/substrate-connection.service';
import { SubstrateController } from './substrate.controller';

@Global()
@Module({
  providers: [
    SubstrateConnectionService,
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
  imports: [KamiConfigModule],
})
export class SubstrateModule {}
