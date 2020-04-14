#!/usr/bin/env python3


import asyncio
import websockets


all_websockets = set()

# async sendMessageToAll(message):
#     for websocket in all_websockets:
#         await websokcet.send(message)


async def echo(websocket, path):
    async for message in websocket:
        await websocket.send(message)

asyncio.get_event_loop().run_until_complete(
    websockets.serve(echo, '0.0.0.0', 8080))
asyncio.get_event_loop().run_forever()
