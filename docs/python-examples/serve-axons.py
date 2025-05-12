from kami import Kami
from dotenv import load_dotenv

from loguru import logger
import bittensor
from bittensor.utils.networking import ip_to_int, ip_version

async def main():
    load_dotenv()
    kami = Kami()

    axon_port = 8888
    wallet = bittensor.wallet(config=self.config)
    axon = bittensor.axon(wallet=wallet, port=axon_port)

    # Serve passes the axon information to the network + netuid we are hosting on.
    # This will auto-update if the axon port of external ip have changed.
    logger.info(f"Serving miner axon {self.axon} with netuid: {self.config.netuid}")

    axon_payload = ServeAxonPayload(
        netuid=self.config.netuid,
        port=self.axon.external_port,
        ip=ip_to_int(self.axon.external_ip),
        ipType=ip_version(self.axon.external_ip),
        protocol=ip_version(self.axon.external_ip),
        version=1,
    )
    if not await kami.check_if_axon_served(axon_payload):
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


def check_if_axon_served(kami: Kami, axon_payload: ServeAxonPayload) -> bool:
    hotkey = self.wallet.hotkey.ss58_address
    uid = self.subnet_metagraph.hotkeys.index(hotkey)
    current_axon: AxonInfo = self.subnet_metagraph.axons[uid]
    current_axon_ip: str = current_axon.ip
    current_axon_port = current_axon.port

    if not current_axon_ip:
        logger.info(
            f"Axon not served for hotkey {hotkey} on netuid {self.config.netuid}"
        )
        return False

    if (
        ip_to_int(current_axon_ip) == axon_payload.ip
        and axon_payload.port == current_axon_port
    ):
        return True
    return False

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
