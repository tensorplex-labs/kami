import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { AccountNonceController } from './account-nonce.controller';
import { AccountNonceMapper } from './account-nonce.mapper';
import { AccountNonceService } from './account-nonce.service';

@Module({
  imports: [SubstrateModule],
  controllers: [AccountNonceController],
  providers: [AccountNonceService, AccountNonceMapper],
})
export class AccountNonceModule {}
