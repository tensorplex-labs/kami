import { Server } from 'socket.io';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import { BlockInfo } from 'src/features/latest-block/latest-block.interface';

import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class WebsocketClient implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebsocketClient.name);

  constructor(private readonly substrateConnectionService: SubstrateConnectionService) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log(`Server Initialised!`);
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client ID: ${client.id} connected..`);
    this.logger.log(`Current connection pool size: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client ID: ${client.id} disconnected.`);

    if (client.data?.blockUnsubscribe) {
      this.logger.debug(`Cleaning up block subscription for client ${client.id}`);
      client.data.blockUnsubscribe();
    }
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, payload: any): any {
    this.logger.log(`Message received from client ID: ${client.id}`);
    this.logger.debug(`Payload: ${payload}`);
    return {
      event: 'pong',
      data: 'PONG',
    };
  }

  @SubscribeMessage('subscribe-blocks')
  async handleBlockSubscription(client: any) {
    try {
      this.logger.log(`Client ${client.id} subscribed to blocks`);

      const apiClient = await this.substrateConnectionService.getClient();

      const unsubscribe = await apiClient.rpc.chain.subscribeNewHeads(header => {
        const blockInfo: BlockInfo = {
          blockNumber: header.number.toNumber(),
          parentHash: header.parentHash.toHex(),
          stateRoot: header.stateRoot.toHex(),
          extrinsicsRoot: header.extrinsicsRoot.toHex(),
        };

        this.logger.debug(`New block ${blockInfo.blockNumber} for client ${client.id}`);

        client.emit('new-block', blockInfo);
      });

      client.data.blockUnsubscribe = unsubscribe;

      return {
        event: 'subscription-confirmed',
        data: { message: 'Successfully subscribed to new blocks' },
      };
    } catch (error) {
      this.logger.error(`Error subscribing client ${client.id} to blocks:`, error);
      return {
        event: 'subscription-error',
        data: { message: 'Failed to subscribe to blocks', error: error.message },
      };
    }
  }
}
