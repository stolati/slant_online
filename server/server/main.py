#!/usr/bin/env python3.8
from aiohttp import web
import logging
import os
import sys

import database_endpoint
import room
import sio
import zone_path_endpoint

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

logging.basicConfig(level=logging.DEBUG)

if __name__ == '__main__':
    port = int(os.getenv('AIO_PORT', '8081'))
    host = os.getenv('AIO_HOST', '0.0.0.0')

    log = logging.getLogger(__name__)
    log.info(f"starting main on host: {host} port:{port}")
    web.run_app(app, host=host, port=port)
