import React  from 'react'
import ReactMarkdown from 'react-markdown'
import { NavLink } from 'react-router-dom'

const markdown = `
# Welcome to [slant.games]
This is a game based on
[Simon Tatham's Portable Puzzle Collection](https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/slant.html)

The twist is to have a large map on which anyone can play.          

If you're new to the game, I highly recommend the [tutorial](/tutorial/rules)
`

//TODO : rename to main page
export function Counter() {
  return (
    <div>
      <ReactMarkdown source={markdown} />
      <NavLink exact to={'/main_map'}>
        To the world map
      </NavLink>
    </div>
  )
}
