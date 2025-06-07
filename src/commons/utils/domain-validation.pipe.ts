import { Injectable, Type } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

import { BaseException } from '../exceptions/base.exception';

@Injectable()
export class DomainValidationPipe extends ValidationPipe {
  constructor(private readonly exceptionClass: Type<BaseException>) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: errors => {
        const errorMessages = errors
          .map(error =>
            Object.entries(error.constraints ?? {})
              .map(([key, value]) => `${key}: ${value}`)
              .join(': '),
          )
          .join('; ');

        // Dynamically create the exception instance
        return new exceptionClass(errorMessages);
      },
    });
  }
}
