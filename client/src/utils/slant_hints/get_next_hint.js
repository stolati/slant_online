
import stringify from 'json-stable-stringify'
import { range } from '../../utils'
import { getLoopGroupHints } from './get_hint_loop'

// here instead of \\, we're going to use L

// (problem, solution, width, heigh, x, y)
import { basic_rules } from './rules'

//Todo put into utils
let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]])
let idFct = (e) => e

//https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
const distinct = (a, compareFct = stringify) => {
  let d = {}
  a.forEach((e) => {
    d[compareFct(e)] = e
  })

  return Object.values(d)
}

let rotateMatrix = (a, rotateElementFct = idFct) => {
  const aWidth = a[0].length

  return range(aWidth).map((_, i) =>
    a.map((aLine) => rotateElementFct(aLine[i])).reverse()
  )
}

// eslint-disable-next-line no-undef
const console = window.console

const STATE_RULE = {
  NOT_IMPORTANT: ' ',
  NUMBER_0: 0,
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
  SLASH_FORWARD_EXPECTED: '/?',
  SLASH_BACKWARD_EXPECTED: '\\?',
  SLASH_FORWARD_RESULT: '/!',
  SLASH_BACKWARD_RESULT: '\\!',
  BORDER: '*',
}

const changeSlashOrientation = (e) => {
  return {
    [STATE_RULE.NOT_IMPORTANT]: STATE_RULE.NOT_IMPORTANT,
    [STATE_RULE.NUMBER_0]: STATE_RULE.NUMBER_0,
    [STATE_RULE.NUMBER_1]: STATE_RULE.NUMBER_1,
    [STATE_RULE.NUMBER_2]: STATE_RULE.NUMBER_2,
    [STATE_RULE.NUMBER_3]: STATE_RULE.NUMBER_3,
    [STATE_RULE.NUMBER_4]: STATE_RULE.NUMBER_4,
    [STATE_RULE.SLASH_FORWARD_EXPECTED]: STATE_RULE.SLASH_BACKWARD_EXPECTED,
    [STATE_RULE.SLASH_BACKWARD_EXPECTED]: STATE_RULE.SLASH_FORWARD_EXPECTED,
    [STATE_RULE.SLASH_FORWARD_RESULT]: STATE_RULE.SLASH_BACKWARD_RESULT,
    [STATE_RULE.SLASH_BACKWARD_RESULT]: STATE_RULE.SLASH_FORWARD_RESULT,
    [STATE_RULE.BORDER]: STATE_RULE.BORDER,
  }[e]
}

const changeSlashExpectation = (e) => {
  return {
    [STATE_RULE.NOT_IMPORTANT]: STATE_RULE.NOT_IMPORTANT,
    [STATE_RULE.NUMBER_0]: STATE_RULE.NUMBER_0,
    [STATE_RULE.NUMBER_1]: STATE_RULE.NUMBER_1,
    [STATE_RULE.NUMBER_2]: STATE_RULE.NUMBER_2,
    [STATE_RULE.NUMBER_3]: STATE_RULE.NUMBER_3,
    [STATE_RULE.NUMBER_4]: STATE_RULE.NUMBER_4,
    [STATE_RULE.SLASH_FORWARD_EXPECTED]: STATE_RULE.SLASH_FORWARD_RESULT,
    [STATE_RULE.SLASH_BACKWARD_EXPECTED]: STATE_RULE.SLASH_BACKWARD_RESULT,
    [STATE_RULE.SLASH_FORWARD_RESULT]: STATE_RULE.SLASH_FORWARD_EXPECTED,
    [STATE_RULE.SLASH_BACKWARD_RESULT]: STATE_RULE.SLASH_BACKWARD_EXPECTED,
    [STATE_RULE.BORDER]: STATE_RULE.BORDER,
  }[e]
}

const textToState = (s) => {
  return {
    '0': STATE_RULE.NUMBER_0,
    '1': STATE_RULE.NUMBER_1,
    '2': STATE_RULE.NUMBER_2,
    '3': STATE_RULE.NUMBER_3,
    '4': STATE_RULE.NUMBER_4,
    '': STATE_RULE.NOT_IMPORTANT,
    '.': STATE_RULE.NOT_IMPORTANT,
    '..': STATE_RULE.NOT_IMPORTANT,
    '//!': STATE_RULE.SLASH_FORWARD_RESULT,
    '//?': STATE_RULE.SLASH_FORWARD_EXPECTED,
    '\\!': STATE_RULE.SLASH_BACKWARD_RESULT,
    '\\?': STATE_RULE.SLASH_BACKWARD_EXPECTED,
    '*': STATE_RULE.BORDER,
  }[s.trim()]
}

