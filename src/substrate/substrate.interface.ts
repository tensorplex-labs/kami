import { KeyringPair } from '@polkadot/keyring/types';

export interface ExtrinsicResponse {
  txHash: string;
  events: object[];
  status: {
    isFinalized: boolean;
  };
}

export interface WalletInfo {
  coldkey: string;
  hotkey: string;
}

export interface SubstrateConfig {
  nodeUrl: string;
  timeout?: number;
  maxRetries?: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastConnected?: Date;
  chainId?: string;
}

export interface BlockDigest {
  logs: object[];
}

export interface BlockInfo {
  parentHash: string;
  blockNumber: number;
  stateRoot: string;
  extrinsicsRoot: string;
  // digest: BlockDigest; // uncomment if you need to include the digest
}

export interface AxonInfo {
  block: number;
  version: number;
  ip: number;
  port: number;
  ipType: number;
  protocol: number;
  placeholder1: number;
  placeholder2: number;
}

export interface PrometheusInfo {
  block: number;
  version: number;
  ip: number;
  port: number;
  ip_type: number;
}

export interface NeuronInfo {
  hotkey: string;
  coldkey: string;
  uid: number;
  netuid: number;
  active: boolean;
  axonInfo: AxonInfo;
  prometheusInfo: PrometheusInfo;
  stake: [string, number][];
  rank: number;
  emission: number;
  incentive: number;
  consensus: number;
  trust: number;
  validator_trust: number;
  dividends: number;
  last_update: number;
  validator_permit: boolean;
  weights: [number, number][];
  bonds: any[]; // You might want to specify a more precise type if you know the structure of bonds
  pruning_score: number;
}

export interface KeyringPairInfo {
  keyringPair: KeyringPair;
  walletColdkey: string;
}

export interface NonceInfo {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: {
    free: number;
    reserved: number;
    frozen: number;
    flags: string;
  };
}

export interface SubnetHyperparameters {
  rho: number;
  kappa: number;
  immunityPeriod: number;
  minAllowedWeights: number;
  maxWeightsLimit: number;
  tempo: number;
  minDifficulty: number;
  maxDifficulty: number;
  weightsVersion: number;
  weightsRateLimit: number;
  adjustmentInterval: number;
  activityCutoff: number;
  registrationAllowed: boolean;
  targetRegsPerInterval: number;
  minBurn: number;
  maxBurn: number;
  bondsMovingAvg: number;
  maxRegsPerBlock: number;
  servingRateLimit: number;
  maxValidators: number;
  adjustmentAlpha: number;
  difficulty: number;
  commitRevealPeriod: number;
  commitRevealWeightsEnabled: boolean;
  alphaHigh: number;
  alphaLow: number;
  liquidAlphaEnabled: boolean;
}

export interface TotalNetworksInfo {
  totalNetworks: number;
}
