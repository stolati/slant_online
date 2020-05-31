import socketio
import sys
from sio import get_sio

sio = get_sio()


def p(*args):
    print(repr(args), file=sys.stdout)
    sys.stdout.flush()


zone_usage = {}


@sio.event
def connect(sid, environ):
    p('connect ', sid)
    sio.enter_room(sid, 'all')


@sio.event
async def disconnect(sid):
    p('disconnect ', sid)
    sio.leave_room(sid, 'all')
    await leaving_zone_room(sid)


async def leaving_zone_room(sid):
    room_name = await get_zone_room(sid)
    if room_name:
        sio.leave_room(sid, room_name)
        new_amount_zone_usage = zone_usage.get(room_name, 0) - 1
        if new_amount_zone_usage > 0:
            zone_usage[room_name] = new_amount_zone_usage
        elif room_name in zone_usage:
            del zone_usage[room_name]
        else:
            pass


async def entering_zone_room(sid, zone_path):
    await leaving_zone_room(sid)
    room_name = f'ZONE:{zone_path}'
    async with sio.session(sid) as session:
        sio.enter_room(sid, room_name)
        session['cur_zone_path'] = room_name

    zone_usage[room_name] = zone_usage.get(room_name, 0) + 1


async def get_zone_room(sid):
    async with sio.session(sid) as session:
        return session.get('cur_zone_path')


@sio.event
async def set_zone(sid, data):
    p('set_zone', sid, data)
    await entering_zone_room(sid, data['zone_path'])


@sio.event
async def exit_zone(sid, data):
    p('exit_zone', sid)
    await leaving_zone_room(sid)


@sio.event
async def mouse_move(sid, data):
    p('mouseMove', sid, data)

    data['sid'] = sid

    room_name = await get_zone_room(sid)

    p(sio.rooms(sid), room_name)

    await sio.emit('mouse_move', data, room=room_name, skip_sid=sid)


@sio.event
async def get_zones_usage(sid):
    await sio.emit('zones_usage', zone_usage)


@sio.event
async def mouse_click(sid, data):
    p('mouse_click', sid, data)

    data['sid'] = sid
    room_name = await get_zone_room(sid)
    if not room_name:
        return

    await sio.emit('mouse_click', data, room=room_name, skip_sid=sid)