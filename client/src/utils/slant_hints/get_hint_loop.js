/**
 * Look at a full solution, and group the links into connected groups
 **/
export const getLoopGroupSolution = (solution) => {
  let res = solution.map((line) => {
    return line.map(() => {
      return null
    })
  })

  let getPos = (x, y) => {
    let solY = solution[y]
    if (solY === undefined) return ' '
    let solYX = solution[y][x]
    if (solYX === undefined) return ' '

    if (res[y][x] !== null) {
      return ' '
    }
    return solYX
  }

  let getLinked = (x, y) => {
    //Pos:
    // 1 2 3
    // 4 X 6
    // 7 8 9

    let v1p = { x: x - 1, y: y - 1 }
    let v2p = { x: x, y: y - 1 }
    let v3p = { x: x + 1, y: y - 1 }
    let v4p = { x: x - 1, y: y }
    let v6p = { x: x + 1, y: y }
    let v7p = { x: x - 1, y: y + 1 }
    let v8p = { x: x, y: y + 1 }
    let v9p = { x: x + 1, y: y + 1 }

    let v1 = getPos(x - 1, y - 1)
    let v2 = getPos(x, y - 1)
    let v3 = getPos(x + 1, y - 1)
    let v4 = getPos(x - 1, y)
    let v5 = getPos(x, y)
    let v6 = getPos(x + 1, y)
    let v7 = getPos(x - 1, y + 1)
    let v8 = getPos(x, y + 1)
    let v9 = getPos(x + 1, y + 1)

    if (v5 === '/') {
      return [
        [
          v2 === '\\' ? v2p : null, // 2
          v3 === '/' ? v3p : null, // 3
          v6 === '\\' ? v6p : null, //6
        ].filter((e) => e !== null),
        [
          v4 === '\\' ? v4p : null, // 4
          v7 === '/' ? v7p : null, // 7
          v8 === '\\' ? v8p : null, // 8
        ].filter((e) => e !== null),
      ].filter((e) => e.length !== 0)
    }

    if (v5 === '\\') {
      return [
        [
          v1 === '\\' ? v1p : null, // 1
          v2 === '/' ? v2p : null, // 2
          v4 === '/' ? v4p : null, //4
        ].filter((e) => e !== null),
        [
          v6 === '/' ? v6p : null, // 6
          v8 === '/' ? v8p : null, // 8
          v9 === '\\' ? v9p : null, // 9
        ].filter((e) => e !== null),
      ].filter((e) => e.length !== 0)
    }
  }

  let nextGroupId = 0

  let processElem = (x, y, curGroupId = null) => {
    let e = getPos(x, y)
    // Nothing to process
    if (e === ' ') return

    //We have a new group
    if (curGroupId === null) {
      curGroupId = nextGroupId
      nextGroupId = nextGroupId + 1
    }

    let linked = [].concat(...getLinked(x, y))
    res[y][x] = curGroupId

    linked.forEach((l) => processElem(l.x, l.y, curGroupId))
  }

  solution.forEach((line, y) => {
    line.forEach((_, x) => processElem(x, y))
  })

  return res
}

const extractIncoherenceInSolutionGroups = (solutionGroups, solution) => {
  let getPos = (x, y) => {
    let solY = solution[y]
    if (solY === undefined) return ' '
    let solYX = solution[y][x]
    if (solYX === undefined) return ' '

    return solYX
  }

  let getLinked = (x, y, v5) => {
    //Pos:
    // 1 2 3
    // 4 X 6
    // 7 8 9

    let v1p = { x: x - 1, y: y - 1 }
    let v2p = { x: x, y: y - 1 }
    let v3p = { x: x + 1, y: y - 1 }
    let v4p = { x: x - 1, y: y }
    let v6p = { x: x + 1, y: y }
    let v7p = { x: x - 1, y: y + 1 }
    let v8p = { x: x, y: y + 1 }
    let v9p = { x: x + 1, y: y + 1 }

    let v1 = getPos(x - 1, y - 1)
    let v2 = getPos(x, y - 1)
    let v3 = getPos(x + 1, y - 1)
    let v4 = getPos(x - 1, y)
    let v6 = getPos(x + 1, y)
    let v7 = getPos(x - 1, y + 1)
    let v8 = getPos(x, y + 1)
    let v9 = getPos(x + 1, y + 1)

    if (v5 === '/') {
      return [
        [
          v2 === '\\' ? v2p : null, // 2
          v3 === '/' ? v3p : null, // 3
          v6 === '\\' ? v6p : null, //6
        ].filter((e) => e !== null),
        [
          v4 === '\\' ? v4p : null, // 4
          v7 === '/' ? v7p : null, // 7
          v8 === '\\' ? v8p : null, // 8
        ].filter((e) => e !== null),
      ].filter((e) => e.length !== 0)
    }

    if (v5 === '\\') {
      return [
        [
          v1 === '\\' ? v1p : null, // 1
          v2 === '/' ? v2p : null, // 2
          v4 === '/' ? v4p : null, //4
        ].filter((e) => e !== null),
        [
          v6 === '/' ? v6p : null, // 6
          v8 === '/' ? v8p : null, // 8
          v9 === '\\' ? v9p : null, // 9
        ].filter((e) => e !== null),
      ].filter((e) => e.length !== 0)
    }
  }

  let hints = []

  const isProblematic = (x, y, slash) => {
    let nums = getLinked(x, y, slash).map((links) => {
      if (links.length === 0) return null
      return solutionGroups[links[0].y][links[0].x]
    })

    if (nums.length !== 2) return false

    let numA = nums[0],
      numB = nums[1]
    if (numA === null || numB === null) {
      return false
    }

    return numA === numB
  }

  solution.forEach((line, y) => {
    line.forEach((cell, x) => {
      if (getPos(x, y) !== ' ') return

      if (isProblematic(x, y, '/')) {
        hints.push({ x, y, s: '\\' })
      }

      if (isProblematic(x, y, '\\')) {
        hints.push({ x, y, s: '/' })
      }
    })
  })

  return hints
}

export const getLoopGroupHints = (problem, solution) => {
  const solutionGroups = getLoopGroupSolution(solution)

  const hints = extractIncoherenceInSolutionGroups(solutionGroups, solution)

  return hints
}
