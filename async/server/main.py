import socketio
from aiohttp import web
import sys

def p(*args, **kwargs):
    print(repr([args, kwargs]), file=sys.stdout)
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


sio = socketio.AsyncServer(async_mode="aiohttp")

app = web.Application()
app.add_routes([
    web.get('/ws', websocket_handler)
])

sio.attach(app)



@sio.event
def connect(sid, environ):
    p('connect ', sid)
    sio.enter_room(sid, 'all')


@sio.event
def disconnect(sid):
    p('disconnect ', sid)
    sio.leave_room(sid, 'all')

@sio.event
async def mouse_move(sid, data):
    p('mouseMove', sid, data)

    data['sid'] = sid

    await sio.emit('mouse_move', data, room='all', skip_sid=sid)
    # await sio.emit('mouse_move', data, room='all')

@sio.event
async def mouse_click(sid, data):
    p('mouse_click', sid, data)

    data['sid'] = sid

    await sio.emit('mouse_click', data, room='all', skip_sid=sid)
    # await sio.emit('mouse_move', data, room='all')


p('stopped starting')

if __name__ == '__main__':
    p("starting main")
    web.run_app(app, host='0.0.0.0', port=8081)
