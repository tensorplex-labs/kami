from kami import Kami
from kami.types import SetWeightsPayload
import os
from dotenv import load_dotenv

async def main():
    load_dotenv()
    kami = Kami()
    netuid = os.getenv("NETUID")
    uids = [1, 2, 3]
    weights = [1000, 2000, 3000]
    version_key = 1

    payload = SetWeightsPayload(netuid=int(netuid), dests=uids, weights=weights, version_key=version_key)
    await kami.set_weights(payload)
    ## Sets Commit Reveal weights automatically if Commit Reveal is enabled


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
