import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'src/components/Select'
import StackedBarChart from 'src/components/StackedBarChart'
import { OptionSelect, SeriesData } from 'src/types/common.type'
import { useParticipationStat } from '../hooks/useParticipationStat'
import { getWeekDates } from 'src/utils/datetime'

type FormData = {
  weekType: 'previous' | 'current'
}

const WEEKS: OptionSelect[] = [
  {
    label: 'Tuần trước',
    value: 'previous'
  },
  {
    label: 'Tuần này',
    value: 'current'
  }
]

export default function EventStatBarChart() {
  const [data, setData] = useState<SeriesData>({
    series: [
      {
        name: 'Tổng số lượt đăng ký',
        data: []
      },
      {
        name: 'Tổng số lượt tham gia',
        data: []
      }
    ]
  })
  const [selectedDateRange, setSelectedDateRange] = useState<{ startDate: string; endDate: string }>(
    getWeekDates('current')
  )

  const { control, watch } = useForm<FormData>({
    defaultValues: {
      weekType: 'current'
    }
  })

  const selectedWeekType = watch('weekType')

  const { registrationAndParticipationQuantityByDate } = useParticipationStat(
    useMemo(() => selectedDateRange, [selectedDateRange])
  )

  useEffect(() => {
    const newDateRange = getWeekDates(selectedWeekType)
    if (newDateRange.startDate !== selectedDateRange.startDate || newDateRange.endDate !== selectedDateRange.endDate) {
      setSelectedDateRange(newDateRange)
    }
  }, [selectedWeekType, selectedDateRange])

  useEffect(() => {
    const newSeries = [
      {
        name: 'Tổng số lượt đăng ký',
        data: registrationAndParticipationQuantityByDate?.map((dataByDate) => dataByDate.registrations) || []
      },
      {
        name: 'Tổng số lượt tham gia',
        data: registrationAndParticipationQuantityByDate?.map((dataByDate) => dataByDate.participations) || []
      }
    ]

    if (JSON.stringify(data.series) !== JSON.stringify(newSeries)) {
      setData({ series: newSeries })
    }
  }, [registrationAndParticipationQuantityByDate, data.series])

  return (
    <div className='col-span-12 rounded-lg border border-neutral-3 bg-white p-8 shadow-custom xl:col-span-4'>
      <div className='mb-4 justify-between gap-4 sm:flex'>
        <div>
          <h4 className='text-xl font-semibold text-neutral-7'>Thống kê sinh viên tham gia sự kiện</h4>
        </div>
        <div>
          <div className='relative z-20 inline-block'>
            <Select
              name='weekType'
              control={control}
              options={WEEKS}
              classNameWrapper='min-w-[8rem]'
              classNameSelect='px-2 py-1 text-sm focus:!outline-none'
            />
          </div>
        </div>
      </div>

      <div>
        <StackedBarChart seriesData={data} />
      </div>
    </div>
  )
}
