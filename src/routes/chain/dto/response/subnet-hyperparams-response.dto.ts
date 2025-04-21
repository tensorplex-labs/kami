import { ApiProperty } from '@nestjs/swagger';

export class SubnetHyperparamsResponseDto {
  @ApiProperty({ description: 'Rho parameter for the subnet' })
  rho: number;

  @ApiProperty({ description: 'Kappa parameter for the subnet' })
  kappa: number;

  @ApiProperty({ description: 'Immunity period in blocks' })
  immunityPeriod: number;

  @ApiProperty({ description: 'Minimum allowed weights for neurons' })
  minAllowedWeights: number;

  @ApiProperty({ description: 'Maximum weights limit for neurons' })
  maxWeightsLimit: number;

  @ApiProperty({ description: 'Tempo parameter for the subnet' })
  tempo: number;

  @ApiProperty({ description: 'Minimum difficulty for subnet operations' })
  minDifficulty: number;

  @ApiProperty({ description: 'Maximum difficulty for subnet operations' })
  maxDifficulty: number;

  @ApiProperty({ description: 'Current weights version' })
  weightsVersion: number;

  @ApiProperty({ description: 'Rate limit for weight setting' })
  weightsRateLimit: number;

  @ApiProperty({ description: 'Interval for parameter adjustments' })
  adjustmentInterval: number;

  @ApiProperty({ description: 'Activity cutoff period in blocks' })
  activityCutoff: number;

  @ApiProperty({ description: 'Whether registration is allowed' })
  registrationAllowed: boolean;

  @ApiProperty({ description: 'Target registrations per interval' })
  targetRegsPerInterval: number;

  @ApiProperty({ description: 'Minimum burn amount for registration' })
  minBurn: number;

  @ApiProperty({ description: 'Maximum burn amount for registration' })
  maxBurn: number;

  @ApiProperty({ description: 'Moving average for bonds' })
  bondsMovingAvg: number;

  @ApiProperty({ description: 'Maximum registrations per block' })
  maxRegsPerBlock: number;

  @ApiProperty({ description: 'Rate limit for serving axons' })
  servingRateLimit: number;

  @ApiProperty({ description: 'Maximum number of validators' })
  maxValidators: number;

  @ApiProperty({ description: 'Alpha parameter for adjustments' })
  adjustmentAlpha: number;

  @ApiProperty({ description: 'Current difficulty level' })
  difficulty: number;

  @ApiProperty({ description: 'Commit-reveal period in blocks' })
  commitRevealPeriod: number;

  @ApiProperty({ description: 'Whether commit-reveal weights are enabled' })
  commitRevealWeightsEnabled: boolean;

  @ApiProperty({ description: 'High alpha parameter' })
  alphaHigh: number;

  @ApiProperty({ description: 'Low alpha parameter' })
  alphaLow: number;

  @ApiProperty({ description: 'Whether liquid alpha is enabled' })
  liquidAlphaEnabled: boolean;
}