import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Loading...')
  const [serverTime, setServerTime] = useState('')

  useEffect(() => {
    // Test API connection
    fetch('http://localhost:3000/api/health')
      .then(response => response.json())
      .then(data => {
        setApiStatus('Connected')
        setServerTime(new Date(data.timestamp).toLocaleString())
      })
      .catch(error => {
        setApiStatus('Disconnected')
        console.error('API Error:', error)
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏠 Stay Planner</h1>
        <p>Welcome to your stay planning application!</p>
        
        <div className="status-section">
          <h3>System Status</h3>
          <div className="status-item">
            <span>Frontend:</span>
            <span className="status-connected">Running</span>
          </div>
          <div className="status-item">
            <span>Backend API:</span>
            <span className={apiStatus === 'Connected' ? 'status-connected' : 'status-disconnected'}>
              {apiStatus}
            </span>
          </div>
          {serverTime && (
            <div className="status-item">
              <span>Server Time:</span>
              <span>{serverTime}</span>
            </div>
          )}
        </div>

        <div className="features">
          <h3>Features Coming Soon</h3>
          <ul>
            <li>✈️ Trip planning and management</li>
            <li>🏨 Accommodation booking</li>
            <li>🗺️ Itinerary creation</li>
            <li>📱 Mobile-friendly interface</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App
