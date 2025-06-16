import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { WebsocketClient } from './websocket.gateway';

@Module({
  providers: [WebsocketClient],
  exports: [WebsocketClient],
  imports: [SubstrateModule],
})
export class WebSocketModule {}
