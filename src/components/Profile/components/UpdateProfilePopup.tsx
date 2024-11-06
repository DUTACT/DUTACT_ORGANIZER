import { createPortal } from 'react-dom'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import Button from 'src/components/Button'
import { useProfile } from 'src/hooks/useProfile'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import Divider from 'src/components/Divider'
import { cn } from 'src/lib/tailwind/utils'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { profileSchema, ProfileSchemaType } from 'src/utils/rules'

interface UpdateProfilePopupProps {
  setIsShowUpdateProfilePopup: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = ProfileSchemaType

export default function UpdateProfilePopup({ setIsShowUpdateProfilePopup }: UpdateProfilePopupProps) {
  const {
    profile,
    error,
    updatePersonalInformationMutation: { mutate: mutateUpdateProfile, isPending: isUpdateProfilePending, isSuccess }
  } = useProfile()
  const { handleSubmit, control } = useForm<FormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: profile
      ? {
          name: profile.name,
          address: profile.address,
          phone: profile.phone,
          personInChargeName: profile.personInChargeName
        }
      : undefined
  })

  if (isSuccess) {
    setIsShowUpdateProfilePopup(false)
  } else if (error) {
    toast.error(error.message)
  }

  if (!profile) {
    return
  }

  const onSubmitUpdateProfile = handleSubmit((data) => {
    mutateUpdateProfile(data)
  })

  return createPortal(
    <div
      className='fixed left-0 right-0 top-0 z-20 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'
      onClick={(e) => {
        e.stopPropagation()
        setIsShowUpdateProfilePopup(false)
      }}
    >
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Cập nhật thông tin cá nhân</div>
          <div
            className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100'
            onClick={() => setIsShowUpdateProfilePopup(false)}
          >
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <Input
            name='name'
            control={control}
            type='text'
            placeholder='Nhập tên tổ chức'
            labelName='Tên tổ chức'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
          <Input
            name='address'
            control={control}
            type='text'
            placeholder='Nhập địa chỉ'
            labelName='Địa chỉ'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
          <Input
            name='phone'
            control={control}
            type='text'
            placeholder='Nhập số điện thoại'
            labelName='Số điện thoại'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
          <Input
            name='personInChargeName'
            control={control}
            type='text'
            placeholder='Nhập tên người phụ trách'
            labelName='Người phụ trách'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
        </div>
        <div className='flex h-footer-popup items-center justify-between gap-2 px-6 text-sm'>
          <Button
            title={isUpdateProfilePending ? 'Đang cập nhật...' : 'Cập nhật'}
            type='submit'
            classButton={cn(
              'min-w-fit text-neutral-0 border-none bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md',
              { 'cursor-progress opacity-50': isUpdateProfilePending }
            )}
            onClick={onSubmitUpdateProfile}
            disabled={isUpdateProfilePending}
          />
          <Button
            title='Quay lại'
            classButton='min-w-[100px] text-neutral-7 border-none bg-neutral-2 hover:bg-neutral-3 text-nowrap rounded-md'
            onClick={() => setIsShowUpdateProfilePopup(false)}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
