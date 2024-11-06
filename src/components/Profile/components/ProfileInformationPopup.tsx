import { createPortal } from 'react-dom'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import Button from 'src/components/Button'
import TelephoneIcon from 'src/assets/icons/i-telephone.svg?react'
import LocationIcon from 'src/assets/icons/i-location.svg?react'
import PersonInChargeIcon from 'src/assets/icons/i-address-card.svg?react'
import { useProfile } from 'src/hooks/useProfile'
import { toast } from 'react-toastify'
import { useUserRole } from 'src/hooks/useUserRole'
import { USER_ROLE_LABEL } from 'src/constants/common'
import { useRef, useState } from 'react'
import { CONFIG } from 'src/constants/config'
import { ERROR_MESSAGE } from 'src/constants/message'
import UpdateProfilePopup from './UpdateProfilePopup'
import { cn } from 'src/lib/tailwind/utils'

interface ProfilePopupProps {
  setIsShowProfilePopup: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProfileInformationPopup({ setIsShowProfilePopup }: ProfilePopupProps) {
  const {
    profile,
    error,
    updateAvatarMutation: { mutate: mutateUploadAvatar, isPending: isUploadAvatarPending }
  } = useProfile()
  const userRole = useUserRole()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isShowUpdateProfilePopup, setIsShowUpdateProfilePopup] = useState<boolean>(false)

  if (error) {
    toast.error(error.message)
  }

  if (!profile) {
    return
  }

  const openFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAvatar = event.target.files?.[0]
    if (newAvatar) {
      const maxFileSize = CONFIG.MAX_SIZE_UPLOAD_IMAGE

      if (newAvatar.size > maxFileSize) {
        toast.error(ERROR_MESSAGE.IMAGE_SIZE_EXCEEDS_LIMIT)
      } else {
        mutateUploadAvatar({ avatar: newAvatar })
      }
    }
  }

  return createPortal(
    <div
      className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay shadow-custom'
      onClick={() => setIsShowProfilePopup(false)}
    >
      <div
        className='relative h-fit max-h-popup w-[500px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className='absolute right-2 top-2 z-20 cursor-pointer p-1 opacity-70 hover:opacity-100'
          onClick={() => setIsShowProfilePopup(false)}
        >
          <CloseIcon className='h-[20px] w-[20px]' />
        </div>
        <div className='relative z-10 h-[60px] w-full border-b-[2px] border-b-neutral-3'>
          <img
            src={profile.avatarUrl || DUTLogo}
            className='h-full w-full object-cover blur-3xl brightness-200'
            alt='dut-logo'
          />
          <div className='absolute bottom-0 left-0 h-[70px] w-[70px] translate-x-5 translate-y-[45%] overflow-hidden rounded-full border-[2px] border-neutral-3'>
            <img
              src={profile.avatarUrl || DUTLogo}
              className='h-full w-full bg-neutral-0 object-cover'
              alt='dut-logo'
            />
          </div>
          <div className='absolute bottom-0 left-[100px] line-clamp-1 max-w-[250px] overflow-hidden text-lg font-semibold text-neutral-7'>
            {profile.name}
          </div>
          <div className='absolute bottom-[-24px] left-[100px] line-clamp-1 max-w-[250px] overflow-hidden text-sm font-medium text-neutral-5'>
            # {USER_ROLE_LABEL[userRole]}
          </div>
        </div>
        <div className='min-h-fit w-full bg-neutral-0 px-5 pb-4 pt-12'>
          <div className='flex w-full flex-col gap-2'>
            <div className='flex w-full items-center gap-3'>
              <TelephoneIcon className='h-[20px] w-[20px]' />
              <span>{profile.phone}</span>
            </div>
            <div className='flex w-full items-center gap-3'>
              <LocationIcon className='h-[20px] w-[20px]' />
              <span>{profile.address}</span>
            </div>
            <div className='flex w-full items-center gap-3'>
              <PersonInChargeIcon className='h-[20px] w-[20px]' />
              <span>{profile.personInChargeName}</span>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Button
              title='Cập nhật thông tin'
              classButton='mt-8 bg-neutral-0 border border-neutral-6 py-1 hover:bg-neutral-2 hover:border-neutral-6'
              onClick={() => setIsShowUpdateProfilePopup(true)}
            />
            <Button
              title='Thay đổi ảnh đại diện'
              classButton='mt-8 bg-neutral-0 border border-neutral-6 py-1 hover:bg-neutral-2 hover:border-neutral-6'
              onClick={openFileInput}
              disabled={isUploadAvatarPending}
              classWrapperLoading={cn('', {
                block: isUploadAvatarPending
              })}
              classLoadingIndicator='text-neutral-7 fill-neutral-7'
            />
            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleAvatarChange} />
          </div>
        </div>
      </div>
      {isShowUpdateProfilePopup && <UpdateProfilePopup setIsShowUpdateProfilePopup={setIsShowUpdateProfilePopup} />}
    </div>,
    document.body
  )
}
