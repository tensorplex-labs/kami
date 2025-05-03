import { ConnectionStatus } from '@app/commons/interface/connection-status.interface';
import { KeyringPairInfo } from '@app/commons/interface/keyringpair-info.interface';
import { WalletInfo } from '@app/commons/interface/wallet-info.interface';
import * as fs from 'fs';
import path from 'path';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

import { SubstrateConfig } from '../substrate-config.interface';
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
} from '../substrate-connection.exception';

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

  constructor(
    config: SubstrateConfig,
    walletPath?: string,
    walletName?: string,
    walletHotkey?: string,
  ) {
    this.client = null;
    this.config = config;
    this.walletPath = walletPath || path.join(process.env.HOME || '', '.bittensor/wallets');
    this.walletName = walletName || 'default';
    this.walletHotkey = walletHotkey || 'default';
    this.keyringPairInfo = null;

    // Initialize retry configuration with defaults that can be overridden by env or config
    this.maxRetries = 5;
    this.initialRetryDelay = 5000; // 5 seconds
    this.backoffFactor = 1.5;
    this.maxRetryDelay = 30000; // 30 seconds

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
    try {
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
    } catch (error) {
      this.logger.error(`Failed to set keyring pair: ${error.message}`);

      // Re-throw the exception if it's already one of our defined exceptions
      if (
        error instanceof WalletPathNotSetException ||
        error instanceof WalletNameNotSetException ||
        error instanceof WalletHotkeyNotSetException ||
        error instanceof InvalidColdkeyFormatException ||
        error instanceof InvalidHotkeyFormatException ||
        error instanceof FileAccessException
      ) {
        throw error;
      }

      // Generic exception
      throw new ConnectionFailedException(`Failed to set keyring pair: ${error.message}`, {
        originalError: error,
      });
    }
  }

  async getCurrentWalletInfo(): Promise<WalletInfo> {
    try {
      if (!this.keyringPairInfo) {
        throw new KeyringPairNotSetException();
      }

      const walletInfo: WalletInfo = {
        coldkey: this.keyringPairInfo.walletColdkey,
        hotkey: this.keyringPairInfo.keyringPair.address,
      };

      return walletInfo;
    } catch (error) {
      this.logger.error(`Failed to get current wallet info: ${error.message}`);

      if (error instanceof KeyringPairNotSetException) {
        throw error;
      }

      throw new ConnectionFailedException(`Failed to get wallet info: ${error.message}`, {
        originalError: error,
      });
    }
  }

  async connect(): Promise<ConnectionStatus> {
    // Apply retry strategy with backoff
    let lastError: Error | null = null;
    let provider: WsProvider | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          this.logger.log(
            `Retrying connection to ${this.config.nodeUrl} (attempt ${attempt + 1}/${this.maxRetries})...`,
          );
          await this.delay(attempt);
        } else {
          this.logger.log(`Connecting to ${this.config.nodeUrl}...`);
        }

        // Create a new provider for each attempt
        provider = new WsProvider(this.config.nodeUrl);

        // Wait for the provider to connect
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout'));
          }, 10000); // 10 second timeout

          if (provider) {
            provider.on('connected', () => {
              clearTimeout(timeout);
              resolve();
            });

            provider.on('error', err => {
              clearTimeout(timeout);
              reject(err);
            });
          }
        });

        // Create API promise with the connected provider
        this.client = new ApiPromise({ provider });

        // Set up monitoring before waiting for isReady
        this.setupConnectionMonitoring();

        await this.client.isReady;
        this.logger.log('Connected to Substrate node!');

        this.connectionStatus = {
          isConnected: true,
          lastConnected: new Date(),
          chainId: (await this.client.rpc.system.chain()).toString(),
        };

        return this.connectionStatus;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Connection attempt ${attempt + 1} failed: ${error.message}`);

        // Cleanup if needed
        if (provider) {
          try {
            provider.disconnect();
          } catch (disconnectError) {
            this.logger.debug(`Error while disconnecting provider: ${disconnectError.message}`);
          }
          provider = null;
        }

        if (this.client) {
          try {
            this.client.disconnect();
          } catch (disconnectError) {
            this.logger.debug(`Error while disconnecting client: ${disconnectError.message}`);
          }
          this.client = null;
        }
      }
    }

    // All retries failed
    this.connectionStatus = { isConnected: false };
    this.logger.error(`Failed to connect after ${this.maxRetries} attempts`);

    throw new ConnectionFailedException(lastError?.message || 'Max retries exceeded', {
      nodeUrl: this.config.nodeUrl,
      originalError: lastError,
      attempts: this.maxRetries,
    });
  }

  async reconnect(): Promise<ConnectionStatus> {
    // Prevent multiple concurrent reconnection attempts
    if (this.isReconnecting) {
      this.logger.debug('Reconnection already in progress, waiting...');
      return new Promise((resolve) => {
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
      if (this.client) {
        this.logger.debug('Disconnecting current client before reconnecting');
        try {
          this.client.disconnect();
        } catch (disconnectError) {
          this.logger.debug(`Error while disconnecting: ${disconnectError.message}`);
        }
        this.client = null;
      }

      this.connectionStatus.isConnected = false;
      this.logger.debug(`Starting reconnection with maxRetries=${this.maxRetries}`);
      return this.connect();
    } catch (error) {
      this.logger.error(`Failed to reconnect: ${error.message}`);

      throw new ReconnectionFailedException(error.message, {
        nodeUrl: this.config.nodeUrl,
        originalError: error,
        maxRetries: this.maxRetries,
      });
    } finally {
      this.isReconnecting = false;
    }
  }

  async ensureConnection(): Promise<void> {
    if (!this.client) {
      await this.reconnect();
    }
  }

  // Public method to get client - will establish connection if needed
  async getClient(): Promise<ApiPromise> {
    if (!this.client || !this.connectionStatus.isConnected) {
      await this.reconnect();
    }

    if (!this.client) {
      throw new ConnectionFailedException(
        'Client could not be initialized after reconnection attempt',
        { maxRetries: this.maxRetries },
      );
    }

    return this.client;
  }

  async getKeyringPair(
    walletPath: string | undefined,
    walletName: string | undefined,
    walletHotkey: string | undefined,
  ): Promise<KeyringPairInfo> {
    try {
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

      try {
        await fs.promises.access(coldkeyPath, fs.constants.R_OK);
        await fs.promises.access(hotkeyPath, fs.constants.R_OK);
      } catch (error) {
        throw new FileAccessException(error.path || 'wallet files', {
          originalError: error,
        });
      }

      let coldkeyContent, hotkeyFileContent;
      try {
        coldkeyContent = await fs.promises.readFile(coldkeyPath, 'utf-8');
        hotkeyFileContent = await fs.promises.readFile(hotkeyPath, 'utf-8');
      } catch (error) {
        throw new FileAccessException(error.path || 'wallet files', {
          originalError: error,
        });
      }

      let coldkeyJsonContent, hotkeyJsonContent;

      // Parse coldkey JSON
      try {
        coldkeyJsonContent = JSON.parse(coldkeyContent);
      } catch (error) {
        throw new InvalidColdkeyFormatException({
          originalError: error,
          message: 'Invalid JSON format in coldkey file',
        });
      }

      // Parse hotkey JSON
      try {
        hotkeyJsonContent = JSON.parse(hotkeyFileContent);
      } catch (error) {
        throw new InvalidHotkeyFormatException({
          originalError: error,
          message: 'Invalid JSON format in hotkey file',
        });
      }

      if (!coldkeyJsonContent.ss58Address) {
        throw new InvalidColdkeyFormatException();
      }
      const coldkey = coldkeyJsonContent.ss58Address;

      if (!hotkeyJsonContent.secretPhrase) {
        throw new InvalidHotkeyFormatException();
      }

      const keyring: Keyring = new Keyring({ type: 'sr25519' });
      const hotkey: KeyringPair = keyring.addFromMnemonic(hotkeyJsonContent.secretPhrase);

      return {
        keyringPair: hotkey,
        walletColdkey: coldkey,
      };
    } catch (error) {
      this.logger.error(`Failed to get keyring pair: ${error.message}`);

      // Re-throw specific exceptions
      if (
        error instanceof WalletPathNotSetException ||
        error instanceof WalletNameNotSetException ||
        error instanceof WalletHotkeyNotSetException ||
        error instanceof InvalidColdkeyFormatException ||
        error instanceof InvalidHotkeyFormatException ||
        error instanceof FileAccessException
      ) {
        throw error;
      }

      // Otherwise wrap in a more generic exception
      throw new ConnectionFailedException(`Failed to get keyring pair: ${error.message}`, {
        originalError: error,
      });
    }
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

  private setupConnectionMonitoring(): void {
    if (!this.client) return;
    
    let reconnectTimer: NodeJS.Timeout | null = null;
    
    // Listen for disconnection events with debouncing
    this.client.on('disconnected', () => {
      this.logger.warn(`Disconnected from ${this.config.nodeUrl}`);
      this.connectionStatus.isConnected = false;
      
      // Clear any pending reconnect timer
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      
      // Set new debounced reconnect timer
      reconnectTimer = setTimeout(() => {
        if (!this.connectionStatus.isConnected) {
          this.logger.log('Attempting to reconnect after debounce...');
          this.reconnect().catch(error => {
            this.logger.error(`Auto-reconnection failed: ${error.message}`);
          });
        }
      }, 1000); // 1 second debounce
    });

    // Listen for connected events
    this.client.on('connected', () => {
      this.logger.log(`Connected to ${this.config.nodeUrl}`);
      this.connectionStatus.isConnected = true;
    });

    // Listen for error events
    this.client.on('error', error => {
      this.logger.error(`Connection error: ${error.message}`);
    });
  }

  /**
   * Helper method to wait with exponential backoff
   */
  private async delay(attempt: number): Promise<void> {
    const delayMs = Math.min(
      this.initialRetryDelay * Math.pow(this.backoffFactor, attempt),
      this.maxRetryDelay,
    );

    this.logger.debug(`Waiting ${delayMs}ms before retry attempt ${attempt + 2}`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
    this.logger.debug(`Delay complete, proceeding with retry attempt ${attempt + 2}`);
  }
}

@Injectable()
export class ConnectionHealthService {
  constructor(private substrateConnectionService: SubstrateConnectionService) {
    this.startHealthCheck();
  }

  private startHealthCheck() {
    setInterval(async () => {
      try {
        await this.substrateConnectionService.ensureConnection();
      } catch (error) {
        // Health check failed - handle appropriately
      }
    }, 30000); // Check every 30 seconds
  }
}
