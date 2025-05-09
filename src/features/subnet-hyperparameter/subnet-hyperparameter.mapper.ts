import { plainToClass } from 'class-transformer';

import { Injectable } from '@nestjs/common';

import { SubnetHyperparamsResponseDto } from './subnet-hyperparameter.dto';
import { SubnetHyperparameters } from './subnet-hyperparameter.interface';

@Injectable()
export class SubnetHyperparameterMapper {
  toDto(subnetHyperparameter: SubnetHyperparameters): SubnetHyperparamsResponseDto {
    const plainDto = {
      rho: subnetHyperparameter.rho,
      kappa: subnetHyperparameter.kappa,
      immunityPeriod: subnetHyperparameter.immunityPeriod,
      minAllowedWeights: subnetHyperparameter.minAllowedWeights,
      maxWeightsLimit: subnetHyperparameter.maxWeightsLimit,
      tempo: subnetHyperparameter.tempo,
      minDifficulty: subnetHyperparameter.minDifficulty,
      maxDifficulty: subnetHyperparameter.maxDifficulty,
      weightsVersion: subnetHyperparameter.weightsVersion,
      weightsRateLimit: subnetHyperparameter.weightsRateLimit,
      adjustmentInterval: subnetHyperparameter.adjustmentInterval,
      activityCutoff: subnetHyperparameter.activityCutoff,
      registrationAllowed: subnetHyperparameter.registrationAllowed,
      targetRegsPerInterval: subnetHyperparameter.targetRegsPerInterval,
      minBurn: subnetHyperparameter.minBurn,
      maxBurn: subnetHyperparameter.maxBurn,
      bondsMovingAvg: subnetHyperparameter.bondsMovingAvg,
      servingRateLimit: subnetHyperparameter.servingRateLimit,
      maxValidators: subnetHyperparameter.maxValidators,
      maxRegsPerBlock: subnetHyperparameter.maxRegsPerBlock,
      adjustmentAlpha: subnetHyperparameter.adjustmentAlpha,
      difficulty: subnetHyperparameter.difficulty,
      commitRevealPeriod: subnetHyperparameter.commitRevealPeriod,
      commitRevealWeightsEnabled: subnetHyperparameter.commitRevealWeightsEnabled,
      alphaHigh: subnetHyperparameter.alphaHigh,
      alphaLow: subnetHyperparameter.alphaLow,
      liquidAlphaEnabled: subnetHyperparameter.liquidAlphaEnabled,
    };

    // Use class-transformer to apply decorators
    return plainToClass(SubnetHyperparamsResponseDto, plainDto);
  }
}
