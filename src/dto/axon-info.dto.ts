import { IpToString } from '@app/decorators';
import { Expose } from 'class-transformer';

export class AxonInfoDto {
  @Expose()
  block: number;

  @Expose()
  version: number;

  @Expose()
  @IpToString()
  ip: number;

  @Expose()
  port: number;

  @Expose()
  ipType: number;

  @Expose()
  protocol: number;

  @Expose()
  placeholder1: number;

  @Expose()
  placeholder2: number;
  constructor(partial: Partial<AxonInfoDto>) {
    Object.assign(this, partial);
  }
}
