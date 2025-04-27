import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SubnetHyperparamsDto {
  @IsNumber()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  netuid: number;
}

export class SubnetHyperparamsResponseDto {
  @ApiProperty({
    description:
      'Scaling factor in the sigmoid that normalises the steepness of the sigmoid curve.',
  })
  rho: number;

  @ApiProperty({
    description:
      'The consensus majority ratio: The weights set by validators who have lower normalized stake than Kappa are not used in calculating consensus, which affects ranks, which affect incentives. The consensus threshold for bond-clipping during [Yuma Consensus](https://docs.bittensor.com/yuma-consensus).',
  })
  kappa: number;

  @ApiProperty({
    description:
      'The number of blocks after registration when a miner is protected from deregistration.',
  })
  immunityPeriod: number;

  @ApiProperty({
    description: 'Minimum number of weights for a validator to set when setting weights.',
  })
  minAllowedWeights: number;

  @ApiProperty({
    description:
      'The limit for the u16-normalized weights. If some weight is greater than this limit when all weights are normalized so that maximum weight is 65535, then it will not be used.',
  })
  maxWeightsLimit: number;

  @ApiProperty({
    description:
      'Length of subnet tempo in blocks. See [Emissions](https://docs.bittensor.com/emissions).',
  })
  tempo: number;

  @ApiProperty({
    description: 'The minimum of the range of the proof-of-work for registering on the subnet.',
  })
  minDifficulty: number;

  @ApiProperty({
    description:
      'The maximum of the dynamic range for difficulty of proof-of-work registration on the subnet.',
  })
  maxDifficulty: number;

  @ApiProperty({
    description:
      'If the version key specified in set_weights extrinsic is lower than this system-wide setting (WeightsVersionKey), the transaction will fail. This is a fool-proofing protection for validators to update, not a security feature.',
  })
  weightsVersion: number;

  @ApiProperty({
    description: 'How long, in blocks, a validator must wait between weight commits on a subnet.',
  })
  weightsRateLimit: number;

  @ApiProperty({
    description:
      'AdjustmentInterval is number of blocks that pass between difficulty and burn adjustments. So, I was wrong about "next block" when I said that if root sets difficulty outside of range, it will get back in range. Difficulty will get back in range at most after AdjustmentInterval blocks pass.',
  })
  adjustmentInterval: number;

  @ApiProperty({
    description:
      "The number of blocks for the stake to become inactive for the purpose of epoch in Yuma Consensus. If a validator doesn't submit weights within the first ActivityCutoff blocks of the epoch, it will not be able to participate until the start of the next epoch.",
  })
  activityCutoff: number;

  @ApiProperty({
    description:
      'NetworkRegistrationAllowed determines if burned registrations are allowed. If both burned and pow registrations are disabled, the subnet will not get emissions.',
  })
  registrationAllowed: boolean;

  @ApiProperty({
    description:
      'Maximum number of neuron registrations allowed per interval. Interval is AdjustmentInterval.',
  })
  targetRegsPerInterval: number;

  @ApiProperty({
    description: 'The minimum of the range of the dynamic burn cost for registering on the subnet.',
  })
  minBurn: number;

  @ApiProperty({
    description: 'he maximum of the dynamic range for TAO cost of burn registration on the subnet.',
  })
  maxBurn: number;

  @ApiProperty({
    description:
      'The moving average of bonds. The higher bonds yield to higher dividends for validators. See [Yuma Consensus: bonding mechanics](https://docs.bittensor.com/yuma-consensus#bonding-mechanics).',
  })
  bondsMovingAvg: number;

  @ApiProperty({
    description:
      'Maximum neuron registrations per block. Note: Actual limit may be lower, as there is also per interval limit TargetRegistrationsPerInterval.',
  })
  maxRegsPerBlock: number;

  @ApiProperty({
    description:
      'Rate limit for calling serve_axon and serve_prometheus extrinsics used by miners.',
  })
  servingRateLimit: number;

  @ApiProperty({ description: 'Maximum validators on a subnet.' })
  maxValidators: number;

  @ApiProperty({
    description: 'AdjustmentAlpha is the rate at which difficulty and burn are adjusted up or down',
  })
  adjustmentAlpha: number;

  @ApiProperty({
    description:
      'Current dynamically computed value for the proof-of-work (POW) requirement for POW hotkey registration. Decreases over time but increases after new registrations, between the min and the maximum set by the subnet creator.',
  })
  difficulty: number;

  @ApiProperty({
    description:
      'How long, in blocks, the consensus weights for a subnet remain time-lock encrypted, preventing weight-copying.',
  })
  commitRevealPeriod: number;

  @ApiProperty({
    description:
      'Enables Commit Reveal. See [Commit Reveal](https://docs.bittensor.com/subnets/commit-reveal).',
  })
  commitRevealWeightsEnabled: boolean;

  @ApiProperty({ description: 'Upper bounds for the liquid alpha parameter.' })
  alphaHigh: number;

  @ApiProperty({ description: 'Lower bounds for the liquid alpha parameter.' })
  alphaLow: number;

  @ApiProperty({
    description:
      'Enables the [liquid alpha](https://docs.bittensor.com/subnets/consensus-based-weights) feature.',
  })
  liquidAlphaEnabled: boolean;
}
