import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import MultipleSelect from 'src/components/MultipleSelect'
import { POST_STATUS_MESSAGES } from 'src/constants/common'
import { Option } from 'src/types/common.type'
import { PostFilterType } from 'src/types/post.type'

interface Props {
  onSendFilterOptions: (data: PostFilterType) => void
  onClosePopover: () => void
}

export default function PostFilter({ onSendFilterOptions, onClosePopover }: Props) {
  const { control, handleSubmit } = useForm<PostFilterType>({
    defaultValues: {
      timeFrom: '',
      timeTo: '',
      types: []
    }
  })

  const postStatusList = useMemo((): Option[] => {
    return Object.entries(POST_STATUS_MESSAGES).map(
      ([value, label]) =>
        ({
          value,
          label
        }) as Option
    )
  }, [])

  const onSubmitFilter = handleSubmit((data: PostFilterType) => {
    onSendFilterOptions(data)
    onClosePopover()
  })

  return (
    <form className='flex w-full flex-col gap-4'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <div className='text-sm font-semibold tracking-wide text-neutral-8'>Thời gian đăng bài</div>
          <div className='flex items-center'>
            <div className='min-w-[50px] text-sm font-medium text-neutral-7'>Từ: </div>
            <Input
              type='date'
              showIsRequired={true}
              showError={false}
              classNameWrapper='text-sm w-full flex-1 mt-0'
              classNameInput='px-3 mt-0'
              name='timeFrom'
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
              name='timeTo'
              control={control}
            />
          </div>
        </div>
        <MultipleSelect
          options={postStatusList}
          labelName='Trạng thái'
          classNameWrapper='mt-0'
          classNameSelect='mt-1'
          name='types'
          control={control}
          placeholder='Chọn các trạng thái'
        />
      </div>
      <div className='flex-end flex items-center gap-2'>
        <Button type='button' title='Quay lại' classButton='hover:bg-neutral-3 min-w-fit' onClick={onClosePopover} />
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
