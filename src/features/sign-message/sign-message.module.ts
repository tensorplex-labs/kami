import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { SignMessageController } from './sign-message.controller';
import { SignMessageMapper, VerifyMessageMapper } from './sign-message.mapper';
import { SignMessageService } from './sign-message.service';

@Module({
  imports: [SubstrateModule],
  controllers: [SignMessageController],
  providers: [SignMessageService, SignMessageMapper, VerifyMessageMapper],
})
export class SignMessageModule {}
