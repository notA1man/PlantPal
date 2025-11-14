import { Link } from 'react-router-dom'
import { FaLeaf, FaRobot, FaCloudSun } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import './AboutUs.css'

function AboutUs() {
  return (
    <div className="about-page">
      <nav className="dashboard-nav pixel-border">
        <Link to="/dashboard" className="pixel-text" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" className="nav-logo" /> PLANT PAL
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link pixel-text">BACK</Link>
        </div>
      </nav>

      <div className="about-content">
        <div className="about-section pixel-card">
          <h1 className="pixel-title">ABOUT US</h1>
          <div className="about-text">
            <p>
              PlantPal is a smart plant care companion designed to help you manage and keep your plants healthy effortlessly. 
              We combine technology with plant care expertise to make gardening accessible to everyone.
            </p>
            <p>
              Our mission is to make plant care simple, fun, and interactive. Whether you're a beginner or an experienced gardener, 
              PlantPal provides the tools you need to succeed.
            </p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-item pixel-card">
            <h3><FaLeaf className="icon" /> Digital Collection</h3>
            <p>Manage all your plants in one place with detailed profiles and care schedules.</p>
          </div>
          <div className="feature-item pixel-card">
            <h3><FaRobot className="icon" /> AI Diagnosis</h3>
            <p>Get instant plant health diagnosis using advanced AI image analysis.</p>
          </div>
          <div className="feature-item pixel-card">
            <h3><FaCloudSun className="icon" /> Weather Insights</h3>
            <p>Receive personalized care suggestions based on real-time weather data.</p>
          </div>
        </div>

        <div className="contact-feedback-section pixel-card">
          <h2 className="pixel-title">GET IN TOUCH</h2>
          <div className="contact-feedback-buttons">
            <Link to="/contact" className="pixel-button">CONTACT US</Link>
            <Link to="/feedback" className="pixel-button">FEEDBACK</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs

