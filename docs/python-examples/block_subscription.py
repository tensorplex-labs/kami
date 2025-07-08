"""
Async Python WebSocket client for Kami block subscription
Uses python-socketio AsyncClient for async/await support

Install dependencies:
pip install python-socketio[asyncio-client]
"""

import asyncio
import socketio
import json
from typing import Dict, Any

# Create an async Socket.IO client
sio = socketio.AsyncClient()

@sio.event
async def connect():
    print("Connected to WebSocket server")

    # Test ping first
    print("Sending ping...")
    await sio.emit('ping', 'hello from async Python')

    # Subscribe to finalized blocks (passing True for finalised parameter)
    print("Subscribing to finalized blocks...")
    await sio.emit('subscribe-blocks', True)

@sio.event
async def disconnect():
    print("Disconnected from WebSocket server")

@sio.event
async def connect_error(data):
    print(f"Connection error: {data}")

@sio.on('pong')
async def on_pong(data: Dict[str, Any]):
    print(f"Ping response: {json.dumps(data, indent=2)}")

@sio.on('subscription-confirmed')
async def on_subscription_confirmed(data: Dict[str, Any]):
    print(f"Block subscription confirmed: {json.dumps(data, indent=2)}")

@sio.on('subscription-error')
async def on_subscription_error(data: Dict[str, Any]):
    print(f"Block subscription error: {json.dumps(data, indent=2)}")

@sio.on('new-block')
async def on_new_block(block_info: Dict[str, Any]):
    print(f"🔗 New finalized block received:")
    print(f"   Block Number: {block_info.get('blockNumber')}")
    print(f"   Parent Hash:  {block_info.get('parentHash')}")
    print(f"   State Root:   {block_info.get('stateRoot')}")
    print(f"   Extrinsics:   {block_info.get('extrinsicsRoot')}")
    print("-" * 50)

    # You can do async operations here, like:
    # await process_block_data(block_info)
    # await store_in_database(block_info)

async def process_block_data(block_info: Dict[str, Any]):
    """Example async function to process block data"""
    # Simulate async processing
    await asyncio.sleep(0.1)
    print(f"Processed block {block_info.get('blockNumber')}")

async def main():
    try:
        # Connect to the Socket.IO server
        print("Connecting to WebSocket server at http://localhost:8882...")
        await sio.connect('ws://localhost:8882')

        # Keep the connection alive and listen for events
        print("Listening for blocks... (Press Ctrl+C to stop)")
        await sio.wait()

    except KeyboardInterrupt:
        print("\nShutting down...")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if sio.connected:
            await sio.disconnect()
        print("Disconnected.")

if __name__ == "__main__":
    asyncio.run(main())