import React from 'react'
import './CreateTask.css'
import TaskTimer from '../TaskTimer/TaskTimer'
import TaskList from '../TaskList/TaskList'
import { useTasks } from '../../context/TaskContext'
import Modal from '../Modal/Modal'

function CreateTask() {
  const { tasks, taskName, inputChange, addTask, editTask, moreTimeTask } =
    useTasks()

  return (
    <div className="createTask__container">
      <div className="createTask__container-left">
        <p className="createTask__container-left-text">
          Ура! Теперь можно начать работать:
        </p>
        <ul className="createTask__text-list">
          <li className="createTask__text-list-item">
            Выберите категорию и напишите название текущей задачи
          </li>
          <li className="createTask__text-list-item">
            Запустите таймер («помидор»)
          </li>
          <li className="createTask__text-list-item">
            Работайте пока «помидор» не прозвонит
          </li>
          <li className="createTask__text-list-item">
            Сделайте короткий перерыв (3-5 минут)
          </li>
          <li className="createTask__text-list-item">
            Продолжайте работать «помидор» за «помидором», пока задача не будут
            выполнена. Каждые 4 «помидора» делайте длинный перерыв (15-30
            минут).
          </li>
        </ul>
        <input
          className="createTask__task-input"
          type="text"
          placeholder="Название задачи"
          value={taskName}
          onChange={inputChange}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
        <button className="createTask__task-btn" onClick={addTask}>
          Добавить
        </button>
        <TaskList tasks={tasks} editTask={editTask} />
      </div>
      <div className="createTask__container-right">
        <Modal />
        <TaskTimer
          name={tasks.length > 0 ? tasks[0].name : 'Название задачи'}
          taskId={tasks.length > 0 ? tasks[0].id : 0}
          taskNum={1}
          time={tasks.length > 0 ? tasks[0].time : '00:00'}
          pomodoroCount={
            tasks.length > 0
              ? `Помидоров ${tasks[0].pomodoroCount}`
              : 'Помидоров 0'
          }
          moreTimeTask={
            tasks.length > 0 ? () => moreTimeTask(tasks[0].id) : null
          }
        />
      </div>
    </div>
  )
}

export default CreateTask
