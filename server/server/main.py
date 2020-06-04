from aiohttp import web
import sys
import os

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
    port = int(os.getenv('AIO_PORT', '8081'))
    host = os.getenv('AIO_HOST', '0.0.0.0')

    p(f"starting main on host: {host} port:{port}")
    web.run_app(app, host=host, port=port)
