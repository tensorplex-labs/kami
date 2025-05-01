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
