import React, { useEffect } from 'react'
import './TaskTimer.css'
import { useTasks } from '../../context/TaskContext'
import { usePomodoro } from '../../context/PomodoroContext'
import Circle from '../../assets/img/circle.svg'

function formatTime(time) {
  if (typeof time !== 'number' || isNaN(time) || time <= 0) {
    return '00:00'
  } else {
    const minutes = Math.floor(time / 60)
    const remainingSeconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }
}

function TaskTimer({ name, taskId, time, pomodoroCount, taskNum }) {
  const {
    tasks,
    moreTimeTask,
    isTimerActive,
    hasTimerStarted,
    startTimer,
    pauseTimer,
    currentTime,
    handleTaskCompletion,
    isPaused,
    setIsPaused,
    resetTask,
  } = useTasks()

  const { switchToBreak, switchToWork, switchToStart, timerMode } =
    usePomodoro()

  useEffect(() => {
    const timerDisplay = document.getElementById('timer')
    if (timerDisplay) {
      timerDisplay.textContent = formatTime(currentTime)
    }
  }, [currentTime])

  useEffect(() => {
    const timerDOM = document.querySelector('.task__timer')
    const startBtnDOM = document.querySelector('.task__btn-start')
    const stopBtnDOM = document.querySelector('.task__btn-stop')
    if (timerMode === 'start') {
      timerDOM.classList.remove('task__timer-pause')
      timerDOM.classList.remove('task__timer-working')
      stopBtnDOM.classList.remove('task__btn-stop-working')
      startBtnDOM.textContent = 'Старт'
      stopBtnDOM.textContent = 'Стоп'
    } else if (timerMode === 'shortBreak' || timerMode === 'longBreak') {
      timerDOM.classList.add('task__timer-pause')
      isTimerActive
        ? (startBtnDOM.textContent = 'Пауза')
        : (startBtnDOM.textContent = 'Продолжить')
      stopBtnDOM.textContent = 'Пропустить'
    } else if (timerMode === 'work') {
      timerDOM.classList.add('task__timer-working')
      stopBtnDOM.classList.add('task__btn-stop-working')
      isTimerActive
        ? (startBtnDOM.textContent = 'Пауза')
        : (startBtnDOM.textContent = 'Продолжить')
      isTimerActive
        ? (stopBtnDOM.textContent = 'Стоп')
        : (stopBtnDOM.textContent = 'Сделано')
    }
  }, [timerMode, isTimerActive])

  function handleStartPause() {
    if (isTimerActive) {
      pauseTimer()
      setIsPaused(true)
    } else {
      startTimer()
      setIsPaused(false)
    }
    if (timerMode === 'start') {
      switchToWork()
    }
  }

  function handleTaskCompletionWrapper(taskId) {
    if (timerMode === 'shortBreak' || timerMode === 'longBreak') {
      resetTask(taskId)
      switchToStart()
    } else if (timerMode === 'work' && isPaused) {
      handleTaskCompletion(taskId, true)
      switchToBreak()
    } else if (timerMode === 'work' && !isPaused) {
      handleTaskCompletion(taskId, false)
      switchToStart()
    } else if (timerMode === 'start') {
      handleTaskCompletion(taskId, false)
      switchToStart()
    }
  }

  return (
    <div className="task__container">
      <div
        className={`task__header ${
          hasTimerStarted ? 'task__header-working' : ''
        }`}
      >
        <span className="task__header-name">{name}</span>
        <span className="task__header-tomato-num">{pomodoroCount}</span>
      </div>
      <div className="task__body">
        <div className="task__timer-container">
          <span id="timer" className="task__timer">
            {formatTime(time)}
          </span>
          <button
            disabled={isTimerActive || hasTimerStarted}
            className="task__btn-add"
            onClick={() => taskId && moreTimeTask(taskId)}
          >
            <img src={Circle} alt="Circle" />
          </button>
        </div>
        <p className="task__description">
          <span className="task__num">
            {`Задача ${tasks.length > 0 ? taskNum : 0} - `}
            <span className="task__name"> {name}</span>
          </span>
        </p>
        <div className="task__btn-container">
          <button
            disabled={currentTime <= 0}
            className="task__btn-start"
            onClick={handleStartPause}
          ></button>
          <button
            className={`task__btn-stop ${
              isPaused ? 'task__btn-stop-paused' : ''
            }`}
            onClick={() => handleTaskCompletionWrapper(taskId)}
          ></button>
        </div>
      </div>
    </div>
  )
}

export default TaskTimer
