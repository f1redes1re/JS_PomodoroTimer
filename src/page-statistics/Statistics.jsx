import React from 'react'
import './Statistics.css'
import StatsHeader from './StatsHeader/StatsHeader'
import StatsMiddle from './StatsMiddle/StatsMiddle'
import StatsBottom from './StatsBottom/StatsBottom'

function Statistics() {
  return (
    <div className="statistics__container">
      <StatsHeader />
      <StatsMiddle />
      <StatsBottom />
    </div>
  )
}

export default Statistics
