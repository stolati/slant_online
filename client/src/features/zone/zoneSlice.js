import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


//const DEFAULT_ZONE = {
//        zone_path: null,
//        problem: null,
//        width: 0,
//        height: 0,
//}

// TODO : change zoneId to zonePath


export const fetchZone = createAsyncThunk(
    'zone:fetchZone:status',
    async (zoneId, thunkAPI) => {
        const response = await axios.get(`/api/zones/${zoneId}`);
        console.log(response);
        return response.data;
    }
)


export const slice = createSlice({
  name: 'zone',
  initialState: {},
  reducers: {


  },
  extraReducers: {
    [fetchZone.fulfilled]: (state, action) => {
        state[action.payload.zone_path] = {
            ...action.payload
        }
    },
  },
});

export const { } = slice.actions;


export const selectZone = zoneId => state => state.zone[zoneId];


export default slice.reducer;

