from kami import Kami
from dotenv import load_dotenv
async def main():
    load_dotenv()
    kami = Kami()

    available_runtime_api = await kami.get_available_runtime_api()
    print("Available runtime definitions and methods:")
    for runtime in available_runtime_api:
        runtime_name = runtime['name']
        print(f"\n📦 {runtime_name}")
        for method in runtime['methods']:
            method_name = method['name']
            print(f"  ├─ {method_name}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
