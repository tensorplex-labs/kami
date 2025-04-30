import { MapperModule } from 'src/mapper/mapper.module';

import { Logger, Module } from '@nestjs/common';

import { ChainController } from './chain.controller';
import { ChainService } from './chain.service';

@Module({
  imports: [MapperModule],
  controllers: [ChainController],
  providers: [ChainService, Logger],
  exports: [ChainService], // export incase other modules need
})
export class ChainModule {}
