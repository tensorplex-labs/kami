import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { ApiResponse } from './common-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const now = Date.now();

    return next.handle().pipe(
      map(data => {
        // Handle case where response has already been formatted as ApiResponse
        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          // If it's already an ApiResponse, ensure metadata is complete and return
          if (!data.metadata) {
            data.metadata = {};
          }

          if (!data.metadata.timestamp) {
            data.metadata.timestamp = new Date().toISOString();
          }

          if (!data.metadata.path && request) {
            data.metadata.path = request.url;
          }

          if (!data.metadata.executionTime) {
            data.metadata.executionTime = Date.now() - now;
          }

          return data as ApiResponse<T>;
        }

        // Standard success response
        return {
          statusCode: 200,
          success: true,
          data: data,
          error: null,
          metadata: {
            timestamp: new Date().toISOString(),
            path: request?.url,
            executionTime: Date.now() - now,
          },
        };
      }),
    );
  }
}
