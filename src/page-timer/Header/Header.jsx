import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import Logo from '../../assets/img/logo.svg'
import NightTheme from '../../assets/img/night-svgrepo-com.svg'
import DayTheme from '../../assets/img/day-sunny-svgrepo-com.svg'
import { useTasks } from '../../context/TaskContext'

function Header() {
  const { theme, setTheme } = useTasks()

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleNightDayTheme() {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <header className="header">
      <nav className="header__nav">
        <Link to="/" className="header__logo">
          <img src={Logo} alt="Logo" className="header__logo-img" />
          pomodoro_box
        </Link>

        <button
          id="theme-toggle"
          className="nightDayTheme"
          onClick={toggleNightDayTheme}
        >
          {theme === 'dark' ? (
            <img src={DayTheme} alt="DayTheme" />
          ) : (
            <img src={NightTheme} alt="NightTheme" />
          )}
        </button>

        <Link to="/stats" className="header__stat">
          Статистика
        </Link>
      </nav>
    </header>
  )
}

export default Header
