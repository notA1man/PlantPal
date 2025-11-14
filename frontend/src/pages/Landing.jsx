import { Link } from 'react-router-dom'
import { FaLeaf, FaRobot, FaCloudSun } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import './Landing.css'

function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="pixel-title" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" style={{width: '56px', height: '56px', imageRendering: 'pixelated'}} /> PLANT PAL <img src={logoImg} alt="PlantPal Logo" style={{width: '56px', height: '56px', imageRendering: 'pixelated'}} />
        </h1>
        <p className="pixel-subtitle">Smart Plant Care Companion</p>
        <div className="landing-buttons">
          <Link to="/login" className="pixel-button">LOGIN</Link>
          <Link to="/register" className="pixel-button">REGISTER</Link>
        </div>
        <div className="landing-features">
          <div className="feature-card pixel-card">
            <h3><FaLeaf className="icon" /> Digital Plant Collection</h3>
            <p>Manage all your plants in one place</p>
          </div>
          <div className="feature-card pixel-card">
            <h3><FaRobot className="icon" /> AI Plant Doctor</h3>
            <p>Diagnose plant health issues instantly</p>
          </div>
          <div className="feature-card pixel-card">
            <h3><FaCloudSun className="icon" /> Weather Insights</h3>
            <p>Get personalized care suggestions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing

