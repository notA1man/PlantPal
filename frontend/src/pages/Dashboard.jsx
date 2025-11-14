import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaLeaf, FaPlus } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import plantSprite1 from '../sprites/plant_sprites/plant_sprite_1.png'
import plantSprite2 from '../sprites/plant_sprites/plant_sprite_2.png'
import plantSprite3 from '../sprites/plant_sprites/plant_sprite_3.png'
import plantSprite4 from '../sprites/plant_sprites/plant_sprite_4.png'
import plantSprite5 from '../sprites/plant_sprites/plant_sprite_5.png'
import './Dashboard.css'

const plantSprites = {
  1: plantSprite1,
  2: plantSprite2,
  3: plantSprite3,
  4: plantSprite4,
  5: plantSprite5
}

function Dashboard({ user, showNotification }) {
  const [plants, setPlants] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/plants', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPlants(res.data)
    } catch (error) {
      showNotification('Failed to load plants. Please refresh the page.', 'error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    showNotification('Logged out successfully', 'success')
    navigate('/')
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav pixel-border">
        <Link to="/dashboard" className="pixel-text" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" className="nav-logo" /> PLANT PAL
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link pixel-text">MY PLANTS</Link>
          <Link to="/weather" className="nav-link pixel-text">WEATHER</Link>
          <Link to="/ai-doctor" className="nav-link pixel-text">AI DOCTOR</Link>
          <Link to="/about" className="nav-link pixel-text">ABOUT</Link>
          <button onClick={handleLogout} className="pixel-button">LOGOUT</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>MY PLANTS</h2>
        <div className="plants-grid">
          {plants.length === 0 ? (
            <div className="no-plants pixel-card">
              <p>No plants yet. Add your first plant!</p>
            </div>
          ) : (
            plants.map(plant => {
              const spriteIndex = plant.spriteIndex || 1
              const spriteImg = plantSprites[spriteIndex] || plantSprites[1]
              return (
                <Link key={plant._id} to={`/plant/${plant._id}`} className="plant-card pixel-card">
                  <img src={spriteImg} alt={plant.name} className="plant-sprite" />
                  <h3 className="pixel-text">{plant.name}</h3>
                  <p className="plant-type">{plant.type}</p>
                  {plant.lastWatered && (
                    <p className="plant-info">Last watered: {new Date(plant.lastWatered).toLocaleDateString()}</p>
                  )}
                </Link>
              )
            })
          )}
          <Link to="/add-plant" className="add-plant-card">
            <FaPlus className="add-icon" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

