import { useState } from 'react'
import { CheckInCode } from 'src/types/checkInCode.type'
import DeleteIcon from 'src/assets/icons/i-delete-warning.svg?react'
import AddIcon from 'src/assets/icons/i-plus-white.svg?react'
import ShowIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import Button from 'src/components/Button'
import { useDispatch } from 'react-redux'
import CreateCheckInCodePopup from './CreateCheckInCodePopup'
import { useEventCheckInCodes } from '../../hooks/useCheckInCode'
import { clearModal, setModalProperties } from 'src/redux/slices/modalConfirm'
import { toast } from 'react-toastify'
import QRCodePopup from './QRCodePopup'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { useEventId } from 'src/hooks/useEventId'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import { useOrganizerEvent } from '../../hooks/useOrganizerEvent'
import moment from 'moment'

export default function CheckInCodeManagement() {
  const dispatch = useDispatch()
  const eventId = useEventId()
  const organizerId = useOrganizerId()

  const { event } = useOrganizerEvent(organizerId, eventId)
  const { checkInCodes, deleteCode: deleteCheckInCode } = useEventCheckInCodes()
  const [isShowCreateCheckInCodePopup, setIsShowCreateCheckInCodePopup] = useState<boolean>(false)
  const [seletedCode, setSeletedCode] = useState<CheckInCode | null>(null)

  const handleDeleteCode = (id: string) => {
    deleteCheckInCode.mutate(id, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGE.DELETE_CHECK_IN_CODE)
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        dispatch(clearModal())
      }
    })
  }

  const openPopupDeleteCode = (code: CheckInCode) => {
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Xóa mã check-in',
        question: `Bạn có chắc chắn muốn xóa mã check-in ${code.title} không?`,
        actionConfirm: () => handleDeleteCode(code.id),
        actionCancel: () => dispatch(clearModal()),
        titleConfirm: 'Xóa',
        titleCancel: 'Quay lại',
        isWarning: true,
        iconComponent: <DeleteIcon className='h-[20px] w-[20px]' />
      })
    )
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex-1'>
          <h2 className='text-lg font-semibold'>Quản lý mã check-in</h2>
        </div>
        <div>
          {moment().isBefore(event?.endAt) && (
            <Button
              title='Tạo mã check-in'
              type='button'
              classButton='min-w-[100px] text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md gap-1'
              iconComponent={<AddIcon className='h-[20px] w-[20px]' />}
              onClick={() => setIsShowCreateCheckInCodePopup(true)}
            />
          )}
        </div>
      </div>
      <table className='relative min-w-full overflow-auto'>
        <thead className='sticky top-0 z-50 bg-neutral-0 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
          <tr>
            <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
              <div className='flex items-center justify-between'>
                <span>Tên</span>
              </div>
            </th>
            <th className='min-w-[140px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
              <div className='flex items-center justify-between'>
                <span>Thời gian hiệu lực</span>
              </div>
            </th>
            <th className='sticky right-0 z-20 whitespace-normal break-words bg-neutral-0 px-4 py-2 text-left text-sm before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-5'>
              Hành động
            </th>
          </tr>
        </thead>
        {checkInCodes.length > 0 && (
          <tbody>
            {checkInCodes.map((checkInCode) => (
              <tr key={checkInCode.id} className='group border-b-[1px] border-neutral-4 hover:bg-neutral-2'>
                <td className='px-4 py-2'>
                  <div className='line-clamp-6 overflow-hidden whitespace-pre-wrap text-sm font-normal'>
                    {checkInCode.title}
                  </div>
                </td>
                <td className='px-4 py-2 text-sm'>
                  {new Date(checkInCode.startAt).toLocaleString()} - {new Date(checkInCode.endAt).toLocaleString()}
                </td>
                <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                  <div className='flex items-center justify-center gap-1'>
                    <div className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'>
                      <ShowIcon className='h-[20px] w-[20px]' onClick={() => setSeletedCode(checkInCode)} />
                    </div>
                    <div className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'>
                      <DeleteIcon className='h-[20px] w-[20px]' onClick={() => openPopupDeleteCode(checkInCode)} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
        {checkInCodes.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={10} className='py-4 text-center'>
                Hiện chưa có mã check-in nào
              </td>
            </tr>
          </tbody>
        )}
      </table>
      {seletedCode && <QRCodePopup checkInCode={seletedCode} onClose={() => setSeletedCode(null)} />}
      {isShowCreateCheckInCodePopup && <CreateCheckInCodePopup setIsShowPopup={setIsShowCreateCheckInCodePopup} />}
    </>
  )
}
