import { Expose } from 'class-transformer';
import { UnicodeToString } from 'src/decorators/unicode-to-string-transform.decorator';
import { UtfToString } from 'src/decorators/utf-to-string-transform.decorator';
import { SubnetIdentityDto } from './subnet-identity.dto';
import { AxonInfoDto } from './axon-info.dto';
import { IdentitiesInfoDto } from './identities-info.dto';
import { DivideBy } from '@app/decorators';

export class SubnetMetagraphDto {
  @Expose()
  netuid: number;

  @Expose()
  @UnicodeToString()
  name: number[];

  @Expose()
  @UtfToString()
  symbol: number[];

  @Expose()
  identity: SubnetIdentityDto;

  @Expose()
  networkRegisteredAt: number;

  @Expose()
  ownerHotkey: string;

  @Expose()
  ownerColdkey: string;

  @Expose()
  block: number;

  @Expose()
  tempo: number;

  @Expose()
  lastStep: number;

  @Expose()
  blocksSinceLastStep: number;

  @Expose()
  @DivideBy(1_000_000_000)
  subnetEmission: number;

  @Expose()
  @DivideBy(1_000_000_000)
  alphaIn: number;

  @Expose()
  @DivideBy(1_000_000_000)
  alphaOut: number;

  @Expose()
  @DivideBy(1_000_000_000)
  taoIn: number;

  @Expose()
  @DivideBy(1_000_000_000)
  alphaOutEmission: number;

  @Expose()
  @DivideBy(1_000_000_000)
  alphaInEmission: number;

  @Expose()
  @DivideBy(1_000_000_000)
  taoInEmission: number;

  @Expose()
  @DivideBy(1_000_000_000)
  pendingAlphaEmission: number;

  @Expose()
  @DivideBy(1_000_000_000)
  pendingRootEmission: number;

  @Expose()
  @DivideBy(1_000_000_000)
  subnetVolume: number;

  @Expose()
  movingPrice: {
    bits: number;
  };

  @Expose()
  rho: number;

  @Expose()
  kappa: number;

  @Expose()
  minAllowedWeights: number;

  @Expose()
  maxAllowedWeights: number;

  @Expose()
  weightsVersion: number;

  @Expose()
  weightsRateLimit: number;

  @Expose()
  activityCutoff: number;

  @Expose()
  maxValidators: number;

  @Expose()
  numUids: number;

  @Expose()
  maxUids: number;

  @Expose()
  burn: number;

  @Expose()
  difficulty: number;

  @Expose()
  registrationAllowed: boolean;

  @Expose()
  powRegistrationAllowed: boolean;

  @Expose()
  immunityPeriod: number;

  @Expose()
  minDifficulty: number;

  @Expose()
  maxDifficulty: string;

  @Expose()
  minBurn: number;

  @Expose()
  maxBurn: number;

  @Expose()
  adjustmentAlpha: string;

  @Expose()
  adjustmentInterval: number;

  @Expose()
  targetRegsPerInterval: boolean;

  @Expose()
  maxRegsPerBlock: number;

  @Expose()
  servingRateLimit: number;

  @Expose()
  commitRevealWeightsEnabled: boolean;

  @Expose()
  commitRevealPeriod: number;

  @Expose()
  liquidAlphaEnabled: boolean;

  @Expose()
  alphaHigh: number;

  @Expose()
  alphaLow: number;

  @Expose()
  bondsMovingAvg: number;

  @Expose()
  hotkeys: string[];

  @Expose()
  coldkeys: string[];

  @Expose()
  identities: (IdentitiesInfoDto | null)[];

  @Expose()
  axons: AxonInfoDto[];

  @Expose()
  active: boolean[];

  @Expose()
  validatorPermit: boolean[];

  @Expose()
  pruningScore: number[];

  @Expose()
  lastUpdate: number[];

  @Expose()
  @DivideBy(1_000_000_000)
  emission: number[];

  @Expose()
  @DivideBy(65535)
  dividends: number[];

  @Expose()
  @DivideBy(65535)
  incentives: number[];

  @Expose()
  @DivideBy(65535)
  consensus: number[];

  @Expose()
  @DivideBy(65535)
  trust: number[];

  @Expose()
  @DivideBy(65535)
  rank: number[];

  @Expose()
  blockAtRegistration: number[];

  @Expose()
  @DivideBy(1_000_000_000)
  alphaStake: number[];

  @Expose()
  @DivideBy(1_000_000_000)
  taoStake: number[];

  @Expose()
  @DivideBy(1_000_000_000)
  totalStake: number[];

  @Expose()
  taoDividendsPerHotkey: [string, number][];

  @Expose()
  alphaDividendsPerHotkey: [string, number][];

  constructor(partial: Partial<SubnetMetagraphDto>) {
    Object.assign(this, partial);
  }
}
