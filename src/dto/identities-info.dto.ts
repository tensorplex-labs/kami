import { HexToString } from '@app/decorators';

import { ApiProperty } from '@nestjs/swagger';

export class IdentitiesInfoDto {
  @ApiProperty({
    description: 'Name',
    example: '',
  })
  @HexToString()
  name: string;

  @ApiProperty({
    description: 'URL',
    example: '',
  })
  @HexToString()
  url: string;

  @ApiProperty({
    description: 'GitHub Repository',
    example: '',
  })
  @HexToString()
  githubRepo: string;

  @ApiProperty({
    description: 'Image',
    example: '',
  })
  @HexToString()
  image: string;

  @ApiProperty({
    description: 'Discord',
    example: '',
  })
  @HexToString()
  discord: string;

  @ApiProperty({
    description: 'Description',
    example: '',
  })
  @HexToString()
  description: string;

  @ApiProperty({
    description: 'Additional',
    example: '',
  })
  @HexToString()
  additional: string;

  constructor(partial: Partial<IdentitiesInfoDto>) {
    Object.assign(this, partial);
  }
}
