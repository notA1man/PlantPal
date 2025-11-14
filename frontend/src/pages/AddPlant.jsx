import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FaLeaf } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import './AddPlant.css'

function AddPlant({ user, showNotification }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/plants', { name, type, notes }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('Plant added successfully!', 'success')
      navigate('/dashboard')
    } catch (error) {
      showNotification('Failed to add plant. Please try again.', 'error')
    }
  }

  return (
    <div className="add-plant-page">
      <nav className="dashboard-nav pixel-border">
        <Link to="/dashboard" className="pixel-text" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" className="nav-logo" /> PLANT PAL
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link pixel-text">BACK</Link>
        </div>
      </nav>

      <div className="add-plant-content">
        <div className="add-plant-form pixel-card">
          <h1 className="pixel-text">ADD NEW PLANT</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Plant Name"
              className="pixel-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Plant Type"
              className="pixel-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
            <textarea
              placeholder="Notes (optional)"
              className="pixel-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
            />
            <button type="submit" className="pixel-button">ADD PLANT</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPlant

