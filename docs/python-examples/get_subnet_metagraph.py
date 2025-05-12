from kami import Kami
from dotenv import load_dotenv
import os
async def main():
    load_dotenv()
    kami = Kami()
    netuid = os.getenv("NETUID")
    
    metagraph = await kami.get_metagraph(netuid)
    print(f"Number of registered Coldkeys: {len(metagraph.coldkeys)}")
    print(f"Number of registered Hotkeys: {len(metagraph.hotkeys)}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
