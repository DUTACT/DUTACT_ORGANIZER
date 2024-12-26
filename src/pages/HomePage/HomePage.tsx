import CardDataStats from 'src/components/CardDataStats'
import EventIcon from 'src/assets/icons/i-calendar-active.svg?react'
import FollowIcon from 'src/assets/icons/i-follow-active.svg?react'
import LikeIcon from 'src/assets/icons/i-heart-active.svg?react'
import FeedbackIcon from 'src/assets/icons/i-feedback-active.svg?react'
import EventCalendar from 'src/components/EventCalendar'
import { useOverallStat } from './hooks/useOverallStat'
import { useEvents } from 'src/hooks/useEvents'
import EventStatLineChart from './components/EventStatLineChart'
import EventStatBarChart from './components/EventStatBarChart'
import OutstandingEvent from './components/OutstandingEvent'

export default function HomePage() {
  const { overallStat } = useOverallStat()
  const { agendaOfEvents } = useEvents()
  return (
    <div className='h-full overflow-auto p-4'>
      <div className='2xl:gap-7.5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4'>
        {overallStat && (
          <>
            <CardDataStats title='Tổng số sự kiện' total={overallStat.totalEvents}>
              <EventIcon className='h-7 w-7' />
            </CardDataStats>
            <CardDataStats title='Số lượt theo dõi' total={overallStat.totalFollows}>
              <FollowIcon className='h-7 w-7' />
            </CardDataStats>
            <CardDataStats title='Số lượt yêu thích' total={overallStat.totalPostLikes}>
              <LikeIcon className='h-7 w-7' />
            </CardDataStats>
            <CardDataStats title='Số bài cảm nghĩ' total={overallStat.totalFeedbacks}>
              <FeedbackIcon className='h-7 w-7' />
            </CardDataStats>
          </>
        )}
      </div>
      <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-8 2xl:gap-8'>
        <EventCalendar agendaOfEvents={agendaOfEvents} />
        <OutstandingEvent />
      </div>
      <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-8 2xl:gap-8'>
        <EventStatLineChart />
        <EventStatBarChart />
      </div>
    </div>
  )
}
