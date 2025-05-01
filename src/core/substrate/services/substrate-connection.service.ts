import { ConnectionStatus } from '@app/commons/interface/connection-status.interface';
import { KeyringPairInfo } from '@app/commons/interface/keyringpair-info.interface';
import { WalletInfo } from '@app/commons/interface/wallet-info.interface';
import * as fs from 'fs';
import path from 'path';
import { SubtensorErrorCode } from 'src/core/substrate/substrate.exceptions';
import { SubtensorException } from 'src/core/substrate/substrate.exceptions';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

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

  public client: ApiPromise | null;

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

    this.initializeKeyringIfPossible();
  }

  private handleSubtensorError(error: any): Error {
    if (error?.data && typeof error.data == 'string') {
      const match = error.data.match(/Custom error: (\d+)/);
      if (match && match[1]) {
      }
      const errorCode = parseInt(match[1], 10);
      throw new SubtensorException(errorCode as SubtensorErrorCode);
    }
    if (error?.message && typeof error.message == 'string') {
      if (error.message.includes(`Priority is too low`)) {
        throw new SubtensorException(SubtensorErrorCode.TRANSACTION_PRIORITY_TOO_LOW);
      }
    }
    throw error;
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
        throw new Error('Wallet path is not set! Please set the BITTENSOR_DIR in your .env file.');
      }
      if (!this.walletName) {
        throw new Error('Wallet name is not set! Please set the WALLET_COLDKEY in your .env file.');
      }
      if (!this.walletHotkey) {
        throw new Error(
          'Wallet hotkey is not set! Please set the WALLET_HOTKEY in your .env file.',
        );
      }
      const correctedWalletPath = this.walletPath.replace('$HOME', process.env.HOME || '');
      this.keyringPairInfo = await this.getKeyringPair(
        correctedWalletPath,
        this.walletName,
        this.walletHotkey,
      );
    } catch (error) {
      this.logger.error(`Failed to set keyring pair: ${error.message}`);
      throw new Error(`Failed to set keyring pair: ${error.message}`);
    }
  }

  async getCurrentWalletInfo(): Promise<WalletInfo | Error> {
    try {
      if (!this.keyringPairInfo) {
        throw new Error('Keyring pair is not set, please call setKeyringPair() first');
      }
      const walletInfo: WalletInfo = {
        coldkey: this.keyringPairInfo.walletColdkey,
        hotkey: this.keyringPairInfo.keyringPair.address,
      };
      return walletInfo;
    } catch (error) {
      this.logger.error(`Failed to get current wallet info: ${error.message}`);
      throw new Error(`Failed to get current wallet info: ${error.message}`);
    }
  }

  async connect(): Promise<ConnectionStatus | Error> {
    try {
      this.logger.log(`Connecting to ${this.config.nodeUrl}...`);

      await new Promise(resolve => setTimeout(resolve, 500));
      this.client = new ApiPromise({
        provider: new WsProvider(this.config.nodeUrl),
      });

      await this.client.isReady;
      this.logger.log('Connected to Substrate node!');

      this.connectionStatus = {
        isConnected: true,
        lastConnected: new Date(),
        chainId: (await this.client.rpc.system.chain()).toString(),
      };
      return this.connectionStatus;
    } catch (error) {
      this.logger.error(`Failed to connect: ${error.message}`);
      this.connectionStatus = { isConnected: false };
      throw error;
    }
  }

  async reconnect() {
    try {
      if (this.client) {
        this.client.disconnect();
      }
      this.connectionStatus.isConnected = false;
      return this.connect();
    } catch (error) {
      this.logger.error(`Failed to reconnect: ${error.message}`);
      throw error;
    }
  }

  async ensureConnection(): Promise<void> {
    if (!this.client) {
      await this.reconnect();
    }
  }

  // Public method to get client - will establish connection if needed
  async getClient(): Promise<ApiPromise | Error> {
    if (!this.client || !this.connectionStatus.isConnected) {
      await this.reconnect();
    }

    if (!this.client) {
      return new Error('Failed to connect to Substrate node');
    }

    return this.client;
  }

  async getKeyringPair(
    walletPath: string | undefined,
    walletName: string | undefined,
    walletHotkey: string | undefined,
  ): Promise<KeyringPairInfo> {
    try {
      const coldkeyPath = `${walletPath}/wallets/${walletName}/coldkeypub.txt`;
      const hotkeyPath = `${walletPath}/wallets/${walletName}/hotkeys/${walletHotkey}`;

      await fs.promises.access(coldkeyPath, fs.constants.R_OK);
      await fs.promises.access(hotkeyPath, fs.constants.R_OK);

      const coldkeyContent = await fs.promises.readFile(coldkeyPath, 'utf-8');
      const coldkeyJsonContent = JSON.parse(coldkeyContent);

      if (!coldkeyJsonContent.ss58Address) {
        throw new Error('Invalid coldkey format: missing ss58Address');
      }
      const coldkey = coldkeyJsonContent.ss58Address;

      const hotkeyFileContent = await fs.promises.readFile(hotkeyPath, 'utf-8');
      const hotkeyJsonContent = JSON.parse(hotkeyFileContent);

      if (!hotkeyJsonContent.secretPhrase) {
        throw new Error('Invalid hotkey format: missing secretPhrase');
      }

      const keyring: Keyring = new Keyring({ type: 'sr25519' });
      const hotkey: KeyringPair = keyring.addFromMnemonic(hotkeyJsonContent.secretPhrase);

      return {
        keyringPair: hotkey,
        walletColdkey: coldkey,
      };
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Failed to get keyring pair: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Returns the current keyring pair information
   * @returns The keyring pair information or null if not initialized
   */
  async getKeyringPairInfo(): Promise<KeyringPairInfo | null> {
    if (!this.keyringPairInfo) {
      await this.setKeyringPair();
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
