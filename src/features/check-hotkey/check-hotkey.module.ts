import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { CheckHotkeyController } from './check-hotkey.controller';
import { CheckHotkeyMapper } from './check-hotkey.mapper';
import { CheckHotkeyService } from './check-hotkey.service';

@Module({
  imports: [SubstrateModule],
  controllers: [CheckHotkeyController],
  providers: [CheckHotkeyService, CheckHotkeyMapper],
})
export class CheckHotkeyModule {}
