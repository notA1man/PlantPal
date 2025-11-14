import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaLeaf } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import './Feedback.css'

function Feedback({ showNotification }) {
  const [feedback, setFeedback] = useState({
    rating: '',
    category: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!feedback.rating || !feedback.message) {
      showNotification('Please provide a rating and feedback message', 'error')
      return
    }
    showNotification('Thank you for your feedback! We appreciate your input.', 'success')
    setFeedback({ rating: '', category: '', message: '' })
  }

  const handleChange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="feedback-page">
      <nav className="dashboard-nav pixel-border">
        <Link to="/dashboard" className="pixel-text" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" className="nav-logo" /> PLANT PAL
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link pixel-text">BACK</Link>
        </div>
      </nav>

      <div className="feedback-content">
        <div className="feedback-form pixel-card">
          <h1 className="pixel-title">FEEDBACK</h1>
          <p className="feedback-subtitle">Help us improve PlantPal by sharing your thoughts!</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Rating *</label>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    className={`rating-button ${feedback.rating === rating.toString() ? 'active' : ''}`}
                    onClick={() => setFeedback({...feedback, rating: rating.toString()})}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="pixel-input"
                value={feedback.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="improvement">Improvement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Your Feedback *</label>
              <textarea
                name="message"
                placeholder="Tell us what you think..."
                className="pixel-input"
                value={feedback.message}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <button type="submit" className="pixel-button">SUBMIT FEEDBACK</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Feedback

