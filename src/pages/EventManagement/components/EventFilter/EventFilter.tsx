import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import MultipleSelect from 'src/components/MultipleSelect'
import { EVENT_STATUS } from 'src/constants/common'
import { Option } from 'src/types/common.type'
import type { EventFilter as EventFilterType } from 'src/types/event.type'

interface Props {
  onSendFilterOptions: (data: EventFilterType) => void
  onClosePopover: () => void
  organizerOptions: Option[]
}

export default function EventFilter({ onSendFilterOptions, onClosePopover, organizerOptions }: Props) {
  const { control, handleSubmit } = useForm<EventFilterType>({
    defaultValues: {
      organizerIds: [],
      timeStartFrom: '',
      timeStartTo: '',
      registrationDeadlineFrom: '',
      registrationDeadlineTo: '',
      types: []
    }
  })

  const eventStatusList = useMemo((): Option[] => {
    return Object.entries(EVENT_STATUS).map(
      ([value, label]) =>
        ({
          value,
          label
        }) as Option
    )
  }, [])

  const onSubmitFilter = handleSubmit((data: EventFilterType) => {
    console.log('data', data)
    onSendFilterOptions(data)
    onClosePopover()
  })

  return (
    <form className='flex w-full flex-col gap-4'>
      <div className='flex flex-col gap-6'>
        <MultipleSelect
          options={organizerOptions}
          labelName='Tên tổ chức'
          classNameWrapper='mt-0'
          classNameSelect='mt-1'
          showError={false}
          name='organizerIds'
          control={control}
        />
        <div className='flex flex-col gap-1'>
          <div className='text-sm font-semibold tracking-wide text-neutral-8'>Sự kiện đang diễn ra</div>
          <div className='flex items-center'>
            <div className='min-w-[50px] text-sm font-medium text-neutral-7'>Từ: </div>
            <Input
              type='date'
              showIsRequired={true}
              showError={false}
              classNameWrapper='text-sm w-full flex-1 mt-0'
              classNameInput='px-3 mt-0'
              name='timeStartFrom'
              control={control}
            />
          </div>
          <div className='flex items-center'>
            <div className='min-w-[50px] text-sm font-medium text-neutral-7'>Đến: </div>
            <Input
              type='date'
              showIsRequired={true}
              showError={false}
              classNameWrapper='text-sm w-full flex-1 mt-0'
              classNameInput='px-3 mt-0'
              name='timeStartTo'
              control={control}
            />
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='text-sm font-semibold tracking-wide text-neutral-8'>Thời gian đăng ký tham gia</div>
          <div className='flex items-center'>
            <div className='min-w-[50px] text-sm font-medium text-neutral-7'>Từ: </div>
            <Input
              type='date'
              showIsRequired={true}
              showError={false}
              classNameWrapper='text-sm w-full flex-1 mt-0'
              classNameInput='px-3 mt-0'
              name='registrationDeadlineFrom'
              control={control}
            />
          </div>
          <div className='flex items-center'>
            <div className='min-w-[50px] text-sm font-medium text-neutral-7'>Đến: </div>
            <Input
              type='date'
              showIsRequired={true}
              showError={false}
              classNameWrapper='text-sm w-full flex-1 mt-0'
              classNameInput='px-3 mt-0'
              name='registrationDeadlineTo'
              control={control}
            />
          </div>
        </div>
        <MultipleSelect
          options={eventStatusList}
          labelName='Trạng thái'
          classNameWrapper='mt-0'
          classNameSelect='mt-1'
          name='types'
          control={control}
        />
      </div>
      <div className='flex-end flex items-center gap-2'>
        <Button title='Quay lại' classButton='hover:bg-neutral-3 min-w-fit' />
        <Button
          title='Áp dụng bộ lọc'
          type='submit'
          onClick={onSubmitFilter}
          classButton='min-w-fit bg-semantic-secondary/80 hover:bg-semantic-secondary text-white'
        />
      </div>
    </form>
  )
}
