import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CommonState {
  isPendingMutationApi: boolean
}

const initialState: CommonState = {
  isPendingMutationApi: false
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsPendingMutationApi: (state, action: PayloadAction<boolean>) => {
      state.isPendingMutationApi = action.payload
    }
  }
})

export const { setIsPendingMutationApi } = commonSlice.actions

export default commonSlice.reducer
