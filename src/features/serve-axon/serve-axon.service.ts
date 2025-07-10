import { SubstrateClientService } from 'src/core/substrate/services/substrate-client.service';
import { SubstrateConnectionService } from 'src/core/substrate/services/substrate-connection.service';

import { Injectable, Logger } from '@nestjs/common';

import { AxonCallParams } from './serve-axon.call-params.interface';

@Injectable()
export class ServeAxonService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly substrateClientService: SubstrateClientService,
    private readonly substrateConnectionService: SubstrateConnectionService,
  ) {}

  async serveAxon(params: AxonCallParams): Promise<string> {
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
  }
}
