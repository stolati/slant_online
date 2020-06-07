import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from './Zone.module.css'
import { getRelativeCoordinates, getElementBox, throttle } from '../../utils'
import { getNextHintAll } from '../../utils/slant_hints/get_next_hint'
import { PROBLEM_STATE } from '../../utils/slant_hints/problemState'
import { socket } from '../../utils/socket'
import SlantState from '../../utils/slant_hints/slant_state'
import { GridBox, HintText, SolutionLine } from './ZoneSvg'
import ZoneDrawingHelper from './ZoneDrawingHelper'

export const NUMBER_STATE = {
  [PROBLEM_STATE.INVALID]: 'red',
  [PROBLEM_STATE.SOLVED]: 'green',
  [PROBLEM_STATE.DEFAULT]: 'black',
}

const zoneDrawingHelper = new ZoneDrawingHelper({
  mapBorder: 10,
  boxSize: 10,
  circleSize: 4,
})

export default function Zone({ onSolve, zoneId, content, onAction, solution, onActions}) {
  const dispatch = useDispatch()
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
      onAction({ x, y, action: (left ? 'clickLeft' : 'clickRight')})
    })
  }, [dispatch, setStateOtherMouse, zoneId])

  const slantState = new SlantState({...content, solution})

  let slantStaticState = slantState.toStaticState()
  //TODO get rid of the usage of thoses (use ZoneDrawingHelper or slantState)
  let { height, width, problem, solved } = slantStaticState
  let solutionStaticState = slantStaticState.solution

  let isFull = !solution.some((line) => line.some((cell) => cell === ' '))
  if (!contentPresent) {
    isFull = false
  }

  const B = 10 // Border every sides
  const M = 10 // View box multiplication

  const viewBoxSize = zoneDrawingHelper.getViewBox(width, height)
  // let viewBoxWidth = width * M + B + B
  // let viewBoxHeight = height * M + B + B
  let viewBoxWidth = viewBoxSize.width
  let viewBoxHeight = viewBoxSize.height

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

    onAction({ ...posAbs, content, zoneId, action: (left ? 'clickLeft' : 'clickRight')})

    return false
  }

  let onClickEvent = (e) => onMouseClickEvent(e, true)
  let onContextMenuEvent = (e) => onMouseClickEvent(e, false)

  let divClassNames = [styles.wrappingDiv]

  if (solved) {
    // divClassNames.push(styles.div_succeed)
    onSolve && setTimeout(onSolve, 0)
  }

  divClassNames = divClassNames.join(' ')

  const onMouseMove = useCallback((e) => {
    const divElementBox = getElementBox(e.target)
    //            setStateDivBox(divElementBox);

    const toSend = {
      x: ((e.pageX - divElementBox.left) * 1.0) / divElementBox.width,
      y: ((e.pageY - divElementBox.top) * 1.0) / divElementBox.height
    }

    sendMouseMoveEvent(toSend)
  })

  const onMouseOut = useCallback((e) => {
    sendMouseMoveEvent({
      x: null,
      y: null,
    })
  }, [])

  const throttledOnMouseMove = useCallback(throttle(onMouseMove, 500), [
    onMouseMove
  ])

  // eslint-disable-next-line no-unused-vars
  const getHint = () => {
    const hints = getNextHintAll(problem, solution)
    const actions = hints.map(({x, y, s}) => ({x, y, action: 'set', value: s}))

    setTimeout(()=>onActions(actions))
  }

  if (!contentPresent) {
    return <div>Empty for now</div>
  }

  // if (isFull) {
  //   dispatch(pushAnswer({ zoneId, solution }))
  // }

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
            {slantState.gridMap(({ x, y }) =>
              GridBox({ x, y, zoneDrawingHelper })
            )}
          </g>

          <g>
            {
              slantState.gridMap(({ x, y, value, isConnectedSide, isInLoop }) =>
                SolutionLine({ x, y, value, isConnectedSide, isInLoop, zoneDrawingHelper })
              ).flat()
            }
          </g>

          <g>
            {
              slantState.hintMap(({ x, y, value, hintState }) =>
                HintText({x, y, value, hintState, zoneDrawingHelper})
              ).flat()
            }
          </g>

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
                  transition: 'transform .5s ease' //Seems to be the best one
                  //                        transition: 'transform .5s linear',
                  //                        transition: 'transform .5s ease-in',
                  //                        transition: 'transform .5s ease-out',
                  //                        transition: 'transform .5s ease-in-out',
                }
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
      <button onClick={getHint}>getHint</button>
    </div>
  )
}
