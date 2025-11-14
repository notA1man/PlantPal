import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaLeaf, FaCloudSun, FaLightbulb } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import './WeatherInsights.css'

function WeatherInsights({ user, showNotification }) {
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString())
          setLon(position.coords.longitude.toString())
          showNotification('Location retrieved successfully!', 'success')
        },
        () => showNotification('Location access denied. Please enter coordinates manually.', 'error')
      )
    } else {
      showNotification('Geolocation is not supported by your browser.', 'error')
    }
  }

  const fetchWeather = async () => {
    if (!lat || !lon) {
      showNotification('Please enter coordinates or use location', 'error')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`/api/weather/insights?lat=${lat}&lon=${lon}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInsights(res.data)
      showNotification('Weather data loaded successfully!', 'success')
    } catch (error) {
      showNotification('Failed to fetch weather data. Please check your API key.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="weather-page">
      <nav className="dashboard-nav pixel-border">
        <Link to="/dashboard" className="pixel-text" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" className="nav-logo" /> PLANT PAL
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link pixel-text">BACK</Link>
        </div>
      </nav>

      <div className="weather-content">
        <div className="weather-form pixel-card">
          <h1 className="pixel-text"><FaCloudSun className="icon" /> WEATHER INSIGHTS</h1>
          <div className="location-inputs">
            <input
              type="text"
              placeholder="Latitude"
              className="pixel-input"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <input
              type="text"
              placeholder="Longitude"
              className="pixel-input"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
            <button onClick={getLocation} className="pixel-button">USE MY LOCATION</button>
            <button onClick={fetchWeather} className="pixel-button" disabled={loading}>
              {loading ? 'LOADING...' : 'GET WEATHER'}
            </button>
          </div>

          {insights && (
            <div className="weather-results pixel-card">
              <h2 className="pixel-text">WEATHER DATA</h2>
              <div className="weather-info">
                <p><strong>Temperature:</strong> {insights.temp}°C</p>
                <p><strong>Humidity:</strong> {insights.humidity}%</p>
                <p><strong>Condition:</strong> {insights.condition}</p>
              </div>
              <div className="care-suggestion pixel-card">
                <h3 className="pixel-text"><FaLightbulb className="icon" /> CARE SUGGESTION</h3>
                <p>{insights.suggestion}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeatherInsights

