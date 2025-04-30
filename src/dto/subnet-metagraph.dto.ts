import { DivideBy } from '@app/decorators';
import { UnicodeToString } from 'src/decorators/unicode-to-string-transform.decorator';
import { UtfToString } from 'src/decorators/utf-to-string-transform.decorator';

import { AxonInfoDto } from './axon-info.dto';
import { IdentitiesInfoDto } from './identities-info.dto';
import { SubnetIdentityDto } from './subnet-identity.dto';

export class SubnetMetagraphDto {
  netuid: number;

  @UnicodeToString()
  name: number[];

  @UtfToString()
  symbol: number[];

  identity: SubnetIdentityDto;

  networkRegisteredAt: number;

  ownerHotkey: string;

  ownerColdkey: string;

  block: number;

  tempo: number;

  lastStep: number;

  blocksSinceLastStep: number;

  @DivideBy(1_000_000_000)
  subnetEmission: number;

  @DivideBy(1_000_000_000)
  alphaIn: number;

  @DivideBy(1_000_000_000)
  alphaOut: number;

  @DivideBy(1_000_000_000)
  taoIn: number;

  @DivideBy(1_000_000_000)
  alphaOutEmission: number;

  @DivideBy(1_000_000_000)
  alphaInEmission: number;

  @DivideBy(1_000_000_000)
  taoInEmission: number;

  @DivideBy(1_000_000_000)
  pendingAlphaEmission: number;

  @DivideBy(1_000_000_000)
  pendingRootEmission: number;

  @DivideBy(1_000_000_000)
  subnetVolume: number;

  movingPrice: {
    bits: number;
  };

  rho: number;

  kappa: number;

  minAllowedWeights: number;

  maxAllowedWeights: number;

  weightsVersion: number;

  weightsRateLimit: number;

  activityCutoff: number;

  maxValidators: number;

  numUids: number;

  maxUids: number;

  burn: number;

  difficulty: number;

  registrationAllowed: boolean;

  powRegistrationAllowed: boolean;

  immunityPeriod: number;

  minDifficulty: number;

  maxDifficulty: string;

  minBurn: number;

  maxBurn: number;

  adjustmentAlpha: string;

  adjustmentInterval: number;

  targetRegsPerInterval: boolean;

  maxRegsPerBlock: number;

  servingRateLimit: number;

  commitRevealWeightsEnabled: boolean;

  commitRevealPeriod: number;

  liquidAlphaEnabled: boolean;

  alphaHigh: number;

  alphaLow: number;

  bondsMovingAvg: number;

  hotkeys: string[];

  coldkeys: string[];

  identities: (IdentitiesInfoDto | null)[];

  axons: AxonInfoDto[];

  active: boolean[];

  validatorPermit: boolean[];

  pruningScore: number[];

  lastUpdate: number[];

  @DivideBy(1_000_000_000)
  emission: number[];

  @DivideBy(65535)
  dividends: number[];

  @DivideBy(65535)
  incentives: number[];

  @DivideBy(65535)
  consensus: number[];

  @DivideBy(65535)
  trust: number[];

  @DivideBy(65535)
  rank: number[];

  blockAtRegistration: number[];

  @DivideBy(1_000_000_000)
  alphaStake: number[];

  @DivideBy(1_000_000_000)
  taoStake: number[];

  @DivideBy(1_000_000_000)
  totalStake: number[];

  taoDividendsPerHotkey: [string, number][];

  alphaDividendsPerHotkey: [string, number][];

  constructor(partial: Partial<SubnetMetagraphDto>) {
    Object.assign(this, partial);
  }
}
