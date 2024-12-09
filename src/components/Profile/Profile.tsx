import Popover from 'src/components/Popover'
import { usePopper } from 'react-popper'
import { Fragment, useState } from 'react'
import ExpandIcon from 'src/assets/icons/i-chevron-down.svg?react'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import ProfilePopover from './components/ProfilePopover'
import ProfileInformationPopup from './components/ProfileInformationPopup'
import { useProfile } from 'src/hooks/useProfile'
import ChangePasswordPopup from './components/ChangePasswordPopup'

export default function Profile() {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
  const [isShowProfilePopup, setIsShowProfilePopup] = useState<boolean>(false)
  const [isShowChangePasswordPopup, setIsShowChangePasswordPopup] = useState<boolean>(false)

  const { profile } = useProfile()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
  })

  const onClosePopover = () => {
    setIsPopoverOpen(false)
    setReferenceElement(null)
    setPopperElement(null)
  }

  return (
    <Fragment>
      <Popover
        isOpen={isPopoverOpen}
        content={
          <div
            className='rounded-lg bg-white shadow-lg'
            ref={setPopperElement}
            style={{ ...styles.popper, zIndex: 9999 }}
            {...attributes.popper}
          >
            <ProfilePopover
              onClosePopover={onClosePopover}
              setIsShowProfilePopup={setIsShowProfilePopup}
              setIsShowChangePasswordPopup={setIsShowChangePasswordPopup}
            />
          </div>
        }
        onClose={() => setIsPopoverOpen(false)}
      >
        <div
          ref={setReferenceElement}
          className='flex items-center gap-0 rounded-full hover:cursor-pointer hover:bg-neutral-2'
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <div className='relative h-logo-sm min-h-logo-sm w-logo-sm min-w-logo-sm'>
            <img
              className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
              src={profile?.avatarUrl || DUTLogo}
              alt='dut-logo'
            />
          </div>
          <ExpandIcon className='h-[20px] w-[20px]' />
        </div>
      </Popover>
      {isShowProfilePopup && <ProfileInformationPopup setIsShowProfilePopup={setIsShowProfilePopup} />}
      {isShowChangePasswordPopup && <ChangePasswordPopup setIsShowChangePasswordPopup={setIsShowChangePasswordPopup} />}
    </Fragment>
  )
}
