import React, { useEffect } from 'react'
import './StatsMiddle.css'
import pomodoroPicDefault from '../../assets/img/tomato2.png'
import pomodoroPicWhenClicked from '../../assets/img/tomato1.png'
import StatsChartbar from './StatsChartbar/StatsChartbar'
import { useStats } from '../../context/StatsContext'
import { useTasks } from '../../context/TaskContext'

function StatsMiddle() {
  const { formattedTime } = useTasks()
  const {
    selectedDay,
    dayOfWeek,
    setDayOfWeek,
    filterTasksTimeByDay,
    filterTasksPomodoroByDay,
  } = useStats()

  useEffect(() => {
    if (selectedDay === 1) {
      setDayOfWeek('Понедельник')
    } else if (selectedDay === 2) {
      setDayOfWeek('Вторник')
    } else if (selectedDay === 3) {
      setDayOfWeek('Среда')
    } else if (selectedDay === 4) {
      setDayOfWeek('Четверг')
    } else if (selectedDay === 5) {
      setDayOfWeek('Пятница')
    } else if (selectedDay === 6) {
      setDayOfWeek('Суббота')
    } else if (selectedDay === 7) {
      setDayOfWeek('Воскресенье')
    }
  }, [selectedDay])

  return (
    <div className="statistics__middle">
      <div className="statistics__middle-left">
        <div className="statistics__middle-info">
          <span className="statistics__middle-day">{dayOfWeek}</span>
          <span className="statistics__middle-time">
            {selectedDay !== null ? (
              <>
                Вы работали над задачами в течение
                <span className="statistics__middle-time-stat">
                  {` ${formattedTime(filterTasksTimeByDay(selectedDay))}`}
                </span>
              </>
            ) : (
              'Нет данных'
            )}
          </span>
        </div>
        <div className="statistics__middle-pomodoros">
          <div className="statistics__middle-pomodoros-data-conatainer">
            <img
              className="statistics__middle-pomodoros-img"
              src={
                selectedDay === null
                  ? pomodoroPicDefault
                  : pomodoroPicWhenClicked
              }
              alt="pomodoro"
            />
            <span className="statistics__middle-pomodoros-num">
              {selectedDay === null
                ? ''
                : `x ${filterTasksPomodoroByDay(selectedDay)}`}
            </span>
          </div>
          <div
            className={`statistics__middle-pomodoros-bottom-block-default ${
              selectedDay === null
                ? ''
                : 'statistics__middle-pomodoros-bottom-block-visible'
            }`}
          >
            <span className="statistics__middle-pomodoros-bottom-block-text">
              {selectedDay === null
                ? ''
                : `${filterTasksPomodoroByDay(selectedDay)} помидоров`}
            </span>
          </div>
        </div>
      </div>
      <div className="statistics__middle-right">
        <div className="statistics__middle-chart" id="myChart">
          <StatsChartbar />
        </div>
      </div>
    </div>
  )
}

export default StatsMiddle
