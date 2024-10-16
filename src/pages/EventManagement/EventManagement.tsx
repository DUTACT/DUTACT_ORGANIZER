import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import EditIcon from 'src/assets/icons/i-edit-secondary.svg?react'
import DeleteIcon from 'src/assets/icons/i-delete-warning.svg?react'
import { getAllEvents } from 'src/apis/event'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import InputSearch from 'src/components/InputSearch'
import { EventOfOrganizer } from 'src/types/event.type'

export default function EventManagement() {
  const [inputSearch, setInputSearch] = useState<string>('')
  const [events, setEvents] = useState<EventOfOrganizer[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventOfOrganizer[]>([])

  const { data: eventList, error: eventsError } = getAllEvents()

  const handleSearchEvents = (value: string) => {
    const lowerCaseValue = value.toLowerCase()
    const filteredEvents = events.filter(
      (event) =>
        event.name.toLowerCase().includes(lowerCaseValue) ||
        event.content.toLowerCase().includes(lowerCaseValue) ||
        event.startAt.includes(lowerCaseValue) ||
        event.endAt.toLowerCase().includes(lowerCaseValue) ||
        event.startRegistrationAt.toLowerCase().includes(lowerCaseValue) ||
        event.endRegistrationAt.toLowerCase().includes(lowerCaseValue)
    )
    setFilteredEvents(filteredEvents)
  }

  useEffect(() => {
    if (eventsError) {
      toast.error(eventsError.message)
    }
  }, [eventsError])

  useEffect(() => {
    if (eventList) {
      const newEvents = eventList.map((event) => ({
        ...event,
        startAt: moment(event.startAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        endAt: moment(event.endAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        startRegistrationAt: moment(event.startRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        endRegistrationAt: moment(event.endRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)
      }))
      setEvents(newEvents)
    }
  }, [eventList])

  useEffect(() => {
    handleSearchEvents(inputSearch)
  }, [inputSearch])

  return (
    <div className='p-4 overflow-y-auto flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <div className='flex-1 max-w-[300px]'>
          <InputSearch
            placeholder='Tìm kiếm tên, nội dung sự kiện'
            inputSearch={inputSearch}
            setInputSearch={setInputSearch}
          />
        </div>
      </div>
      <div className='overflow-x-auto'>
        {events.length > 0 && (
          <table className='min-w-full'>
            <thead className='border-b-[2px] border-neutral-5'>
              <tr>
                <th className='px-4 py-2 text-center sticky left-0 z-10 bg-neutral-0'>
                  <div className='flex items-center justify-center'>
                    <input type='checkbox' className='w-[16px] h-[16px] cursor-pointer' />
                  </div>
                </th>
                <th className='px-4 py-2 text-sm text-center whitespace-normal break-words'>STT</th>
                <th className='px-4 py-2 text-sm text-center whitespace-normal break-words min-w-[150px]'>
                  Tên sự kiện
                </th>
                <th className='px-4 py-2 text-sm text-center whitespace-normal break-words min-w-[300px]'>Mô tả</th>
                <th className='px-4 py-2 text-sm text-center whitespace-normal break-words min-w-[150px]'>Ảnh bìa</th>
                <th className='px-4 py-2 text-sm text-center whitespace-normal break-words min-w-[120px]'>
                  Ngày bắt đầu sự kiện
                </th>
                <th className='px-4 py-2 text-sm text-center whitespace-normal break-words min-w-[120px]'>
                  Ngày kết thúc sự kiện
                </th>
                <th className='px-4 py-2 text-sm text-center whitespace-normal break-words min-w-[120px]'>
                  Ngày bắt đầu đăng ký
                </th>
                <th className='px-4 py-2 text-sm text-center whitespace-normal break-words min-w-[120px]'>
                  Ngày kết thúc đăng ký
                </th>
                <th className='text-center bg-neutral-0 px-4 py-2 text-sm  whitespace-normal break-words sticky right-0 z-20 before:absolute before:top-0 before:left-0 before:h-full before:w-[1px] before:bg-neutral-3'>
                  Hành động
                </th>
              </tr>
            </thead>
            {filteredEvents.length > 0 && (
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr className='border-b-[1px] border-neutral-4 group hover:bg-neutral-2'>
                    <td className='px-4 py-2 bg-neutral-0 sticky left-0 z-10 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center'>
                        <input type='checkbox' className='w-[16px] h-[16px] cursor-pointer' />
                      </div>
                    </td>
                    <td className='px-4 py-2 text-sm text-center'>{index + 1}</td>
                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 overflow-hidden'>{event.name}</div>
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 overflow-hidden'>{event.content}</div>
                    </td>
                    <td className='px-4 py-2 text-sm flex items-center justify-center '>
                      <img
                        src={event.coverPhotoUrl}
                        alt='ảnh sự kiện'
                        className='max-w-[300px] max-h-[100px] aspect-w-16 aspect-h-9 p-0'
                      />
                    </td>
                    <td className='px-4 py-2 text-sm'>{event.startAt}</td>
                    <td className='px-4 py-2 text-sm'>{event.endAt}</td>
                    <td className='px-4 py-2 text-sm'>{event.startRegistrationAt}</td>
                    <td className='px-4 py-2 text-sm'>{event.endRegistrationAt}</td>
                    <td className='px-4 py-2 bg-neutral-0 group-hover:bg-neutral-2 sticky right-0 z-20 before:absolute before:top-0 before:left-0 before:h-full before:w-[1px] before:bg-neutral-3'>
                      <div className='flex items-center justify-center gap-1'>
                        <div className='flex items-center justify-center p-2 cursor-pointer opacity-70 hover:opacity-100'>
                          <ShowDetailIcon className='w-[20px] h-[20px]' />
                        </div>
                        <div className='flex items-center justify-center p-2 cursor-pointer opacity-70 hover:opacity-100'>
                          <EditIcon className='w-[20px] h-[20px]' />
                        </div>
                        <div className='flex items-center justify-center p-2 cursor-pointer opacity-70 hover:opacity-100'>
                          <DeleteIcon className='w-[20px] h-[20px]' />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        )}
      </div>
    </div>
  )
}
