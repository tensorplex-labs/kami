import { ConnectionStatus } from '@app/commons/interface/connection-status.interface';
import { KeyringPairInfo } from '@app/commons/interface/keyringpair-info.interface';
import * as fs from 'fs';
import { KamiConfigService } from 'src/core/kami-config/kami-config.service';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

// Import the new exception classes
import {
  ConnectionFailedException,
  InvalidColdkeyFormatException,
  InvalidHotkeyFormatException,
  KeyringPairNotSetException,
  WalletHotkeyNotSetException,
  WalletNameNotSetException,
  WalletPathNotSetException,
} from '../exceptions/substrate-connection.exception';
import { SubstrateConfig } from '../substrate-config.interface';
import { GetKeyringPair } from '../utils/keyring.util';

@Injectable()
export class SubstrateConnectionService implements OnModuleInit {
  protected readonly logger = new Logger(this.constructor.name);
  protected config: SubstrateConfig;
  protected connectionStatus: ConnectionStatus = { isConnected: false };
  protected keyringPairInfo: KeyringPairInfo | null;
  protected walletName: string | undefined;
  protected walletHotkey: string | undefined;
  protected walletPath: string | undefined;

  protected maxRetries: number;
  protected initialRetryDelay: number;
  protected backoffFactor: number;
  protected maxRetryDelay: number;

  public client: ApiPromise | null;

  private isReconnecting = false;

  constructor(private readonly kamiConfigService: KamiConfigService) {
    this.client = null;
    // Use KamiConfigService to get SubstrateConfig
    const subtensorConfig = this.kamiConfigService.getSubtensorConfig();
    this.config = {
      nodeUrl: subtensorConfig.subtensorNetwork,
      timeout: subtensorConfig.subtensorWsProviderTimeout,
    };

    // Get wallet config from KamiConfigService
    const walletConfig = this.kamiConfigService.getWalletConfig();
    this.walletPath = walletConfig.bittensorWalletDir;
    this.walletName = walletConfig.bittensorWalletColdkey;
    this.walletHotkey = walletConfig.bittensorWalletHotkey;

    this.keyringPairInfo = null;

    // Get retry config from KamiConfigService
    const retryConfig = this.kamiConfigService.getRetryConfig();
    this.maxRetries = retryConfig.maxRetries;
    this.initialRetryDelay = retryConfig.initialRetryDelay;
    this.backoffFactor = retryConfig.backoffFactor;
    this.maxRetryDelay = retryConfig.maxRetryDelay;
  }

  async onModuleInit() {
    try {
      // Initialize connection first
      this.logger.log('Initializing substrate connection during bootstrap...');
      await this.connect();

      // Then try to initialize keyring if wallet info is available
      if (!this.walletPath || !this.walletName || !this.walletHotkey) {
        this.logger.warn(
          'Wallet environment variables not fully set. Keyring initialization skipped.',
        );
      } else {
        await this.setKeyringPair();
        this.logger[this.keyringPairInfo ? 'log' : 'warn'](
          this.keyringPairInfo
            ? `Keyring pair initialized successfully for wallet: ${this.walletName}`
            : 'Failed to initialize keyring pair despite valid wallet configuration.',
        );
      }
    } catch (error) {
      this.logger.error(`Failed to initialize substrate connection: ${error.message}`);
    }
  }

  async connect(): Promise<ConnectionStatus> {
    this.logger.log(`Connecting to ${this.config.nodeUrl}...`);

    const provider = new WsProvider(
      this.config.nodeUrl, // URL
      this.initialRetryDelay, // Auto reconnect delay in ms
      {}, // Headers
      this.config.timeout, // Timeout
    );

    // Setup event listeners
    provider.on('connected', () => {
      this.logger.log(`Connected to ${this.config.nodeUrl}`);
      this.connectionStatus.isConnected = true;
    });

    provider.on('disconnected', () => {
      this.logger.warn(`WebSocket disconnected from ${this.config.nodeUrl}`);
      this.connectionStatus.isConnected = false;
    });

    provider.on('error', error => {
      this.logger.error(`WebSocket error: ${JSON.stringify(error) ?? 'Unknown error'}`);
    });

    // Create API with this provider
    this.client = new ApiPromise({ provider });

    // Wait for API to be ready
    await this.client.isReady;

    // Set connection status
    this.connectionStatus = {
      isConnected: true,
      lastConnected: new Date(),
      chainId: (await this.client.rpc.system.chain()).toString(),
    };

    this.logger.log(`Connected to Substrate node for ${this.connectionStatus.chainId}!`);

    return this.connectionStatus;
  }

  // Public method to get client
  async getClient(): Promise<ApiPromise> {
    if (!this.client || !this.connectionStatus.isConnected) {
      this.logger.log('No client');
      throw new ConnectionFailedException(`Client could not be initialized`);
    } else {
      return this.client;
    }
  }

  async setKeyringPair() {
    this.logger.log(`Setting keyring pair for wallet: ${this.walletName}`);

    if (!this.walletPath) {
      throw new WalletPathNotSetException();
    }

    if (!this.walletName) {
      throw new WalletNameNotSetException();
    }

    if (!this.walletHotkey) {
      throw new WalletHotkeyNotSetException();
    }

    this.keyringPairInfo = await GetKeyringPair(
      this.walletPath,
      this.walletName,
      this.walletHotkey,
    );
  }

  /**
   * Returns the current keyring pair information
   * @returns The keyring pair information or null if not initialized
   */
  async getKeyringPairInfo(): Promise<KeyringPairInfo> {
    if (!this.keyringPairInfo) {
      throw new KeyringPairNotSetException();
    }

    return this.keyringPairInfo;
  }
}
