import { DivideBy } from '@app/decorators';
import { UnicodeToString } from 'src/decorators/unicode-to-string-transform.decorator';
import { UtfToString } from 'src/decorators/utf-to-string-transform.decorator';

import { ApiProperty } from '@nestjs/swagger';

import { AxonInfoDto } from './axon-info.dto';
import { IdentitiesInfoDto } from './identities-info.dto';
import { SubnetIdentityDto } from './subnet-identity.dto';

export class SubnetMetagraphDto {
  @ApiProperty({
    description: 'The subnet UID',
    example: 1,
  })
  netuid: number;

  @ApiProperty({
    description: 'The subnet name',
    example: 'Tensorplex Dojo',
  })
  @UnicodeToString()
  name: number[];

  @ApiProperty({
    description: 'The subnet symbol',
    example: 'ا',
  })
  @UtfToString()
  symbol: number[];

  @ApiProperty({
    description: 'The subnet identity',
    type: SubnetIdentityDto,
  })
  identity: SubnetIdentityDto;

  @ApiProperty({
    description: 'The network registered at',
    example: 3989825,
  })
  networkRegisteredAt: number;

  @ApiProperty({
    description: 'The owner hotkey',
    example: '5EgfUiH6A99dhihMzp7eMM8UDkvmFjCWgM5gnpBN8UgLrVuz',
  })
  ownerHotkey: string;

  @ApiProperty({
    description: 'The owner coldkey',
    example: '5EgfUiH6A99dhihMzp7eMM8UDkvmFjCWgM5gnpBN8UgLrVuz',
  })
  ownerColdkey: string;

  @ApiProperty({
    description: 'Current block',
    example: 3989825,
  })
  block: number;

  @ApiProperty({
    description: 'The tempo',
    example: 360,
  })
  tempo: number;

  @ApiProperty({
    description: 'Last step',
    example: 170,
  })
  lastStep: number;

  @ApiProperty({
    description: 'Blocks since last step',
    example: 3989825,
  })
  blocksSinceLastStep: number;

