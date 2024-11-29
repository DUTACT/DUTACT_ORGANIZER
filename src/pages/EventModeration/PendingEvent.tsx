import ShowDetailIcon from 'src/assets/icons/i-eye-secondary.svg?react'
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
import { EventOfOrganizer, EventFilter as EventFilterType } from 'src/types/event.type'
import { SortCriterion } from 'src/utils/sortItems'
import Pagination from 'src/components/Pagination/Pagination'
import Tag from 'src/components/Tag'
import { Option } from 'src/types/common.type'
import EventFilter from '../EventManagement/components/EventFilter'
import FilterPopover from 'src/components/FilterPopover'
import { useNavigate } from 'react-router-dom'
import { path } from 'src/routes/path'
import useQueryEvents from './hooks/useFilteredEvents'
import { getStatusMessage } from 'src/utils/common'

export default function PendingEvent() {
  const navigate = useNavigate()

  const [inputSearch, setInputSearch] = useState<string>('')
  const [eventFilterOptions, setEventFilterOptions] = useState<EventFilterType>({
    organizerIds: [],
    timeStartFrom: '',
    timeStartTo: '',
    registrationDeadlineFrom: '',
    registrationDeadlineTo: '',
    types: ['pending']
  })
  const [sortCriteria] = useState<SortCriterion<EventOfOrganizer>[]>([
    { field: 'name', direction: null },
    { field: 'createdAt', direction: 'desc' }
  ])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(INITIAL_ITEMS_PER_PAGE)

  const { queryEvents, eventsError, organizers, totalEvents } = useQueryEvents({
    search: inputSearch,
    filter: eventFilterOptions,
    sortCriteria,
    currentPage,
    itemsPerPage
  })

  const curEvents = useMemo(() => {
    if (queryEvents) {
      return queryEvents.map((event) => ({
        ...event,
        createdAt: moment(event.createdAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
        status: {
          ...event.status,
          label: getStatusMessage(EVENT_STATUS_MESSAGES, event.status.type)
        }
      }))
    }
  }, [queryEvents])

  const organizerOptions = useMemo((): Option[] => {
    return organizers.map(
      (organizer) =>
        ({
          label: organizer.name,
          value: organizer.id
        }) as Option
    )
  }, [organizers])

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

  if (!curEvents) {
    return <div>Loading...</div>
  }

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
                organizerOptions={organizerOptions}
              />
            )}
          />
        </div>
      </div>
      <Pagination
        totalItems={totalEvents}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <div className='block overflow-auto'>
        {curEvents.length > 0 && (
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
                    <span>Thời gian đăng</span>
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
            {curEvents.length > 0 && (
              <tbody>
                {curEvents.map((event) => (
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
                    <td className='px-4 py-2 text-sm'>{event.createdAt}</td>
                    <td className='px-4 py-2 text-sm'>
                      <Tag status={event.status} statusClasses={EVENT_STATUS_COLOR_CLASSES} />
                    </td>
                    <td className='sticky right-0 z-20 bg-neutral-0 px-4 py-2 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-3 group-hover:bg-neutral-2'>
                      <div className='flex items-center justify-center gap-1'>
                        <div
                          className='flex cursor-pointer items-center justify-center p-2 opacity-70 hover:opacity-100'
                          onClick={() => navigate(path.eventPendingDetails.link(event.id))}
                        >
                          <ShowDetailIcon className='h-[20px] w-[20px]' />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
            {curEvents.length === 0 && (
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
