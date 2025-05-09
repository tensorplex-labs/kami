import { KeyringPair } from '@polkadot/keyring/types';

export interface KeyringPairInfo {
  keyringPair: KeyringPair;
  walletColdkey: string;
}
