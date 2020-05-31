from aiohttp import web
import sys

import room
import sio
import zone_path_endpoint
import database_endpoint

def p(*args):
    print(repr(args), file=sys.stdout)
    sys.stdout.flush()


####################
# Websocket part
####################

app = web.Application()
# db = await create_connection
# app['db'] = db

app.add_routes(zone_path_endpoint.routes)
app.add_routes(database_endpoint.routes)

sio.attach(app, [room])

p('stopped starting')

if __name__ == '__main__':
    p("starting main")
    web.run_app(app, host='0.0.0.0', port=8081)
