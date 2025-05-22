import {
  EnvMapping,
  KamiAppConfig,
  KamiRetryConfig,
  KamiSubtensorConfig,
  KamiWalletConfig,
} from './kami-config.interface';
import { getNetworkUrl, processWalletPath } from './kami-config.utils';

export const SUBTENSOR_NETWORK = {
  finney: 'wss://entrypoint-finney.opentensor.ai:443',
  test: 'wss://test.finney.opentensor.ai:443',
  local: 'local',
};

export const subtensorConfigMapping: EnvMapping<KamiSubtensorConfig>[] = [
  {
    key: 'subtensorNetwork',
    envVar: 'SUBTENSOR_NETWORK',
    default: 'wss://lite.sub.latent.to:443',
    transform: value => getNetworkUrl(value),
  },
  {
    key: 'subtensorEndpoint',
    envVar: 'SUBTENSOR_ENDPOINT',
    default: 'wss://lite.sub.latent.to:443',
  },
  {
    key: 'subtensorWsProviderAutoConnectMsRetryDelay',
    envVar: 'SUBTENSOR_WS_RETRY_DELAY',
    default: 1000,
    transform: value => parseInt(value),
  },
  {
    key: 'subtensorWsProviderTimeout',
    envVar: 'SUBTENSOR_TIMEOUT',
    default: 30000,
    transform: value => parseInt(value),
  },
];

export const walletConfigMapping: EnvMapping<KamiWalletConfig>[] = [
  {
    key: 'bittensorWalletDir',
    envVar: 'BITTENSOR_DIR',
    default: process.env.HOME + '/.bittensor',
    transform: value => processWalletPath(value),
  },
  {
    key: 'bittensorWalletColdkey',
    envVar: 'WALLET_COLDKEY',
  },
  {
    key: 'bittensorWalletHotkey',
    envVar: 'WALLET_HOTKEY',
  },
];

export const retryConfigMapping: EnvMapping<KamiRetryConfig>[] = [
  {
    key: 'maxRetries',
    envVar: 'MAX_RETRIES',
    default: 5,
    transform: value => parseInt(value),
  },
  {
    key: 'initialRetryDelay',
    envVar: 'INITIAL_RETRY_DELAY',
    default: 5000,
    transform: value => parseInt(value),
  },
  {
    key: 'backoffFactor',
    envVar: 'BACKOFF_FACTOR',
    default: 1.5,
    transform: value => parseFloat(value),
  },
  {
    key: 'maxRetryDelay',
    envVar: 'MAX_RETRY_DELAY',
    default: 30000,
    transform: value => parseInt(value),
  },
];

export const appConfigMapping: EnvMapping<KamiAppConfig>[] = [
  {
    key: 'kamiPort',
    envVar: 'KAMI_PORT',
    default: 3000,
    transform: value => parseInt(value),
  },
];
