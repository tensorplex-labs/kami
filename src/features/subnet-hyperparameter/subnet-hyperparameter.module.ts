import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { SubnetHyperparameterController } from './subnet-hyperparameter.controller';
import { SubnetHyperparameterMapper } from './subnet-hyperparameter.mapper';
import { SubnetHyperparameterService } from './subnet-hyperparameter.service';

@Module({
  imports: [SubstrateModule],
  controllers: [SubnetHyperparameterController],
  providers: [SubnetHyperparameterService, SubnetHyperparameterMapper],
})
export class SubnetHyperparameterModule {}
