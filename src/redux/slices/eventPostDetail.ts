import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EventOfOrganizer } from 'src/types/event.type'
import { Post } from 'src/types/post.type'

interface EventPostDetailState {
  isShowEventPostDetailPopup: boolean
  event?: EventOfOrganizer
  post?: Post
}

const initialState: EventPostDetailState = {
  isShowEventPostDetailPopup: false,
  event: undefined,
  post: undefined
}

const eventPostDetailSlice = createSlice({
  name: 'eventPostDetail',
  initialState,
  reducers: {
    setEventPostDetailState: (state, action: PayloadAction<EventPostDetailState>) => {
      Object.assign(state, action.payload)
    },
    clearEventPostDetailState: (state) => {
      Object.assign(state, initialState)
    }
  }
})

export const { setEventPostDetailState, clearEventPostDetailState } = eventPostDetailSlice.actions

export default eventPostDetailSlice.reducer
