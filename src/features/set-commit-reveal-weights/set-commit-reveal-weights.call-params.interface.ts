export interface CommitRevealWeightsCallParams {
  netuid: number;
  commit: Buffer | string; // TODO: remove string
  revealRound: number;
}
