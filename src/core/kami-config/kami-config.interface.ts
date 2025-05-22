export interface KamiSubtensorConfig {
  subtensorNetwork: string;
  subtensorEndpoint: string;
  subtensorWsProviderAutoConnectMsRetryDelay: number;
  subtensorWsProviderTimeout: number;
}

export interface KamiWalletConfig {
  bittensorWalletDir?: string;
  bittensorWalletColdkey?: string;
  bittensorWalletHotkey?: string;
}

export interface KamiRetryConfig {
  maxRetries: number;
  initialRetryDelay: number;
  backoffFactor: number;
  maxRetryDelay: number;
}

export interface KamiAppConfig {
  kamiPort: number;
}

export interface KamiConfig
  extends KamiSubtensorConfig,
    KamiWalletConfig,
    KamiRetryConfig,
    KamiAppConfig {}

export interface EnvMapping<T> {
  key: keyof T;
  envVar: string; // Variable name in .env file
  default?: unknown;
  transform?: (value: string) => unknown;
}
