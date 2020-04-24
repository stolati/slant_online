import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { range } from '../../utils'

// TODO : change zoneId to zonePath

export const fetchZone = createAsyncThunk(
  'zone:fetchZone:status',
  async (zoneId, thunkAPI) => {
    const response = await axios.get(`/api/zones/${zoneId}`)
    return response.data
  }
)

export const pushAnswer = createAsyncThunk(
  'zone:pushAnswer:status',
  async (data, thunkAPI) => {
    const { zoneId, solution } = data

    let payload = {
      solution: solution.map((l) => l.join('')),
    }
    const response = await axios.post(`/api/zones/${zoneId}`, payload)

    let isOk = response.data.ok !== undefined
    return { isOk, zoneId }
  }
)

export const slice = createSlice({
  name: 'zone',
  initialState: {},
  reducers: {
    specifyState: (state, action) => {
      let { x, y, zoneId, s } = action.payload
      state[zoneId].solution[y][x] = s
    },
    leftClick: (state, action) => {
      let { x, y, zoneId } = action.payload
      let zone = state[zoneId]

      let rotateClick = (e) =>
        ({
          ' ': '\\',
          '\\': '/',
          '/': ' ',
        }[e])

      zone.solution[y][x] = rotateClick(zone.solution[y][x])
    },
    rightClick: (state, action) => {
      let { x, y, zoneId } = action.payload
      let zone = state[zoneId]

      let rotateClick = (e) =>
        ({
          ' ': '/',
          '/': '\\',
          '\\': ' ',
        }[e])

      zone.solution[y][x] = rotateClick(zone.solution[y][x])
    },
  },
  extraReducers: {
    [fetchZone.fulfilled]: (state, action) => {
      let { height, width, problem, zone_path } = action.payload
      let solved = false

      let newZone = { height, width, problem, solved, zone_path }

      if (!newZone.solution) {
        newZone.solution = range(newZone.height).map((_, y) =>
          range(newZone.width).map((_, x) => ' ')
        )
      }

      state[zone_path] = newZone
    },
    [pushAnswer.fulfilled]: (state, action) => {
      console.log('pushAnswer.fulfilled', state, action)
      let { isOk, zoneId } = action.payload

      state[zoneId].solved = isOk
    },
  },
})

export const { leftClick, rightClick, specifyState } = slice.actions

export const selectZone = (zoneId) => (state) => state.zone[zoneId]

export default slice.reducer
