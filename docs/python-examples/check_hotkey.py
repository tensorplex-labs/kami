from kami import Kami
from dotenv import load_dotenv
import os
async def main():
    load_dotenv()
    kami = Kami()
    netuid = os.getenv("NETUID")
    
    keyring_pair_info = await kami.get_keyring_pair_info()
    hotkey = keyring_pair_info.keyringPair.address

    is_hotkey_registered = await kami.is_hotkey_registered(netuid, hotkey)
    print(f"Is hotkey {hotkey} registered on netuid {netuid}: {is_hotkey_registered}")
    ## Is hotkey 5XXX registered on netuid 98: True

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
