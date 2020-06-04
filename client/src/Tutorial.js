import React from 'react'
import styles from './Tutorial.css'
import { NavLink, useParams } from 'react-router-dom'

import Rules from './features/tuto/Rules'
import End from './features/tuto/End'
import Example from './features/tuto/Example'

//Rule
//Simple example of problem
//List of cases that can be found
//5 examples of simple problems
//More complicated problems
//5 examples of complicated problems
//Talking about the 2
//Talking about loops
//End


function Tutorial() {

  let { step, num } = useParams()

  let content = null
  let nextStep = null

  // TODO can be changed into a better structure
  switch (step) {
    case 'end':
      content = <End/>
      nextStep = { link: '/main_map', text: 'You\'re ready to go to the world map' }
      break

    case 'example':
      content = <Example level={num}/>
      nextStep = { link: '/tutorial/end', text : 'finished'}
      break

    default:
      content = "First, the rules : "
      nextStep = { link: '/tutorial/example/easy_1', text: 'First example' }
  }


  return (
    <div className="App">
      <header className="App-header">
        <div style={styles.header}>
          Tutorial : {step} {num}
        </div>
        <div>
          {content}
          <Rules/>
        </div>
          <div>
            Next step :&nbsp;
            <NavLink exact to={nextStep.link}>{nextStep.text}</NavLink>
          </div>
      </header>
    </div>
  )
}

export default Tutorial
