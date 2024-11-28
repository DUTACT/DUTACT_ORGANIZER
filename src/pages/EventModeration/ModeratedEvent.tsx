import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
import { getAllEvents } from 'src/apis/event'
import {
  DATE_TIME_FORMATS,
  EVENT_STATUS_COLOR_CLASSES,
  EVENT_STATUS_MESSAGES,
  INITIAL_ITEMS_PER_PAGE
} from 'src/constants/common'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import InputSearch from 'src/components/InputSearch'
import { EventOfOrganizer, EventFilter as EventFilterType, EventStatus } from 'src/types/event.type'
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
import { ModeratedEvent, ModeratedEvent, ModeratedEvent } from './type'

export default function ModeratedEvent() {
  const navigate = useNavigate()

  const [inputSearch, setInputSearch] = useState<string>('')

  const [events, setEvents] = useState<EventOfOrganizer[]>([])
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

  const { data: eventList, error: eventsError } = getAllEvents(['approved', 'rejected'])

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

  const handleSearchEvents = (events: ModeratedEvent[], value: string): ModeratedEvent[] => {
    const lowerCaseValue = value.trim().toLowerCase()
    return events.filter(
      (event: ModeratedEvent) =>
        event.name.toLowerCase().includes(lowerCaseValue) ||
        event.moderatedAt.includes(lowerCaseValue) ||
        event.organizerName.toLowerCase().includes(lowerCaseValue) ||
        event.status.toLowerCase().includes(lowerCaseValue)
    )
  }

  const handleSortChange = (events: ModeratedEvent[], criteria: SortCriterion<ModeratedEvent>[]): ModeratedEvent[] => {
    return sortItems<ModeratedEvent>(events, criteria)
  }

  const handleFilterEvents = (events: ModeratedEvent[], eventFilterOptions: EventFilterType) => {
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
          moderatedAt: event.status.moderatedAt
            ? moment(event.status.moderatedAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)
            : event.status.moderatedAt,
          label: getStatusMessage(EVENT_STATUS_MESSAGES, event.status.type)
        }
      }))
      setEvents(newEvents)
    }
  }, [eventList])

  useEffect(() => {
    const newFilteredEvents = handleFilterEvents(handleSearchEvents(eventList, inputSearch), eventFilterOptions)

    setEvents(newFilteredEvents)
  }, [inputSearch, eventList, eventFilterOptions])

  const indexOfLastEvent = useMemo(() => currentPage * itemsPerPage, [currentPage, itemsPerPage])
  const indexOfFirstEvent = useMemo(() => indexOfLastEvent - itemsPerPage, [indexOfLastEvent, itemsPerPage])
  const currentEvents = useMemo(
    () => events.slice(indexOfFirstEvent, indexOfLastEvent),
    [events, indexOfFirstEvent, indexOfLastEvent]
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
                <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='font-bold'>Tên sự kiện</span>
                  </div>
                </th>
                <th className='min-w-[150px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='font-bold'>Tổ chức</span>
                  </div>
                </th>
                <th className='min-w-[140px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Thời gian kiểm duyệt</span>
                  </div>
                </th>
                <th className='min-w-[120px] whitespace-normal break-words px-4 py-2 text-left text-sm'>
                  <div className='flex items-center justify-between'>
                    <span>Trạng thái</span>
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
                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 overflow-hidden'>
                        <span className='text-base font-bold'>{event.name}</span>
                      </div>
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      <div className='line-clamp-3 overflow-hidden'>
                        <div className='text-sm'>{event.organizer.name}</div>
                      </div>
                    </td>
                    <td className='px-4 py-2 text-sm'>{event.status.moderatedAt}</td>
                    <td className='px-4 py-2 text-sm'>
                      <Tag status={event.status} statusClasses={EVENT_STATUS_COLOR_CLASSES} />
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
