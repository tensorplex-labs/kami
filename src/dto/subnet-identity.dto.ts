import { HexToString } from '@app/decorators';

import { ApiProperty } from '@nestjs/swagger';

export class SubnetIdentityDto {
  @ApiProperty({
    description: 'The subnet name',
    example: 'Dojo',
  })
  @HexToString()
  subnetName: string;

  @ApiProperty({
    description: 'The GitHub repository',
    example: 'https://github.com/tensorplex-labs/dojo',
  })
  @HexToString()
  githubRepo: string;

  @ApiProperty({
    description: 'The contact URL',
    example: 'jarvis@tensorplex.ai',
  })
  @HexToString()
  subnetContact: string;

  @ApiProperty({
    description: 'The URL',
    example: 'https://dojo.network',
  })
  @HexToString()
  subnetUrl: string;

  @ApiProperty({
    description: 'The Discord URL',
    example: 'https://discord.com/channels/799672011265015819/1213131262483628102',
  })
  @HexToString()
  discord: string;

  @ApiProperty({
    description: 'The description',
    example: 'Premier Infrastructure Layer for Human Intelligence.',
  })
  @HexToString()
  description: string;

  @ApiProperty({
    description: 'The additional information',
    example: '~',
  })
  @HexToString()
  additional: string;

  constructor(partial: Partial<SubnetIdentityDto>) {
    Object.assign(this, partial);
  }
}
