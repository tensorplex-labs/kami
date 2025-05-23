import { SUBTENSOR_NETWORK } from './kami-config.constants';

export function processWalletPath(walletPath: string): string {
  if (walletPath.startsWith('$HOME/') || walletPath === '$HOME') {
    return walletPath.replace('$HOME', process.env.HOME || '');
  }
  return walletPath;
}

export function getNetworkUrl(networkName: string): string {
  if (networkName.startsWith('wss://') || networkName.startsWith('ws://')) {
    return networkName;
  }

  if (networkName in SUBTENSOR_NETWORK) {
    return SUBTENSOR_NETWORK[networkName as keyof typeof SUBTENSOR_NETWORK];
  }

  throw new Error(
    `Invalid network name: ${networkName} - must be a valid websocket URL or one of valid OTF network name (${Object.keys(SUBTENSOR_NETWORK).join(' | ')})`,
  );
}
