import { useEffect } from 'react'
import skyBg2 from '../sprites/Sky/Background_1.png'
import skyBg1 from '../sprites/Sky/Background_2.png'
import './SkyBackground.css'

function SkyBackground() {
  useEffect(() => {
    // Preload images
    const img1 = new Image()
    const img2 = new Image()
    img1.src = skyBg1
    img2.src = skyBg2
  }, [])

  return (
    <div className="sky-background">
      <div className="sky-layer sky-layer-1" style={{ backgroundImage: `url(${skyBg1})` }}></div>
      <div className="sky-layer sky-layer-2" style={{ backgroundImage: `url(${skyBg2})` }}></div>
    </div>
  )
}

export default SkyBackground

