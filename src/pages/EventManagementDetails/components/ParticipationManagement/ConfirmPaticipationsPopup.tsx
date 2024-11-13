import { useState } from 'react'
import { createPortal } from 'react-dom'
import Button from 'src/components/Button'
import Divider from 'src/components/Divider'
import Input from 'src/components/Input'
import { ConfirmAllParticipation, ConfirmPaticipationWithCheckedInAtLeast } from 'src/types/participation.type'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import { useEventCheckInCodes } from '../../hooks/useCheckInCode'
import { confirmParticipation } from 'src/apis/participation/participation.mutation'
import { toast } from 'react-toastify'
import { useEventId } from 'src/hooks/useEventId'
import { SUCCESS_MESSAGE } from 'src/constants/message'

type ConfirmCriterion = ConfirmAllParticipation | ConfirmPaticipationWithCheckedInAtLeast
type ConfirmCriterionType = ConfirmCriterion['type']

interface Props {
  onClose: () => void
  onSubmit: () => void
}

export default function ConfirmParticipationPopup({ onClose, onSubmit }: Props) {
  const eventId = useEventId()
  const { checkInCodes } = useEventCheckInCodes()
  const [confirmCriterion, setConfirmCriterion] = useState<ConfirmCriterion>({
    type: 'all'
  })

  const { mutate: confirmMutate, isPending } = confirmParticipation(eventId)

  const handleCriterionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const criterionType = e.target.value as ConfirmCriterionType
    if (criterionType === 'all') {
      setConfirmCriterion({ type: 'all' })
    } else {
      setConfirmCriterion({ type: 'checkedInAtLeast', count: 1 })
    }

    e.preventDefault()
  }

  const handleSubmitConfirmation = () => {
    const submitCriterion = confirmCriterion as ConfirmCriterion

    confirmMutate(submitCriterion, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGE.CONFIRM_PARTICIPATION)
        onSubmit()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  return createPortal(
    <div className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'>
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='block flex max-h-main-popup items-start justify-between overflow-auto px-6 py-4'>
          <div>
            <div className='text-lg font-semibold text-neutral-9'>Xác nhận tham gia</div>
            <div className='text-neutral-5'>Xác nhận tham gia cho sinh viên</div>
          </div>
          <div className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100' onClick={onClose}>
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <div className='flex w-full flex-1 items-start gap-2'>
            <div className='block flex flex-1 flex-col'>
              <label className='mb-6 block text-neutral-5'>
                <span className='text-sm font-semibold tracking-wide text-neutral-8'>Điều kiện xác nhận</span>
                <select
                  value={confirmCriterion.type}
                  onChange={handleCriterionTypeChange}
                  className='w-full rounded-lg border border-neutral-3 p-2'
                >
                  <option value='all'>Tất cả</option>
                  {checkInCodes.length > 0 && <option value='checkedInAtLeast'>Check-in ít nhất</option>}
                </select>
              </label>
              {confirmCriterion.type === 'checkedInAtLeast' && (
                <Input
                  labelName={`Số lần check-in ít nhất (1-${checkInCodes.length})`}
                  type='number'
                  min={1}
                  max={checkInCodes.length}
                  value={(confirmCriterion as ConfirmPaticipationWithCheckedInAtLeast).count}
                  onChange={(count) =>
                    setConfirmCriterion({
                      type: 'checkedInAtLeast',
                      count: parseInt(count.target.value, 10)
                    })
                  }
                />
              )}
              <div>
                {confirmCriterion.type === 'checkedInAtLeast' && (
                  <span>
                    Xác nhận sinh viên (đang trong trạng thái chờ xác nhận) đã check-in ít nhất{' '}
                    {(confirmCriterion as ConfirmPaticipationWithCheckedInAtLeast).count} lần đã tham gia sự kiện
                  </span>
                )}
                {confirmCriterion.type === 'all' && (
                  <span>Xác nhận tất cả sinh viên (đang trong trạng thái chờ xác nhận) đã tham gia sự kiện</span>
                )}
              </div>
              <div className='mt-6 flex justify-end gap-4'>
                <Button
                  title='Hủy'
                  className='gap-1 text-nowrap rounded-md bg-neutral-3 text-neutral-9 hover:bg-neutral-2'
                  onClick={onClose}
                />
                <Button
                  title={isPending ? 'Đang xử lý...' : 'Xác nhận tham gia'}
                  className='gap-1 text-nowrap rounded-md bg-semantic-secondary/90 text-neutral-0 hover:bg-semantic-secondary'
                  onClick={handleSubmitConfirmation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
