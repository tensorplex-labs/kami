import { Global, Module } from '@nestjs/common';

import { KamiConfigService } from './kami-config.service';

@Global()
@Module({
  providers: [KamiConfigService],
  exports: [KamiConfigService],
})
export class KamiConfigModule {}
