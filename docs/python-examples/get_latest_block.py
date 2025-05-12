from kami import Kami
from dotenv import load_dotenv
async def main():
    load_dotenv()
    kami = Kami()
    
    block = await kami.get_current_block()
    print(f"Latest Block: {block}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
