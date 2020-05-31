import json
import random
from collections import namedtuple
from aiohttp import web

import config
import puzzle
from database import DbQueries
routes = web.RouteTableDef()

random.seed()

def api_wrapper(fct):

    # TODO : here extract the api path from the name
    # <method>_url1_url2
    # TODO : if res is a tulpe of 2, then it's (status, content)

    async def wrapper_fct(*args, **kwargs):
        res = await fct(*args, **kwargs)
        if isinstance(res, dict):
            # Can be : web.json_response(data)
            return web.Response(text=json.dumps(res))
        return res

    return wrapper_fct


@routes.get('/api/status')
async def get_api_status(request):
    return web.json_response({"status": "running", "it": "ok"})


class ZonePath(namedtuple('ZonePath', ['x', 'y'])):

    @classmethod
    def from_str(cls, s):
        # TODO: use regex to check if this is valid before hand
        x, y = s.split('-')
        return cls(x, y)

    def to_str(self):
        return f'{self.x}-{self.y}'

    @classmethod
    def clean(cls, s):
        return cls.from_str(s).to_str()


def random_zone_path():
    return ZonePath(random.randint(0, 100),
                    random.randint(0, 100))


def get_or_create_zone_path(zone_path):
    zone_path = ZonePath.clean(zone_path)

    cur_zone_obj = DbQueries.find_by_zone_path_or_null(zone_path)

    if cur_zone_obj is not None:
        return cur_zone_obj

    new_zone = puzzle.get_puzzle(zone_path,
                                 width=config.PUZZLE_WIDTH,
                                 height=config.PUZZLE_HEIGHT,
                                 )
    new_zone['zone_path'] = zone_path
    new_zone['solved'] = False

    DbQueries.insert_new_zone(new_zone)

    return DbQueries.find_by_zone_path_or_null(zone_path)


def zone_to_apiget(zone_obj):
    print(zone_obj)
    return {
        'zone_path': zone_obj['zone_path'],
        'problem': zone_obj['problem'],
        'width': zone_obj['width'],
        'height': zone_obj['height'],
    }


@routes.get("/api/zones/free")
async def api_zones_new(request):

    for i in range(100): # Max loop we're ready to do

        cur_zone_path = random_zone_path().to_str()
        zone_obj = get_or_create_zone_path(cur_zone_path)
        solved = zone_obj['solved']

        if not solved:
            break

    return web.json_response(zone_to_apiget(zone_obj))


@routes.get("/api/zones/{zone_path}")
async def api_zones_get_by_path(request):
    zone_path = request.match_info.get('zone_path')
    zone_obj = get_or_create_zone_path(zone_path)

    return web.json_response(zone_to_apiget(zone_obj))


@routes.post("/api/zones/{zone_path}")
async def api_zones_post_by_path(request):
    zone_path = request.match_info.get('zone_path')
    zone_path = ZonePath.clean(zone_path)

    zone_path_obj = get_or_create_zone_path(zone_path)

    request_data = await request.json()

    if zone_path_obj['solved']:
        return web.json_response({'ok': 'already_solved'})

    is_solution_correct = zone_path_obj['solution'] == request_data.get('solution')
    if not is_solution_correct:
        return web.json_response({'ko': 'not right solution'})

    zone_path_obj['solved'] = True

    DbQueries.update_solved_true_by_zone_path(zone_path)

    return web.json_response({'ok':'ok'})


@routes.get("/api/zones")
async def api_zones_all(request):
    content = [['0'] * config.MAP_WIDTH for _ in range(config.MAP_HEIGHT)]

    # HERE
    for zone in DbQueries.all_zones_iter():
        zone_path = zone.get('zone_path')
        solved = zone.get('solved', False)

        if solved and zone_path:
            zp = ZonePath.from_str(zone_path)
            content[int(zp.x)][int(zp.y)] = 'X'

    content_str = '\n'.join([''.join(row) for row in content])

    return web.json_response({
        'width': config.MAP_WIDTH,
        'height': config.MAP_HEIGHT,
        'content': content_str,
    })
