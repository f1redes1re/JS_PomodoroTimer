import React, { useEffect, createContext } from 'react'
import { useTasks } from './TaskContext'
import { usePomodoro } from './PomodoroContext'
import { useStats } from './StatsContext'
import { saveStateToLocalStorage } from '../utils/localStorageUtils'

const LocalStorageContext = createContext()

// Провайдер для управления сохранением состояний
export const LocalStorageProvider = ({ children }) => {
  const {
    tasks,
    taskName,
    currentTaskId,
    isTimerActive,
    hasTimerStarted,
    currentTime,
    isPaused,
    pomodoroNum,
    theme,
  } = useTasks()
  const { globalPomodoroCount, timerMode } = usePomodoro()
  const { selectedDay, dayOfWeek, timeArrayForBar, period } = useStats()

  useEffect(() => {
    saveStateToLocalStorage('tasks', tasks)
  }, [tasks])

  useEffect(() => {
    saveStateToLocalStorage('taskName', taskName)
  }, [taskName])

  useEffect(() => {
    saveStateToLocalStorage('currentTaskId', currentTaskId)
  }, [currentTaskId])

  useEffect(() => {
    saveStateToLocalStorage('isTimerActive', isTimerActive)
  }, [isTimerActive])

  useEffect(() => {
    saveStateToLocalStorage('hasTimerStarted', hasTimerStarted)
  }, [hasTimerStarted])

  useEffect(() => {
    saveStateToLocalStorage('currentTime', currentTime)
  }, [currentTime])

  useEffect(() => {
    saveStateToLocalStorage('isPaused', isPaused)
  }, [isPaused])

  useEffect(() => {
    saveStateToLocalStorage('pomodoroNum', pomodoroNum)
  }, [pomodoroNum])

  useEffect(() => {
    saveStateToLocalStorage('theme', theme)
  }, [theme])

  useEffect(() => {
    saveStateToLocalStorage('globalPomodoroCount', globalPomodoroCount)
  }, [globalPomodoroCount])

  useEffect(() => {
    saveStateToLocalStorage('timerMode', timerMode)
  }, [timerMode])

  useEffect(() => {
    saveStateToLocalStorage('selectedDay', selectedDay)
  }, [selectedDay])

  useEffect(() => {
    saveStateToLocalStorage('period', period)
  }, [period])

  useEffect(() => {
    saveStateToLocalStorage('dayOfWeek', dayOfWeek)
  }, [dayOfWeek])

  useEffect(() => {
    saveStateToLocalStorage('timeArrayForBar', timeArrayForBar)
  }, [timeArrayForBar])

  return (
    <LocalStorageContext.Provider value={{}}>
      {children}
    </LocalStorageContext.Provider>
  )
}
