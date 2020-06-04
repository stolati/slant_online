import React from 'react'
import Zone from './Zone'
import {
  selectZone,
} from './zoneSlice'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function ZonePlayWrapper({history}){
  return <div>
    <Zone history={history}/>
  </div>
}

