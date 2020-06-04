import React from 'react'
import ReactMarkdown from 'react-markdown'
import './Rules.module.css'

const ruleMarkdown = `
Fill in a diagonal line in every grid square so that there are no loops in the grid, 
and so that every numbered point has that many lines meeting at it.

Left-click in a square to mark it with a \\; right-click to mark it with a /. 
Keep clicking in a square to cycle it between \\, / and empty.
`

function Rules() {
  return <div>
    <ReactMarkdown source={ruleMarkdown}/>
  </div>

}

export default Rules
