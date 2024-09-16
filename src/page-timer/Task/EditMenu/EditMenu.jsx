import React from 'react'
import './EditMenu.css'
import { useTasks } from '../../../context/TaskContext'

function EditMenu({ taskId, setIsEditing, closeMenu, pomodoroCount }) {
  const { updatePomodoroCount, openModal, isTimerActive, hasTimerStarted } =
    useTasks()

  return (
    <ul className="editMenu__list">
      <li className="editMenu__list-item">
        <button
          className="editMenu__btn editMenu__btn-up"
          disabled={isTimerActive || hasTimerStarted}
          onClick={() => taskId && updatePomodoroCount(taskId, true)}
        >
          Увеличить
        </button>
      </li>
      <li className="editMenu__list-item">
        <button
          disabled={isTimerActive || hasTimerStarted || pomodoroCount === 1}
          className="editMenu__btn editMenu__btn-down"
          onClick={() => taskId && updatePomodoroCount(taskId, false)}
        >
          Уменьшить
        </button>
      </li>
      <li className="editMenu__list-item">
        <button
          className="editMenu__btn editMenu__btn-edit"
          onClick={() => setIsEditing(true)}
        >
          Редактировать
        </button>
      </li>
      <li className="editMenu__list-item">
        <button
          className="editMenu__btn editMenu__btn-delete"
          onClick={() => {
            if (taskId) {
              closeMenu()
              openModal(taskId)
            }
          }}
        >
          Удалить
        </button>
      </li>
    </ul>
  )
}

export default EditMenu
