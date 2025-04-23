import { Injectable } from "@nestjs/common";

import { SubnetMetagraph, SubnetIdentity } from "src/substrate/substrate.interface";
import { SubnetMetagraphDto } from "../dto/subnet-metagraph.dto";
import { SubnetIdentityDto } from "../dto/subnet-identity.dto";


@Injectable()
export class SubnetMetagraphMapper {
    toDto(subnetMetagraph: SubnetMetagraph): SubnetMetagraphDto {
        
        return new SubnetMetagraphDto({
            netuid: subnetMetagraph.netuid,
            name: subnetMetagraph.name,
            symbol: subnetMetagraph.symbol,
            identity: new SubnetIdentityDto({
                subnetName: subnetMetagraph.identity.subnetName,
                githubRepo: subnetMetagraph.identity.githubRepo,
                subnetContact: subnetMetagraph.identity.subnetContact,
                subnetUrl: subnetMetagraph.identity.subnetUrl,
                discord: subnetMetagraph.identity.discord,
                description: subnetMetagraph.identity.description,
                additional: subnetMetagraph.identity.additional,
            }),
        });
    }
}