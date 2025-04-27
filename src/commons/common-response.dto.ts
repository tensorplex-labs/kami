import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

export interface Response<T> {
  statusCode: number;
  message: string;
  data?: T | null;
  error?: string | null;
  reqId?: string;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        if (data && data.statusCode && data.statusCode >= 400) {
          return {
            statusCode: data.statusCode,
            reqId: context.switchToHttp().getRequest().reqId,
            message: data.message || 'Error occurred',
            error: data.error,
            data: null,
          };
        }

        return {
          statusCode: 200,
          reqId: context.switchToHttp().getRequest().reqId,
          message: data.message || 'success',
          data: data,
        };
      }),
    );
  }
}
