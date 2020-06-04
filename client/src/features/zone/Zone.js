import React, { useEffect, useLayoutEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  fetchZone,
  selectZone,
  leftClick,
  rightClick,
  pushAnswer,
  specifyState,
} from './zoneSlice'
import styles from './Zone.module.css'
import {
  range,
  getRelativeCoordinates,
  getElementBox,
  throttle,
  postphoneAsync,
  postphoneAsyncWithTime,
} from '../../utils'
import { getLoopSolution } from '../../utils/slant_hints/loops'
import { getNextHintAll } from '../../utils/slant_hints/get_next_hint'
import {
  PROBLEM_STATE,
  extractProblemState,
} from '../../utils/slant_hints/problemState'
import { socket } from '../../utils/socket'
import {is_connected_side} from '../../utils/slant_hints/is_connected_side'

export const NUMBER_STATE = {
  [PROBLEM_STATE.INVALID]: 'red',
  [PROBLEM_STATE.SOLVED]: 'green',
  [PROBLEM_STATE.DEFAULT]: 'black',
}

const getNumberColor = (problem, solution, posX, posY) => {
  const hint_state = extractProblemState(problem, solution, posX, posY)

  return NUMBER_STATE[hint_state]
}


export default function Zone(props) {
  const dispatch = useDispatch()
  let { zoneId } = useParams()
  const content = useSelector(selectZone(zoneId))
  const contentPresent = !!content

  const sendMouseMoveEvent = (pos) => {
    socket.emit('mouse_move', pos)
  }
  const sendMouseClickEvent = (e) => {
    socket.emit('mouse_click', e)
  }
  const sendSetZoneEvent = () => {
    socket.emit('set_zone', { zone_path: zoneId })
  }
  const sendLeaveZoneEvent = () => {
    socket.emit('leave_zone')
  }

  const [stateOtherMouse, setStateOtherMouse] = useState({})
  //Init without all zeros to avoid divide by 0
  //   const [stateDivBox, setStateDivBox] = useState({top:0, left: 0, width: 1, height:1});

  useEffect(() => {
    if (!contentPresent) {
      dispatch(fetchZone(zoneId))
    }
  }, [zoneId, contentPresent])

  useEffect(() => {
    const cleanMethod = socket.whenConnected(sendSetZoneEvent)

    return () => {
      sendLeaveZoneEvent()
      cleanMethod()
    }
  }, [zoneId])

  useEffect(() => {
    socket.on('mouse_move', (data) => {
      const { x, y, sid } = data
      setStateOtherMouse({ [sid]: { x, y } })
    })

    socket.on('mouse_click', (data) => {
      let { x, y, left } = data
      if (left) {
        dispatch(leftClick({ x, y, zoneId }))
      } else dispatch(rightClick({ x, y, zoneId }))
    })
  }, [dispatch, setStateOtherMouse, zoneId])

  let { height, width, problem, solution, solved } = content || {
    height: 0,
    width: 0,
    problem: [],
    solution: [],
    solved: false,
  }

  let isFull = !solution.some((line) => line.some((cell) => cell === ' '))
  if (!contentPresent) {
    isFull = false
  }

  let loopSolution = getLoopSolution(solution)
  let isConnectedSide = is_connected_side(solution)

  const B = 10 // Border every sides
  const M = 10 // View box multiplication
  const CS = 4 // circle size

  let viewBoxWidth = width * M + B + B
  let viewBoxHeight = height * M + B + B

  const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`

  let onMouseClickEvent = (e, left) => {
    e.preventDefault()

    //      setStateDivBox(getElementBox(e.target));

    let posDiv = getRelativeCoordinates(e, e.target)

    let rect = e.target.getBoundingClientRect()

    // Changing to the viewbox view, removing the borders
    let posViewBox = {
      x: (posDiv.x * viewBoxWidth) / (rect.right - rect.left),
      y: (posDiv.y * viewBoxHeight) / (rect.bottom - rect.top),
    }

    let posInField = {
      x: posViewBox.x - B,
      y: posViewBox.y - B,
    }

    //Removing events outside the field
    if (
      posInField.x < 0 ||
      posInField.y < 0 ||
      posInField.x > width * M ||
      posInField.y > height * M
    ) {
      return true
    }

    let posAbs = {
      x: Math.floor(posInField.x / M),
      y: Math.floor(posInField.y / M),
    }

    sendMouseClickEvent({ ...posAbs, left })

    if (left) {
      dispatch(leftClick({ ...posAbs, zoneId }))
    } else dispatch(rightClick({ ...posAbs, zoneId }))

    return false
  }

  let onClickEvent = (e) => onMouseClickEvent(e, true)
  let onContextMenuEvent = (e) => onMouseClickEvent(e, false)

  let divClassNames = [styles.wrappingDiv]

  if (solved) {
    divClassNames.push(styles.div_succeed)
    setTimeout(() => props.history.push('/main_map'), 4000)
  }

  divClassNames = divClassNames.join(' ')

  const onMouseMove = useCallback((e) => {
    const divElementBox = getElementBox(e.target)
    //            setStateDivBox(divElementBox);

    const toSend = {
      x: ((e.pageX - divElementBox.left) * 1.0) / divElementBox.width,
      y: ((e.pageY - divElementBox.top) * 1.0) / divElementBox.height,
    }

    sendMouseMoveEvent(toSend)
  }, [])

  const onMouseOut = useCallback((e) => {
    sendMouseMoveEvent({
      x: null,
      y: null,
    })
  })

  const throttledOnMouseMove = useCallback(throttle(onMouseMove, 500), [
    onMouseMove,
  ])

  const getHint = () => {
    const hints = getNextHintAll(problem, solution)

    hints.forEach((h) => {
      dispatch(specifyState({ zoneId, ...h }))
    })

    // if (hints.length !== 0) {
    //   getHint()
    // }
  }

  if (!contentPresent) {
    return <div>Empty for now</div>
  }

  if (isFull) {
    dispatch(pushAnswer({ zoneId, solution }))
  }

  return (
    <div>
      Zone {'' + zoneId} here
      <div
        className={divClassNames}
        onClick={onClickEvent}
        onContextMenu={onContextMenuEvent}
        onMouseMove={throttledOnMouseMove}
        onMouseOut={onMouseOut}>
        <svg viewBox={viewBox}>
          <rect
            x="0"
            y="0"
            width={viewBoxWidth}
            height={viewBoxHeight}
            className={styles.rectBackground}
          />
          <g>
            {range(width).map((_, x) => {
              return range(height)
                .map((_, y) => {
                  let pos = `${x},${y}`

                  return (
                    <rect
                      x={x * M + B}
                      y={y * M + B}
                      width={M}
                      height={M}
                      className={styles.rectFloor}
                      key={pos}
                    />
                  )
                })
                .flat()
            })}
          </g>

          <g>
            {range(width)
              .map((_, x) => {
                return range(height)
                  .map((_, y) => {
                    let pos = `${x},${y}`

                    let curStyle = styles.line;
                    if(isConnectedSide[y][x]) {
                      curStyle = styles.isConnectedSide;
                    }
                    if(loopSolution[y][x]){
                      curStyle = styles.lineError;
                    }
                    let sol_content = solution[y][x]

                    if (sol_content === '/') {
                      return (
                        <line
                          x1={x * M + B + M}
                          y1={y * M + B}
                          x2={x * M + B}
                          y2={y * M + B + M}
                          className={curStyle}
                          key={pos}
                        />
                      )
                    }

                    if (sol_content === '\\') {
                      return (
                        <line
                          x1={x * M + B}
                          y1={y * M + B}
                          x2={x * M + B + M}
                          y2={y * M + B + M}
                          className={curStyle}
                          key={pos}
                        />
                      )
                    }

                    return null
                  })
                  .flat()
              })
              .flat()}
          </g>

          <g>
            {range(width + 1).map((_, x) => {
              return range(height + 1)
                .map((_, y) => {
                  let pos = `${x},${y}`
                  if (problem[y][x] === ' ') {
                    return null
                  }

                  let numberColor = getNumberColor(problem, solution, x, y)

                  return (
                    <circle
                      cx={x * M + B}
                      cy={y * M + B}
                      r={CS / 1.5}
                      stroke={numberColor}
                      strokeWidth="1"
                      fill="grey"
                      key={pos}
                    />
                  )
                })
                .flat()
            })}
          </g>

          <g>
            {range(width + 1).map((_, x) => {
              return range(height + 1)
                .map((_, y) => {
                  let pos = `${x},${y}`
                  if (problem[y][x] === ' ') {
                    return null
                  }

                  let numberColor = getNumberColor(problem, solution, x, y)

                  return (
                    <text
                      x={x * M + B - CS / 2 + 1 - 0.25}
                      y={y * M + B + CS / 2 - 1 + 0.5}
                      className={styles.small_text}
                      key={pos}
                      draggable="false"
                      fill={numberColor}>
                      {problem[y][x]}
                    </text>
                  )
                })
                .flat()
            })}
          </g>

          <g></g>

          <g>
            {Object.entries(stateOtherMouse).map(([key, value]) => {
              let { x, y } = value

              if (x === null || y === null) {
                return null
              }

              const transformY = Math.round(value.y * viewBoxHeight)
              const transformX = Math.round(value.x * viewBoxWidth)
              let box = {
                key,
                height: 6,
                width: 6,
                //                    y: y,
                //                    x: x,
                style: {
                  transform: `translate(${transformX}px, ${transformY}px)`,
                  position: 'absolute',
                  transition: 'transform .5s ease', //Seems to be the best one
                  //                        transition: 'transform .5s linear',
                  //                        transition: 'transform .5s ease-in',
                  //                        transition: 'transform .5s ease-out',
                  //                        transition: 'transform .5s ease-in-out',
                },
              }

              return (
                <image
                  {...box}
                  href={process.env.PUBLIC_URL + '/mouse_pointer-purple.svg'}
                />
              )
              ////                return <rect fill="black" {...box} key={key} />;
              //                return <svg viewBox={"0 0 744.09447 1052.362179"} {...box}>
              //                     <path d="m35.438 24.812v602.34h35.438v-35.438h35.438v-35.406h-35.438v-460.66h35.438v-35.406h-35.438v-35.438h-35.438zm70.875 70.844v35.438h35.406v-35.438h-35.406zm35.406 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.406h35.438v-35.406h-35.438zm35.438 35.406v35.438h35.406v-35.438h-35.406zm35.406 35.438v35.438h-106.28v106.31h35.438v-70.875h141.72v-35.438h-35.438v-35.438h-35.438zm-70.844 141.75v70.844h35.438v-70.844h-35.438zm35.438 70.844v70.875h35.406v-70.875h-35.406zm35.406 70.875v70.875h35.438v-70.875h-35.438zm0 70.875h-70.844v35.438h70.844v-35.438zm-70.844 0v-70.875h-35.438v70.875h35.438zm-35.438-70.875v-70.875h-35.438v70.875h35.438zm-35.438-70.875v-70.844h-35.438v70.844h35.438zm-35.438-70.844v-70.875h-35.438v35.438h-35.438v35.438h70.875zm-70.875 0h-35.406v35.438h35.406v-35.438z" fillRule="evenodd"/>
              //                     <path d="m70.875 95.656v460.66h35.438v-35.438h35.406v-35.438h35.438v-35.438h35.438v70.875h35.438v70.844h35.438v70.875h35.438v70.875h70.844v-70.875h-35.406v-70.875h-35.438v-70.844h-35.438v-106.31h106.28v-35.438h-35.406v-35.438h-35.438v-35.406h-35.438v-35.438h-35.438v-35.438h-35.438v-35.438h-35.438v-35.438h-35.438v-35.438h-35.406v-35.438h-35.438z" fill="#fff"/>
              //                </svg>

              //From https://pixabay.com/vectors/cursor-arrow-pointer-computer-23231/
              //                return <svg key={key} styles={styles} width="10px" height="10px" viewBox={"0 0 744.09447 1052.362179"}>
              //                 <path d="m35.438 24.812v602.34h35.438v-35.438h35.438v-35.406h-35.438v-460.66h35.438v-35.406h-35.438v-35.438h-35.438zm70.875 70.844v35.438h35.406v-35.438h-35.406zm35.406 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.438h35.438v-35.438h-35.438zm35.438 35.438v35.406h35.438v-35.406h-35.438zm35.438 35.406v35.438h35.406v-35.438h-35.406zm35.406 35.438v35.438h-106.28v106.31h35.438v-70.875h141.72v-35.438h-35.438v-35.438h-35.438zm-70.844 141.75v70.844h35.438v-70.844h-35.438zm35.438 70.844v70.875h35.406v-70.875h-35.406zm35.406 70.875v70.875h35.438v-70.875h-35.438zm0 70.875h-70.844v35.438h70.844v-35.438zm-70.844 0v-70.875h-35.438v70.875h35.438zm-35.438-70.875v-70.875h-35.438v70.875h35.438zm-35.438-70.875v-70.844h-35.438v70.844h35.438zm-35.438-70.844v-70.875h-35.438v35.438h-35.438v35.438h70.875zm-70.875 0h-35.406v35.438h35.406v-35.438z" fill-rule="evenodd"/>
              //                 <path d="m70.875 95.656v460.66h35.438v-35.438h35.406v-35.438h35.438v-35.438h35.438v70.875h35.438v70.844h35.438v70.875h35.438v70.875h70.844v-70.875h-35.406v-70.875h-35.438v-70.844h-35.438v-106.31h106.28v-35.438h-35.406v-35.438h-35.438v-35.406h-35.438v-35.438h-35.438v-35.438h-35.438v-35.438h-35.438v-35.438h-35.438v-35.438h-35.406v-35.438h-35.438z" fill="#fff"/>
              //                </svg>
            })}
          </g>
        </svg>
      </div>
      {/*<button onClick={getHint}>getHint</button>*/}
    </div>
  )
}
