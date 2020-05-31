import json
import random
from collections import namedtuple
from aiohttp import web
import sys

import database

routes = web.RouteTableDef()

def p(*args):
    print(repr(args), file=sys.stdout)
    sys.stdout.flush()


@routes.get("/api/db/export")
def get_db_export(request):
    for table_name in database.db.tables():
        p(table_name)

    res = {
        table_name: list(database.db.table(table_name).all())
        for table_name in database.db.tables()}

    return web.json_response(res)





