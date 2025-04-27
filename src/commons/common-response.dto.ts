import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

export interface Response<T> {
  statusCode: number;
  success: boolean;
  data?: T | null;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        if (data && data.statusCode && data.statusCode >= 400) {
          return {
            statusCode: data.statusCode,
            success: false,
            data: data,
          };
        }

        return {
          statusCode: 200,
          success: true,
          data: data,
        };
      }),
    );
  }
}
