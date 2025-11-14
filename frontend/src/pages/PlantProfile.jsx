import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FaLeaf, FaTint } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import plantSprite1 from '../sprites/plant_sprites/plant_sprite_1.png'
import plantSprite2 from '../sprites/plant_sprites/plant_sprite_2.png'
import plantSprite3 from '../sprites/plant_sprites/plant_sprite_3.png'
import plantSprite4 from '../sprites/plant_sprites/plant_sprite_4.png'
import plantSprite5 from '../sprites/plant_sprites/plant_sprite_5.png'
import './PlantProfile.css'

const plantSprites = {
  1: plantSprite1,
  2: plantSprite2,
  3: plantSprite3,
  4: plantSprite4,
  5: plantSprite5
}

function PlantProfile({ user, showNotification }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [lastWatered, setLastWatered] = useState('')
  const [lastFertilized, setLastFertilized] = useState('')
  const [loadingSuggestion, setLoadingSuggestion] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)

  useEffect(() => {
    fetchPlant()
  }, [id])

  const fetchPlant = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`/api/plants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPlant(res.data)
      if (res.data.lastWatered) {
        setLastWatered(new Date(res.data.lastWatered).toISOString().split('T')[0])
      }
      if (res.data.lastFertilized) {
        setLastFertilized(new Date(res.data.lastFertilized).toISOString().split('T')[0])
      }
    } catch (error) {
      showNotification('Failed to load plant. Please try again.', 'error')
      navigate('/dashboard')
    }
  }

  const handleWater = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/plants/${id}`, { lastWatered: new Date() }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('Plant watered!', 'success')
      fetchPlant()
    } catch (error) {
      showNotification('Failed to update watering date.', 'error')
    }
  }

  const handleFertilize = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/plants/${id}`, { lastFertilized: new Date() }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('Plant fertilized!', 'success')
      fetchPlant()
    } catch (error) {
      showNotification('Failed to update fertilizing date.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this plant?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/plants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('Plant deleted successfully.', 'success')
      navigate('/dashboard')
    } catch (error) {
      showNotification('Failed to delete plant.', 'error')
    }
  }

  const handleGetSuggestion = async () => {
    setLoadingSuggestion(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`/api/plants/${id}/suggestions`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPlant(res.data.plant)
      showNotification('Suggestion generated successfully!', 'success')
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to get suggestion. Please try again.', 'error')
    } finally {
      setLoadingSuggestion(false)
    }
  }

  const handleDeleteSuggestion = async (suggestionId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`/api/plants/${id}/suggestions/${suggestionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPlant(res.data.plant)
      showNotification('Suggestion deleted successfully!', 'success')
    } catch (error) {
      showNotification('Failed to delete suggestion.', 'error')
    }
  }

  const handleChatSend = async (e) => {
    e.preventDefault()
    if (!chatInput.trim() || loadingChat) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setLoadingChat(true)

    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', text: userMessage }])

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`/api/plants/${id}/chat`, { message: userMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { type: 'ai', text: res.data.response }])
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to get response. Please try again.', 'error')
      // Remove the user message if there was an error
      setChatMessages(prev => prev.slice(0, -1))
    } finally {
      setLoadingChat(false)
    }
  }

  if (!plant) return <div className="loading pixel-text">Loading...</div>

  return (
    <div className="plant-profile-page">
      <nav className="dashboard-nav pixel-border">
        <Link to="/dashboard" className="pixel-text" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" className="nav-logo" /> PLANT PAL
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link pixel-text">BACK</Link>
        </div>
      </nav>

      <div className="plant-profile-content">
        <div className="plant-profile pixel-card">
          <img 
            src={plantSprites[plant.spriteIndex || 1] || plantSprites[1]} 
            alt={plant.name} 
            className="plant-profile-sprite" 
          />
          <h1 className="pixel-text">{plant.name}</h1>
          <p className="plant-type">Type: {plant.type}</p>
          {plant.notes && <p className="plant-notes">{plant.notes}</p>}

          <div className="schedule-section">
            <h2 className="pixel-text">WATER / FERTILIZER SCHEDULE</h2>
            <div className="schedule-buttons">
              <button onClick={handleWater} className="pixel-button">WATER NOW</button>
              <button onClick={handleFertilize} className="pixel-button">FERTILIZE NOW</button>
            </div>
            {plant.lastWatered && (
              <p className="schedule-info">Last watered: {new Date(plant.lastWatered).toLocaleString()}</p>
            )}
            {plant.lastFertilized && (
              <p className="schedule-info">Last fertilized: {new Date(plant.lastFertilized).toLocaleString()}</p>
            )}
          </div>

          <div className="care-suggestions pixel-card">
            <h3 className="pixel-text">CARE SUGGESTIONS</h3>
            <button 
              onClick={handleGetSuggestion} 
              className="pixel-button" 
              disabled={loadingSuggestion}
            >
              {loadingSuggestion ? 'LOADING...' : 'GET SUGGESTION'}
            </button>
            
            <div className="suggestions-list">
              {plant?.suggestions && plant.suggestions.length > 0 ? (
                plant.suggestions.map((suggestion, index) => (
                  <div key={suggestion._id || index} className="suggestion-item">
                    <p className="suggestion-text">{suggestion.text}</p>
                    <button 
                      onClick={() => handleDeleteSuggestion(suggestion._id)}
                      className="delete-suggestion-button"
                      title="Delete suggestion"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="suggestions-placeholder">No suggestions yet. Click "GET SUGGESTION" to get AI-powered care tips!</p>
              )}
            </div>
          </div>

          <div className="plant-chat pixel-card">
            <h3 className="pixel-text">CHAT WITH AI</h3>
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <p className="chat-placeholder">Ask me anything about your plant!</p>
              ) : (
                chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}>
                    <p className="chat-text">{msg.text}</p>
                  </div>
                ))
              )}
              {loadingChat && (
                <div className="chat-message ai-message">
                  <p className="chat-text">Thinking...</p>
                </div>
              )}
            </div>
            <form onSubmit={handleChatSend} className="chat-form">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your question..."
                className="chat-input pixel-input"
                disabled={loadingChat}
              />
              <button 
                type="submit" 
                className="pixel-button chat-send-button"
                disabled={loadingChat || !chatInput.trim()}
              >
                SEND
              </button>
            </form>
          </div>

          <button onClick={handleDelete} className="pixel-button delete-button">DELETE PLANT</button>
        </div>
      </div>
    </div>
  )
}

export default PlantProfile

