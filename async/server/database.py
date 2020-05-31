from tinydb import TinyDB, Query
from tinydb import operations

db = TinyDB('./db.json')


class DbQueries(object):
    zone_table = db.table("zones")
    Zone = Query()

    @classmethod
    def find_by_zone_path_or_null(cls, zone_path):
        Zone = Query()
        res = cls.zone_table.search(Zone.zone_path == zone_path)
        if res:
            return res[0]
        return None

    @classmethod
    def insert_new_zone(cls, new_zone):
        cls.zone_table.insert(new_zone)

    @classmethod
    def update_solved_true_by_zone_path(cls, zone_path):
        Zone = Query()
        cls.zone_table.update(operations.set('solved', True), Zone.zone_path == zone_path)

    @classmethod
    def all_zones_iter(cls):
        return cls.zone_table.all()
