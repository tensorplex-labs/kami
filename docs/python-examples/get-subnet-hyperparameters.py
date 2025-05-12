from kami import Kami
from dotenv import load_dotenv
async def main():
    load_dotenv()
    kami = Kami()
    netuid = 52
    hyperparameters = await kami.get_subnet_hyperparameters(netuid)
    print(f"Registration Allowed: {hyperparameters.registrationAllowed}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
