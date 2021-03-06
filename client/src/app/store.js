import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import mainMapReducer from '../features/mainMap/mainMapSlice'
import { createLogger } from 'redux-logger'

export default configureStore({
  reducer: {
    counter: counterReducer,
    mainMap: mainMapReducer,
  },
  devTools: true,
  middleware: [...getDefaultMiddleware(), createLogger()],
})
