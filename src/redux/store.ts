import { combineReducers } from 'redux'
import modalConfirmReducer from './slices/modalConfirm'
import commonReducer from './slices/common'
import eventPostDetailReducer from './slices/eventPostDetail'

import { configureStore } from '@reduxjs/toolkit'

const reducer = combineReducers({
  modalConfirm: modalConfirmReducer,
  common: commonReducer,
  eventPostDetail: eventPostDetailReducer
})

const store = configureStore({
  reducer,
  devTools: import.meta.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>

export const modalConfirmState = (state: RootState) => state.modalConfirm
export const commonState = (state: RootState) => state.common
export const eventPostDetailState = (state: RootState) => state.eventPostDetail

export type AppDispatch = typeof store.dispatch

export default store
