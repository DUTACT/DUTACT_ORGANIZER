import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import EditIcon from 'src/assets/icons/i-edit-secondary.svg?react'
import DeleteIcon from 'src/assets/icons/i-delete-warning.svg?react'
import { getAllEvents } from 'src/apis/event'
import { DATE_TIME_FORMATS, INITIAL_ITEMS_PER_PAGE } from 'src/constants/common'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import InputSearch from 'src/components/InputSearch'
import { EventOfOrganizer } from 'src/types/event.type'
import { getSortDirection, SortCriterion, sortItems, toggleSortDirection } from 'src/utils/sortItems'
import SortIcon from 'src/components/SortIcon'
import Pagination from 'src/components/Pagination/Pagination'

export default function EventManagement() {
  const [inputSearch, setInputSearch] = useState<string>('')
  const [events, setEvents] = useState<EventOfOrganizer[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventOfOrganizer[]>([])
  const [sortCriteria, setSortCriteria] = useState<SortCriterion<EventOfOrganizer>[]>([
    { field: 'name', direction: null },
    { field: 'content', direction: null },
    { field: 'startAt', direction: null },
    { field: 'endAt', direction: null },
    { field: 'startRegistrationAt', direction: null },
    { field: 'endRegistrationAt', direction: null }
  ])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(INITIAL_ITEMS_PER_PAGE)

  const { data: eventList, error: eventsError } = getAllEvents()

  const handleSearchEvents = (value: string) => {
    const lowerCaseValue = value.toLowerCase()
    const orderedEvents = sortItems<EventOfOrganizer>(events, sortCriteria)
    const filteredEvents = orderedEvents.filter(
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

  const handleSortChange = (field: keyof EventOfOrganizer) => {
    const updatedCriteria = toggleSortDirection(sortCriteria, field)
    const newFilteredEvents = sortItems<EventOfOrganizer>(filteredEvents, updatedCriteria)
    setSortCriteria(updatedCriteria)
    setFilteredEvents(newFilteredEvents)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (eventsError) {
      toast.error(eventsError.message)
    }
  }, [eventsError])

  useEffect(() => {
    if (eventList) {
      const newEvents = eventList.map((event: EventOfOrganizer) => ({
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
  }, [inputSearch, events])

  const indexOfLastEvent = currentPage * itemsPerPage
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)

  return (
    <div className='p-4 h-full flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex-1 max-w-[300px]'>
          <InputSearch
            placeholder='Tìm kiếm tên, nội dung sự kiện'
            inputSearch={inputSearch}
            setInputSearch={setInputSearch}
          />
        </div>
      </div>
      <Pagination
        totalItems={filteredEvents.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <div className='block overflow-auto '>
        {events.length > 0 && (
          <table className='min-w-full overflow-auto relative'>
            <thead className='before:absolute sticky top-0 before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-neutral-5 z-50 bg-neutral-0'>
              <tr>
                <th className='px-4 py-2 text-center sticky left-0 z-10 bg-neutral-0 before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-neutral-5 before:absolute'>
                  <div className='flex items-center justify-center'>
                    <input type='checkbox' className='w-[16px] h-[16px] cursor-pointer' />
                  </div>
                </th>
                <th className='px-4 py-2 text-sm text-left whitespace-normal break-words'>STT</th>
                <th
                  className='px-4 py-2 text-sm text-left whitespace-normal break-words min-w-[150px] cursor-pointer'
                  onClick={() => handleSortChange('name')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Tên sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'name')} />
                  </div>
                </th>
                <th
                  className='px-4 py-2 text-sm text-left whitespace-normal break-words min-w-[300px] cursor-pointer'
                  onClick={() => handleSortChange('content')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Mô tả</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'content')} />
                  </div>
                </th>
                <th className='px-4 py-2 text-sm text-left whitespace-normal break-words min-w-[150px]'>Ảnh bìa</th>
                <th
                  className='px-4 py-2 text-sm text-left whitespace-normal break-words min-w-[140px] cursor-pointer'
                  onClick={() => handleSortChange('startAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày bắt đầu sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'startAt')} />
                  </div>
                </th>
                <th
                  className='px-4 py-2 text-sm text-left whitespace-normal break-words min-w-[140px] cursor-pointer'
                  onClick={() => handleSortChange('endAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày kết thúc sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'endAt')} />
                  </div>
                </th>
                <th
                  className='px-4 py-2 text-sm text-left whitespace-normal break-words min-w-[140px] cursor-pointer'
                  onClick={() => handleSortChange('startRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày bắt đầu đăng ký</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'startRegistrationAt')} />
                  </div>
                </th>
                <th
                  className='px-4 py-2 text-sm text-left whitespace-normal break-words min-w-[140px] cursor-pointer'
                  onClick={() => handleSortChange('endRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày kết thúc đăng ký</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'endRegistrationAt')} />
                  </div>
                </th>
                <th className='text-left bg-neutral-0 px-4 py-2 text-sm whitespace-normal break-words sticky right-0 z-20 before:absolute before:top-0 before:left-0 before:h-full before:w-[1px] before:bg-neutral-3 after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-neutral-5 after:absolute'>
                  Hành động
                </th>
              </tr>
            </thead>
            {currentEvents.length > 0 && (
              <tbody>
                {currentEvents.map((event, index) => (
                  <tr key={event.id} className='border-b-[1px] border-neutral-4 group hover:bg-neutral-2'>
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
            {currentEvents.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={10} className='text-center py-4 '>
                    Không có kết quả
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        )}
      </div>
    </div>
  )
}
