export interface AxonCallParams {
  version: number;
  ip: number;
  port: number;
  ipType: number;
  netuid: number;
  protocol: number;
  placeholder1: number;
  placeholder2: number;
}

export interface SetWeightsCallParams {
  netuid: number;
  dests: number[];
  weights: number[];
  versionKey: number;
}
