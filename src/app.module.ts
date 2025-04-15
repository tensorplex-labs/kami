import { Module } from '@nestjs/common';
import { ChainModule } from './chain/chain.module';

@Module({
  imports: [ChainModule],
})
export class AppModule {}
