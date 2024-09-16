import React, { useState, useEffect } from 'react'
import './Task.css'
import EditMenu from './EditMenu/EditMenu'
import { useTasks } from '../../context/TaskContext'
import TaskEditBtnImg from '../../assets/img/task-edit-btn.svg'

function Task({ name, taskId, pomodoroCount }) {
  const { editTask, animateClass, setAnimateClass } = useTasks()

  const [menuOpen, setMenuOpen] = useState(false)
  const [editName, setEditName] = useState(name)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    document.addEventListener('mousedown', closeMenu)
    return () => {
      document.removeEventListener('mousedown', closeMenu)
    }
  }, [menuOpen, isEditing, editName, taskId, editTask])

  useEffect(() => {
    setTimeout(() => {
      setAnimateClass('')
    }, 0)
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = event => {
    if (menuOpen && !event.target.closest('.task__item-container')) {
      setMenuOpen(false)
      if (isEditing) {
        editTask(taskId, editName)
        setIsEditing(false)
      }
    }
  }

  const finishEditing = () => {
    if (editName.length > 0) {
      editTask(taskId, editName)
      setIsEditing(false)
    } else if (editName.length == 0) {
      console.error('Short!')
    }
  }

  const handleInputChange = e => {
    setEditName(e.target.value)
  }

  return (
    <li className={`task__item ${animateClass}`}>
      <div className="task__item-container">
        <div className="task__task-pomodoros-num">{pomodoroCount}</div>
        {isEditing ? (
          <input
            className="task__task-name"
            value={editName}
            onChange={handleInputChange}
            onBlur={e => {
              e.preventDefault()
              finishEditing()
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                finishEditing()
              }
            }}
            autoFocus
          />
        ) : (
          <span className="task__task-name">{editName}</span>
        )}
        <button className="task__btn" onClick={toggleMenu}>
          <img src={TaskEditBtnImg} alt="TaskEditBtnImg" />
        </button>
        {menuOpen && (
          <EditMenu
            taskId={taskId}
            setIsEditing={setIsEditing}
            closeMenu={() => setMenuOpen(false)}
            pomodoroCount={pomodoroCount}
          />
        )}
      </div>
    </li>
  )
}

export default Task
