import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { SeriesData } from 'src/types/common.type'
import moment from 'moment'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import { DateStatProps } from 'src/types/statistics.type'

const baseOptions: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left'
  },
  colors: ['#93c5fd', '#0960bd'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1
    },

    toolbar: {
      show: false
    }
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300
        }
      }
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350
        }
      }
    }
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight'
  },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#93c5fd', '#0960bd'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5
    }
  },
  xaxis: {
    type: 'category',
    categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px'
      }
    },
    min: 0,
    max: 5
  }
}

moment.updateLocale('en', {
  week: {
    dow: 1
  }
})

interface MultiLineChartProps {
  seriesData: SeriesData
  dateStatProps: DateStatProps
}

export default function MultiLineChart({ seriesData, dateStatProps }: MultiLineChartProps) {
  const maxDataValue = Math.max(...seriesData.series.flatMap((series) => series.data))

  let categories: string[] = []

  if (dateStatProps.filterType === 'day') {
    const start = moment(dateStatProps.fromDate)
    const end = moment(dateStatProps.toDate)
    while (start.isSameOrBefore(end)) {
      categories.push(start.format(DATE_TIME_FORMATS.DATE_WITHOUT_YEAR))
      start.add(1, 'days')
    }
  } else if (dateStatProps.filterType === 'month') {
    const startYear = dateStatProps.startYear ?? moment().year()
    const endYear = dateStatProps.endYear ?? moment().year()
    const startMonth = dateStatProps.startMonth ?? 1
    const endMonth = dateStatProps.endMonth ?? 12

    for (let year = startYear; year <= endYear; year++) {
      const start = year === startYear ? startMonth : 1
      const end = year === endYear ? endMonth : 12

      for (let month = start; month <= end; month++) {
        categories.push(`${month}/${year}`)
      }
    }
  } else if (dateStatProps.filterType === 'week') {
    const start = moment(dateStatProps.startWeek).startOf('week')
    const end = moment(dateStatProps.endWeek).endOf('week')
    const sameYear = moment(dateStatProps.startWeek).year() === moment(dateStatProps.endWeek).year()
    while (start.isSameOrBefore(end)) {
      const weekStart = start.clone()
      const weekEnd = start.clone().endOf('week')
      categories.push(
        `${weekStart.format(sameYear ? DATE_TIME_FORMATS.DATE_WITHOUT_YEAR : DATE_TIME_FORMATS.DATE_COMMON)} - ${weekEnd.format(sameYear ? DATE_TIME_FORMATS.DATE_WITHOUT_YEAR : DATE_TIME_FORMATS.DATE_COMMON)}`
      )
      start.add(1, 'weeks')
    }
  }

  const updatedOptions = {
    ...baseOptions,
    yaxis: {
      ...baseOptions.yaxis,
      max: maxDataValue
    },
    xaxis: {
      ...baseOptions.xaxis,
      categories
    }
  }

  return (
    <div className='-ml-5'>
      <ReactApexChart options={updatedOptions} series={seriesData.series} type='area' height={350} />
    </div>
  )
}
