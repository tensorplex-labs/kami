import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { IApiResponse } from './common-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // Handle case where response has already been formatted as ApiResponse
        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          return data as IApiResponse<T>;
        }

        // Standard success response
        return {
          statusCode: 200,
          success: true,
          data: data,
          error: null,
        };
      }),
    );
  }
}
