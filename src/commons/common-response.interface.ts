export interface IApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  data?: T | null;
  error?: {
    code: string;
    errorMessage: string;
    details?: any;
    executionTrace?: string;
  } | null;
  metadata?: {
    timestamp: string;
    path?: string;
    blockNumber?: number;
    executionTime?: number;
    [key: string]: any;
  };
}
