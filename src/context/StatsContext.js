import React, { createContext, useContext, useEffect, useState } from 'react'
import { loadStateFromLocalStorage } from '../utils/localStorageUtils'

const StatsContext = createContext()

export const useStats = () => useContext(StatsContext)

export const StatsProvider = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState(
    () => loadStateFromLocalStorage('selectedDay') || null,
  )
  const [activeIndex, setActiveIndex] = useState(null)
  const [dayOfWeek, setDayOfWeek] = useState(
    () => loadStateFromLocalStorage('dayOfWeek') || '',
  )
  const [timeArrayForBar, setTimeArrayForBar] = useState(
    () => loadStateFromLocalStorage('timeArrayForBar') || [],
  )
  const [period, setPeriod] = useState(
    () => loadStateFromLocalStorage('period') || 'thisWeek',
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const updatedTimeArray = getArrayByDateForBar(period)
    setTimeArrayForBar(updatedTimeArray)
  }, [period])

  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('completedPomodoros')) || []
  }

  function filterTasksByDay(day) {
    const completedTimeArray = getTasksFromLocalStorage()
    if (completedTimeArray.length > 0) {
      const filteredDayArr = completedTimeArray.filter(task => {
        const taskDate = new Date(task.createdAt)
        let taskDay = taskDate.getDay()
        taskDay = taskDay === 0 ? 7 : taskDay
        return taskDay === day
      })
      return filteredDayArr
    } else return []
  }

  function filterTasksByDate(date) {
    const completedTasks = getTasksFromLocalStorage()
    const filteredTasks = completedTasks.filter(task => {
      const taskDate = new Date(task.createdAt)
      return taskDate.toDateString() === date.toDateString()
    })
    return filteredTasks
  }

  function filterTasksTimeByDay(day) {
    const dayTasks = filterTasksByDay(day)
    if (dayTasks.length > 0) {
      return dayTasks.reduce((totalTime, task) => {
        const taskTime = task.time > 0 && task.time <= 1500 ? task.time : 0
        return totalTime + taskTime
      }, 0)
    } else return 0
  }

  function filterTasksPomodoroByDay(day) {
    const dayTasks = filterTasksByDay(day)
    if (dayTasks.length > 0) {
      return dayTasks.reduce(
        (totalTime, task) => totalTime + task.pomodoroCount,
        0,
      )
    } else return 0
  }

  function filterTasksTimeOnPauseByDay(day) {
    const dayTasks = filterTasksByDay(day)
    if (dayTasks.length > 0) {
      return dayTasks.reduce(
        (totalTime, task) => totalTime + task.timeOnPause,
        0,
      )
    } else return 0
  }

  function filterTasksStopsByDay(day) {
    const dayTasks = filterTasksByDay(day)
    if (dayTasks.length > 0) {
      const result = dayTasks.reduce(
        (totalTime, task) => totalTime + task.stoppedTimes,
        0,
      )
      return result
    } else return 0
  }

  function getTimeArrayForBar() {
    const timeArray = []
    for (let day = 1; day <= 7; day++) {
      const totalTimeForDay = filterTasksTimeByDay(day)
      timeArray.push(totalTimeForDay)
    }
    return timeArray
  }

  const getMonday = date => {
    const resultDate = new Date(date)
    const day = resultDate.getDay() || 7
    resultDate.setDate(resultDate.getDate() - day + 1)
    return resultDate
  }

  function getArrayByDateForBar(period) {
    const timeArray = []
    const currentDate = new Date()
    let startDate
    switch (period) {
      case 'thisWeek':
        startDate = getMonday(currentDate) // Получаем понедельник текущей недели
        break
      case 'lastWeek':
        startDate = getMonday(currentDate)
        startDate.setDate(startDate.getDate() - 7) // Начало прошлой недели
        break
      case 'twoWeeksAgo':
        startDate = getMonday(currentDate)
        startDate.setDate(startDate.getDate() - 14) // Начало недели 2 недели назад
        break
      default:
        startDate = getMonday(currentDate) // По умолчанию текущая неделя
    }
    for (let day = 0; day < 7; day++) {
      const currentDay = new Date(startDate)
      currentDay.setDate(startDate.getDate() + day)
      const tasksForDay = filterTasksByDate(currentDay)
      const totalTimeForDay = tasksForDay.reduce((totalTime, task) => {
        return totalTime + task.time
      }, 0)
      timeArray.push(totalTimeForDay)
    }
    return timeArray
  }

  function getFocusData(day) {
    const dayTime = filterTasksTimeByDay(day)
    const dayPomodoros = filterTasksPomodoroByDay(day)
    if (dayPomodoros === 0) return '0%'
    const focusTime = (dayTime / (dayPomodoros * 25)) * 100
    const focusTimeFloored = Math.round(focusTime)
    return focusTimeFloored + '%'
  }

  const value = {
    selectedDay,
    activeIndex,
    dayOfWeek,
    timeArrayForBar,
    dropdownOpen,
    setSelectedDay,
    setActiveIndex,
    getTimeArrayForBar,
    setDayOfWeek,
    getFocusData,
    filterTasksTimeByDay,
    filterTasksPomodoroByDay,
    filterTasksTimeOnPauseByDay,
    filterTasksStopsByDay,
    getArrayByDateForBar,
    setTimeArrayForBar,
    setPeriod,
    setDropdownOpen,
  }

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}
