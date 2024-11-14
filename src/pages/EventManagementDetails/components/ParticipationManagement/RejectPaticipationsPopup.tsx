import { useState } from 'react'
import { createPortal } from 'react-dom'
import Button from 'src/components/Button'
import Divider from 'src/components/Divider'
import Input from 'src/components/Input'
import { RejectAllParticipation } from 'src/types/participation.type'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import { rejectParticipationSchema, RejectParticipationSchemaType } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { rejectParticipation } from 'src/apis/participation/participation.mutation'
import { useEventId } from 'src/hooks/useEventId'
import { toast } from 'react-toastify'
import { SUCCESS_MESSAGE } from 'src/constants/message'

type RejectCriterion = RejectAllParticipation
type RejectCriterionType = RejectCriterion['type']

type FormData = RejectParticipationSchemaType

interface Props {
  onClose: () => void
  onSubmit: () => void
}

export default function RejectParticipationPopup({ onClose, onSubmit }: Props) {
  const eventId = useEventId()
  const [rejectCriterion, setRejectCriterion] = useState<RejectCriterion>({
    type: 'all'
  })

  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(rejectParticipationSchema)
  })

  const { mutate: rejectMutate, isPending } = rejectParticipation(eventId)

  const handleCriterionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const criterionType = e.target.value as RejectCriterionType
    if (criterionType === 'all') {
      setRejectCriterion({ type: 'all' })
    }

    e.preventDefault()
  }

  const handleSubmitRejection = handleSubmit((data) => {
    const submitCriterion = {
      ...rejectCriterion,
      ...data
    } as RejectCriterion

    rejectMutate(submitCriterion, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGE.REJECT_PARTICIPATION)
        onSubmit()
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  })

  return createPortal(
    <div className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'>
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='block flex max-h-main-popup items-start justify-between overflow-auto px-6 py-4'>
          <div>
            <div className='text-lg font-semibold text-neutral-9'>Xác nhận không tham gia</div>
            <div className='text-neutral-5'>Xác nhận sinh viên không tham gia sự kiện</div>
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
                  value={rejectCriterion.type}
                  onChange={handleCriterionTypeChange}
                  className='w-full rounded-lg border border-neutral-3 p-2'
                >
                  <option value='all'>Tất cả</option>
                </select>
              </label>
              <Input
                variant='textarea'
                labelName='Lý do'
                placeholder='Nhập lý do'
                value={(rejectCriterion as any).reason}
                onChange={(e) => setRejectCriterion({ ...rejectCriterion, reason: e.target.value })}
                control={control}
                name='reason'
              />
              <div>
                {rejectCriterion.type === 'all' && (
                  <span>Xác nhận tất cả sinh viên đang trong trạng thái chờ xác nhận đã không tham gia sự kiện</span>
                )}
              </div>
              <div className='mt-6 flex justify-end gap-4'>
                <Button
                  title='Hủy'
                  className='gap-1 text-nowrap rounded-md bg-neutral-3 text-neutral-9 hover:bg-neutral-2'
                  onClick={onClose}
                />
                <Button
                  title={isPending ? 'Đang xử lý...' : 'Xác nhận không tham gia'}
                  disabled={isPending}
                  className='gap-1 text-nowrap rounded-md bg-semantic-cancelled/90 text-neutral-0 hover:bg-semantic-cancelled'
                  onClick={handleSubmitRejection}
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
