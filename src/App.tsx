import { useState } from 'react'
import Spline from '@splinetool/react-spline'

const SCENE_URL = 'https://prod.spline.design/PtxdoKRiTEQr4Smp/scene.splinecode'

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <div className="scene-container">
        {!loaded && <div className="loader" aria-label="Loading" />}
        <Spline
          scene={SCENE_URL}
          renderOnDemand
          style={{
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
          onLoad={() => setLoaded(true)}
        />
      </div>
      {/* Real scrollable page height: Spline's Scroll event reads window
          scroll, which touch devices can only produce if the page scrolls */}
      <div className="scroll-space" aria-hidden="true" />
    </>
  )
}

export default App
