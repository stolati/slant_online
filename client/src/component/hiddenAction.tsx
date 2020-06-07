// @ts-ignore
import React from 'react'
import PropTypes, { InferProps } from "prop-types";


// @ts-ignore
window.activateHiddenActions = () =>{
  Array.from(
    document.getElementsByClassName('hidden_action')
  // @ts-ignore
  ).forEach(e => e.style.display = null)
}

const IS_LOCALHOST = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
const STYLE_HIDDEN = {display: 'none'}

export function HiddenAction({children}: InferProps<typeof HiddenAction.propTypes>){

  const style = IS_LOCALHOST ? {} : STYLE_HIDDEN

  return <div className='hidden_action' style={style}>
    {children}
  </div>

}

HiddenAction.propTypes = {
  children: PropTypes.any
}
