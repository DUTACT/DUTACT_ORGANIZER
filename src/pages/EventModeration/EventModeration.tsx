import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import { getAllEvents } from 'src/apis/event'
import { DATE_TIME_FORMATS, INITIAL_ITEMS_PER_PAGE } from 'src/constants/common'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import InputSearch from 'src/components/InputSearch'
import { EventOfOrganizer, EventFilter as EventFilterType } from 'src/types/event.type'
import { getSortDirection, SortCriterion, sortItems, toggleSortDirection } from 'src/utils/sortItems'
import SortIcon from 'src/components/SortIcon'
import Pagination from 'src/components/Pagination/Pagination'
import { getStatusMessage, parseJwt } from 'src/utils/common'
import Tag from 'src/components/Tag'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { checkTimeOverlap } from 'src/utils/datetime'
import { Option } from 'src/types/common.type'
import EventFilter from '../EventManagement/components/EventFilter'
import FilterPopover from 'src/components/FilterPopover'
import { useNavigate } from 'react-router-dom'
import { path } from 'src/routes/path'

export default function EventModeration() {
  const navigate = useNavigate()

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

  const { data: eventList, error: eventsError } = getAllEvents(organizerId)

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
                <th
                  className='min-w-[150px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('name')}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-bold'>Tên sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'name')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('startAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Thời gian diễn ra sự kiện</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'startAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[140px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('startRegistrationAt')}
                >
                  <div className='flex items-center justify-between'>
                    <span>Thời gian đăng ký</span>
                    <SortIcon sortDirection={getSortDirection(sortCriteria, 'startRegistrationAt')} />
                  </div>
                </th>
                <th
                  className='min-w-[120px] cursor-pointer whitespace-normal break-words px-4 py-2 text-left text-sm'
                  onClick={() => toggleSortCriteria('endRegistrationAt')}
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
                {currentEvents.map((event) => (
                  <tr key={event.id} className='group border-b-[1px] border-neutral-4 hover:bg-neutral-2'>
                    <td className='sticky left-0 z-10 bg-neutral-0 px-4 py-2 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center'>
                        <input type='checkbox' className='h-[16px] w-[16px] cursor-pointer' />
                      </div>
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 overflow-hidden'>
                        <span className='text-base font-bold'>{event.name}</span>
                        <div className='text-sm'>{event.organizer.name}</div>
                      </div>
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      {event.startAt} - {event.endAt}
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      {event.startRegistrationAt} - {event.endRegistrationAt}
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      <Tag status={event.status} />
                    </td>
                    <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center gap-1'>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          onClick={() => navigate(path.eventModDetails.link(event.id))}
                        >
                          <ShowDetailIcon className='h-[20px] w-[20px]' />
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