const parse_rule = (rule) => {
  const INVERTED_TEXT = 'INVERTED_VALID'
  let invertedValid = false
  if (rule.startsWith(INVERTED_TEXT)) {
    invertedValid = true
    rule = rule.slice(INVERTED_TEXT.length)
  }

  const lines = rule
    .split('\n')
    .filter((l) => l.trim() !== '')
    .map((l) => {
      let isNumberLine = l.includes('-'),
        isSlashLine = l.includes('|')

      console.assert(
        isNumberLine !== isSlashLine,
        `isNumberLine:${isNumberLine} isSlashLine:${isSlashLine} rule:${rule}`
      )

      let content = null

      if (isNumberLine) {
        content = l
          .split('-')
          .map((c) => c.trim())
          .map(textToState)
        // Removing first and last element
        content.pop()
        content.shift()
      } else {
        content = l
          .split('|')
          .map((c) => c.trim())
          .map(textToState)
      }

      return { isNumberLine, content }
    })

  //Check that the lines alternates
  let previousIsNumber = !lines[0].isNumberLine
  lines.forEach((e, i) => {
    let expectedIsNumber = !previousIsNumber
    console.assert(
      e.isNumberLine === expectedIsNumber,
      `Is number failed for ${rule} on ${e.content}`,
    )
    previousIsNumber = expectedIsNumber
  })

  const startsWithNumber = lines[0].isNumberLine
  console.assert(!startsWithNumber)

  const numberLines = lines.filter((l) => l.isNumberLine).map((l) => l.content)
  const slashLines = lines.filter((l) => !l.isNumberLine).map((l) => l.content)

  return { num: numberLines, slash: slashLines, invertedValid }
}

const print_rule = (rule) => {
  let res_str = [] //To be joined with empty string ''
  let res_args = [] // To be added to console arguments

  const cssExpected = 'color:green; font-weight:bolder; background:white'
  const cssResult = 'color:red; font-weight:bolder; background:white'
  const cssWalls = 'color:black; font-weight:bold; background:white'

  const elemPatt = {
    [STATE_RULE.NOT_IMPORTANT]: [' ', cssWalls],
    [STATE_RULE.NUMBER_0]: ['0', cssExpected],
    [STATE_RULE.NUMBER_1]: ['1', cssExpected],
    [STATE_RULE.NUMBER_2]: ['2', cssExpected],
    [STATE_RULE.NUMBER_3]: ['3', cssExpected],
    [STATE_RULE.NUMBER_4]: ['4', cssExpected],
    [STATE_RULE.SLASH_FORWARD_EXPECTED]: ['/', cssExpected],
    [STATE_RULE.SLASH_BACKWARD_EXPECTED]: ['\\', cssExpected],
    [STATE_RULE.SLASH_FORWARD_RESULT]: ['/', cssResult],
    [STATE_RULE.SLASH_BACKWARD_RESULT]: ['\\', cssResult],
    [STATE_RULE.BORDER]: ['*', cssWalls],
    '-': ['-', cssWalls],
    '|': ['|', cssWalls],
    '\n': ['\n', 'color: black; background: black'],
  }

  const put = (e) => {
    const [txt, css] = elemPatt[e]

    res_str.push(`%c ${txt}`)
    res_args.push(css)
  }

  zip(rule.slash, rule.num).forEach(([slash, num]) => {
    //Slash part
    slash.forEach((c, ci) => {
      if (ci !== 0) put('|')
      put(c)
    })
    put('\n')

    //Num part
    if (num !== undefined) {
      num.forEach((c) => {
        put('-')
        put(c)
      })
      put('-')
      put('\n')
    }
  })

  res_args.unshift(res_str.join(''))

  //Print all the cases
  // console.log(...res_args)
}

// Rotate 1/4 the rule clock-wise
const rotateRule = (rule) => {
  // Then merge them together
  return {
    slash: rotateMatrix(rule.slash, changeSlashOrientation),
    num: rotateMatrix(rule.num),
  }
}

// Rotate 1/4 the rule clock-wise
const mirrorRuleLeftRight = (rule) => {
  return {
    slash: rule.slash.map((l) =>
      l.slice().reverse().map(changeSlashOrientation)
    ),
    num: rule.num.map((l) => l.slice().reverse()),
  }
}

const mirrorRuleTopBottom = (rule) => {
  return {
    slash: rule.slash.map((l) => l.map(changeSlashOrientation)).reverse(),
    num: rule.num.map((l) => l.map(changeSlashOrientation)).reverse(),
  }
}

const addInvertRule = (rule) => {
  if (!rule.invertedValid) {
    return {
      slash: rule.slash,
      num: rule.num,
    }
  }

  const invertedSlash = rule.slash.map((l) => l.map(changeSlashExpectation))

  return [
    //Rule without the invertedValid
    { slash: rule.slash, num: rule.num },
    //Invert rule
    { slash: invertedSlash, num: rule.num },
  ]
}

