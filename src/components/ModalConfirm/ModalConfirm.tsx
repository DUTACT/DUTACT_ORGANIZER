import Button from 'src/components/Button'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import { cn } from 'src/lib/tailwind/utils'
import { modalConfirmState } from 'src/redux/store'
import { useSelector } from 'react-redux'

export default function ModalConfirm() {
  const {
    isShow,
    title,
    question,
    iconComponent,
    moreInfoComponent,
    actionConfirm,
    actionCancel,
    titleConfirm,
    titleCancel,
    isWarning
  } = useSelector(modalConfirmState)
  if (isShow) {
    return (
      <div className='z-100 fixed inset-0 flex items-center justify-center bg-overlay' onClick={actionCancel}>
        <div
          className='relative flex w-[450px] flex-col rounded-md bg-neutral-0 p-4 shadow-custom'
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className='absolute right-3 top-3 flex cursor-pointer items-center justify-center p-1 opacity-80 hover:opacity-100'
            onClick={actionCancel}
          >
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
          <div className='mb-3 flex items-center gap-2'>
            {iconComponent && iconComponent}
            <div className='test-base font-medium text-neutral-7'>{title}</div>
          </div>
          <div className='text-sm font-normal'>{question}</div>
          {moreInfoComponent && moreInfoComponent}
          <div className='mt-6 flex items-center gap-2'>
            <Button
              title={titleCancel}
              classButton='text-neutral-7 text-nowrap border-none rounded-md bg-neutral-0 hover:bg-neutral-2'
              onClick={actionCancel}
            />
            <Button
              title={titleConfirm}
              classButton={cn(
                'text-neutral-0 text-nowrap border-none rounded-md bg-semantic-secondary/90 hover:bg-semantic-secondary',
                {
                  'bg-semantic-cancelled/90 hover:bg-semantic-cancelled': isWarning
                }
              )}
              onClick={actionConfirm}
            />
          </div>
        </div>
      </div>
    )
  }
}
