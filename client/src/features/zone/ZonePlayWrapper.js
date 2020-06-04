import React, { useState } from 'react'
import Zone from './Zone'
import styles from './Zone.module.css'
import { useSelector } from 'react-redux'
import { selectZone } from './zoneSlice'
import { useParams } from 'react-router-dom'

export default function ZonePlayWrapper({history}){

  let { zoneId } = useParams()
  const content = useSelector(selectZone(zoneId))

  const [solved, setSolved] = useState(false)

  // const content = useSelector(selectZone(zoneId))

  let onSolve = () => {
    setSolved(true)
    // eslint-disable-next-line react/prop-types
    setTimeout(() => history.push('/main_map'), 4000)
  }

  let className = [];
  if(solved){
    className.push(styles.div_succeed)
  }

  return <div className={className.join(' ')}>
    <Zone onSolve={onSolve} zoneId={zoneId} content={content}/>
  </div>
}

