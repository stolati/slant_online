import React, { useState } from 'react'
import Zone from './Zone'
import styles from './Zone.module.css'
import { useParams } from 'react-router-dom'
import { ZoneContext, ZoneContextProvider } from './ZoneContext'

export default function ZonePlayWrapper({ history }) {
  let { zoneId } = useParams()

  const [solved, setSolved] = useState(false)

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
              return <Zone onSolve={onSolve} {...value} />
            }
          }
        }
      </ZoneContext.Consumer>
    </ZoneContextProvider>

  </div>
}

