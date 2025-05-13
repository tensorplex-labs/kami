import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({
    description: 'Error Type Enum Defined in Exception',
    example: 'SUBNET_METAGRAPH.NOT_FOUND',
  })
  type: string;

  @ApiProperty({
    description: 'Error Message',
    example: 'Subnet metagraph with ID 1000 not found',
  })
  message: string;

  @ApiProperty({
    description: 'Error Stack Trace',
    required: false,
  })
  stackTrace?: string;
}

export class ApiResponseDto {
  @ApiProperty({
    description: 'Status Code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Success',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Data',
    example: null,
  })
  data: any | null;

  @ApiProperty({
    description: 'Error Details',
    type: ErrorDto,
    example: null,
  })
  error: ErrorDto | null;

  constructor(partial: Partial<ApiResponseDto>) {
    Object.assign(this, partial);
  }
}
