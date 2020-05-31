#!/usr/bin/env python3
import random
import json
import requests
import urllib.parse

import config

DIFFICULTY_HARD = 'HARD'
DIFFICULTY_EASY = 'EASY'


def divide_chunks(l, n):
    # looping till length l
    for i in range(0, len(l), n):
        yield l[i:i + n]

def extract_problem(problem):
    ord_0 = ord('0')
    ord_4 = ord('4')

    ord_a = ord('a')
    ord_z = ord('z')

    res = []

    for c in problem:
        ord_c = ord(c)
        if c in {'0', '1', '2', '3', '4'}:
            res.append(c)
            continue
        if ord_a <= ord_c <= ord_z:
            res.append(' ' * (ord_c - (ord_a - 1)))
            continue

    return ''.join(res)


def get_puzzle(seed=None, width=12, height=12, difficulty=DIFFICULTY_HARD):
    seed = seed or str(random.random())

    response = requests.get(config.PUZZLE_URL + '/puzzle', params={
        'width': width,
        'height': height,
        'difficulty': difficulty,
        'seed': seed,
    })

    output = response.content

    output = output.decode('utf-8')

    # TODO: Make the game binary exscape the \ in json solution
    #output = output.replace('\\', '.')
    json_output = json.loads(output)
    #json_output['solution'] = json_output['solution'].replace('.', '\\')

    json_output['solution'] = list(divide_chunks(json_output['solution'], width))
    json_output['problem'] = list(divide_chunks(extract_problem(json_output['problem']), width+1))

    return json_output

if __name__ == '__main__':
    print(get_puzzle())

