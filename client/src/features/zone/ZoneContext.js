import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { range } from '../../utils'

export const ZoneContext = React.createContext({})


const rotateLeftClick = (e) =>
  ({
    ' ': '\\',
    '\\': '/',
    '/': ' '
  }[e])

const rotateRightClick = (e) =>
  ({
    ' ': '/',
    '/': '\\',
    '\\': ' '
  }[e])


const oneAction = ({ x, y, action, value }, solution) => {
  switch (action) {
    case 'set':
      solution[y][x] = value
      break
    case 'clickLeft':
      solution[y][x] = rotateLeftClick(solution[y][x])
      break
    case 'clickRight':
      solution[y][x] = rotateRightClick(solution[y][x])
      break
    default:
      throw action
  }
}

const copySolution = (solution) => solution.map(l => l.slice())


export function ZoneContextProvider({ zoneIdInitial, children }) {
  const [zoneId, setZoneId] = useState(zoneIdInitial)

  const [isLoaded, setLoaded] = useState(false)
  const [isFull, setIsFull] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [content, setContent] = useState({
    height: 0,
    width: 0,
    problem: [],
    solved: false
  })

  const [solution, setSolution] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`/api/zones/${zoneId}`)

      setSolution(range(response.data.height).map((_, y) =>
        range(response.data.width).map((_, x) => ' ')))
      setContent({ ...response.data, solution })
      setLoaded(true)
    }
    fetch()
  }, [zoneId])


  useEffect(() => {
    if (!isFull) {
      return
    }

    const post = async () => {
      //Success ??

      let payload = {
        solution: solution.map((l) => l.join(''))
      }
      console.log('zoneId : ', zoneId)
      const response = await axios.post(`/api/zones/${zoneId}`, payload)
      let isOk = response.data.ok !== undefined
      setIsSuccess(isOk)
      console.log("Success !!!!!")
    }
    post()
  }, [isFull])

  const onAction = (action) => onActions([action])

  const onActions = (actions) => {
    //Block any action when state success is already done.
    if(isSuccess) {
      return
    }
    const solutionCopy = copySolution(solution)
    actions.forEach(a => oneAction(a, solutionCopy))
    setSolution(solutionCopy)

    const isFull = !solutionCopy.some((line) => line.some((cell) => cell === ' '))
    setIsFull(isFull)
  }


  const value = { content, isLoaded, solution, onAction, onActions, isSuccess }

  return <ZoneContext.Provider value={value}>
    {children}
  </ZoneContext.Provider>


}



// export function ZoneContextProviderOffline({ contentInitial, expectedSolution, children }) {
//   const [zoneId, setZoneId] = useState(zoneIdInitial)
//
//   const [isSuccess, setIsSuccess] = useState(false)
//   const [content, setContent] = useState(contentInitial)
//   const [solution, setSolution] = useState(contentInitial)
//
//   const onAction = (action) => onActions([action])
//
//   const onActions = (actions) => {
//     const solutionCopy = copySolution(solution)
//     actions.forEach(a => oneAction(a, solutionCopy))
//     setSolution(solutionCopy)
//
//     //TODO solution == expectedSolution => setIsSuccess(true)
//
//     // const isFull = !solutionCopy.some((line) => line.some((cell) => cell === ' '))
//     //
//     // setIsFull(isFull)
//   }
//
//   const constValues = {
//     isLoaded: true,
//     isFull: isSuccess,
//
//
//
//   }
//
//   const value = { content, solution, onAction, onActions, ...constValues }
//
//   return <ZoneContext.Provider value={value}>
//     {children}
//   </ZoneContext.Provider>
//
//
// }

