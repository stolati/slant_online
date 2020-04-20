export const PROBLEM_STATE = {
  INVALID: 'INVALID',
  SOLVED: 'SOLVED',
  DEFAULT: 'DEFAULT',
}
Object.freeze(PROBLEM_STATE)

export const extractProblemState = (problem, solution, posX, posY) => {
  let num = parseInt(problem[posY][posX])

  let getSol = (y, x, inverted) => {
    let solY = solution[y]
    if (solY === undefined) {
      return undefined
    }
    let solYX = solY[x]
    if (solYX === undefined) {
      return undefined
    }

    if (solYX === ' ') return null
    if (solYX === '/') return !inverted
    if (solYX === '\\') return inverted

    throw new Error()
  }

  let around = [
    getSol(posY - 1, posX - 1, true),
    getSol(posY - 1, posX, false),
    getSol(posY, posX - 1, false),
    getSol(posY, posX, true),
  ].filter((e) => e !== undefined)

  let numConnection = around.filter((e) => e === true).length
  let numNonConnection = around.filter((e) => e === false).length
  let numTotal = around.length

  let allowedNumNonConnection = numTotal - num

  if (numConnection > num || numNonConnection > allowedNumNonConnection)
    return PROBLEM_STATE.INVALID

  if (numConnection === num && numNonConnection === allowedNumNonConnection) {
    return PROBLEM_STATE.SOLVED
  }

  return PROBLEM_STATE.DEFAULT
}
