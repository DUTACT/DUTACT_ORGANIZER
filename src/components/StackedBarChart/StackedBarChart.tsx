import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { SeriesData } from 'src/types/common.type'

const options: ApexOptions = {
  colors: ['#93c5fd', '#0960bd'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%'
          }
        }
      }
    }
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last'
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '13px',
    itemMargin: {
      vertical: 32
    }
  },
  fill: {
    opacity: 1
  }
}

interface StackedBarChartProps {
  seriesData: SeriesData
}

export default function StackedBarChart({ seriesData }: StackedBarChartProps) {
  return (
    <div className='-mb-9 -ml-5'>
      <ReactApexChart options={options} series={seriesData.series} type='bar' height={350} />
    </div>
  )
}
