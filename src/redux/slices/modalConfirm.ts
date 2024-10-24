import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReactNode } from 'react'

interface ModalConfirmState {
  isShow: boolean
  title: string
  iconComponent?: ReactNode
  question: string
  moreInfoComponent?: ReactNode
  actionConfirm: any
  actionCancel: any
  titleConfirm: string
  titleCancel: string
  isWarning: boolean
  data: any
}

const initialState: ModalConfirmState = {
  isShow: false,
  title: '',
  question: '',
  actionConfirm: () => {},
  actionCancel: () => {},
  titleConfirm: 'Xác nhận',
  titleCancel: 'Hủy',
  isWarning: false,
  data: {}
}

const modalConfirmSlice = createSlice({
  name: 'modalConfirm',
  initialState,
  reducers: {
    setIsShowModalConfirm: (state, action: PayloadAction<boolean>) => {
      state.isShow = action.payload
    },
    setModalProperties: (state, action: PayloadAction<Partial<ModalConfirmState>>) => {
      Object.assign(state, action.payload)
    },
    clearModal: (state) => {
      Object.assign(state, initialState)
    }
  }
})

export const { setIsShowModalConfirm, setModalProperties, clearModal } = modalConfirmSlice.actions

export default modalConfirmSlice.reducer
