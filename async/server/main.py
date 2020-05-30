from aiohttp import web
import sys
import room
import sio


def p(*args):
    print(repr(args), file=sys.stdout)
    sys.stdout.flush()


####################
# Websocket part
####################

async def websocket_handler(request):
    p('websokcet handler starts')
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    try:

        async for msg in ws:
            p(msg)
            await ws.send_str(msg.data)

    finally:
        p('websocket connection closed')

    return ws


async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = "Hello, " + name
    return web.Response(text=text)


app = web.Application()
app.add_routes([
    web.get('/ws', websocket_handler)
])

sio.attach(app, [room])

p('stopped starting')

if __name__ == '__main__':
    p("starting main")
    web.run_app(app, host='0.0.0.0', port=8081)
