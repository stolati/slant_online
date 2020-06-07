import React, { useState } from 'react'
import Zone from './Zone'
import styles from './Zone.module.css'
import { useParams } from 'react-router-dom'
import { ZoneContext, ZoneContextProvider } from './ZoneContext'
import { HiddenAction } from '../../component/hiddenAction'


function checkBoxState([activated, setActivated], label=null, props={}){
  const onChange = (e)=>setActivated(e.target.checked)
  // const onChange = (e)=>setActivated(!activated)

  const dom = <label>
    {label}
    <input type="checkbox" name="socketIoActivated" checked={activated} onChange={onChange} {...props} />
  </label>

  return [activated, setActivated, dom]
}


export default function ZonePlayWrapper({ history }) {
  let { zoneId } = useParams()

  const [solved, setSolved] = useState(false)

  const [sockActivated, _, sockDom] = checkBoxState(useState(true), "Socket IO activated")

  let onSolve = () => {
    setSolved(true)
    // eslint-disable-next-line react/prop-types
    setTimeout(() => history.push('/main_map'), 4000)
  }

  let className = []
  if (solved) {
    className.push(styles.div_succeed)
  }

  return <div className={className.join(' ')}>

    <HiddenAction>
      {sockDom}
    </HiddenAction>

    <ZoneContextProvider zoneIdInitial={zoneId}>
      <ZoneContext.Consumer>
        {
          (value) => {
            if(value.isSuccess){
              onSolve()
            }

            if(!value.isLoaded){
              return 'loading ...'
            } else {
              return <Zone onSolve={onSolve} socketIoActivated={sockActivated} {...value} />
            }
          }
        }
      </ZoneContext.Consumer>
    </ZoneContextProvider>

  </div>
}

