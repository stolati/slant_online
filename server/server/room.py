import sys
from sio import get_sio
import logging

sio = get_sio()

zone_usage = {}
log = logging.getLogger(__name__)


@sio.event
def connect(sid, environ):
    log.debug('connect %s', sid)
    sio.enter_room(sid, 'all')


@sio.event
async def disconnect(sid):
    log.debug('disconnect %s', sid)
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
    log.debug('set_zone %s %s', sid, data)
    await entering_zone_room(sid, data['zone_path'])


@sio.event
async def exit_zone(sid, data):
    log.debug('exit_zone %s', sid)
    await leaving_zone_room(sid)


@sio.event
async def mouse_move(sid, data):
    log.debug('mouseMove %s %s', sid, data)

    data['sid'] = sid

    room_name = await get_zone_room(sid)

    log.debug('moveMove for room : %s %s', sio.rooms(sid), room_name)

    await sio.emit('mouse_move', data, room=room_name, skip_sid=sid)


@sio.event
async def get_zones_usage(sid):
    await sio.emit('zones_usage', zone_usage)


@sio.event
async def mouse_click(sid, data):
    log.debug('mouse_click %s %s', sid, data)

    data['sid'] = sid
    room_name = await get_zone_room(sid)
    if not room_name:
        return

    await sio.emit('mouse_click', data, room=room_name, skip_sid=sid)
