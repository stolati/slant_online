import React, { useState } from 'react'
import Zone from './Zone'
import styles from './Zone.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { leftClick, rightClick, selectZone } from './zoneSlice'
import { useParams } from 'react-router-dom'

export default function ZonePlayWrapper({ history }) {
  const dispatch = useDispatch()

  let { zoneId } = useParams()
  const content = useSelector(selectZone(zoneId))

  const [solved, setSolved] = useState(false)

  // const content = useSelector(selectZone(zoneId))

  let onSolve = () => {
    setSolved(true)
    // eslint-disable-next-line react/prop-types
    setTimeout(() => history.push('/main_map'), 4000)
  }

  let className = []
  if (solved) {
    className.push(styles.div_succeed)
  }

  const onClick = ({ x, y, zoneId, isLeft, isRight }) => {
    if (isLeft) {
      dispatch(leftClick({x, y, zoneId}))
    }
    if (isRight) {
      dispatch(rightClick({x, y, zoneId}))
    }
  }


  return <div className={className.join(' ')}>
    <Zone onSolve={onSolve} zoneId={zoneId} content={content} onClick={onClick}/>
  </div>
}

