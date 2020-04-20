// let getPos = (x, y, solution) => {
//   let solY = solution[y]
//   if (solY === undefined) return ' '
//   let solYX = solution[y][x]
//   if (solYX === undefined) return ' '
//
//   if (res[y][x] === false) {
//     return ' '
//   }
//   return solYX
// }

import stringify from 'json-stable-stringify'
import { matrixMap, range } from '../../utils'

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
  }[s.trim()]
}

const parse_rule = (rule) => {
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
  lines.map((e, i) => {
    let expectedIsNumber = !previousIsNumber
    console.assert(
      e.isNumberLine === expectedIsNumber,
      `Is number failed for ${rule} on ${e.content}`
    )
    previousIsNumber = expectedIsNumber
  })

  const startsWithNumber = lines[0].isNumberLine
  console.assert(!startsWithNumber)

  const numberLines = lines.filter((l) => l.isNumberLine).map((l) => l.content)
  const slashLines = lines.filter((l) => !l.isNumberLine).map((l) => l.content)

  return { num: numberLines, slash: slashLines }
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

  const add = (elem, color) => {
    if (elem.length == 1) elem = `${elem} `
    res_str.push(`%c${elem}`)
    res_args.push(`color: ${color}`)
  }

  const addDash = () => add('--', 'black')
  const addPipe = () => add('||', 'black')
  const addElem = (e) => add(`${e}`, 'red')
  const addNewLine = () => res_str.push('\n')

  zip(rule.slash, rule.num).map(([slash, num]) => {
    //Slash part
    slash.map((c, ci) => {
      if (ci !== 0) put('|')
      put(c)
    })
    put('\n')

    //Num part
    if (num !== undefined) {
      num.map((c) => {
        put('-')
        put(c)
      })
      put('-')
      put('\n')
    }
  })

  res_args.unshift(res_str.join(''))

  console.log(...res_args)
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

basic_rules.map(parse_rule).map(generateAllVersions).flat().map(print_rule)

/**
 * Case of 11 near each other, and 33 near each others
 */
const case_11 = (problem, solution) => {
  let res = []
  const width = problem[0].length,
    height = problem.length

  const getSol = (x, y, empty = ' ') => {
    const line = solution[y]
    if (line === undefined) return empty
    const cell = solution[x]
    if (cell === undefined) return empty
    return cell
  }

  const getElem = (x, y, empty = ' ') => {
    const line = problem[y]
    if (line === undefined) return empty
    const cell = line[x]
    if (cell === undefined) return empty
    return cell
  }

  // top-left, top-right, bottom-left, bottom right
  const getSolAround = (x, y, outOfBound = null) => {
    return {
      tl: { e: getSol(x - 1, y - 1, outOfBound), x: x - 1, y: y - 1 },
      tr: { e: getSol(x, y - 1, outOfBound), x: x, y: y - 1 },
      bl: { e: getSol(x - 1, y, outOfBound), x: x - 1, y: y },
      br: { e: getSol(x, y, outOfBound), x: x, y: y },
    }
  }

  matrixMap(width, height, (x, y) => {
    const atTop = y === 0
    const atLeft = x === 0
    const atBottom = y === height - 1
    const atRight = x === width - 1
    if (atTop || atLeft || atBottom || atRight) {
      return
    }

    let elem = getElem(x, y)
    let elemDown = getElem(x, y + 1)
    let elemRight = getElem(x + 1, y)

    if (elem === '1' && elemDown === '1') {
      let solAroundElem = getSolAround(x, y)
      let solAroundElemDown = getSolAround(x, y + 1)

      let shouldBe = [
        { pos: solAroundElem.tl, s: '/' },
        { pos: solAroundElem.tr, s: '\\' },
        { pos: solAroundElemDown.bl, s: '\\' },
        { pos: solAroundElemDown.br, s: '/' },
      ]
      res.push(...shouldBe)
    }

    if (elem === '1' && elemRight === '1') {
      let solAroundElem = getSolAround(x, y)
      let solAroundElemRight = getSolAround(x + 1, y)

      let shouldBe = [
        { pos: solAroundElem.tl, s: '/' },
        { pos: solAroundElem.bl, s: '\\' },
        { pos: solAroundElemRight.tr, s: '\\' },
        { pos: solAroundElemRight.br, s: '/' },
      ]
      res.push(...shouldBe)
    }

    if (elem === '3' && elemDown === '3') {
      let solAroundElem = getSolAround(x, y)
      let solAroundElemDown = getSolAround(x, y + 1)

      let shouldBe = [
        { pos: solAroundElem.tl, s: '\\' },
        { pos: solAroundElem.tr, s: '/' },
        { pos: solAroundElemDown.bl, s: '/' },
        { pos: solAroundElemDown.br, s: '\\' },
      ]
      res.push(...shouldBe)
    }

    if (elem === '3' && elemRight === '3') {
      let solAroundElem = getSolAround(x, y)
      let solAroundElemRight = getSolAround(x + 1, y)

      let shouldBe = [
        { pos: solAroundElem.tl, s: '\\' },
        { pos: solAroundElem.bl, s: '/' },
        { pos: solAroundElemRight.tr, s: '/' },
        { pos: solAroundElemRight.br, s: '\\' },
      ]
      res.push(...shouldBe)
    }
  })

  return res
}

const caseNoMoreChoice = (problem, solution) => {
  return []
}

export const getNextHint = (problem, solution) => {
  let caseNoMoreChoiceFindings = caseNoMoreChoice(problem, solution)

  let case11Findings = case_11(problem, solution)

  console.log(case11Findings)

  return case11Findings
}
