import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTasks } from './TaskContext'
import { loadStateFromLocalStorage } from '../utils/localStorageUtils'

const PomodoroContext = createContext()

export const usePomodoro = () => useContext(PomodoroContext)

export const PomodoroProvider = ({ children }) => {
  const { tasks, setCurrentTime, startTimer } = useTasks()
  const [globalPomodoroCount, setGlobalPomodoroCount] = useState(
    () => loadStateFromLocalStorage('globalPomodoroCount') || 0,
  )
  const [timerMode, setTimerMode] = useState(
    () => loadStateFromLocalStorage('timerMode') || 'start',
  ) // 'start', 'work', 'shortBreak', 'longBreak'

  useEffect(() => {
    if (tasks.length === 0) {
      setTimerMode('start')
    }
  }, [tasks.length])

  useEffect(() => {
    if (timerMode === 'shortBreak') {
      setCurrentTime(300)
    } else if (timerMode === 'longBreak') {
      setTimerMode('longBreak')
    }
    console.log('Timer mode:', timerMode)
  }, [timerMode])

  function switchToBreak() {
    incrementGlobalPomodoro()
    if (globalPomodoroCount !== 0 && globalPomodoroCount % 4 === 0) {
      setTimerMode('longBreak')
      resetGlobalPomodoro()
    } else {
      setTimerMode('shortBreak')
    }
    startTimer()
  }

  function switchToWork() {
    setTimerMode('work')
  }

  function switchToStart() {
    setTimerMode('start')
    if (tasks.length > 0) {
      setCurrentTime(1500)
    }
  }

  function incrementGlobalPomodoro() {
    setGlobalPomodoroCount(prevCount => prevCount + 1)
  }

  function resetGlobalPomodoro() {
    setGlobalPomodoroCount(0)
  }

  const value = {
    timerMode,
    switchToBreak,
    switchToWork,
    switchToStart,
  }

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  )
}
