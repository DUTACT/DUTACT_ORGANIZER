import { useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { useState } from 'react'
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
import { parseJwt } from 'src/utils/common'
import { eventSchema, EventSchemaType } from 'src/utils/rules'
import { ValidationError } from 'yup'

type FormData = EventSchemaType

export default function UpdateEventPage() {
  const [accessToken, _] = useLocalStorage<string>('access_token')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const eventId = Number(id) ?? 0
  const organizerId = parseJwt(accessToken)?.organizerId ?? 0
  const [removedCoverPhoto, setRemovedCoverPhoto] = useState<boolean>(false)
  const { data, isSuccess } = getEventOfOrganizerById(organizerId, Number(eventId) ?? 0)

  const {
    control,
    trigger,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { dirtyFields }
  } = useForm<FormData>()

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

  const submitForm = handleSubmit((data) => {
    const eventBody: Partial<EventBody> = {}
    if (data.name) {
      eventBody.name = data.name
    }
    if (data.content) {
      eventBody.content = data.content
    }
    if (data.startAt) {
      eventBody.startAt = data.startAt
    }
    if (data.endAt) {
      eventBody.endAt = data.endAt
    }
    if (data.startRegistrationAt) {
      eventBody.startRegistrationAt = data.startRegistrationAt
    }
    if (data.endRegistrationAt) {
      eventBody.endRegistrationAt = data.endRegistrationAt
    }
    if (removedCoverPhoto) {
      eventBody.coverPhoto = data.coverPhoto
    }
    mutate(eventBody)
  })

  const handleUserSubmit = async () => {
    const fieldsToValidate = Object.keys(eventSchema.fields).filter((key) => dirtyFields[key as keyof FormData])
    let isValid = true
    for (const field of fieldsToValidate) {
      try {
        await eventSchema.validateAt(field, getValues())
      } catch (error) {
        isValid = false
        if (error instanceof ValidationError) {
          setError(field as keyof FormData, { type: 'manual', message: error.message })
        }
      }
    }

    if (!isValid) {
      return
    }

    submitForm()
  }

  const navigateToEventManagementPage = () => {
    navigate(path.event)
  }

  const handleFieldChange = (name: keyof FormData, value: string) => {
    setValue(name, value)
  }

  if (!isSuccess || !data) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full w-full flex-1 flex-col'>
      <div className='sticky left-0 top-0 px-6 pt-3'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1'>
            <div className='text-xl font-semibold text-neutral-8'>Cập nhật sự kiện</div>
            <div className='text-sm font-normal text-neutral-5'>
              Thay đổi kịp thời các thông tin sự kiện của tổ chức
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              title={isPending ? 'Đang cập nhật...' : 'Cập nhật sự kiện'}
              type='submit'
              classButton={cn(
                'min-w-fit text-neutral-0 border-none bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md',
                { 'cursor-progress opacity-50': isPending }
              )}
              onClick={handleUserSubmit}
              disabled={isPending}
            />
            <Button
              title='Quay lại'
              classButton='min-w-[100px] text-neutral-7 border-none bg-neutral-2 hover:bg-neutral-3 text-nowrap rounded-md'
              onClick={navigateToEventManagementPage}
            />
          </div>
        </div>
        <Divider className='mt-4' />
      </div>

      <form action='' className='flex-1 overflow-auto px-6 py-3'>
        <div className='flex w-full gap-4'>
          <Input
            name='name'
            value={data?.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
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
                name='startAt'
                value={moment(data?.startAt).format(DATE_TIME_FORMATS.DATE_TIME_LOCAL)}
                type='datetime-local'
                labelName='Ngày bắt đầu sự kiện'
                showIsRequired={true}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                disabled={moment().isAfter(data?.startAt)}
                onChange={(e) => {
                  trigger('endAt')
                  trigger('endRegistrationAt')
                  handleFieldChange('startAt', e.target.value)
                }}
              />
              <Input
                name='endAt'
                value={moment(data?.endAt).format(DATE_TIME_FORMATS.DATE_TIME_LOCAL)}
                type='datetime-local'
                labelName='Ngày kết thúc sự kiện'
                showIsRequired={true}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                onChange={(e) => {
                  trigger('startAt')
                  handleFieldChange('endAt', e.target.value)
                }}
              />
            </div>
          </div>
          <div className='flex w-full flex-col'>
            <div className='flex w-full flex-1 gap-4'>
              <Input
                name='startRegistrationAt'
                value={moment(data?.startRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_LOCAL)}
                type='datetime-local'
                labelName='Ngày bắt đầu đăng ký'
                showIsRequired={true}
                showError={false}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                onChange={() => {
                  trigger('endRegistrationAt')
                }}
              />
              <Input
                name='endRegistrationAt'
                value={moment(data?.endRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_LOCAL)}
                type='datetime-local'
                labelName='Ngày kết thúc đăng ký'
                showIsRequired={true}
                showError={false}
                classNameWrapper='text-sm w-full flex-1'
                classNameInput='px-3'
                control={control}
                onChange={(e) => {
                  trigger('startRegistrationAt')
                  trigger('startAt')
                  handleFieldChange('endRegistrationAt', e.target.value)
                }}
              />
            </div>
          </div>
        </div>
        <div className='flex w-full gap-4'>
          <Input
            name='content'
            value={data?.content}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            variant='textarea'
            placeholder='Nhập thông tin sự kiện'
            labelName='Thông tin sự kiện'
            showIsRequired={true}
            showError={true}
            classNameWrapper='text-sm w-full flex-1'
            classNameInput='px-3 overflow-hidden'
            control={control}
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
