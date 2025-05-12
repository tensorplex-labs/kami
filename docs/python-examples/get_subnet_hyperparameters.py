from kami import Kami
from dotenv import load_dotenv
import os
async def main():
    load_dotenv()
    kami = Kami()
    netuid = os.getenv("NETUID")
    
    hyperparameters = await kami.get_subnet_hyperparameters(netuid)
    print(f"Registration Allowed: {hyperparameters.registrationAllowed}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
