export interface IApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  data: T | null;
  error: {
    type: string;
    message: string;
    stackTrace?: string;
  } | null;
}
