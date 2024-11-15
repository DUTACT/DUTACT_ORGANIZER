import { Bar, BarChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EventRegistrationCountByDate } from 'src/types/eventRegistration.type'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import moment from 'moment'
import { getRegistrationCountByDate } from 'src/apis/registration'
import { useEventId } from '../../../../hooks/useEventId'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import { useOrganizerEvent } from '../../hooks/useOrganizerEvent'

export default function EventRegistrations() {
  const eventId = useEventId()
  const organizerId = useOrganizerId()
  const event = useOrganizerEvent(organizerId, eventId)
  const { registrations, error } = useRegistrations(eventId)

  if (error) {
    console.error(error)
    return <div>Đã có lỗi xảy ra</div>
  }

  if (!registrations || !event) {
    return <div>Đang tải dữ liệu...</div>
  }

  if (registrations.length === 0) {
    return <div className='mb-12 text-lg'>Tổng số đơn đăng ký: 0</div>
  }

  const startDate = moment(registrations[0].date).format(DATE_TIME_FORMATS.DATE)
  const endDate = moment(registrations[registrations.length - 1].date).format(DATE_TIME_FORMATS.DATE)
  const total = registrations.reduce((acc, registration) => acc + registration.count, 0)
  const legendName = 'Số đơn đăng ký, từ ngày ' + startDate + ' đến ngày ' + endDate
  const registrationsChartData = mapRegistrationsToChartData(registrations, moment.min(moment(), moment(endDate)))

  return (
    <>
      <header className='mb-4 text-2xl font-semibold'>Đơn đăng ký</header>
      <div className='mb-12 text-lg'>Tổng số đơn đăng ký: {total}</div>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart data={registrationsChartData} margin={{ top: 10, right: 30, left: 30, bottom: 40 }}>
          <XAxis dataKey='date'>
            <Label value='Ngày' offset={-5} dy={10} position='insideBottomRight' />
            <Label value={legendName} offset={0} dy={40} position='center' />
          </XAxis>
          <YAxis dataKey='count'>
            <Label value='Số đơn đăng ký' offset={0} dx={-20} angle={-90} position='center' />
          </YAxis>
          <Tooltip />
          <Bar dataKey='count' fill='#8884d8' name={'Số đơn đăng ký'} />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

function useRegistrations(eventId: number) {
  const { data: fetchedData, error } = getRegistrationCountByDate(eventId)

  return { registrations: fetchedData, error }
}

function mapRegistrationsToChartData(registrations: EventRegistrationCountByDate[], endDate: moment.Moment) {
  if (registrations.length === 0) {
    return []
  }

  const sortedDate = registrations.sort((a, b) => moment(a.date).diff(moment(b.date)))
  const startDate = moment(sortedDate[0].date)

  var filledResult: EventRegistrationCountByDate[] = []
  var currentDate = startDate
  while (currentDate.isSameOrBefore(endDate)) {
    const found = sortedDate.find((item) => moment(item.date).isSame(currentDate, 'day'))
    filledResult.push({
      date: currentDate.toISOString(),
      count: found ? found.count : 0
    })
    currentDate = currentDate.clone().add(1, 'day')
  }

  return filledResult.map((item) => ({
    date: moment(item.date).format(DATE_TIME_FORMATS.DATE_WITHOUT_YEAR),
    count: item.count
  }))
}
