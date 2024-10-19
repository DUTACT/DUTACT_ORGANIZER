import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import { changeStatusOfEvent, getAllEvents } from 'src/apis/event'
import { DATE_TIME_FORMATS, INITIAL_ITEMS_PER_PAGE } from 'src/constants/common'
import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import InputSearch from 'src/components/InputSearch'
import { ChangeStatusData, EventOfOrganizer, EventStatus } from 'src/types/event.type'
import { getSortDirection, SortCriterion, sortItems, toggleSortDirection } from 'src/utils/sortItems'
import SortIcon from 'src/components/SortIcon'
import Pagination from 'src/components/Pagination/Pagination'
import ApproveIcon from 'src/assets/icons/i-check.svg?react'
import RejectIcon from 'src/assets/icons/i-close-cancelled.svg?react'
import DeleteEventIcon from 'src/assets/icons/i-delete-event.svg?react'
import { useDispatch } from 'react-redux'
import { clearModal, setIsShowModalConfirm, setModalProperties } from 'src/redux/slices/modalConfirm'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { getStatusMessage } from 'src/utils/common'
import Tag from 'src/components/Tag'

export default function EventModeration() {
  const dispatch = useDispatch()

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
    const lowerCaseValue = value.trim().toLowerCase()
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
    const lowerCaseValue = inputSearch.trim().toLowerCase()
    const updatedCriteria = toggleSortDirection(sortCriteria, field)
    const newFilteredEvents = sortItems<EventOfOrganizer>(events, updatedCriteria)
    setSortCriteria(updatedCriteria)
    setFilteredEvents(
      newFilteredEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(lowerCaseValue) ||
          event.content.toLowerCase().includes(lowerCaseValue) ||
          event.startAt.includes(lowerCaseValue) ||
          event.endAt.toLowerCase().includes(lowerCaseValue) ||
          event.startRegistrationAt.toLowerCase().includes(lowerCaseValue) ||
          event.endRegistrationAt.toLowerCase().includes(lowerCaseValue)
      )
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage)
    setCurrentPage(1)
  }

  const openPopupRejectEvent = (event: EventOfOrganizer) => {
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Từ chối sự kiện',
        question: `Bạn có chắc chắn muốn từ chối sự kiện ${event.name} diễn ra?`,
        actionConfirm: () => handleChangeStatusOfEvent(event.id, 'rejected'),
        actionCancel: () => dispatch(clearModal()),
        titleConfirm: 'Từ chối sự kiện',
        titleCancel: 'Quay lại',
        isWarning: true,
        iconComponent: <DeleteEventIcon className='h-[20px] w-[20px]' />
      })
    )
  }

  const { mutate: mutateChangeStatusOfEvent } = changeStatusOfEvent({
    onSuccess: (data: ChangeStatusData) => {
      if (data.type === 'approved') {
        toast.success(SUCCESS_MESSAGE.APPROVE_EVENT)
      } else {
        toast.success(SUCCESS_MESSAGE.REJECT_EVENT)
      }
      dispatch(setIsShowModalConfirm(false))
      setEvents(
        events.map((event) =>
          event.id === data.eventId
            ? ({ ...event, status: { type: data.type, label: getStatusMessage(data.type) } } as EventOfOrganizer)
            : event
        )
      )
      setFilteredEvents(filteredEvents.filter((event) => event.id !== data.eventId))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleChangeStatusOfEvent = (eventId: number, type: EventStatus) => {
    mutateChangeStatusOfEvent({
      eventId,
      type
    })
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
        endRegistrationAt: moment(event.endRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        status: {
          ...event.status,
          label: getStatusMessage(event.status.type)
        }
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
    <div className='flex h-full flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <div className='max-w-[300px] flex-1'>
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
      <div className='block overflow-auto'>
        {events.length > 0 && (
          <table className='relative min-w-full overflow-auto'>
            <thead className='sticky top-0 z-50 bg-neutral-0 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
              <tr>
                <th className='sticky left-0 z-10 bg-neutral-0 px-4 py-2 text-center before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-neutral-5'>
                  <div className='flex items-center justify-center'>
                    <input type='checkbox' className='h-[16px] w-[16px] cursor-pointer' />
                  </div>
                </th>
                <th className='whitespace-normal break-words px-4 py-2 text-left text-sm'>STT</th>
                <th
                  className='min-w-[150px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => handleSortChange('name')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Tên sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'name')} />
                  </div>
                </th>
                <th
                  className='min-w-[180px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => handleSortChange('name')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Được tạo bởi</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'name')} />
                  </div>
                </th>
                <th
                  className='min-w-[300px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => handleSortChange('content')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Mô tả</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'content')} />
                  </div>
                </th>
                <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>Ảnh bìa</th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => handleSortChange('startAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày bắt đầu sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'startAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => handleSortChange('endAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày kết thúc sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'endAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => handleSortChange('startRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày bắt đầu đăng ký</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'startRegistrationAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => handleSortChange('endRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày kết thúc đăng ký</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'endRegistrationAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[120px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => handleSortChange('endRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Trạng thái</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'endRegistrationAt')} />
                  </div>
                </th>
                <th className='sticky right-0 z-20 whitespace-normal break-words bg-neutral-0 px-4 py-2 text-left text-sm before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-5'>
                  Hành động
                </th>
              </tr>
            </thead>
            {currentEvents.length > 0 && (
              <tbody>
                {currentEvents.map((event, index) => (
                  <tr key={event.id} className='group border-b-[1px] border-neutral-4 hover:bg-neutral-2'>
                    <td className='sticky left-0 z-10 bg-neutral-0 px-4 py-2 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center'>
                        <input type='checkbox' className='h-[16px] w-[16px] cursor-pointer' />
                      </div>
                    </td>
                    <td className='px-4 py-2 text-center text-sm'>{index + 1}</td>
                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 overflow-hidden'>{event.name}</div>
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 flex items-start gap-2 overflow-hidden'>
                        <div className='relative h-logo-sm min-h-logo-sm w-logo-sm min-w-logo-sm'>
                          <img
                            className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
                            src={event.organizer.avatarUrl}
                            alt='org-avt'
                          />
                        </div>

                        <div className='text-sm'>{event.organizer.name}</div>
                      </div>
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 overflow-hidden'>{event.content}</div>
                    </td>
                    <td className='flex items-center justify-center px-4 py-2 text-sm'>
                      <img
                        src={event.coverPhotoUrl}
                        alt='ảnh sự kiện'
                        className='aspect-h-9 aspect-w-16 max-h-[100px] max-w-[300px] p-0'
                      />
                    </td>
                    <td className='px-4 py-2 text-sm'>{event.startAt}</td>
                    <td className='px-4 py-2 text-sm'>{event.endAt}</td>
                    <td className='px-4 py-2 text-sm'>{event.startRegistrationAt}</td>
                    <td className='px-4 py-2 text-sm'>{event.endRegistrationAt}</td>
                    <td className='px-4 py-2 text-sm'>
                      <Tag status={event.status} />
                    </td>
                    <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center gap-1'>
                        <div className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'>
                          <ShowDetailIcon className='h-[20px] w-[20px]' />
                        </div>
                        {event.status.type === 'pending' && (
                          <Fragment>
                            <div
                              className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                              onClick={() => handleChangeStatusOfEvent(event.id, 'approved')}
                            >
                              <ApproveIcon className='h-[20px] w-[20px]' />
                            </div>
                            <div
                              className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                              onClick={() => openPopupRejectEvent(event)}
                            >
                              <RejectIcon className='h-[20px] w-[20px]' />
                            </div>
                          </Fragment>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
            {currentEvents.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={10} className='py-4 text-center'>
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
