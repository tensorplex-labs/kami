import { HexToString } from '@app/decorators';

export class SubnetIdentityDto {
  @HexToString()
  subnetName: string;

  @HexToString()
  githubRepo: string;

  @HexToString()
  subnetContact: string;

  @HexToString()
  subnetUrl: string;

  @HexToString()
  discord: string;

  @HexToString()
  description: string;

  @HexToString()
  additional: string;

  constructor(partial: Partial<SubnetIdentityDto>) {
    Object.assign(this, partial);
  }
}
