import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/vi'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { EventInformationForCalendar } from 'src/types/event.type'
import { CALENDAR_LABEL } from 'src/constants/calendar'
import { useNavigate } from 'react-router-dom'
import { path } from 'src/routes/path'

moment.locale('vi')
const localizer = momentLocalizer(moment)

interface EventCalendarProps {
  agendaOfEvents: EventInformationForCalendar[]
}

export default function EventCalendar({ agendaOfEvents }: EventCalendarProps) {
  const navigate = useNavigate()
  return (
    <div className='col-span-8'>
      <Calendar
        localizer={localizer}
        events={agendaOfEvents}
        startAccessor='start'
        endAccessor='end'
        style={{ height: '100%' }}
        defaultView='month'
        step={60}
        popup
        messages={CALENDAR_LABEL}
        onSelectEvent={(event) => navigate(path.eventDetails.link(parseInt(event.id, 10)))}
      />
    </div>
  )
}
