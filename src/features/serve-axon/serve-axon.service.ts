import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';
import { SubtensorException } from 'src/core/substrate/substrate-client.exception';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { AxonCallParams } from './serve-axon.call-params.interface';
import { ServeAxonException } from './serve-axon.exception';

@Injectable()
export class ServeAxonService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async serveAxon(params: AxonCallParams): Promise<any> {
    try {
      const client = await this.substrateConnectionService.getClient();

      // Create the transaction using the client
      const axonTx = client.tx.subtensorModule.serveAxon(
        params.netuid,
        params.version,
        params.ip,
        params.port,
        params.ipType,
        params.protocol,
        params.placeholder1,
        params.placeholder2,
      );

      // Use the client service to sign and send the transaction
      return await this.substrateClientService.signAndSendTransaction(axonTx);
    } catch (error) {
      this.logger.error(`Error serving axon: ${error.message}`);
      if (error instanceof SubtensorException) {
        throw error;
      }

      throw new ServeAxonException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'UNKNOWN',
        error.message,
        error.stack,
      );
    }
  }
}
