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

export interface NeuronInfo {
  hotkey: string;
  coldkey: string;
  uid: number;
  netuid: number;
  active: boolean;
  axon_info: {
    block: number;
    version: number;
    ip: number;
    port: number;
    ip_type: number;
    protocol: number;
    placeholder1: number;
    placeholder2: number;
  };
  prometheus_info: {
    block: number;
    version: number;
    ip: number;
    port: number;
    ip_type: number;
  };
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
