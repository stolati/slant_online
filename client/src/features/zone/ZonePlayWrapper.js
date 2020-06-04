import React, { useState } from 'react'
import Zone from './Zone'
import styles from './Zone.module.css'

export default function ZonePlayWrapper({history}){

  const [solved, setSolved] = useState(false)

  let onSolve = () => {
    setSolved(true);
    setTimeout(() => history.push('/main_map'), 4000)
  }

  let className = [];
  if(solved){
    className.push(styles.div_succeed)
  }

  return <div className={className.join(' ')}>
    <Zone onSolve={onSolve}/>
  </div>
}

