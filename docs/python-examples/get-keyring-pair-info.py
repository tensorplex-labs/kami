from kami import Kami
from dotenv import load_dotenv
async def main():
    load_dotenv()
    kami = Kami()
    keyring_pair_info = await kami.get_keyring_pair_info()
    print(f"Coldkey SS58 address: {keyring_pair_info.walletColdkey}")
    print(f"Hotkey SS58 address: {keyring_pair_info.keyringPair.address}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
