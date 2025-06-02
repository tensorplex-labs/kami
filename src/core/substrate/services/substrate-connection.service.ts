import { BaseException } from '@app/commons/exceptions/base.exception';
import { ConnectionStatus } from '@app/commons/interface/connection-status.interface';
import { KeyringPairInfo } from '@app/commons/interface/keyringpair-info.interface';
import { WalletInfo } from '@app/commons/interface/wallet-info.interface';
import * as fs from 'fs';
import { KamiConfigService } from 'src/core/kami-config/kami-config.service';

import { HttpStatus, Injectable, Logger, OnModuleInit, UseFilters } from '@nestjs/common';

import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

// Import the new exception classes
import {
  ConnectionFailedException,
  FileAccessException,
  InvalidColdkeyFormatException,
  InvalidHotkeyFormatException,
  KeyringPairNotSetException,
  ReconnectionFailedException,
  WalletHotkeyNotSetException,
  WalletNameNotSetException,
  WalletPathNotSetException,
} from '../exceptions/substrate-connection.exception';
import { SubstrateConfig } from '../substrate-config.interface';

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

    this.initializeKeyringIfPossible();
  }

  async onModuleInit() {
    try {
      // Initialize connection first
      this.logger.log('Initializing substrate connection during bootstrap...');
      await this.connect();

      // Then try to initialize keyring if wallet info is available
      if (this.walletPath && this.walletName && this.walletHotkey) {
        try {
          await this.setKeyringPair();
          this.logger.log(`Keyring pair initialized successfully for wallet: ${this.walletName}`);
        } catch (error) {
          // Just log the error but don't throw - this is optional initialization
          this.logger.warn(`Failed to initialize keyring pair: ${error.message}`);
        }
      } else {
        this.logger.warn(
          'Wallet environment variables not fully set. Keyring initialization skipped.',
        );
      }
    } catch (error) {
      this.logger.error(`Failed to initialize substrate connection: ${error.message}`);
      // Don't throw error to allow app to start, connection will be retried when needed
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

    const correctedWalletPath = this.walletPath.replace('$HOME', process.env.HOME || '');
    this.keyringPairInfo = await this.getKeyringPair(
      correctedWalletPath,
      this.walletName,
      this.walletHotkey,
    );
  }

  async getCurrentWalletInfo(): Promise<WalletInfo> {
    if (!this.keyringPairInfo) {
      throw new KeyringPairNotSetException();
    }

    const walletInfo: WalletInfo = {
      coldkey: this.keyringPairInfo.walletColdkey,
      hotkey: this.keyringPairInfo.keyringPair.address,
    };

    return walletInfo;
  }

  async connect(): Promise<ConnectionStatus> {
    this.logger.log(`Connecting to ${this.config.nodeUrl}...`);

    // Create a provider with auto-reconnect enabled
    // The second parameter is the reconnect delay in milliseconds
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

    // Handle API events as well
    this.client.on('connected', () => {
      this.logger.log('Substrate client established');
    });

    this.client.on('disconnected', () => {
      this.logger.warn('Substrate client disconnected');
    });

    this.client.on('error', error => {
      this.logger.error(`Substrate client error: ${error?.message ?? 'Unknown error'}`);
    });

    this.client.on('ready', () => {
      this.logger.log('Substrate client is ready');
    });

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

  async reconnect(): Promise<ConnectionStatus> {
    // Prevent multiple concurrent reconnection attempts
    if (this.isReconnecting) {
      this.logger.debug('Reconnection already in progress, waiting...');
      return new Promise(resolve => {
        // Poll until reconnection is complete or timeout
        const interval = setInterval(() => {
          if (!this.isReconnecting && this.connectionStatus.isConnected) {
            clearInterval(interval);
            resolve(this.connectionStatus);
          }
        }, 100);

        // Set a timeout in case reconnection stalls
        setTimeout(() => {
          clearInterval(interval);
          if (!this.connectionStatus.isConnected) {
            resolve({ isConnected: false });
          }
        }, 30000);
      });
    }

    try {
      this.isReconnecting = true;

      // Check if API exists and is still usable
      if (this.client) {
        try {
          // Try to use existing connection if possible
          await this.client.isReady;

          // If we get here, connection is already established
          this.connectionStatus.isConnected = true;
          return this.connectionStatus;
        } catch (error) {
          this.logger.debug(`Existing client is not usable: ${error?.message}`);

          // Disconnect client if it exists but is not usable
          try {
            await this.client.disconnect();
          } catch (disconnectError) {
            this.logger.debug(`Error disconnecting client: ${disconnectError?.message}`);
          }

          this.client = null;
        }
      }

      // Create a new connection if needed
      this.logger.debug('Creating new connection');
      return await this.connect();
    } catch (error) {
      this.logger.error(`Failed to reconnect: ${error?.message ?? 'Unknown error'}`);
      throw new ReconnectionFailedException(error?.message ?? 'Reconnection failed', error.stack);
    } finally {
      this.isReconnecting = false;
    }
  }

  // Public method to get client
  async getClient(): Promise<ApiPromise> {
    if (!this.client || !this.connectionStatus.isConnected) {
      // await this.reconnect();
      this.logger.log('No client');
      throw new ConnectionFailedException(`Client could not be initialized`);
    } else {
      return this.client;
    }
  }

  async getKeyringPair(
    walletPath: string | undefined,
    walletName: string | undefined,
    walletHotkey: string | undefined,
  ): Promise<KeyringPairInfo> {
    if (!walletPath) {
      throw new WalletPathNotSetException();
    }

    if (!walletName) {
      throw new WalletNameNotSetException();
    }

    if (!walletHotkey) {
      throw new WalletHotkeyNotSetException();
    }

    const coldkeyPath = `${walletPath}/wallets/${walletName}/coldkeypub.txt`;
    const hotkeyPath = `${walletPath}/wallets/${walletName}/hotkeys/${walletHotkey}`;

    await fs.promises.access(coldkeyPath, fs.constants.R_OK);
    await fs.promises.access(hotkeyPath, fs.constants.R_OK);

    let coldkeyContent, hotkeyFileContent;

    coldkeyContent = await fs.promises.readFile(coldkeyPath, 'utf-8');
    hotkeyFileContent = await fs.promises.readFile(hotkeyPath, 'utf-8');

    let coldkeyJsonContent, hotkeyJsonContent;

    coldkeyJsonContent = JSON.parse(coldkeyContent);

    hotkeyJsonContent = JSON.parse(hotkeyFileContent);

    if (!coldkeyJsonContent.ss58Address) {
      throw new InvalidColdkeyFormatException('Missing ss58Address in coldkey file');
    }
    const coldkey = coldkeyJsonContent.ss58Address;

    if (!hotkeyJsonContent.secretPhrase) {
      throw new InvalidHotkeyFormatException('Missing secretPhrase in hotkey file');
    }

    const keyring: Keyring = new Keyring({ type: 'sr25519' });
    const hotkey: KeyringPair = keyring.addFromMnemonic(hotkeyJsonContent.secretPhrase);

    return {
      keyringPair: hotkey,
      walletColdkey: coldkey,
    };
  }

  /**
   * Returns the current keyring pair information
   * @returns The keyring pair information or null if not initialized
   */
  async getKeyringPairInfo(): Promise<KeyringPairInfo> {
    if (!this.keyringPairInfo) {
      await this.setKeyringPair();
    }

    if (!this.keyringPairInfo) {
      throw new KeyringPairNotSetException();
    }

    return this.keyringPairInfo;
  }

  private async initializeKeyringIfPossible(): Promise<void> {
    // Only try to set keyring if all wallet info is available
    if (this.walletPath && this.walletName && this.walletHotkey) {
      try {
        // Use setTimeout to make this non-blocking
        setTimeout(async () => {
          try {
            await this.setKeyringPair();
            this.logger.log(`Keyring pair initialized successfully for wallet: ${this.walletName}`);
          } catch (error) {
            // Just log the error but don't throw - this is optional initialization
            this.logger.warn(`Failed to initialize keyring pair: ${error.message}`);
          }
        }, 0);
      } catch (error) {
        // Non-critical error, just log it
        this.logger.warn(`Failed to schedule keyring initialization: ${error.message}`);
      }
    } else {
      this.logger.warn(
        'Wallet environment variables not fully set. Keyring initialization skipped.',
      );
    }
  }
}
