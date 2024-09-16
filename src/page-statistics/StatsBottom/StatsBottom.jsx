import React from 'react'
import './StatsBottom.css'
import { useStats } from '../../context/StatsContext'
import { useTasks } from '../../context/TaskContext'

function StatsBottom() {
  const { formattedTime } = useTasks()
  const {
    selectedDay,
    getFocusData,
    filterTasksTimeOnPauseByDay,
    filterTasksStopsByDay,
  } = useStats()

  return (
    <div className="statistics__section-bottom">
      <div
        className={`statistics__section-bottom-module section-module__focus ${
          selectedDay !== null ? 'section-module__focus-enabled' : ''
        }`}
      >
        <span className="statistics__section-bottom-module-title">Фокус</span>
        <span className="statistics__section-bottom-module-value">
          {selectedDay !== null ? getFocusData(selectedDay) : 0}
        </span>
      </div>
      <div
        className={`statistics__section-bottom-module section-module__pause-time ${
          selectedDay !== null ? 'section-module__pause-time-enabled' : ''
        }`}
      >
        <span className="statistics__section-bottom-module-title">
          Время на паузе
        </span>
        <span className="statistics__section-bottom-module-value">
          {selectedDay !== null
            ? formattedTime(filterTasksTimeOnPauseByDay(selectedDay))
            : '0м'}
        </span>
      </div>
      <div
        className={`statistics__section-bottom-module section-module__stops ${
          selectedDay !== null ? 'section-module__stops-enabled' : ''
        }`}
      >
        <span className="statistics__section-bottom-module-title">
          Остановки
        </span>
        <span className="statistics__section-bottom-module-value">
          {selectedDay !== null ? filterTasksStopsByDay(selectedDay) : 0}
        </span>
      </div>
    </div>
  )
}

export default StatsBottom
