import { createPortal } from 'react-dom'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import Divider from 'src/components/Divider'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { checkInCodeSchema, CheckInCodeSchemaType } from 'src/utils/rules'
import { useEventCheckInCodes } from '../../hooks/useCheckInCode'
import { toast } from 'react-toastify'
import { useEventId } from '../../../../hooks/useEventId'
import { CheckInCodeBody } from 'src/types/checkInCode.type'
import { useOrganizerEvent } from '../../hooks/useOrganizerEvent'
import { useOrganizerId } from '../../../../hooks/useOrganizerId'
import moment from 'moment'
import SearchLocation from './SearchLocation'
import { GeoItem } from 'src/types/map.type'
import { useState } from 'react'

interface CreateCheckInCodePopup {
  setIsShowPopup: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = CheckInCodeSchemaType

export default function CreateCheckInCodePopup({ setIsShowPopup }: CreateCheckInCodePopup) {
  const eventId = useEventId()
  const organizerId = useOrganizerId()
  const { event } = useOrganizerEvent(organizerId, eventId)
  const [location, setLocation] = useState<GeoItem | null>(null)
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)

  if (!event) {
    return <div>Loading...</div>
  }

  const { control, handleSubmit, trigger, setError } = useForm<FormData>({
    resolver: yupResolver(checkInCodeSchema)
  })

  const {
    createCode: { mutate: createCheckInCode, isPending: isCreatingPostPending }
  } = useEventCheckInCodes()

  const handleSelectLocation = (item: GeoItem) => {
    setLocation(item)
    setIsSearchingLocation(false)
  }

  const handleCancelSelectLocation = () => {
    setIsSearchingLocation(false)
  }

  const handleCreateCheckInCode = handleSubmit((data) => {
    const body: CheckInCodeBody = {
      eventId,
      location: location
        ? {
            title: location.title,
            address: location.address?.label,
            geoPosition: { ...location.position }
          }
        : undefined,
      ...data
    }

    const startAt = moment(data.startAt)
    const endAt = moment(data.endAt)
    const eventStartAt = moment(event.startAt)
    const eventEndAt = moment(event.endAt)

    var isValid = true
    if (startAt < eventStartAt || startAt > eventEndAt) {
      setError('startAt', {
        type: 'manual',
        message: `Thời gian bắt đầu phải trong khoảng từ ${new Date(event?.startAt).toLocaleString()}
          đến ${new Date(event?.endAt).toLocaleString()}`
      })
      isValid = false
    }

    if (endAt < eventStartAt || endAt > eventEndAt) {
      setError('endAt', {
        type: 'manual',
        message: `Thời gian kết thúc phải trong khoảng từ ${new Date(event?.startAt).toLocaleString()}
          đến ${new Date(event?.endAt).toLocaleString()}`
      })
      isValid = false
    }

    if (!isValid) {
      return
    }

    createCheckInCode(body, {
      onSuccess: () => {
        setIsShowPopup(false)
      },
      onError: (error) => {
        console.error(error)
        toast.error('Đã xảy ra lỗi, vui lòng thử lại sau')
      }
    })
  })

  return createPortal(
    <div className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'>
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Tạo mã check-in</div>
          <div className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100' onClick={() => setIsShowPopup(false)}>
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <div className='flex w-full flex-1 items-start gap-2'>
            <div className='block flex-1'>
              <Input
                type='text'
                labelName='Tên'
                placeholder='Tên mã'
                control={control}
                name='title'
                onChange={() => trigger('title')}
                autoResize
              />
              <Input
                type='datetime-local'
                labelName='Thời gian bắt đầu hiệu lực'
                control={control}
                name='startAt'
                onChange={() => {
                  trigger('startAt')
                  trigger('endAt')
                }}
                autoResize
              />
              <Input
                type='datetime-local'
                labelName='Thời gian kết thúc hiệu lực'
                control={control}
                name='endAt'
                onChange={() => {
                  trigger('startAt')
                  trigger('endAt')
                }}
                autoResize
              />
              {isSearchingLocation ? (
                <SearchLocation onSelect={handleSelectLocation} onCancel={handleCancelSelectLocation} />
              ) : (
                <div>
                  <div>
                    {location ? (
                      <div className='flex items-start justify-between'>
                        <div className='text-base font-medium text-neutral-7'>Địa điểm</div>
                        <div
                          className='cursor-pointer p-1 opacity-70 hover:opacity-100'
                          onClick={() => setLocation(null)}
                        >
                          <CloseIcon className='h-[20px] w-[20px]' />
                        </div>
                      </div>
                    ) : (
                      <div className='text-base font-medium text-neutral-7'>Địa điểm</div>
                    )}
                  </div>
                  <div className='mt-2 flex items-center justify-between gap-2'>
                    {location ? (
                      <div>
                        <div>{location.title}</div>
                      </div>
                    ) : (
                      <div>Chưa chọn địa điểm</div>
                    )}
                    <div
                      onClick={() => setIsSearchingLocation(true)}
                      className='min-w-[150px] cursor-pointer text-right font-medium text-semantic-secondary/80 underline decoration-blue-600 transition duration-300 hover:text-semantic-secondary/90'
                    >
                      Chọn địa điểm
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex h-footer-popup items-center justify-between px-6 text-sm'>
          <Button
            title={isCreatingPostPending ? 'Đang tạo...' : 'Tạo mã check-in'}
            type='submit'
            classButton='text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md'
            classButtonDisabled='cursor-not-allowed opacity-40'
            onClick={handleCreateCheckInCode}
            disabled={isCreatingPostPending}
            classLoadingIndicator='text-neutral-7 fill-neutral-7'
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
