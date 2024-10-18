import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createEvent } from 'src/apis/event'
import Button from 'src/components/Button'
import Divider from 'src/components/Divider'
import DraggableInputFile from 'src/components/DraggableInputFile/DraggableInputFile'
import Input from 'src/components/Input'
import TextArea from 'src/components/TextArea'
import { DATE_TIME_FORMATS, TIMEOUT } from 'src/constants/common'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { path } from 'src/routes/path'
import { EventBody } from 'src/types/event.type'
import { eventSchema, EventSchemaType } from 'src/utils/rules'

type FormData = EventSchemaType

export default function CreateEventPage() {
  const navigate = useNavigate()
  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(eventSchema)
  })

  const { mutate } = createEvent({
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGE.CREATE_EVENT)
      setTimeout(() => {
        navigate(path.event)
      }, TIMEOUT.NAVIGATE)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    const eventBody: EventBody = {
      name: data.name,
      content: data.content,
      startAt: moment(data.startAt).format(DATE_TIME_FORMATS.ISO),
      endAt: moment(data.endAt).format(DATE_TIME_FORMATS.ISO),
      startRegistrationAt: moment(data.startRegistrationAt).format(DATE_TIME_FORMATS.ISO),
      endRegistrationAt: moment(data.endRegistrationAt).format(DATE_TIME_FORMATS.ISO),
      coverPhoto: data.coverPhoto,
      organizerId: 33
    } as EventBody
    mutate(eventBody)
  })

  const navigateToEventManagementPage = () => {
    navigate(path.event)
  }

  return (
    <div className='flex flex-col flex-1 w-full h-full'>
      <div className='sticky top-0 left-0 px-6 pt-3'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-1'>
            <div className='text-xl font-semibold text-neutral-8'>Tạo sự kiện mới</div>
            <div className='text-sm font-normal text-neutral-5'>
              Tạo ra các sự kiện mới tiếp cận các sinh viên Trường Đại học Bách khoa Đà Nẵng
            </div>
          </div>
          <div className='flex gap-1'>
            <Button
              title='Tạo sự kiện'
              type='submit'
              classButton='min-w-[100px] text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md'
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

      <form action='' className='px-6 py-3 overflow-auto flex-1'>
        <div className='flex gap-4 w-full'>
          <Input
            name='name'
            register={register}
            type='text'
            placeholder='Nhập tên sự kiện'
            labelName='Tên sự kiện'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
            errorMessage={errors.name?.message}
          />
          <Input
            type='text'
            placeholder='Phòng Công tác Sinh viên'
            labelName='Được tạo bởi'
            disabled={true}
            classNameWrapper='w-full flex-1'
          />
        </div>
        <div className='flex gap-4 w-full'>
          <div className='flex flex-col w-full'>
            <div className='flex gap-4 w-full flex-1'>
              <Controller
                control={control}
                name='startAt'
                render={({ field }) => {
                  return (
                    <Input
                      type='datetime-local'
                      labelName='Ngày bắt đầu sự kiện'
                      showIsRequired={true}
                      showError={false}
                      classNameWrapper='text-sm w-full flex-1'
                      classNameInput='px-3'
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        trigger('endAt')
                        trigger('endRegistrationAt')
                      }}
                    />
                  )
                }}
              />
              <Controller
                control={control}
                name='endAt'
                render={({ field }) => {
                  return (
                    <Input
                      type='datetime-local'
                      labelName='Ngày kết thúc sự kiện'
                      showIsRequired={true}
                      showError={false}
                      classNameWrapper='text-sm w-full flex-1'
                      classNameInput='px-3'
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        trigger('startAt')
                      }}
                    />
                  )
                }}
              />
            </div>
            <div className='mt-1 min-h-[18px] text-xs font-semibold text-semantic-cancelled'>
              {errors.startAt?.message}
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <div className='flex gap-4 w-full flex-1'>
              <Controller
                control={control}
                name='startRegistrationAt'
                render={({ field }) => {
                  return (
                    <Input
                      type='datetime-local'
                      labelName='Ngày bắt đầu đăng ký'
                      showIsRequired={true}
                      showError={false}
                      classNameWrapper='text-sm w-full flex-1'
                      classNameInput='px-3'
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        trigger('endRegistrationAt')
                      }}
                    />
                  )
                }}
              />
              <Controller
                control={control}
                name='endRegistrationAt'
                render={({ field }) => {
                  return (
                    <Input
                      type='datetime-local'
                      labelName='Ngày kết thúc đăng ký'
                      showIsRequired={true}
                      showError={false}
                      classNameWrapper='text-sm w-full flex-1'
                      classNameInput='px-3'
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        trigger('startRegistrationAt')
                        trigger('startAt')
                      }}
                    />
                  )
                }}
              />
            </div>
            <div className='mt-1 min-h-[18px] text-xs font-semibold text-semantic-cancelled'>
              {errors.startRegistrationAt?.message}
            </div>
          </div>
        </div>
        <div className='flex gap-4 w-full'>
          <TextArea
            name='content'
            register={register}
            placeholder='Nhập thông tin sự kiện'
            labelName='Thông tin sự kiện'
            showIsRequired={true}
            classNameWrapper='w-full flex-1'
            errorMessage={errors.content?.message}
          />
        </div>
        <div className='flex gap-4 w-full'>
          <Controller
            name='coverPhoto'
            control={control}
            render={({ field }) => (
              <DraggableInputFile
                {...field}
                labelName='Ảnh sự kiện'
                classNameWrapper='w-full flex-1'
                errorMessage={errors.coverPhoto?.message}
                onChange={(file?: File) => field.onChange(file)}
              />
            )}
          />
          <div className='w-full flex-1'></div>
        </div>
      </form>
    </div>
  )
}
