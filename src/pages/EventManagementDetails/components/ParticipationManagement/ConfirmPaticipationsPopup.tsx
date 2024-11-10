import { useState } from 'react'
import { createPortal } from 'react-dom'
import Button from 'src/components/Button'
import Divider from 'src/components/Divider'
import Input from 'src/components/Input'
import { ConfirmAllParticipation, ConfirmPaticipationWithCheckedInAtLeast } from 'src/types/participation.type'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import { useEventCheckInCodes } from '../../hooks/useCheckInCode'

type AllowedConfimrCriterion = ConfirmAllParticipation | ConfirmPaticipationWithCheckedInAtLeast
type AllowedConfirmCriterion = AllowedConfimrCriterion['type']

interface Props {
  onClose: () => void
  onSubmit: () => void
}

export default function ConfirmParticipationPopup({ onClose, onSubmit }: Props) {
  const { checkInCodes } = useEventCheckInCodes()
  const [confirmCriterion, setConfirmCriterion] = useState<AllowedConfimrCriterion>({
    type: 'all'
  })

  const handleCriterionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const criterionType = e.target.value as AllowedConfirmCriterion
    if (criterionType === 'all') {
      setConfirmCriterion({ type: 'all' })
    } else {
      setConfirmCriterion({ type: 'checkedInAtLeast', count: 1 })
    }

    e.preventDefault()
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
                    Xác nhận tham gia cho sinh viên đã check-in ít nhất{' '}
                    {(confirmCriterion as ConfirmPaticipationWithCheckedInAtLeast).count} lần đang và trong trạng thái
                    chờ xác nhận
                  </span>
                )}
                {confirmCriterion.type === 'all' && (
                  <span>Xác nhận tham gia cho tất cả sinh viên đang trong trạng thái chờ xác nhận</span>
                )}
              </div>
              <div className='mt-6 flex justify-end gap-4'>
                <Button
                  title='Hủy'
                  className='gap-1 text-nowrap rounded-md bg-neutral-3 text-neutral-9 hover:bg-neutral-2'
                  onClick={onClose}
                />
                <Button
                  title='Xác nhận'
                  className='gap-1 text-nowrap rounded-md bg-semantic-secondary/90 text-neutral-0 hover:bg-semantic-secondary'
                  onClick={() => {
                    onSubmit()
                    onClose()
                  }}
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
