import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaLeaf, FaRobot } from 'react-icons/fa'
import logoImg from '../sprites/logo.png'
import './AIPlantDoctor.css'

function AIPlantDoctor({ user, showNotification }) {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [diagnosis, setDiagnosis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDiagnose = async () => {
    if (!image) {
      showNotification('Please select an image first', 'error')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('image', image)

      const res = await axios.post('/api/ai/diagnose', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setDiagnosis(res.data.diagnosis)
      showNotification('Diagnosis complete!', 'success')
    } catch (error) {
      showNotification('Failed to diagnose plant. Please check your API key and try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-doctor-page">
      <nav className="dashboard-nav pixel-border">
        <Link to="/dashboard" className="pixel-text" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src={logoImg} alt="PlantPal Logo" className="nav-logo" /> PLANT PAL
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link pixel-text">BACK</Link>
        </div>
      </nav>

      <div className="ai-doctor-content">
        <div className="ai-doctor-form pixel-card">
          <h1 className="pixel-text"><FaRobot className="icon" /> AI PLANT DOCTOR</h1>
          <p className="ai-doctor-subtitle">Upload an image of your plant for diagnosis</p>

          <div className="image-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="pixel-button file-label">
              SELECT IMAGE
            </label>

            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}

            <button
              onClick={handleDiagnose}
              className="pixel-button diagnose-button"
              disabled={loading || !image}
            >
              {loading ? 'DIAGNOSING...' : 'DIAGNOSE PLANT'}
            </button>
          </div>

          {diagnosis && (
            <div className="diagnosis-result pixel-card">
              <h2 className="pixel-text">DIAGNOSIS RESULT</h2>
              <div className="diagnosis-text">
                {diagnosis.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIPlantDoctor

