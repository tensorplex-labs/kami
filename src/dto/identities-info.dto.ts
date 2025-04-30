import { HexToString } from '@app/decorators';
import { Expose } from 'class-transformer';

export class IdentitiesInfoDto {
  @Expose()
  @HexToString()
  name: string;

  @Expose()
  @HexToString()
  url: string;

  @Expose()
  @HexToString()
  githubRepo: string;

  @Expose()
  @HexToString()
  image: string;

  @Expose()
  @HexToString()
  discord: string;

  @Expose()
  @HexToString()
  description: string;

  @Expose()
  @HexToString()
  additional: string;

  constructor(partial: Partial<IdentitiesInfoDto>) {
    Object.assign(this, partial);
  }
}
