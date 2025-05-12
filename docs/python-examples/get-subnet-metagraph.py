from kami import Kami
from dotenv import load_dotenv
async def main():
    load_dotenv()
    kami = Kami()
    netuid = 52
    metagraph = await kami.get_metagraph(netuid)
    print(f"Number of registered Coldkeys: {len(metagraph.coldkeys)}")
    print(f"Number of registered Hotkeys: {len(metagraph.hotkeys)}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
