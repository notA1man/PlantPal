import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaLeaf, FaEnvelope, FaComments } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import './Contact.css'

function Contact({ showNotification }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      showNotification('Please fill in all required fields', 'error')
      return
    }
    showNotification('Thank you for your message! We will get back to you soon.', 'success')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="contact-page">
      <nav className="dashboard-nav pixel-border">
        <Link to="/dashboard" className="pixel-text" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" className="nav-logo" /> PLANT PAL
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link pixel-text">BACK</Link>
        </div>
      </nav>

      <div className="contact-content">
        <div className="contact-form pixel-card">
          <h1 className="pixel-title">CONTACT US</h1>
          <p className="contact-subtitle">Have a question? We'd love to hear from you!</p>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="pixel-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="pixel-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject (optional)"
              className="pixel-input"
              value={formData.subject}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              className="pixel-input"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
            />
            <button type="submit" className="pixel-button">SEND MESSAGE</button>
          </form>
        </div>

        <div className="contact-info pixel-card">
          <h2 className="pixel-text">GET IN TOUCH</h2>
          <div className="info-item">
            <h3><FaEnvelope className="icon" /> Email</h3>
            <p>support@plantpal.com</p>
          </div>
          <div className="info-item">
            <h3><FaComments className="icon" /> Support</h3>
            <p>Available 24/7 for your plant care needs</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

