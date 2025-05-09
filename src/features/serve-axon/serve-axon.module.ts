import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { ServeAxonController } from './serve-axon.controller';
import { ServeAxonService } from './serve-axon.service';

@Module({
  imports: [SubstrateModule],
  controllers: [ServeAxonController],
  providers: [ServeAxonService],
})
export class ServeAxonModule {}
