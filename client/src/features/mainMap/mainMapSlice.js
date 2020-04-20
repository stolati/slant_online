import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchMainMap = createAsyncThunk(
  'mainMap:fetchMainMap:status',
  async (thunkAPI) => {
    const response = await axios.get('/api/zones')
    return response.data
  }
)

export const slice = createSlice({
  name: 'mainMap',
  initialState: {
    width: 1,
    height: 1,
    content: [[false]],
  },
  reducers: {},
  extraReducers: {
    [fetchMainMap.fulfilled]: (state, action) => {
      state.width = action.payload.width
      state.height = action.payload.height

      state.content = action.payload.content
        .split('\n')
        .map((line) => line.split('').map((c) => (c === '0' ? true : false)))
    },
  },
})

//export const { } = slice.actions;

export const selectMainMap = (state) => state.mainMap

export default slice.reducer
