import { Expose } from "class-transformer";
import { SubnetIdentityDto } from "./subnet-identity.dto";
import { UnicodeToString } from "src/decorators/unicode-to-string-transform.decorator";
import { UtfToString } from "src/decorators/utf-to-string-transform.decorator";

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

    constructor(partial: Partial<SubnetMetagraphDto>) {
        Object.assign(this, partial)
    }
}
