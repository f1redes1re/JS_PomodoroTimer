import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { loadStateFromLocalStorage } from '../utils/localStorageUtils'

const TaskContext = createContext()

export const useTasks = () => useContext(TaskContext)

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(
    () => loadStateFromLocalStorage('tasks') || [],
  )
  const [taskName, setTaskName] = useState(
    () => loadStateFromLocalStorage('taskName') || '',
  )
  const [isModalOpen, setIsModalOpen] = useState(
    () => loadStateFromLocalStorage('isModalOpen') || false,
  )
  const [currentTaskId, setCurrentTaskId] = useState(
    () => loadStateFromLocalStorage('currentTaskId') || null,
  )
  const [isTimerActive, setIsTimerActive] = useState(
    () => loadStateFromLocalStorage('isTimerActive') || false,
  )
  const [hasTimerStarted, setHasTimerStarted] = useState(
    () => loadStateFromLocalStorage('hasTimerStarted') || false,
  )
  const [currentTime, setCurrentTime] = useState(
    () => loadStateFromLocalStorage('currentTime') || 0,
  )
  const [isPaused, setIsPaused] = useState(
    () => loadStateFromLocalStorage('isPaused') || false,
  )
  const [pomodoroNum, setPomodoroNum] = useState(
    () => loadStateFromLocalStorage('pomodoroNum') || 0,
  )
  const [timeNum, setTimeNum] = useState(
    () => loadStateFromLocalStorage('timeNum') || 0,
  )
  const [timeWhenPaused, setTimeWhenPaused] = useState(
    () => loadStateFromLocalStorage('timeWhenPaused') || 0,
  )
  const [stops, setStops] = useState(
    () => loadStateFromLocalStorage('stops') || 0,
  )
  const [theme, setTheme] = useState(
    () => loadStateFromLocalStorage('theme') || 'light',
  )
  const [isLoading, setIsLoading] = useState(
    () => loadStateFromLocalStorage('isLoading') || false,
  )
  const [editName, setEditName] = useState(
    () => loadStateFromLocalStorage('editName') || '',
  )
  const [animateClass, setAnimateClass] = useState(
    () => loadStateFromLocalStorage('animateClass') || 'enter',
  )

  const intervalIdRef = useRef(null)
  const intervalIdRefWhenPaused = useRef(null)

  useEffect(() => {
    if (tasks.length === 0) {
      stopTimer()
    }
  }, [tasks])

  useEffect(() => {
    if (isTimerActive && hasTimerStarted && currentTime > 0) {
      startTimer()
    }
  }, [isTimerActive, hasTimerStarted, currentTime])

  function inputChange(e) {
    setTaskName(e.target.value)
  }

  // Функция добавления задачи
  function addTask() {
    if (taskName.trim().length > 0) {
      const newTask = {
        id: new Date().getTime(),
        name: taskName.trim(),
        pomodoroCount: 1,
        time: 1500,
        timeOnPause: 0,
        day: 0,
        createdAt: new Date().toISOString(),
        solvedAt: '',
        stoppedTimes: 0,
      }
      setTasks(prevTasks => [...prevTasks, newTask])
      setCurrentTime(1500)
      setTaskName('')
      setIsTimerActive(false)
      setHasTimerStarted(false)
    }
  }

  // Функция проверки существования задачи в списке задач
  function taskExistsCheck(taskId) {
    return tasks.find(task => task.id === Number(taskId))
  }

  // Функция удаления задачи
  function deleteTask(
    taskId,
    completedPomodoros,
    completedTime,
    countedStops = 0,
  ) {
    const taskExists = taskExistsCheck(taskId)
    const finalTime = hasTimerStarted ? completedTime : 0
    if (taskExists) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      saveToLocalStorage({
        ...taskExists,
        time: finalTime,
        timeOnPause: timeWhenPaused,
        pomodoroCount: completedPomodoros,
        day: new Date().getDay() === 0 ? 7 : new Date().getDay(),
        solvedAt: new Date().toISOString(),
        stoppedTimes: countedStops,
      })
      stopTimer()
      setTimeNum(0)
      setPomodoroNum(0)
      stopCountTimeWhenPaused()
      setStops(0)
    }
  }

  // Функция завершения текущей задачи (1 помидор)
  function handleTaskCompletion(taskId, completed) {
    const taskExists = taskExistsCheck(taskId)
    if (taskExists) {
      const newTimeNum = timeNum + (taskExists.time - currentTime)
      setTimeNum(newTimeNum)
      if (completed) {
        const newPomodoroNum = pomodoroNum + 1
        setPomodoroNum(newPomodoroNum)
        if (taskExists.pomodoroCount > 1) {
          updatePomodoroCount(taskId, false)
        } else {
          deleteTask(taskId, newPomodoroNum, newTimeNum)
        }
      } else {
        const updatedStops = stops + 1
        setStops(updatedStops)
        if (taskExists.pomodoroCount > 1) {
          updatePomodoroCount(taskId, false)
          stopTimer()
        } else {
          deleteTask(taskId, pomodoroNum, newTimeNum, updatedStops)
        }
      }
      setHasTimerStarted(false)
      setIsPaused(false)
    }
  }

  // Функция изменения количества помидоров у задачи
  function updatePomodoroCount(taskId, increment) {
    const taskExists = taskExistsCheck(taskId)
    if (taskExists) {
      setTasks(prevTasks =>
        prevTasks
          .map(task => {
            if (task.id === taskId) {
              const newCount = task.pomodoroCount + (increment ? 1 : -1)
              if (newCount > 0) {
                return {
                  ...task,
                  pomodoroCount: newCount,
                }
              } else {
                deleteTask(taskId, pomodoroNum, timeNum)
                return null
              }
            }
            return task
          })
          .filter(task => task !== null),
      )
    }
  }

  // Функция добавления времени задаче
  function moreTimeTask(taskId) {
    const taskExists = taskExistsCheck(taskId)
    if (taskExists && !isTimerActive && !hasTimerStarted) {
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId && task.time < 1800) {
            return {
              ...task,
              time: task.time + 60,
            }
          }
          return task
        }),
      )
    }
  }

  // Функция редактирования задачи
  function editTask(taskId, newName) {
    const taskExists = taskExistsCheck(taskId)
    if (taskExists) {
      setTasks(
        tasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              name: newName,
            }
          }
          return task
        }),
      )
    } else return null
  }

  function resetTask(taskId) {
    const taskExists = taskExistsCheck(taskId)
    if (taskExists) {
      stopTimer()
    }
  }

  function openModal(taskId) {
    setIsModalOpen(true)
    setCurrentTaskId(taskId)
  }

  function closeModal() {
    setIsModalOpen(false)
    setCurrentTaskId(null)
  }

  function confirmDeleteTask() {
    const taskExists = tasks.find(task => task.id === currentTaskId)
    if (taskExists) {
      deleteTask(currentTaskId, pomodoroNum, currentTime)
      closeModal()
    }
  }

  function updateTimer() {
    setCurrentTime(prevTime => {
      if (prevTime === 0 && hasTimerStarted) {
        handleTaskCompletion(currentTaskId, true)
        return 0
      }
      return prevTime - 1
    })
  }

  function startTimer() {
    if (!intervalIdRef.current) {
      intervalIdRef.current = setInterval(updateTimer, 1000)
      setIsTimerActive(true)
      if (!hasTimerStarted) {
        setHasTimerStarted(true)
      }
    }
    pauseCountTimeWhenPaused()
  }

  function pauseTimer() {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current)
      intervalIdRef.current = null
    }
    setIsTimerActive(false)
    startCountTimeWhenPaused()
  }

  function stopTimer() {
    clearInterval(intervalIdRef.current)
    intervalIdRef.current = null
    setIsTimerActive(false)
    setHasTimerStarted(false)
    setCurrentTime(0)
    setIsPaused(false)
  }

  function formattedTime(time) {
    const processedTime = Math.floor(time)
    if (processedTime < 60) {
      return `${processedTime} сек`
    } else {
      const minutes = Math.floor(processedTime / 60)
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (hours > 0) {
        return `${hours} ч ${remainingMinutes} мин`
      } else {
        return `${minutes} мин`
      }
    }
  }

  function saveToLocalStorage(task) {
    const completedPomodoros =
      JSON.parse(localStorage.getItem('completedPomodoros')) || []
    completedPomodoros.push({ ...task })
    localStorage.setItem(
      'completedPomodoros',
      JSON.stringify(completedPomodoros),
    )
    console.log(completedPomodoros)
  }

  // Функция начала подсчета "времени на паузе"
  function startCountTimeWhenPaused() {
    if (hasTimerStarted) {
      if (!intervalIdRefWhenPaused.current) {
        intervalIdRefWhenPaused.current = setInterval(
          setTimeWhenPaused(prevTime => {
            return prevTime + 1
          }),
          1000,
        )
      }
      if (!isPaused) {
        setIsPaused(true)
      }
    }
  }

  // Функция паузы подсчета "времени на паузе"
  function pauseCountTimeWhenPaused() {
    if (hasTimerStarted) {
      if (intervalIdRefWhenPaused.current) {
        clearInterval(intervalIdRefWhenPaused.current)
        intervalIdRefWhenPaused.current = null
      }
      if (!isPaused) {
        setIsPaused(false)
      }
    }
  }

  // Функция прекращения подсчета "времени на паузе"
  function stopCountTimeWhenPaused() {
    clearInterval(intervalIdRefWhenPaused.current)
    intervalIdRefWhenPaused.current = null
    setTimeWhenPaused(0)
  }

  const value = {
    tasks,
    taskName,
    isModalOpen,
    hasTimerStarted,
    isTimerActive,
    currentTime,
    currentTaskId,
    intervalIdRef,
    isPaused,
    pomodoroNum,
    theme,
    isLoading,
    editName,
    animateClass,
    addTask,
    inputChange,
    updatePomodoroCount,
    moreTimeTask,
    editTask,
    openModal,
    closeModal,
    confirmDeleteTask,
    formattedTime,
    setIsTimerActive,
    setHasTimerStarted,
    startTimer,
    pauseTimer,
    setCurrentTime,
    setTasks,
    setIsPaused,
    handleTaskCompletion,
    setPomodoroNum,
    resetTask,
    setTheme,
    setIsLoading,
    setEditName,
    setAnimateClass,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
