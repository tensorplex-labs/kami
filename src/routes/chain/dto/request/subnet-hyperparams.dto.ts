import { IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SubnetHyperparamsDto {
  @IsNumber()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  netuid: number;
}