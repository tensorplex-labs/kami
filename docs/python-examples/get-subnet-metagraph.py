from kami import Kami
from dotenv import load_dotenv
async def main():
    load_dotenv()
    kami = Kami()
    netuid = 1
    metagraph = await kami.get_metagraph(netuid)
    print(metagraph)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
