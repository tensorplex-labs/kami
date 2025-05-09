export interface ConnectionStatus {
  isConnected: boolean;
  lastConnected?: Date;
  chainId?: string;
}
