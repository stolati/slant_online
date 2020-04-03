#!/usr/bin/env python3.6
import random
from collections import namedtuple
from flask import Flask, request
from flask_pymongo import PyMongo
from pymongo import MongoClient
import config

import puzzle

# TODO: have logging system

app = Flask(__name__)

client = MongoClient(config.MONGO_URL)
db = client.test_database

random.seed()


@app.route('/status')
def status():
    return {"status": "running", "it": "ok"}


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

    cur_zone_obj = db.zones.find_one({'zone_path': zone_path})

    if cur_zone_obj is not None:
        return cur_zone_obj

    new_zone = puzzle.get_puzzle(zone_path,
                                 width=config.PUZZLE_WIDTH,
                                 height=config.PUZZLE_HEIGHT,
        )
    new_zone['zone_path'] = zone_path
    new_zone['solved'] = False

    zone_inserted_id = db.zones.insert_one(new_zone).inserted_id

    return db.zones.find_one({'zone_path': zone_path})


def zone_to_apiget(zone_obj):
    return {
        'zone_path': zone_obj['zone_path'],
        'problem': zone_obj['problem'],
        'width': zone_obj['width'],
        'height': zone_obj['height'],
    }


@app.route("/api/zones/free")
def api_zones_new():

    for i in range(100): # Max loop we're ready to do

        cur_zone_path = random_zone_path().to_str()
        zone_obj = get_or_create_zone_path(cur_zone_path)
        solved = zone_obj['solved']

        if not solved:
            break

    return zone_to_apiget(zone_obj)


@app.route("/api/zones/<zone_path>", methods=['GET'])
def api_zones_get_by_path(zone_path):
    zone_obj = get_or_create_zone_path(zone_path)

    return zone_to_apiget(zone_obj)


@app.route("/api/zones/<zone_path>", methods=['POST'])
def api_zones_post_by_path(zone_path):
    zone_path = ZonePath.clean(zone_path)

    zone_path_obj = get_or_create_zone_path(zone_path)

    request_data = request.get_json()

    if zone_path_obj['solved']:
        return {'ok': 'already_solved'}

    is_solution_correct = zone_path_obj['solution'] == request_data.get('solution')
    if not is_solution_correct:
        return {'ko': 'not right solution'}

    zone_path_obj['solved'] = True
    db.zones.update({"_id": zone_path_obj['_id']}, {"$set": {"solved": True}})

    return {'ok':'ok'}


@app.route("/api/zones")
def api_zones_all():
    content = [['0'] * config.MAP_WIDTH for _ in range(config.MAP_HEIGHT)]

    for zone in db.zones.find():
        zone_path = zone.get('zone_path')
        solved = zone.get('solved', False)

        if solved and zone_path:
            zp = ZonePath.from_str(zone_path)
            content[int(zp.x)][int(zp.y)] = 'X'

    content_str = '\n'.join([''.join(row) for row in content])

    return {
        'width': config.MAP_WIDTH,
        'height': config.MAP_HEIGHT,
        'content': content_str,
    }


def start_dev():
    app.run(
        host="0.0.0.0",
        port="5000",
        debug=True
    )


def start_prod():
    app.run(
        host="0.0.0.0",
        port="80",
        debug=False
    )

# toto
if __name__ == '__main__':
    # TODO: have env variable to set prod/dev
    start_dev()
