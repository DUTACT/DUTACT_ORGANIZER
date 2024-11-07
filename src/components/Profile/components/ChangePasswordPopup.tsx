import { createPortal } from 'react-dom'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import Button from 'src/components/Button'
import { useForm } from 'react-hook-form'
import Divider from 'src/components/Divider'
import { cn } from 'src/lib/tailwind/utils'
import Input from 'src/components/Input'
import { changePasswordSchema, ChangePasswordSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { changePassword } from 'src/apis/account/account.mutation'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import { toast } from 'react-toastify'
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/constants/message'
import { HttpStatusCode } from 'axios'

interface ChangePasswordPopupProps {
  setIsShowChangePasswordPopup: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = ChangePasswordSchema

export default function ChangePasswordPopup({ setIsShowChangePasswordPopup }: ChangePasswordPopupProps) {
  const { handleSubmit, control, setError } = useForm<FormData>({
    resolver: yupResolver(changePasswordSchema)
  })
  const organizerId = useOrganizerId()

  const { mutate: changePasswordMutation, isPending: isChangePasswordPending } = changePassword(organizerId, {
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGE.CHANGE_PASSWORD)
      setIsShowChangePasswordPopup(false)
    },
    onError: (error) => {
      if (error.status === HttpStatusCode.BadRequest) {
        setError('oldPassword', {
          type: 'manual',
          message: ERROR_MESSAGE.INVALID_PASSWORD
        })
      } else {
        toast.error(error.message)
      }
    }
  })

  const onSubmitChangePassword = handleSubmit((data) => {
    changePasswordMutation({ oldPassword: data.oldPassword, newPassword: data.newPassword })
  })

  return createPortal(
    <div
      className='fixed left-0 right-0 top-0 z-20 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'
      onClick={(e) => {
        e.stopPropagation()
        setIsShowChangePasswordPopup(false)
      }}
    >
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Đổi mật khẩu</div>
          <div
            className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100'
            onClick={() => setIsShowChangePasswordPopup(false)}
          >
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <Input
            name='oldPassword'
            control={control}
            type='password'
            placeholder='Nhập mật khẩu hiện tại'
            labelName='Mật khẩu hiện tại'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
          <Input
            name='newPassword'
            control={control}
            type='password'
            placeholder='Nhập mật khẩu mới'
            labelName='Mật khẩu mới'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
          <Input
            name='confirmPassword'
            control={control}
            type='password'
            placeholder='Nhập lại mật khẩu'
            labelName='Xác nhận mật khẩu'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
        </div>
        <div className='flex h-footer-popup items-center justify-between gap-2 px-6 text-sm'>
          <Button
            title={isChangePasswordPending ? 'Đổi mật khẩu...' : 'Đổi mật khẩu'}
            classButton={cn(
              'min-w-fit text-neutral-0 border-none bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md',
              { 'cursor-progress opacity-50': isChangePasswordPending }
            )}
            onClick={onSubmitChangePassword}
            disabled={isChangePasswordPending}
          />
          <Button
            title='Quay lại'
            classButton='min-w-[100px] text-neutral-7 border-none bg-neutral-2 hover:bg-neutral-3 text-nowrap rounded-md'
            onClick={() => setIsShowChangePasswordPopup(false)}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
