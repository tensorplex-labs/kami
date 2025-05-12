import json
import os
from typing import Any, Dict

import aiohttp
from bittensor_commit_reveal import get_encrypted_commit  # type: ignore
from bittensor.utils.networking import ip_to_int
from loguru import logger

from kami.types import (
    AxonInfo,
    ServeAxonPayload,
    SetWeightsPayload,
    SubnetHyperparameters,
    SubnetMetagraph,
    KeyringPairInfo,
)


class Kami:
    """
    Kami is a class that handles the connection to the Kami API.
    """

    def __init__(self):
        kami_host = os.getenv("KAMI_HOST")
        kami_port = os.getenv("KAMI_PORT")
        if kami_host is None:
            raise ValueError("Require KAMI_HOST to be set in environment variables")
        if kami_port is None:
            raise ValueError("Require KAMI_PORT to be set in environment variables")

        self.url = f"http://{kami_host}:{kami_port}"
        self.session: aiohttp.ClientSession | None = None
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def _ensure_session(self):
        if self.session is None:
            self.session = aiohttp.ClientSession()

    async def close(self):
        """
        Close the aiohttp session.
        """
        if self.session is not None:
            await self.session.close()

    async def get(
        self, endpoint: str, params: Dict[str, Any] | None = None
    ) -> Dict[str, Any]:
        """
        Send a GET request to the Kami API.

        Args:
            endpoint (str): The API endpoint to send the request to.
            params (Dict[str, Any] | None): Optional query parameters to include in the request.

        Returns:
            Dict[str, Any]: The JSON response from the API.
        """
        try:
            await self._ensure_session()
            if self.session is None:
                raise ValueError("Session is not initialized.")
            url = f"{self.url}/{endpoint}"
            async with self.session.get(
                url, headers=self.headers, params=params
            ) as response:
                return await response.json()
        except aiohttp.ClientError as e:
            message = f"Error connecting to Kami API: {e}"
            logger.error(message)
            raise RuntimeError(f"Error connecting to Kami API: {e}")
        except json.decoder.JSONDecodeError as e:
            logger.error(f"Error decoding JSON response: {e}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise e

    async def post(
        self, endpoint: str, data: Dict[str, Any] | None = None
    ) -> Dict[str, Any]:
        """
        Send a POST request to the Kami API.

        Args:
            endpoint (str): The API endpoint to send the request to.
            data (Dict[str, Any] | None): Optional data to include in the request body.

        Returns:
            Dict[str, Any]: The JSON response from the API.
        """
        try:
            await self._ensure_session()
            if self.session is None:
                raise ValueError("Session is not initialized.")
            url = f"{self.url}/{endpoint}"
            async with self.session.post(
                url, headers=self.headers, json=data
            ) as response:
                return await response.json()
        except aiohttp.ClientError as e:
            message = f"Error connecting to Kami API: {e}"
            logger.error(message)
            raise RuntimeError(message)
        except json.decoder.JSONDecodeError as e:
            logger.error(f"Error decoding JSON response: {e}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise e

    async def get_metagraph(self, netuid: int) -> SubnetMetagraph:
        """
        Get the metagraph for a given netuid.

        Args:
            netuid (int): The netuid to get the metagraph for.

        Returns:
            SubnetMetagraph: The subnet metagraph object.
        """
        get_metagraph = await self.get(f"chain/subnet-metagraph/{netuid}")
        metagraph = get_metagraph.get("data", {})
        return SubnetMetagraph.model_validate(metagraph)

    async def get_hotkeys(self, netuid: int) -> list[str]:
        """
        Get the hotkeys for a given netuid.

        Args:
            netuid (int): The netuid to get the hotkeys for.

        Returns:
            list[str]: The list of hotkeys for the given netuid.
        """
        metagraph = await self.get_metagraph(netuid)
        return metagraph.hotkeys

    async def get_axons(self, netuid: int) -> list[AxonInfo]:
        """
        Get the axons for a given netuid.

        Args:
            netuid (int): The netuid to get the axons for.

        Returns:
            list[AxonInfo]: The list of axons for the given netuid.
        """
        get_metagraph = await self.get(f"chain/subnet-metagraph/{netuid}")
        metagraph = get_metagraph.get("data", {})
        axons = metagraph.get("axons", [])
        if len(axons) == 0:
            logger.warning("No axons found in metagraph response.")

        return [AxonInfo.model_validate(axon) for axon in axons]

    async def get_current_block(self) -> int:
        """
        tcurrent finalized block number.

                Returns:
                    int: The current finalized block number.
        """
        result = await self.get("chain/latest-block")
        latest_block = result.get("data", {}).get("blockNumber", "")
        return int(latest_block)

    async def get_subnet_hyperparameters(self, netuid: int) -> SubnetHyperparameters:
        """
        Get the subnet hyperparameters for a given netuid.

        Args:
            netuid (int): The netuid to get the hyperparameters for.

        Returns:
            SubnetHyperparameters: The subnet hyperparameters object.
        """
        result = await self.get(f"chain/subnet-hyperparameters/{netuid}")
        hyperparameters = result.get("data", {})
        return SubnetHyperparameters.model_validate(hyperparameters)

    async def is_hotkey_registered(
        self, netuid: int, hotkey: str, block: int | None = None
    ) -> bool:
        """
        Check if a hotkey is registered in a subnet.

        Args:
            netuid (int): The netuid to check.
            hotkey (str): The hotkey to check.
            block (int | None): Optional block number to check at. If None, uses the latest block.

        Returns:
            bool: True if the hotkey is registered, False otherwise.
        """
        result = dict[str, bool]()
        if block is None:
            result = await self.get(
                f"chain/check-hotkey?netuid={netuid}&hotkey={hotkey}"
            )
        else:
            result = await self.get(
                f"chain/check-hotkey?netuid={netuid}&hotkey={hotkey}&block={block}"
            )
        return result.get("data", {}).get("isHotkeyValid", False)

    async def serve_axon(self, payload: ServeAxonPayload) -> Dict[str, Any]:
        """
        Register an axon server with the network.

        Args:
            payload (ServeAxonPayload): The payload containing axon information.

        Returns:
            Dict[str, Any]: The JSON response from the API.
        """
        return await self.post("chain/serve-axon", data=payload.model_dump())

    async def set_weights(self, payload: SetWeightsPayload) -> Dict[str, Any]:
        """
        Set weights for neurons in the network.

        Handles both standard weight setting and commit-reveal weight setting
        based on subnet hyperparameters.

        Args:
            payload (SetWeightsPayload): The payload containing weights information.

        Returns:
            Dict[str, Any]: The JSON response from the API.
        """
        get_hpams = await self.get_subnet_hyperparameters(payload.netuid)
        if get_hpams.commitRevealWeightsEnabled:
            tempo = get_hpams.tempo
            reveal_period = get_hpams.commitRevealPeriod
            if tempo == 0 or reveal_period == 0:
                raise ValueError(
                    "Tempo and reveal round must be greater than 0 for commit reveal weights."
                )

            print(
                f"Commit reveal weights enabled: tempo: {tempo}, reveal_period: {reveal_period}"
            )

            # Encrypt `commit_hash` with t-lock and `get reveal_round`
            commit_for_reveal, reveal_round = get_encrypted_commit(  # type: ignore
                uids=payload.dests,
                weights=payload.weights,
                version_key=payload.version_key,
                tempo=tempo,
                current_block=await self.get_current_block(),
                netuid=payload.netuid,
                subnet_reveal_period_epochs=reveal_period,
            )

            print(f"Commit for reveal: {commit_for_reveal}")
            print(f"Reveal round: {reveal_round}")

            cr_payload: dict[str, int | str] = {
                "netuid": payload.netuid,
                "commit": commit_for_reveal.hex(),  # type: ignore
                "reveal_round": reveal_round,
            }

            return await self.post("chain/set-commit-reveal-weights", data=cr_payload)

        return await self.post("chain/set-weights", data=payload.model_dump())

    async def get_keyring_pair_info(self) -> KeyringPairInfo:
        """
        Get the keyring pair info.
        """
        result = await self.get("substrate/keyring-pair-info")
        keyring_pair_info = result.get("data", {})
        return KeyringPairInfo.model_validate(keyring_pair_info)

    async def check_if_axon_served(self, axon_payload: ServeAxonPayload) -> bool:
        keyring_pair_info = await self.get_keyring_pair_info()
        hotkey = keyring_pair_info.keyringPair.address
        metagraph = await self.get_metagraph(axon_payload.netuid)
        uid = metagraph.hotkeys.index(hotkey)
        current_axon: AxonInfo = metagraph.axons[uid]
        current_axon_ip: str = current_axon.ip
        current_axon_port = current_axon.port

        if not current_axon_ip:
            logger.info(
                f"Axon not served for hotkey {hotkey} on netuid {axon_payload.netuid}"
            )
            return False

        if (
            ip_to_int(current_axon_ip) == axon_payload.ip
            and axon_payload.port == current_axon_port
        ):
            return True
        return False


