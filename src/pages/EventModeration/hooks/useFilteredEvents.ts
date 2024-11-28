import moment from 'moment'
import { useMemo } from 'react'
import { getAllEvents } from 'src/apis/event'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import { EventFilter, EventOfOrganizer } from 'src/types/event.type'
import { checkTimeOverlap } from 'src/utils/datetime'
import { SortCriterion, sortItems } from 'src/utils/sortItems'

interface Props {
  search: string
  filter: EventFilter
  sortCriteria: SortCriterion<EventOfOrganizer>[]
  currentPage?: number
  itemsPerPage?: number
}

export default function useQueryEvents({ search, filter, sortCriteria, currentPage = 1, itemsPerPage = 10 }: Props) {
  const { data: events, error: eventsError } = getAllEvents(filter.types.length > 0 ? filter.types : undefined)
  const organizers = useMemo(() => {
    if (!events) return []
    return events
      .map((event) => event.organizer)
      .filter((organizer, index, self) => index === self.findIndex((o) => o.id === organizer.id))
  }, [events])

  const filteredEvents = useMemo(() => {
    if (!events) return
    const sortedEvents = applySort(events || [], sortCriteria)
    const filteredEvents = applySearch(applyFilter(sortedEvents, filter), search)

    return filteredEvents
  }, [events, search, filter, sortCriteria])

  const totalEvents = filteredEvents?.length || 0
  const pagedEvents = useMemo(
    () => applyPagination(filteredEvents || [], currentPage, itemsPerPage),
    [filteredEvents, currentPage, itemsPerPage]
  )

  return { queryEvents: pagedEvents, eventsError, organizers, totalEvents }
}

function applySearch(events: EventOfOrganizer[], searchString: string): EventOfOrganizer[] {
  const lowerCaseValue = searchString.trim().toLowerCase()
  return events.filter(
    (event: EventOfOrganizer) =>
      event.name.toLowerCase().includes(lowerCaseValue) ||
      event.organizer.name.toLowerCase().includes(lowerCaseValue) ||
      event.status.type.toLowerCase().includes(lowerCaseValue)
  )
}

function applyFilter(events: EventOfOrganizer[], eventFilterOptions: EventFilter) {
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

function applySort(events: EventOfOrganizer[], criteria: SortCriterion<EventOfOrganizer>[]): EventOfOrganizer[] {
  return sortItems<EventOfOrganizer>(events, criteria)
}

function applyPagination(events: EventOfOrganizer[], currentPage: number, itemsPerPage: number): EventOfOrganizer[] {
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  return events.slice(start, end)
}
