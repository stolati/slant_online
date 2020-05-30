import socketio

_SIO = socketio.AsyncServer(async_mode="aiohttp")


def get_sio():
    return _SIO


def attach(application, modules):
    _SIO.attach(application)
