import { plainToClass } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { AxonInfoDto, IdentitiesInfoDto, SubnetIdentityDto } from '../../commons/dto';
import { SubnetMetagraphDto } from './subnet-metagraph.dto';
import { SubnetMetagraph } from './subnet-metagraph.interface';

@Injectable()
export class SubnetMetagraphMapper {
  toDto(subnetMetagraph: SubnetMetagraph): SubnetMetagraphDto {
    // Create object with all properties
    const plainDto = {
      netuid: subnetMetagraph.netuid,
      name: subnetMetagraph.name,
      symbol: subnetMetagraph.symbol,
      identity: subnetMetagraph.identity // this will check if identity is null or not, if it is null, it will assign an empty string
        ? new SubnetIdentityDto({
            subnetName: subnetMetagraph.identity.subnetName,
            githubRepo: subnetMetagraph.identity.githubRepo,
            subnetContact: subnetMetagraph.identity.subnetContact,
            subnetUrl: subnetMetagraph.identity.subnetUrl,
            discord: subnetMetagraph.identity.discord,
            description: subnetMetagraph.identity.description,
            additional: subnetMetagraph.identity.additional,
          })
        : new SubnetIdentityDto({
            subnetName: '',
            githubRepo: '',
            subnetContact: '',
            subnetUrl: '',
            discord: '',
            description: '',
            additional: '',
          }),
      networkRegisteredAt: subnetMetagraph.networkRegisteredAt,
      ownerHotkey: subnetMetagraph.ownerHotkey,
      ownerColdkey: subnetMetagraph.ownerColdkey,
      block: subnetMetagraph.block,
      tempo: subnetMetagraph.tempo,
      lastStep: subnetMetagraph.lastStep,
      blocksSinceLastStep: subnetMetagraph.blocksSinceLastStep,
      subnetEmission: subnetMetagraph.subnetEmission,
      alphaIn: subnetMetagraph.alphaIn,
      alphaOut: subnetMetagraph.alphaOut,
      taoIn: subnetMetagraph.taoIn,
      alphaOutEmission: subnetMetagraph.alphaOutEmission,
      alphaInEmission: subnetMetagraph.alphaInEmission,
      taoInEmission: subnetMetagraph.taoInEmission,
      pendingAlphaEmission: subnetMetagraph.pendingAlphaEmission,
      pendingRootEmission: subnetMetagraph.pendingRootEmission,
      subnetVolume: subnetMetagraph.subnetVolume,
      movingPrice: subnetMetagraph.movingPrice,
      rho: subnetMetagraph.rho,
      kappa: subnetMetagraph.kappa,
      minAllowedWeights: subnetMetagraph.minAllowedWeights,
      maxAllowedWeights: subnetMetagraph.maxAllowedWeights,
      weightsVersion: subnetMetagraph.weightsVersion,
      weightsRateLimit: subnetMetagraph.weightsRateLimit,
      activityCutoff: subnetMetagraph.activityCutoff,
      maxValidators: subnetMetagraph.maxValidators,
      numUids: subnetMetagraph.numUids,
      maxUids: subnetMetagraph.maxUids,
      burn: subnetMetagraph.burn,
      difficulty: subnetMetagraph.difficulty,
      registrationAllowed: subnetMetagraph.registrationAllowed,
      powRegistrationAllowed: subnetMetagraph.powRegistrationAllowed,
      immunityPeriod: subnetMetagraph.immunityPeriod,
      minDifficulty: subnetMetagraph.minDifficulty,
      maxDifficulty: subnetMetagraph.maxDifficulty,
      minBurn: subnetMetagraph.minBurn,
      maxBurn: subnetMetagraph.maxBurn,
      adjustmentAlpha: subnetMetagraph.adjustmentAlpha,
      adjustmentInterval: subnetMetagraph.adjustmentInterval,
      targetRegsPerInterval: subnetMetagraph.targetRegsPerInterval,
      maxRegsPerBlock: subnetMetagraph.maxRegsPerBlock,
      servingRateLimit: subnetMetagraph.servingRateLimit,
      commitRevealWeightsEnabled: subnetMetagraph.commitRevealWeightsEnabled,
      commitRevealPeriod: subnetMetagraph.commitRevealPeriod,
      liquidAlphaEnabled: subnetMetagraph.liquidAlphaEnabled,
      alphaHigh: subnetMetagraph.alphaHigh,
      alphaLow: subnetMetagraph.alphaLow,
      bondsMovingAvg: subnetMetagraph.bondsMovingAvg,
      hotkeys: subnetMetagraph.hotkeys,
      coldkeys: subnetMetagraph.coldkeys,
      identities: subnetMetagraph.identities.map(identity =>
        identity
          ? new IdentitiesInfoDto({
              name: identity.name,
              url: identity.url,
              githubRepo: identity.githubRepo,
              image: identity.image,
              discord: identity.discord,
              description: identity.description,
              additional: identity.additional,
            })
          : null,
      ),
      axons: subnetMetagraph.axons.map(
        axon =>
          new AxonInfoDto({
            block: axon.block,
            version: axon.version,
            ip: axon.ip,
            port: axon.port,
            ipType: axon.ipType,
            protocol: axon.protocol,
            placeholder1: axon.placeholder1,
            placeholder2: axon.placeholder2,
          }),
      ),
      active: subnetMetagraph.active,
      validatorPermit: subnetMetagraph.validatorPermit,
      pruningScore: subnetMetagraph.pruningScore,
      lastUpdate: subnetMetagraph.lastUpdate,
      emission: subnetMetagraph.emission,
      dividends: subnetMetagraph.dividends,
      incentives: subnetMetagraph.incentives,
      consensus: subnetMetagraph.consensus,
      trust: subnetMetagraph.trust,
      rank: subnetMetagraph.rank,
      blockAtRegistration: subnetMetagraph.blockAtRegistration,
      alphaStake: subnetMetagraph.alphaStake,
      taoStake: subnetMetagraph.taoStake,
      totalStake: subnetMetagraph.totalStake,
      taoDividendsPerHotkey: subnetMetagraph.taoDividendsPerHotkey.map(([hotkey, amount]) => [
        hotkey,
        amount / 1_000_000_000,
      ]),
      alphaDividendsPerHotkey: subnetMetagraph.alphaDividendsPerHotkey.map(([hotkey, amount]) => [
        hotkey,
        amount / 1_000_000_000,
      ]),
    };

    // Use class-transformer to apply decorators
    return plainToClass(SubnetMetagraphDto, plainDto);
  }
}