const generateAllVersions = (rule) => {
  let rotate0 = rule
  let rotate90 = rotateRule(rotate0)
  let rotate180 = rotateRule(rotate90)
  let rotate270 = rotateRule(rotate180)

  let pivotedRules = [rotate0, rotate90, rotate180, rotate270]

  let res = pivotedRules
    .map((r) => [r, mirrorRuleLeftRight(r)])
    .flat()
    .map((r) => [r, mirrorRuleTopBottom(r)])
    .flat()

  return distinct(res)
}

const calculatedRules = distinct(
  basic_rules
    .map(parse_rule)
    .map(addInvertRule)
    .flat()
    .map(generateAllVersions)
    .flat()
)

calculatedRules.forEach(print_rule)

/**
 * Case of 11 near each other, and 33 near each others
 */
const lookForRules = (problem, solution) => {
  let allToApply = []
  const width = problem[0].length,
    height = problem.length

  const getSol = (x, y) => {
    const line = solution[y]
    if (line === undefined) return '*'
    const cell = line[x]
    if (cell === undefined) return '*'
    return cell
  }

  const getElem = (x, y) => {
    const line = problem[y]
    if (line === undefined) return '*'
    const cell = line[x]
    if (cell === undefined) return '*'
    return cell
  }

  const applyRule = (applyX, applyY, r) => {
    let toApply = []
    let valid = true

    r.num.forEach((line, lineY) => {
      line.forEach((ruleCell, lineX) => {
        const solX = applyX + lineX,
          solY = applyY + lineY
        const s = getElem(solX, solY)

        switch (ruleCell) {
          case STATE_RULE.NOT_IMPORTANT:
            break
          case STATE_RULE.NUMBER_0:
            if (s !== '0') valid = false
            break
          case STATE_RULE.NUMBER_1:
            if (s !== '1') valid = false
            break
          case STATE_RULE.NUMBER_2:
            if (s !== '2') valid = false
            break
          case STATE_RULE.NUMBER_3:
            if (s !== '3') valid = false
            break
          case STATE_RULE.NUMBER_4:
            if (s !== '4') valid = false
            break
          default:
            console.assert(false, `${s} ${ruleCell}`)
        }
      })
    })

    r.slash.forEach((line, lineY) => {
      line.forEach((ruleCell, lineX) => {
        const solX = applyX + lineX - 1,
          solY = applyY + lineY - 1
        const s = getSol(solX, solY)

        switch (ruleCell) {
          case STATE_RULE.NOT_IMPORTANT:
            if (s === '*')
              // We found a wall when there wasn't any
              valid = false
            //The rest ignore
            break
          case STATE_RULE.BORDER:
            if (s !== '*') valid = false
            break
          case STATE_RULE.SLASH_FORWARD_EXPECTED:
            if (s !== '/') valid = false
            break
          case STATE_RULE.SLASH_BACKWARD_EXPECTED:
            if (s !== '\\') valid = false
            break
          case STATE_RULE.SLASH_BACKWARD_RESULT:
            if (s === ' ') toApply.push({ x: solX, y: solY, s: '\\' })
            break
          case STATE_RULE.SLASH_FORWARD_RESULT:
            if (s === ' ') toApply.push({ x: solX, y: solY, s: '/' })
            break
          default:
            console.assert(false, `${s} ${ruleCell}`)
        }
      })
    })

    if (!valid) {
      return []
    }
    return toApply
  }

  range(height).forEach((_, y) => {
    range(width).forEach((_, x) => {
      calculatedRules.forEach((r) => {
        let toApply = applyRule(x, y, r)
        toApply.forEach((e) => allToApply.push(e))
      })
    })
  })
  return allToApply
}

export const getNextHint = (problem, solution) => {
  let lookForRulesRes = lookForRules(problem, solution)
  if (lookForRulesRes.length !== 0) {
    return lookForRulesRes
  }

  let loopGroupHintsRes = getLoopGroupHints(problem, solution)
  if (loopGroupHintsRes.length !== 0) {
    return loopGroupHintsRes
  }

  return []
}

export const getNextHintAll = (problem, solution) => {
  let curSolution = solution.map((l) => l.slice())

  let allHints = []
  let hints = getNextHint(problem, curSolution)
  hints.forEach((hint) => {
    curSolution[hint.y][hint.x] = hint.s
  })

  allHints.push(hints)

  while (hints.length !== 0) {
    hints = getNextHint(problem, curSolution)
    allHints.push(hints)

    hints.forEach((hint) => {
      curSolution[hint.y][hint.x] = hint.s
    })
  }

  return [].concat(...allHints)
}
