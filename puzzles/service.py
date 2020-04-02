#!/usr/bin/env python3.6
from flask import Flask, request
import subprocess
import os
import random

random.seed()
app = Flask(__name__)


DIFFICULTY_HARD = 'HARD'
DIFFICULTY_EASY = 'EASY'


@app.route('/status')
def status():
    return {"status": "running", "it": "ok"}

@app.route('/puzzle')
def puzzle():
    width = request.args.get('width', 12)
    height = request.args.get('height', 12)
    difficulty = request.args.get('difficulty', DIFFICULTY_HARD)
    seed = request.args.get('seed') or str(random.random())

    difficulty_char = {
        DIFFICULTY_HARD: 'h',
        DIFFICULTY_EASY: 'e',
    }[difficulty]

    param = str(width) + 'x' + str(height) + 'd' + difficulty_char

    return subprocess.check_output(['/code/slant_puzzle', param, seed])


def start_dev():
    app.run(
        host="0.0.0.0",
        port="5001",
        debug=True
    )


def start_prod():
    app.run(
        host="0.0.0.0",
        port="80",
        debug=False
    )

if __name__ == '__main__':
    start_dev()
