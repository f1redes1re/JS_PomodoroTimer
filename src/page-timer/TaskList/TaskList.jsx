import React from 'react'
import Task from '../Task/Task'
import './TaskList.css'
import { useTasks } from '../../context/TaskContext'

function getTotalTime(allTasks) {
  return allTasks.reduce((total, task) => {
    return total + task.pomodoroCount * task.time
  }, 0)
}

function TaskList({ tasks, editTask }) {
  const { formattedTime } = useTasks()

  return (
    <>
      <ul
        className={`taskList__list ${
          tasks.length > 0 ? 'taskList__list-filled' : ''
        }`}
      >
        {tasks.map((task, index) => (
          <Task
            key={task.id}
            taskId={task.id}
            taskNum={index + 1}
            name={task.name}
            pomodoroCount={task.pomodoroCount}
            editTask={editTask}
          />
        ))}
      </ul>
      <span
        className={`taskList__result-time ${
          tasks.length > 0 ? 'taskList__result-time-filled' : ''
        }`}
      >
        {formattedTime(getTotalTime(tasks))}
      </span>
    </>
  )
}

export default TaskList
