import React, { useEffect } from 'react'
import './StatsHeader.css'
import { useStats } from '../../context/StatsContext'

function StatsHeader() {
  const {
    setTimeArrayForBar,
    getArrayByDateForBar,
    setPeriod,
    dropdownOpen,
    setDropdownOpen,
  } = useStats()
  const chartRef = React.useRef(null)

  const closeDropdown = () => {
    setDropdownOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        closeDropdown()
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownOpen])

  const handlePeriodChange = period => {
    setPeriod(period)
    const timeArray = getArrayByDateForBar(period)
    setTimeArrayForBar(timeArray)
  }

  return (
    <div className="statistics__header">
      <h3 className="statistics__header-text">Ваша активность</h3>
      <div
        className="statistics__header-dropdown"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="statistics__header-dropdown-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={chartRef}
        >
          Эта неделя
          <span
            className={`statistics__header-arrow ${
              dropdownOpen ? 'statistics__header-arrow-show' : ''
            }`}
          ></span>
        </button>
        {dropdownOpen && (
          <div className="statistics__header-dropdown-content">
            <button
              className="statistics__header-dropdown-btn"
              onClick={() => handlePeriodChange('thisWeek')}
            >
              Эта неделя
            </button>
            <button
              className="statistics__header-dropdown-btn"
              onClick={() => handlePeriodChange('lastWeek')}
            >
              Прошлая неделя
            </button>
            <button
              className="statistics__header-dropdown-btn"
              onClick={() => handlePeriodChange('twoWeeksAgo')}
            >
              2 недели назад
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsHeader
