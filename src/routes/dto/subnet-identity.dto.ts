import { Expose } from 'class-transformer';
import { HexToString } from '@app/decorators';

export class SubnetIdentityDto {
  @Expose()
  @HexToString()
  subnetName: string;

  @Expose()
  @HexToString()
  githubRepo: string;

  @Expose()
  @HexToString()
  subnetContact: string;

  @Expose()
  @HexToString()
  subnetUrl: string;

  @Expose()
  @HexToString()
  discord: string;

  @Expose()
  @HexToString()
  description: string;

  @Expose()
  @HexToString()
  additional: string;

  constructor(partial: Partial<SubnetIdentityDto>) {
    Object.assign(this, partial);
  }
}