  @ApiProperty({
    description: 'Subnet emission',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  subnetEmission: number;

  @ApiProperty({
    description: 'alpha_in',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  alphaIn: number;

  @ApiProperty({
    description: 'alpha_out',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  alphaOut: number;

  @ApiProperty({
    description: 'tao_in',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  taoIn: number;

  @ApiProperty({
    description: 'alpha_out_emission',
    example: 1,
  })
  @DivideBy(1_000_000_000)
  alphaOutEmission: number;

  @ApiProperty({
    description: 'alpha_in_emission',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  alphaInEmission: number;

  @ApiProperty({
    description: 'tao_in_emission',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  taoInEmission: number;

  @ApiProperty({
    description: 'pending_alpha_emission',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  pendingAlphaEmission: number;

  @ApiProperty({
    description: 'pending_root_emission',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  pendingRootEmission: number;

  @ApiProperty({
    description: 'subnet_volume',
    example: 0,
  })
  @DivideBy(1_000_000_000)
  subnetVolume: number;

  @ApiProperty({
    description: 'moving_price',
    example: {
      bits: 0,
    },
  })
  movingPrice: {
    bits: number;
  };

  @ApiProperty({
    description: 'rho',
    example: 0,
  })
  rho: number;

  @ApiProperty({
    description: 'kappa',
    example: 0,
  })
  kappa: number;

  @ApiProperty({
    description: 'Min Allowed Weights',
    example: 0,
  })
  minAllowedWeights: number;

  @ApiProperty({
    description: 'Max Allowed Weights',
    example: 0,
  })
  maxAllowedWeights: number;

  @ApiProperty({
    description: 'Weights Version',
    example: 0,
  })
  weightsVersion: number;

  @ApiProperty({
    description: 'Weights Rate Limit',
    example: 0,
  })
  weightsRateLimit: number;

  @ApiProperty({
    description: 'Activity Cutoff',
    example: 0,
  })
  activityCutoff: number;

  @ApiProperty({
    description: 'Max Validators',
    example: 0,
  })
  maxValidators: number;

  @ApiProperty({
    description: 'Current number of UIDs',
    example: 0,
  })
  numUids: number;

  @ApiProperty({
    description: 'Max UIDs',
    example: 0,
  })
  maxUids: number;

  @ApiProperty({
    description: 'Burn',
    example: 0,
  })
  burn: number;

  @ApiProperty({
    description: 'Difficulty',
    example: 0,
  })
  difficulty: number;

  @ApiProperty({
    description: 'Registration Allowed',
    example: false,
  })
  registrationAllowed: boolean;

  @ApiProperty({
    description: 'Pow Registration Allowed',
    example: false,
  })
  powRegistrationAllowed: boolean;

  @ApiProperty({
    description: 'Immunity Period',
    example: 0,
  })
  immunityPeriod: number;

  @ApiProperty({
    description: 'Min Difficulty',
    example: 0,
  })
  minDifficulty: number;

  @ApiProperty({
    description: 'Max Difficulty',
    example: 1,
  })
  // TODO: Convert to number, is it bigint?
  maxDifficulty: string;

  @ApiProperty({
    description: 'Min Burn',
    example: 0,
  })
  minBurn: number;

  @ApiProperty({
    description: 'Max Burn',
    example: 0,
  })
  maxBurn: number;

  @ApiProperty({
    description: 'Adjustment Alpha',
    example: 0,
  })
  // TODO: Convert to number, is it bigint?
  adjustmentAlpha: string;

  @ApiProperty({
    description: 'Adjustment Interval',
    example: 0,
  })
  adjustmentInterval: number;

  @ApiProperty({
    description: 'Target Registrations Per Interval',
    example: 0,
  })
  targetRegsPerInterval: number;

  @ApiProperty({
    description: 'Max Registrations Per Block',
    example: 0,
  })
  maxRegsPerBlock: number;

  @ApiProperty({
    description: 'Serving Rate Limit',
    example: 0,
  })
  servingRateLimit: number;

  @ApiProperty({
    description: 'Commit Reveal Weights Enabled',
    example: false,
  })
  commitRevealWeightsEnabled: boolean;

  @ApiProperty({
    description: 'Commit Reveal Epoch',
    example: 0,
  })
  commitRevealPeriod: number;

  @ApiProperty({
    description: 'Liquid Alpha Enabled',
    example: false,
  })
  liquidAlphaEnabled: boolean;

  @ApiProperty({
    description: 'Alpha High',
    example: 0,
  })
  alphaHigh: number;

  @ApiProperty({
    description: 'Alpha Low',
    example: 0,
  })
  alphaLow: number;

  @ApiProperty({
    description: 'Bonds Moving Average',
    example: 0,
  })
  bondsMovingAvg: number;

  @ApiProperty({
    description: 'Hotkeys',
    example: [],
  })
  hotkeys: string[];

  @ApiProperty({
    description: 'Coldkeys',
    example: [],
  })
  coldkeys: string[];

  @ApiProperty({
    description: 'Identities',
    type: [IdentitiesInfoDto],
  })
  identities: (IdentitiesInfoDto | null)[];

  @ApiProperty({
    description: 'Axons',
    type: [AxonInfoDto],
  })
  axons: AxonInfoDto[];

  @ApiProperty({
    description: 'Active',
    example: [false],
  })
  active: boolean[];

  @ApiProperty({
    description: 'Validator Permit',
    example: [false],
  })
  validatorPermit: boolean[];

  @ApiProperty({
    description: 'Pruning Score',
    example: [0],
  })
  pruningScore: number[];

  @ApiProperty({
    description: 'Last Update',
    example: [0],
  })
  lastUpdate: number[];

  @ApiProperty({
    description: 'Emission',
    example: [0],
  })
  @DivideBy(1_000_000_000)
  emission: number[];

  @ApiProperty({
    description: 'Dividends',
    example: [0],
  })
  @DivideBy(65535)
  dividends: number[];

  @ApiProperty({
    description: 'Incentives',
    example: [0],
  })
  @DivideBy(65535)
  incentives: number[];

  @ApiProperty({
    description: 'Consensus',
    example: [0],
  })
  @DivideBy(65535)
  consensus: number[];

  @ApiProperty({
    description: 'Trust',
    example: [0],
  })
  @DivideBy(65535)
  trust: number[];

  @ApiProperty({
    description: 'Rank',
    example: [0],
  })
  @DivideBy(65535)
  rank: number[];

  @ApiProperty({
    description: 'Block At Registration',
    example: [0],
  })
  blockAtRegistration: number[];

  @ApiProperty({
    description: 'Alpha Stake',
    example: [0],
  })
  @DivideBy(1_000_000_000)
  alphaStake: number[];

  @ApiProperty({
    description: 'Root Stake',
    example: [0],
  })
  @DivideBy(1_000_000_000)
  taoStake: number[];

  @ApiProperty({
    description: 'Total Stake',
    example: [0],
  })
  @DivideBy(1_000_000_000)
  totalStake: number[];

  @ApiProperty({
    description: 'Tao Dividends Per Hotkey',
    example: ['', 0],
  })
  taoDividendsPerHotkey: [string, number][];

  @ApiProperty({
    description: 'Alpha Dividends Per Hotkey',
    example: ['', 0],
  })
  alphaDividendsPerHotkey: [string, number][];

  constructor(partial: Partial<SubnetMetagraphDto>) {
    Object.assign(this, partial);
  }
}
