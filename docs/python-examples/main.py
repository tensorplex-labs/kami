from kami import Kami

async def main():
    kami = Kami()
    metagraph = await kami.get_metagraph(1)
    print(metagraph)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
