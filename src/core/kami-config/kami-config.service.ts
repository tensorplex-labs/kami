import { Injectable, Logger } from '@nestjs/common';

import {
  appConfigMapping,
  retryConfigMapping,
  subtensorConfigMapping,
  walletConfigMapping,
} from './kami-config.constants';
import {
  EnvMapping,
  KamiAppConfig,
  KamiConfig,
  KamiRetryConfig,
  KamiSubtensorConfig,
  KamiWalletConfig,
} from './kami-config.interface';

@Injectable()
export class KamiConfigService {
  private readonly config: KamiConfig;
  private readonly logger: Logger;

  constructor() {
    this.config = {} as KamiConfig;
    this.logger = new Logger(KamiConfigService.name);

    // Process each mapping group
    this.processEnvMappings(subtensorConfigMapping);
    this.processEnvMappings(walletConfigMapping);
    this.processEnvMappings(retryConfigMapping);
    this.processEnvMappings(appConfigMapping);

    this.logger.debug('KamiConfigService initialized with config: ', this.config);
  }

  private processEnvMappings<T>(mappings: EnvMapping<T>[]): void {
    for (const mapping of mappings) {
      const envValue = process.env[mapping.envVar];

      if (envValue !== undefined) {
        (this.config as any)[mapping.key] = mapping.transform
          ? mapping.transform(envValue)
          : envValue;
      } else if (mapping.default !== undefined) {
        (this.config as any)[mapping.key] = mapping.default;
      }
    }
  }

  getKamiConfig(): KamiConfig {
    return this.config;
  }

  getSubtensorConfig(): KamiSubtensorConfig {
    return {
      subtensorNetwork:
        this.config.subtensorNetwork === 'local'
          ? this.config.subtensorEndpoint
          : this.config.subtensorNetwork,
      subtensorEndpoint: this.config.subtensorEndpoint,
      subtensorWsProviderAutoConnectMsRetryDelay:
        this.config.subtensorWsProviderAutoConnectMsRetryDelay,
      subtensorWsProviderTimeout: this.config.subtensorWsProviderTimeout,
    };
  }

  getWalletConfig(): KamiWalletConfig {
    return {
      bittensorWalletDir: this.config.bittensorWalletDir,
      bittensorWalletColdkey: this.config.bittensorWalletColdkey,
      bittensorWalletHotkey: this.config.bittensorWalletHotkey,
    };
  }

  getRetryConfig(): KamiRetryConfig {
    return {
      maxRetries: this.config.maxRetries,
      initialRetryDelay: this.config.initialRetryDelay,
      backoffFactor: this.config.backoffFactor,
      maxRetryDelay: this.config.maxRetryDelay,
    };
  }

  getAppConfig(): KamiAppConfig {
    return {
      kamiPort: this.config.kamiPort,
    };
  }
}
