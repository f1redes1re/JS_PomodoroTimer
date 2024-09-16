import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './page-timer/Header/Header'
import CreateTask from './page-timer/CreateTask/CreateTask'
import Statistics from './page-statistics/Statistics'
import { TaskProvider } from './context/TaskContext'
import { PomodoroProvider } from './context/PomodoroContext'
import { StatsProvider } from './context/StatsContext'
import { LocalStorageProvider } from './context/LocalStorageContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <TaskProvider>
    <PomodoroProvider>
      <StatsProvider>
        <LocalStorageProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<CreateTask />} />
              <Route path="/stats" element={<Statistics />} />
            </Routes>
          </Router>
        </LocalStorageProvider>
      </StatsProvider>
    </PomodoroProvider>
  </TaskProvider>,
)
