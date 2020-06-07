
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { range } from '../../utils'
import { Dictionary } from '@reduxjs/toolkit'

export const ZoneContext = React.createContext({})

enum SolutionValue {
  EMPTY = ' ',
  SLICE_LEFT = '\\',
  SLICE_RIGHT = '/',
}

const LEFT_ROTATION: Dictionary<SolutionValue> = {
  [SolutionValue.EMPTY]: SolutionValue.SLICE_LEFT,
  [SolutionValue.SLICE_LEFT]: SolutionValue.SLICE_RIGHT,
  [SolutionValue.SLICE_RIGHT]: SolutionValue.EMPTY,
}

const RIGHT_ROTATION: Dictionary<SolutionValue> = {
  [SolutionValue.EMPTY]: SolutionValue.SLICE_RIGHT,
  [SolutionValue.SLICE_RIGHT]: SolutionValue.SLICE_LEFT,
  [SolutionValue.SLICE_LEFT]: SolutionValue.EMPTY,
}


type Action = {x : number, y: number, action: string, value: SolutionValue | undefined }
type Solution  = SolutionValue[][]

const oneAction = ({ x, y, action, value }: Action, solution: any) => {
  switch (action) {
    case 'set':
      solution[y][x] = value
      break
    case 'clickLeft':
      solution[y][x] = LEFT_ROTATION[solution[y][x]]
      break
    case 'clickRight':
      solution[y][x] = RIGHT_ROTATION[solution[y][x]]
      break
    default:
      throw action
  }
}

const copySolution = (solution: Solution) => solution.map(l => l.slice())
const emptySolution = (height: number, width: number): Solution =>
  range(height).map((_, y) =>
    range(width).map((_, x) => SolutionValue.EMPTY))

const isSolutionFull = (solution: Solution) =>
  !solution.some((line) =>
    line.some((cell) => cell === SolutionValue.EMPTY))


interface ZoneContextProviderParams {
  zoneIdInitial: string,
  children: any
}
export function ZoneContextProvider({ zoneIdInitial, children }: ZoneContextProviderParams) {
  const zoneId = zoneIdInitial //We never modify it

  const [isLoaded, setLoaded] = useState(false)
  const [isFull, setIsFull] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [content, setContent] = useState({
    height: 0,
    width: 0,
    problem: [],
    solved: false
  })

  const [solution, setSolution] = useState([] as Solution)

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`/api/zones/${zoneId}`)

      setSolution(emptySolution(response.data.height, response.data.width))
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

  const onAction = (action: Action) => onActions([action])

  const onActions = (actions: Action[]) => {
    //Block any action when state success is already done.
    if(isSuccess) {
      return
    }
    const solutionCopy = copySolution(solution)
    actions.forEach(a => oneAction(a, solutionCopy))
    setSolution(solutionCopy)

    setIsFull(isSolutionFull(solutionCopy))
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

