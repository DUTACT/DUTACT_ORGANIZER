import { yupResolver } from '@hookform/resolvers/yup'
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
import { DATE_TIME_FORMATS, TIMEOUT } from 'src/constants/common'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { path } from 'src/routes/path'
import { EventBody } from 'src/types/event.type'
import { getDefaultImageFile, parseJwt } from 'src/utils/common'
import { eventSchema, EventSchemaType } from 'src/utils/rules'

type FormData = EventSchemaType

export default function UpdateEventPage() {
  const [accessToken, _] = useLocalStorage<string>('access_token')
  const navigate = useNavigate()
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

  const { mutate } = updateEvent(organizerId, eventId, {
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGE.UPDATE_EVENT)
      setTimeout(() => {
        navigate(path.event)
      }, TIMEOUT.NAVIGATE)
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
      console.log('true')
      eventBody.coverPhoto = data.coverPhoto
    }
    mutate(eventBody)
  })

  const navigateToEventManagementPage = () => {
    navigate(path.event)
  }

  useEffect(() => {
    if (isSuccess && data) {
      reset({ ...data, coverPhoto: getDefaultImageFile() })
    } else if (error) {
      toast.error(error.message)
    }
  }, [isSuccess, data, error, reset])

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
          <div className='flex gap-1'>
            <Button
              title='Cập nhật sự kiện'
              type='submit'
              classButton='min-w-[150px] text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md'
              onClick={onSubmit}
            />
            <Button
              title='Quay lại'
              classButton='min-w-[100px] text-neutral-7 bg-neutral-2 hover:bg-neutral-3 text-nowrap rounded-md'
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
            classNameInput='px-3'
            control={control}
            name='content'
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