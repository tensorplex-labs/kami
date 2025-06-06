// TODO: Remove this interface once tested that we can use DTO as the call params instead
export interface SetWeightsCallParams {
  netuid: number;
  dests: number[];
  weights: number[];
  versionKey: number;
}
