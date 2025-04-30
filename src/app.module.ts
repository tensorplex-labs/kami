import { Module } from '@nestjs/common';

import { MapperModule } from './mapper/mapper.module';
import { ChainModule } from './routes/chain/chain.module';

@Module({
  imports: [ChainModule, MapperModule],
})
export class AppModule {}
