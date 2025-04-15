import { Module } from '@nestjs/common';
import { ChainModule } from './routes/chain/chain.module';

@Module({
  imports: [ChainModule],
})
export class AppModule {}
