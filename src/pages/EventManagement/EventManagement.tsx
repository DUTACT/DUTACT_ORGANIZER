import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import EditIcon from 'src/assets/icons/i-edit-secondary.svg?react'
import DeleteIcon from 'src/assets/icons/i-delete-warning.svg?react'
import { deleteEvent, getAllEventsOfOrganizer } from 'src/apis/event'
import { DATE_TIME_FORMATS, INITIAL_ITEMS_PER_PAGE } from 'src/constants/common'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import InputSearch from 'src/components/InputSearch'
import { EventOfOrganizer, EventFilter as EventFilterType } from 'src/types/event.type'
import { getSortDirection, SortCriterion, sortItems, toggleSortDirection } from 'src/utils/sortItems'
import SortIcon from 'src/components/SortIcon'
import Pagination from 'src/components/Pagination/Pagination'
import AddIcon from 'src/assets/icons/i-plus-white.svg?react'
import Button from 'src/components/Button'
import DeleteEventIcon from 'src/assets/icons/i-delete-event.svg?react'
import { useNavigate } from 'react-router-dom'
import { path } from 'src/routes/path'
import { useDispatch } from 'react-redux'
import { clearModal, setIsShowModalConfirm, setModalProperties } from 'src/redux/slices/modalConfirm'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { getStatusMessage, parseJwt } from 'src/utils/common'
import Tag from 'src/components/Tag'
import useLocalStorage from 'src/hooks/useLocalStorage'
import FilterPopover from 'src/components/FilterPopover'
import EventFilter from './components/EventFilter'
import _ from 'lodash'
import { checkTimeOverlap } from 'src/utils/datetime'
import { Option } from 'src/types/common.type'

