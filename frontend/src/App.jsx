import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PlantProfile from './pages/PlantProfile'
import AddPlant from './pages/AddPlant'
import WeatherInsights from './pages/WeatherInsights'
import AIPlantDoctor from './pages/AIPlantDoctor'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Feedback from './pages/Feedback'
import NotificationContainer from './components/NotificationContainer'
import SkyBackground from './components/SkyBackground'
import { useNotification } from './hooks/useNotification'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const { notifications, showNotification, removeNotification } = useNotification()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <Router>
      <SkyBackground />
      <NotificationContainer 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} showNotification={showNotification} />} />
        <Route path="/register" element={<Register setUser={setUser} showNotification={showNotification} />} />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} showNotification={showNotification} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/plant/:id" 
          element={user ? <PlantProfile user={user} showNotification={showNotification} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/add-plant" 
          element={user ? <AddPlant user={user} showNotification={showNotification} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/weather" 
          element={user ? <WeatherInsights user={user} showNotification={showNotification} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/ai-doctor" 
          element={user ? <AIPlantDoctor user={user} showNotification={showNotification} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/about" 
          element={user ? <AboutUs /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/contact" 
          element={user ? <Contact showNotification={showNotification} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/feedback" 
          element={user ? <Feedback showNotification={showNotification} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  )
}

export default App

