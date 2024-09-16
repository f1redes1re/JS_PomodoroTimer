import React from 'react'
import './Modal.css'
import { useTasks } from '../../context/TaskContext'

const Modal = () => {
  const {
    isModalOpen,
    closeModal,
    confirmDeleteTask,
    isLoading,
    setIsLoading,
  } = useTasks()

  if (!isModalOpen) return null

  const handleConfirmDelete = () => {
    setIsLoading(true)

    setTimeout(() => {
      confirmDeleteTask()
      setIsLoading(false)
    }, 400)
  }

  return (
    <div className="modal">
      <div className="modal-content">
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <p className="modal-content__text">Удалить задачу?</p>
            <button
              className="modal-btn modal-btn__delete"
              onClick={handleConfirmDelete}
            >
              Удалить
            </button>
            <button
              className="modal-btn modal-btn__cancel"
              onClick={closeModal}
            >
              Отмена
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Modal