export default function EventManagement() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [accessToken, _] = useLocalStorage<string>('access_token')
  const organizerId = parseJwt(accessToken)?.organizerId

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
  const [eventFilterOptions, setEventFilterOptions] = useState<EventFilterType>({
    organizerIds: [],
    timeStartFrom: '',
    timeStartTo: '',
    registrationDeadlineFrom: '',
    registrationDeadlineTo: '',
    types: []
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(INITIAL_ITEMS_PER_PAGE)

  const { data: eventList, error: eventsError } = getAllEventsOfOrganizer(organizerId)

  const uniqueOrganizers = useMemo(() => {
    return events
      .map((event) => event.organizer)
      .filter((organizer, index, self) => index === self.findIndex((o) => o.id === organizer.id))
  }, [events])

  const organizerList = useMemo((): Option[] => {
    return uniqueOrganizers.map(
      (organizer) =>
        ({
          label: organizer.name,
          value: organizer.id
        }) as Option
    )
  }, [uniqueOrganizers])

  const handleSearchEvents = (events: EventOfOrganizer[], value: string): EventOfOrganizer[] => {
    const lowerCaseValue = value.trim().toLowerCase()
    return events.filter(
      (event: EventOfOrganizer) =>
        event.name.toLowerCase().includes(lowerCaseValue) ||
        event.content.toLowerCase().includes(lowerCaseValue) ||
        event.startAt.includes(lowerCaseValue) ||
        event.endAt.toLowerCase().includes(lowerCaseValue) ||
        event.startRegistrationAt.toLowerCase().includes(lowerCaseValue) ||
        event.endRegistrationAt.toLowerCase().includes(lowerCaseValue)
    )
  }

  const toggleSortCriteria = (field: keyof EventOfOrganizer): void => {
    const updatedCriteria = toggleSortDirection(sortCriteria, field)
    setSortCriteria(updatedCriteria)
  }

  const handleSortChange = (
    events: EventOfOrganizer[],
    criteria: SortCriterion<EventOfOrganizer>[]
  ): EventOfOrganizer[] => {
    return sortItems<EventOfOrganizer>(events, criteria)
  }

  const handleFilterEvents = (events: EventOfOrganizer[], eventFilterOptions: EventFilterType) => {
    return events.filter((event) => {
      const organizerMatch =
        eventFilterOptions.organizerIds.length === 0 || eventFilterOptions.organizerIds.includes(event.organizer.id)

      const typesMatch = eventFilterOptions.types.length === 0 || eventFilterOptions.types.includes(event.status.type)

      const timeStartFrom = moment(eventFilterOptions.timeStartFrom, DATE_TIME_FORMATS.DATE).startOf('day')
      const timeStartTo = moment(eventFilterOptions.timeStartTo, DATE_TIME_FORMATS.DATE).startOf('day')
      const eventStartAt = moment(event.startAt, DATE_TIME_FORMATS.DATE_TIME_COMMON).startOf('day')
      const eventEndAt = moment(event.endAt, DATE_TIME_FORMATS.DATE_TIME_COMMON).startOf('day')

      const isTimeOverlap = checkTimeOverlap(eventStartAt, eventEndAt, timeStartFrom, timeStartTo)

      const registrationDeadlineFrom = moment(
        eventFilterOptions.registrationDeadlineFrom,
        DATE_TIME_FORMATS.DATE
      ).startOf('day')
      const registrationDeadlineTo = moment(eventFilterOptions.registrationDeadlineTo, DATE_TIME_FORMATS.DATE).startOf(
        'day'
      )
      const eventRegistrationStartAt = moment(event.startRegistrationAt, DATE_TIME_FORMATS.DATE_TIME_COMMON).startOf(
        'day'
      )
      const eventRegistrationEndAt = moment(event.endRegistrationAt, DATE_TIME_FORMATS.DATE_TIME_COMMON).startOf('day')

      const isRegistrationOverlap = checkTimeOverlap(
        eventRegistrationStartAt,
        eventRegistrationEndAt,
        registrationDeadlineFrom,
        registrationDeadlineTo
      )

      return organizerMatch && typesMatch && isTimeOverlap && isRegistrationOverlap
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage)
    setCurrentPage(1)
  }

  const navigateToCreateEventPage = () => {
    navigate(path.createEvent)
  }

  const openPopupDeleteEvent = (event: EventOfOrganizer) => {
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Xóa sự kiện',
        question: `Bạn có chắc chắn muốn xóa sự kiện ${event.name}?`,
        actionConfirm: () => handleDeleteEvent(event.id),
        actionCancel: () => dispatch(clearModal()),
        titleConfirm: 'Xóa sự kiện',
        titleCancel: 'Quay lại',
        isWarning: true,
        iconComponent: <DeleteEventIcon className='h-[20px] w-[20px]' />
      })
    )
  }

  const { mutate } = deleteEvent(organizerId, {
    onSuccess: (eventId: number) => {
      toast.success(SUCCESS_MESSAGE.DELETE_EVENT)
      dispatch(setIsShowModalConfirm(false))
      setEvents(events.filter((event) => event.id !== eventId))
      setFilteredEvents(filteredEvents.filter((event) => event.id !== eventId))
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleDeleteEvent = (eventId: number) => {
    mutate(eventId)
  }

  const navigateToUpdateEventPage = (eventId: number) => {
    navigate(path.updateEvent.link(eventId))
  }

  const navigateToEventDetailsPage = (eventId: number) => {
    navigate(path.eventDetails.link(eventId))
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
        createdAt: moment(event.createdAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        startAt: moment(event.startAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        endAt: moment(event.endAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        startRegistrationAt: moment(event.startRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        endRegistrationAt: moment(event.endRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        status: {
          ...event.status,
          label: getStatusMessage(event.status.type),
          moderatedAt: moment(event.status.moderatedAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)
        }
      }))
      setEvents(newEvents)
    }
  }, [eventList])

  useEffect(() => {
    const newFilteredEvents = handleSortChange(
      handleFilterEvents(handleSearchEvents(events, inputSearch), eventFilterOptions),
      sortCriteria
    )
    setFilteredEvents(newFilteredEvents)
  }, [inputSearch, events, eventFilterOptions, sortCriteria])

  const indexOfLastEvent = useMemo(() => currentPage * itemsPerPage, [currentPage, itemsPerPage])
  const indexOfFirstEvent = useMemo(() => indexOfLastEvent - itemsPerPage, [indexOfLastEvent, itemsPerPage])
  const currentEvents = useMemo(
    () => filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent),
    [filteredEvents, indexOfFirstEvent, indexOfLastEvent]
  )

  return (
    <div className='flex h-full flex-col gap-4 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-[300px] flex-1'>
            <InputSearch
              placeholder='Tìm kiếm tên, nội dung sự kiện'
              inputSearch={inputSearch}
              setInputSearch={setInputSearch}
            />
          </div>
          <FilterPopover
            content={(onClosePopover) => (
              <EventFilter
                onSendFilterOptions={setEventFilterOptions}
                onClosePopover={onClosePopover}
                organizerOptions={organizerList}
              />
            )}
          />
        </div>
        <div className='flex items-center gap-2'>
          <Button
            title='Tạo sự kiện mới'
            type='button'
            classButton='min-w-[100px] text-neutral-0 bg-semantic-secondary/90 hover:bg-semantic-secondary text-nowrap rounded-md gap-1'
            iconComponent={<AddIcon className='h-[20px] w-[20px]' />}
            onClick={navigateToCreateEventPage}
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
                <th className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Thời gian tạo</span>
                  </div>
                </th>
                <th
                  className='min-w-[150px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('name')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Tên sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'name')} />
                  </div>
                </th>
                <th
                  className='min-w-[300px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('content')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Mô tả</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'content')} />
                  </div>
                </th>
                <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>Ảnh bìa</th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('startAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày bắt đầu sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'startAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('endAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày kết thúc sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'endAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('startRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày bắt đầu đăng ký</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'startRegistrationAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('endRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Ngày kết thúc đăng ký</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'endRegistrationAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('endRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Trạng thái</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'endRegistrationAt')} />
                  </div>
                </th>
                <th className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Thời gian duyệt</span>
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
                    <td className='px-4 py-2 text-sm'>{event.createdAt}</td>

                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 overflow-hidden'>{event.name}</div>
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
                    <td className='px-4 py-2 text-sm'>{event.status.moderatedAt}</td>

                    <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center gap-1'>
                        <div className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'>
                          <ShowDetailIcon
                            className='h-[20px] w-[20px]'
                            onClick={() => navigateToEventDetailsPage(event.id)}
                          />
                        </div>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          onClick={() => navigateToUpdateEventPage(event.id)}
                        >
                          <EditIcon className='h-[20px] w-[20px]' />
                        </div>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          onClick={() => openPopupDeleteEvent(event)}
                        >
                          <DeleteIcon className='h-[20px] w-[20px]' />
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
