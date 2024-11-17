import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getEventOfOrganizerById, updateEvent } from 'src/apis/event'
import Button from 'src/components/Button'
import Divider from 'src/components/Divider'
import DraggableInputFile from 'src/components/DraggableInputFile/DraggableInputFile'
import Input from 'src/components/Input'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { cn } from 'src/lib/tailwind/utils'
import { path } from 'src/routes/path'
import { EventBody, EventOfOrganizer } from 'src/types/event.type'
import { getDefaultImageFile, parseJwt } from 'src/utils/common'
import { eventSchema, EventSchemaType } from 'src/utils/rules'

type FormData = EventSchemaType

export default function UpdateEventDetails() {
  const [accessToken, _] = useLocalStorage<string>('access_token')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const eventId = Number(id) ?? 0
  const organizerId = parseJwt(accessToken)?.organizerId ?? 0
  const [removedCoverPhoto, setRemovedCoverPhoto] = useState<boolean>(false)
  const {
    control,
    trigger,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(eventSchema)
  })

  const { data, error, isSuccess } = getEventOfOrganizerById(organizerId, Number(eventId) ?? 0)

  const { mutate, isPending } = updateEvent(organizerId, eventId, {
    onSuccess: (data) => {
      toast.success(SUCCESS_MESSAGE.UPDATE_EVENT)
      queryClient.setQueryData<EventOfOrganizer>(['getEventOfOrganizerById', organizerId, eventId], () => data)
      navigate(path.event)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    const eventBody: Partial<EventBody> = {
      name: data.name,
      content: data.content,
      startAt: moment(data.startAt).format(DATE_TIME_FORMATS.ISO),
      endAt: moment(data.endAt).format(DATE_TIME_FORMATS.ISO),
      startRegistrationAt: moment(data.startRegistrationAt).format(DATE_TIME_FORMATS.ISO),
      endRegistrationAt: moment(data.endRegistrationAt).format(DATE_TIME_FORMATS.ISO)
    }
    if (removedCoverPhoto) {
      eventBody.coverPhoto = data.coverPhoto
    }
    mutate(eventBody)
  })

  const navigateToEventManagementPage = () => {
    navigate(path.event)
  }

  useEffect(() => {
    if (isSuccess && data) {
      reset({
        ...data,
        startAt: moment(data.startAt).format(DATE_TIME_FORMATS.DATE_TIME_LOCAL),
        endAt: moment(data.endAt).format(DATE_TIME_FORMATS.DATE_TIME_LOCAL),
        startRegistrationAt: moment(data.startRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_LOCAL),
        endRegistrationAt: moment(data.endRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_LOCAL),
        coverPhoto: getDefaultImageFile()
      })
    } else if (error) {
      toast.error(error.message)
    }
  }, [isSuccess, data, error, reset])

  return (
    <div className='flex h-full w-full flex-1 flex-col'>
      <form action='' className='flex-1 overflow-auto'>
        <div className='flex w-full gap-4'>
          <Input
            name='name'
            control={control}
            type='text'
            placeholder='Nhập tên sự kiện'
            labelName='Tên sự kiện'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
          />
          <Input
            type='text'
            placeholder={data?.organizer.name}
            labelName='Được tạo bởi'
            disabled={true}
            classNameWrapper='w-full flex-1'
          />
        </div>
        <div className='flex w-full gap-4'>
          <div className='flex w-full flex-col'>
            <div className='flex w-full flex-1 gap-4'>
              <Input
                type='datetime-local'
                labelName='Ngày bắt đầu sự kiện'
                showIsRequired={true}
                showError={false}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                name='startAt'
                onChange={() => {
                  trigger('endAt')
                  trigger('endRegistrationAt')
                }}
              />

              <Input
                type='datetime-local'
                labelName='Ngày kết thúc sự kiện'
                showIsRequired={true}
                showError={false}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                name='endAt'
                onChange={() => {
                  trigger('startAt')
                }}
              />
            </div>
            <div className='mt-1 min-h-[18px] text-xs font-semibold text-semantic-cancelled'>
              {errors.startAt?.message}
            </div>
          </div>
          <div className='flex w-full flex-col'>
            <div className='flex w-full flex-1 gap-4'>
              <Input
                type='datetime-local'
                labelName='Ngày bắt đầu đăng ký'
                showIsRequired={true}
                showError={false}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                name='startRegistrationAt'
                onChange={() => {
                  trigger('endRegistrationAt')
                }}
              />

              <Input
                type='datetime-local'
                labelName='Ngày kết thúc đăng ký'
                showIsRequired={true}
                showError={false}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                name='endRegistrationAt'
                onChange={() => {
                  trigger('startRegistrationAt')
                  trigger('startAt')
                }}
              />
            </div>
            <div className='mt-1 min-h-[18px] text-xs font-semibold text-semantic-cancelled'>
              {errors.startRegistrationAt?.message}
            </div>
          </div>
        </div>
        <div className='flex w-full gap-4'>
          <Input
            variant='textarea'
            placeholder='Nhập thông tin sự kiện'
            labelName='Thông tin sự kiện'
            showIsRequired={true}
            showError={false}
            classNameWrapper='text-sm w-full flex-1'
            classNameInput='px-3 overflow-hidden'
            control={control}
            name='content'
            autoResize
          />
        </div>
        <div className='flex w-full gap-4'>
          <DraggableInputFile
            name='coverPhoto'
            control={control}
            labelName='Ảnh sự kiện'
            showIsRequired={true}
            classNameWrapper='text-sm w-full flex-1'
            initialImageUrl={data?.coverPhotoUrl}
            removedInitialImage={removedCoverPhoto}
            setRemovedInitialImage={setRemovedCoverPhoto}
          />
          <div className='w-full flex-1'></div>
        </div>
      </form>
    </div>
  )
}
