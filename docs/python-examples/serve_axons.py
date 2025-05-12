from kami import Kami
from kami.types import ServeAxonPayload
import os
from dotenv import load_dotenv

from loguru import logger
import bittensor
from bittensor.utils.networking import ip_to_int, ip_version

async def main():
    load_dotenv()
    kami = Kami()


    wallet_name = os.getenv("WALLET_COLDKEY")
    wallet_hotkey = os.getenv("WALLET_HOTKEY")
    wallet_path = os.getenv("WALLET_PATH")
    netuid = os.getenv("NETUID")
    axon_port = os.getenv("AXON_PORT")
    wallet = bittensor.wallet(name=wallet_name, hotkey=wallet_hotkey, path=wallet_path)
    axon = bittensor.axon(wallet=wallet, port=int(axon_port))

    # Serve passes the axon information to the network + netuid we are hosting on.
    # This will auto-update if the axon port of external ip have changed.
    logger.info(f"Serving miner axon {axon} with netuid: {netuid}")

    axon_payload = ServeAxonPayload(
        netuid=netuid,
        port=axon.external_port,
        ip=ip_to_int(axon.external_ip),
        ipType=ip_version(axon.external_ip),
        protocol=ip_version(axon.external_ip),
        version=1,
    )
    print(f"Axon payload: {axon_payload}")
    if not await kami.check_if_axon_served(axon_payload):
        print("Axon not served, serving axon...")
        serve_success = await kami.serve_axon(axon_payload)
        if serve_success.get("statusCode", None) == 200:
            logger.success("Successfully served axon for miner!")
        else:
            logger.error(
                f"Failed to serve axon for miner, exiting with error message: {serve_success.get('message')}"
            )
            exit()
    else:
        logger.info("Axon already served, no need to serve again.")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
