import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createOrganizerAccount } from 'src/apis/account/account.mutation'
import Button from 'src/components/Button'
import Divider from 'src/components/Divider'
import Input from 'src/components/Input'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { cn } from 'src/lib/tailwind/utils'
import { path } from 'src/routes/path'
import { OrganizerAccountBody } from 'src/types/account.type'
import { createOrganizerAccountSchema, CreateOrganizerAccountSchemaType } from 'src/utils/rules'

type FormData = CreateOrganizerAccountSchemaType

export default function CreateOrganizerAccount() {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(createOrganizerAccountSchema)
  })

  const { mutate, isPending } = createOrganizerAccount({
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGE.CREATE_ORGANIZER_ACCOUNT)
      navigate(path.organizerAccount)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    const body: OrganizerAccountBody = {
      ...data
    } as OrganizerAccountBody
    mutate(body)
  })

  return (
    <div className='flex h-full w-full flex-1 flex-col'>
      <div className='sticky left-0 top-0 px-6 pt-3'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1'>
            <div className='text-xl font-semibold text-neutral-8'>Tạo tài khoản tổ chức</div>
            <div className='text-sm font-normal text-neutral-5'>Tạo tài khoản tổ chức để quản lý sự kiện</div>
          </div>
          <div className='flex gap-2'>
            <Button
              title={isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
              type='submit'
              classButton={cn(
                'min-w-fit text-neutral-0 border-none bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md',
                { 'cursor-progress opacity-50': isPending }
              )}
              onClick={onSubmit}
              disabled={isPending}
            />
            <Button
              title='Quay lại'
              classButton='min-w-[100px] text-neutral-7 border-none bg-neutral-2 hover:bg-neutral-3 text-nowrap rounded-md'
              onClick={() => navigate(path.organizerAccount)}
            />
          </div>
        </div>
        <Divider className='mt-4' />
      </div>

      <form action='' className='flex-1 overflow-auto px-6 py-3'>
        <div className='flex w-full gap-4'>
          <Input
            name='username'
            control={control}
            type='text'
            placeholder='Nhập tên tài khoản'
            labelName='Tên tài khoản'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
          <Input
            name='name'
            control={control}
            type='text'
            placeholder='Nhập tên tổ chức'
            labelName='Tên tổ chức'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
        </div>
        <div className='flex w-full gap-4'>
          <div className='flex w-full flex-col'>
            <div className='flex w-full flex-1 gap-4'>
              <Input
                type='password'
                labelName='Mật khẩu'
                showIsRequired={true}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                name='password'
              />

              <Input
                type='password'
                labelName='Xác nhận mật khẩu'
                showIsRequired={true}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                name='confirmPassword'
              />
            </div>
          </div>
          <div className='flex w-full flex-col'>
            <div className='flex w-full flex-1 gap-4'>
              <Input
                type='text'
                labelName='Số điện thoại'
                showIsRequired={true}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                name='phone'
              />

              <Input
                type='text'
                labelName='Địa chỉ'
                showIsRequired={true}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                name='address'
              />
            </div>
          </div>
        </div>
        <div className='flex w-full gap-4'>
          <Input
            variant='input'
            placeholder='Tên người phụ trách'
            labelName='Người phụ trách'
            showIsRequired={true}
            classNameWrapper='text-sm w-full flex-1'
            classNameInput='px-3 overflow-hidden resize-none'
            control={control}
            name='personInChargeName'
          />
        </div>
      </form>
    </div>
  )
}
