import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from 'src/components/Input'
import MultiLineChart from 'src/components/MultiLineChart'
import Select from 'src/components/Select'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import { OptionSelect, SeriesData } from 'src/types/common.type'
import { getFirstDayOfMonth, getLastDayOfMonth, getWeeksForYear } from 'src/utils/datetime'
import { useParticipationStat } from '../hooks/useParticipationStat'
import { DateStatProps } from 'src/types/statistics.type'

moment.updateLocale('en', {
  week: {
    dow: 1
  }
})

type FormData = DateStatProps

const DEFAULT_DATE_VALUES: FormData = {
  filterType: 'day',
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  fromDate: moment().subtract(6, 'days').format(DATE_TIME_FORMATS.DATE),
  toDate: moment().format(DATE_TIME_FORMATS.DATE),
  startWeek: moment().subtract(11, 'weeks').startOf('week').format(DATE_TIME_FORMATS.DATE),
  endWeek: moment().startOf('week').format(DATE_TIME_FORMATS.DATE),
  startMonth: 1,
  endMonth: 12
}

export default function EventStatLineChart() {
  console.log(DEFAULT_DATE_VALUES)
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
  const [selectedDateRange, setSelectedDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: DEFAULT_DATE_VALUES.fromDate as string,
    endDate: DEFAULT_DATE_VALUES.toDate as string
  })

  const { control, watch } = useForm<FormData>({
    defaultValues: DEFAULT_DATE_VALUES
  })

  const filterType = watch('filterType')
  const startYear = watch('startYear')
  const endYear = watch('endYear')
  const fromDate = watch('fromDate')
  const toDate = watch('toDate')
  const startWeek = watch('startWeek')
  const endWeek = watch('endWeek')
  const startMonth = watch('startMonth')
  const endMonth = watch('endMonth')
  const dateStatProps = watch()

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const yearOptions = years.map((year) => ({ label: year.toString(), value: year.toString() }) as OptionSelect)

  const weeksStartYear = useMemo(() => getWeeksForYear(startYear), [startYear])
  const weeksEndYear = useMemo(() => getWeeksForYear(endYear), [endYear])

  console.log('weeksStartYear', weeksStartYear, weeksEndYear)

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `Tháng ${i + 1}`,
    value: i + 1
  }))

  const {
    registrationAndParticipationQuantityByDate,
    registrationAndParticipationQuantityByWeek,
    registrationAndParticipationQuantityByMonth
  } = useParticipationStat(useMemo(() => selectedDateRange, [selectedDateRange]))

  useEffect(() => {}, [filterType])

  useEffect(() => {
    if (
      filterType === 'day' &&
      fromDate &&
      toDate &&
      (!moment(fromDate).isSame(selectedDateRange.startDate) || !moment(toDate).isSame(selectedDateRange.endDate))
    ) {
      setSelectedDateRange({
        startDate: fromDate,
        endDate: toDate
      })
    }
  }, [fromDate, toDate, filterType])

  useEffect(() => {
    if (filterType === 'week' && startYear && endYear && startWeek && endWeek) {
      setSelectedDateRange({
        startDate: startWeek,
        endDate: moment(endWeek).endOf('week').format(DATE_TIME_FORMATS.DATE)
      })
    }
  }, [startYear, endYear, startWeek, endWeek, filterType])

  useEffect(() => {
    if (filterType === 'month' && startYear && endYear && startMonth && endMonth) {
      setSelectedDateRange({
        startDate: getFirstDayOfMonth(startYear, startMonth),
        endDate: getLastDayOfMonth(endYear, endMonth)
      })
    }
  }, [startYear, endYear, startMonth, endMonth, filterType])

  useEffect(() => {
    const newSeries = [
      {
        name: 'Tổng số lượt đăng ký',
        data:
          filterType === 'day'
            ? registrationAndParticipationQuantityByDate?.map((dataByDate) => dataByDate.registrations) || []
            : filterType === 'week'
              ? registrationAndParticipationQuantityByWeek?.map((dataByDate) => dataByDate.registrations) || []
              : registrationAndParticipationQuantityByMonth?.map((dataByDate) => dataByDate.registrations) || []
      },
      {
        name: 'Tổng số lượt tham gia',
        data:
          filterType === 'day'
            ? registrationAndParticipationQuantityByDate?.map((dataByDate) => dataByDate.participations) || []
            : filterType === 'week'
              ? registrationAndParticipationQuantityByWeek?.map((dataByDate) => dataByDate.participations) || []
              : registrationAndParticipationQuantityByMonth?.map((dataByDate) => dataByDate.participations) || []
      }
    ]

    if (JSON.stringify(data.series) !== JSON.stringify(newSeries)) {
      setData({ series: newSeries })
    }
  }, [
    filterType,
    registrationAndParticipationQuantityByDate,
    registrationAndParticipationQuantityByWeek,
    registrationAndParticipationQuantityByMonth,
    data.series
  ])

  return (
    <div className='col-span-12 rounded-lg border border-neutral-3 bg-neutral-1 px-5 py-4 shadow-custom xl:col-span-8'>
      <div className='flex flex-col flex-wrap items-start justify-between sm:flex-nowrap'>
        <div className='flex gap-4'>
          <Select
            control={control}
            name='filterType'
            labelName='Thống kê theo: '
            options={[
              {
                label: 'Ngày',
                value: 'day'
              },
              {
                label: 'Tuần',
                value: 'week'
              },
              {
                label: 'Tháng',
                value: 'month'
              }
            ]}
            classNameWrapper='w-32'
            classNameSelect='px-2 py-1 text-sm'
          />
          {filterType === 'day' && (
            <>
              <Input
                type='date'
                control={control}
                name='fromDate'
                labelName='Từ ngày: '
                classNameInput='px-2 py-1 text-sm'
              />
              <Input
                type='date'
                control={control}
                name='toDate'
                labelName='Đến ngày: '
                classNameInput='px-2 py-1 text-sm'
              />
            </>
          )}
          {filterType === 'week' && (
            <>
              <Select
                name='startYear'
                control={control}
                labelName='Từ năm:'
                options={yearOptions}
                classNameWrapper='w-20'
                classNameSelect='px-2 py-1 text-sm'
              />
              <Select
                name='startWeek'
                control={control}
                labelName='Tuần bắt đầu:'
                options={weeksStartYear}
                classNameWrapper='min-w-40'
                classNameSelect='px-2 py-1 text-sm'
              />
              <Select
                name='endYear'
                control={control}
                labelName='Đến năm:'
                options={yearOptions}
                classNameWrapper='w-20'
                classNameSelect='px-2 py-1 text-sm'
              />
              <Select
                name='endWeek'
                control={control}
                labelName='Tuần kết thúc:'
                options={weeksEndYear}
                classNameWrapper='min-w-40'
                classNameSelect='px-2 py-1 text-sm'
              />
            </>
          )}
          {filterType === 'month' && (
            <>
              <Select
                name='startYear'
                control={control}
                labelName='Từ:'
                options={yearOptions}
                classNameWrapper='w-20'
                classNameSelect='px-2 py-1 text-sm'
              />
              <Select
                name='startMonth'
                control={control}
                labelName='Tháng'
                options={months}
                classNameWrapper='min-w-40'
                classNameSelect='px-2 py-1 text-sm'
              />
              <Select
                name='endYear'
                control={control}
                labelName='Đến:'
                options={yearOptions}
                classNameWrapper='w-20'
                classNameSelect='px-2 py-1 text-sm'
              />
              <Select
                name='endMonth'
                control={control}
                labelName='Tháng:'
                options={months}
                classNameWrapper='min-w-40'
                classNameSelect='px-2 py-1 text-sm'
              />
            </>
          )}
        </div>
        <div className='flex w-full flex-wrap gap-3 sm:gap-5'>
          <div className='flex min-w-48'>
            <span className='mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-blue-300'>
              <span className='block h-2.5 w-full max-w-2.5 rounded-full bg-blue-300'></span>
            </span>
            <div className='w-full'>
              <p className='font-semibold text-blue-400'>Tổng số lượt đăng ký</p>
            </div>
          </div>
          <div className='flex min-w-48'>
            <span className='mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-semantic-secondary'>
              <span className='block h-2.5 w-full max-w-2.5 rounded-full bg-semantic-secondary'></span>
            </span>
            <div className='w-full'>
              <p className='font-semibold text-semantic-secondary'>Tổng số lượt tham gia</p>
            </div>
          </div>
        </div>
      </div>

      <div>{fromDate && toDate && <MultiLineChart seriesData={data} dateStatProps={dateStatProps} />}</div>
    </div>
  )
}
