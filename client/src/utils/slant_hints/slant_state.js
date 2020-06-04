import { getLoopSolution } from './loops'
import { is_connected_side } from './is_connected_side'
import { getNextHintAll } from './get_next_hint'
import { range } from '../../utils'
import React from 'react'
import { extractProblemState } from './problemState'

const DEFAULT_STATE = {
   height : 0,
   width : 0,
   problem : [],
   solution : [],
   solved : false,
}



export default class SlantState { //Should be immutable

  constructor(staticState) {
    if (staticState === undefined) {
      staticState = DEFAULT_STATE
    }
    this.height = staticState.height
    this.width = staticState.width
    this.problem = staticState.problem
    this.solution = staticState.solution
    this.solved = staticState.solved

    this.calculateMetadata()
  }

  calculateMetadata() {
    //TODO lazy do that
    this.loopSolution = getLoopSolution(this.solution)
    this.isConnectedSide = is_connected_side(this.solution)
  }

  toStaticState() {
    return {
      height: this.height,
      width: this.width,
      problem: this.problem, //Clues
      solution: this.solution, //Grid
      solved: this.solved,
    }
  }

  __getGrid(x, y) {
    return this.solution[y][x]
  }

  __getHint(x, y) {
    return this.problem[y][x]
  }

  getGridInfo(x, y) {
    return {
      x,
      y,
      value: this.__getGrid(x, y),
      isConnectedSide: this.isConnectedSide[y][x],
      isInLoop: this.loopSolution[y][x],
    }
  }

  getHintInfo(x, y){
    return{
      x,
      y,
      value: this.__getHint(x, y),
      hintState: extractProblemState(this.problem, this.solution, x, y),
    }
  }

  gridMap(fct) {
    return range(this.width)
      .map((_, x) => {
        return range(this.height)
          .map((_, y) => {
            return fct(this.getGridInfo(x, y))
          })
      }).flat()
  }

  hintMap(fct){
    return range(this.width+1)
      .map((_, x) => {
        return range(this.height+1)
          .map((_, y) => {
            return fct(this.getHintInfo(x, y))
          })
      }).flat()
  }

}


