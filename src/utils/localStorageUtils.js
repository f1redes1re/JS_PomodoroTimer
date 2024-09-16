// Функция для сохранения состояния в localStorage
export const saveStateToLocalStorage = (key, state) => {
  try {
    if (state !== undefined) {
      const serializedState = JSON.stringify(state)
      localStorage.setItem(key, serializedState)
    }
  } catch (error) {
    console.error('Ошибка при сохранении состояния в localStorage', error)
  }
}

// Функция для загрузки состояния из localStorage
export const loadStateFromLocalStorage = key => {
  try {
    const serializedState = localStorage.getItem(key)
    if (serializedState === null || serializedState === 'undefined') {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (error) {
    console.error('Ошибка при загрузке состояния из localStorage', error)
    return undefined
  }
}

// Функция для удаления состояния из localStorage (если нужно)
export const removeStateFromLocalStorage = key => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Ошибка при удалении состояния из localStorage', error)
  }
}
