from typing import Any, List, Tuple

from pydantic import BaseModel, field_validator


class SubnetHyperparameters(BaseModel):
    rho: int
    kappa: int
    immunityPeriod: int
    minAllowedWeights: int
    maxWeightsLimit: int
    tempo: int
    minDifficulty: int
    maxDifficulty: int
    difficulty: int
    weightsVersion: int
    weightsRateLimit: int
    adjustmentInterval: int
    activityCutoff: int
    registrationAllowed: bool
    targetRegsPerInterval: int
    minBurn: int
    maxBurn: int
    bondsMovingAvg: int
    maxRegsPerBlock: int
    servingRateLimit: int
    maxValidators: int
    adjustmentAlpha: int
    commitRevealPeriod: int
    commitRevealWeightsEnabled: bool
    alphaHigh: int
    alphaLow: int
    liquidAlphaEnabled: bool

    @field_validator(
        "difficulty", "minDifficulty", "maxDifficulty", "adjustmentAlpha", mode="before"
    )
    def validate_hex_number(cls, v: Any) -> Any:
        if isinstance(v, str) and v.startswith("0x"):
            return int(v, 16)
        elif isinstance(v, int):
            return v
        return v

    class Config:
        arbitrary_types_allowed = False


class ServeAxonPayload(BaseModel):
    netuid: int
    version: int = 1
    ip: int
    port: int
    ipType: int
    protocol: int
    placeholder1: int = 0
    placeholder2: int = 0


class SetWeightsPayload(BaseModel):
    netuid: int
    dests: List[int]
    weights: List[int]  # Normalized weights
    version_key: int


class CommitRevealPayload(BaseModel):
    netuid: int
    commit: int | bytes
    reveal_round: int


class MovingPrice(BaseModel):
    bits: int


class SubnetIdentity(BaseModel):
    subnetName: str
    githubRepo: str
    subnetContact: str
    subnetUrl: str
    discord: str
    description: str
    additional: str


class IdentitiesInfo(BaseModel):
    name: str
    url: str
    githubRepo: str
    image: str
    discord: str
    description: str
    additional: str


class AxonInfo(BaseModel):
    block: int
    version: int
    ip: str
    port: int
    ipType: int
    protocol: int
    placeholder1: int
    placeholder2: int


class SubnetMetagraph(BaseModel):
    netuid: int
    name: str
    symbol: str
    identity: SubnetIdentity
    networkRegisteredAt: int
    ownerHotkey: str
    ownerColdkey: str
    block: int
    tempo: int
    lastStep: int
    blocksSinceLastStep: int
    subnetEmission: int
    alphaIn: float
    alphaOut: float
    taoIn: float
    alphaOutEmission: float
    alphaInEmission: float
    taoInEmission: float
    pendingAlphaEmission: float
    pendingRootEmission: float
    subnetVolume: float
    movingPrice: MovingPrice
    rho: int
    kappa: int
    # # TODO: not sure if this field is present
    # minAllowedWeights: int
    # # TODO: not sure if this field is present
    # maxAllowedWeights: int
    weightsVersion: int
    weightsRateLimit: int
    activityCutoff: int
    maxValidators: int
    numUids: int
    maxUids: int
    burn: int
    difficulty: int
    registrationAllowed: bool
    powRegistrationAllowed: bool
    immunityPeriod: int
    minDifficulty: int
    maxDifficulty: int
    minBurn: int
    maxBurn: int
    adjustmentAlpha: int
    adjustmentInterval: int
    targetRegsPerInterval: int
    maxRegsPerBlock: int
    servingRateLimit: int
    commitRevealWeightsEnabled: bool
    commitRevealPeriod: int
    liquidAlphaEnabled: bool
    alphaHigh: int
    alphaLow: int
    bondsMovingAvg: int
    hotkeys: List[str]
    coldkeys: List[str]
    identities: List[IdentitiesInfo | None]
    axons: List[AxonInfo]
    active: List[bool]
    validatorPermit: List[bool]
    pruningScore: List[int]
    lastUpdate: List[int]
    emission: List[float]
    dividends: List[float]
    incentives: List[float]
    consensus: List[float]
    trust: List[float]
    rank: List[float]
    blockAtRegistration: List[int]
    alphaStake: List[float]
    taoStake: List[float]
    totalStake: List[float]
    taoDividendsPerHotkey: List[Tuple[str, float]]
    alphaDividendsPerHotkey: List[Tuple[str, float]]

    @field_validator(
        "difficulty", "minDifficulty", "maxDifficulty", "adjustmentAlpha", mode="before"
    )
    def validate_hex_number(cls, v: Any) -> Any:
        if isinstance(v, str) and v.startswith("0x"):
            return int(v, 16)
        elif isinstance(v, int):
            return v
        return v

    class Config:
        arbitrary_types_allowed = False
