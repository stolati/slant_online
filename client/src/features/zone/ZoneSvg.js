import React from 'react'
import styles from './Zone.module.css'
import { PROBLEM_STATE } from '../../utils/slant_hints/problemState'


export function SolutionLine({ x, y, value, isConnectedSide, isInLoop, zoneDrawingHelper }) {
  let key = `${x},${y}`

  let curStyle = styles.line
  if (isConnectedSide) {
    curStyle = styles.isConnectedSide
  }
  if (isInLoop) {
    curStyle = styles.lineError
  }

  if (value === '/') {
    const blp = zoneDrawingHelper.gridBottomLeftPos(x, y)
    const trp = zoneDrawingHelper.gridTopRightPos(x, y)

    return (
      <line
        x1={blp.x} y1={blp.y}
        x2={trp.x} y2={trp.y}
        className={curStyle}
        key={key}
      />
    )
  }

  if (value === '\\') {
    const tlp = zoneDrawingHelper.gridTopLeftPos(x, y)
    const brp = zoneDrawingHelper.gridBottomRightPos(x, y)

    return (
      <line
        x1={tlp.x} y1={tlp.y}
        x2={brp.x} y2={brp.y}
        className={curStyle}
        key={key}
      />
    )
  }

  return null
}


export function GridBox({ x, y, zoneDrawingHelper }) {
  const gtlp = zoneDrawingHelper.gridTopLeftPos(x, y)

  return (
    <rect
      x={gtlp.x}
      y={gtlp.y}
      width={zoneDrawingHelper.gridBoxWidth}
      height={zoneDrawingHelper.gridBoxHeight}
      className={styles.rectFloor}
      key={`${x},${y}`}
    />
  )


}

export function HintText({ x, y, value, hintState, zoneDrawingHelper }) {
  if (value === ' ') {
    return null
  }

  //TODO change that into class
  let numberColor = {
    [PROBLEM_STATE.INVALID]: 'red',
    [PROBLEM_STATE.SOLVED]: 'green',
    [PROBLEM_STATE.DEFAULT]: 'black'
  }[hintState]

  const p = zoneDrawingHelper.getHintPos(x, y)

  return [

    <circle
      cx={p.x}
      cy={p.y}
      r={zoneDrawingHelper.circleSize / 1.5}
      stroke={numberColor}
      strokeWidth="1"
      fill="grey"
      key={`circle-${x},${y}`}
    />,
    <text
      x={p.x - zoneDrawingHelper.circleSize / 2 + 1 - 0.25}
      y={p.y + zoneDrawingHelper.circleSize / 2 - 1 + 0.5}
      className={styles.small_text}
      key={`text-${x},${y}`}
      draggable="false"
      fill={numberColor}>
      {value}
    </text>
  ]
}