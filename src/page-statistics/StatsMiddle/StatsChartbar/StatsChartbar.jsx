import React, { useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useStats } from '../../../context/StatsContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function BarChart() {
  const {
    setSelectedDay,
    activeIndex,
    setActiveIndex,
    timeArrayForBar,
    setDayOfWeek,
  } = useStats()

  const chartRef = React.useRef(null)
  const dataForChart = timeArrayForBar

  const data = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    datasets: [
      {
        backgroundColor: function (context) {
          const index = context.dataIndex
          return index === activeIndex ? 'red' : '#EA8A79'
        },
        hoverBackgroundColor: 'rgba(230, 126, 110, 0.8)',
        hoverBorderColor: 'rgba(230, 126, 110, 1)',
        data: dataForChart,
      },
    ],
  }

  const options = {
    layout: {
      padding: {
        top: 45,
        right: 0,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: function (context) {
            const index = context.index
            return index === activeIndex ? 'red' : '#999999'
          },
          font: {
            weight: 400,
            size: '24px',
            lineHeight: '28px',
          },
        },
      },
      y: {
        position: 'right',
        grid: {
          display: true,
        },
        border: {
          display: false,
        },
        afterBuildTicks: axis => {
          const ticks = [0, 25, 50, 75, 100]
          axis.ticks = ticks.map(tick => ({ value: tick }))
          return axis.ticks
        },
        ticks: {
          color: '#333333',
          font: {
            weight: 400,
            size: '12px',
            lineHeight: '33px',
          },
          padding: 32,
          callback: function (value) {
            if (value === 0) return ''
            if (value === 25) return '25 мин'
            if (value === 50) return '50 мин'
            if (value === 75) return '1 ч 15 мин'
            if (value === 100) return '1 ч 40 мин'
            return ''
          },
          maxTicksLimit: 5,
        },
      },
    },
    onClick: (e, element) => {
      if (element.length > 0) {
        const index = element[0].index
        setSelectedDay(index + 1)
        setActiveIndex(index)
      }
    },
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        setActiveIndex(null)
        setSelectedDay(null)
        setDayOfWeek('')
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [setActiveIndex, setSelectedDay])
  return (
    <div ref={chartRef}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default BarChart
