import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const SCENE_URL = 'https://prod.spline.design/PtxdoKRiTEQr4Smp/scene.splinecode'

/* The Spline runtime advances this scene's Scroll event one step per wheel
   EVENT (sign of deltaY only). Touch devices never fire wheel events, so we
   translate scrolled distance into synthetic ones. ~15px per step lets a
   full scroll of the track comfortably complete the animation. */
const PX_PER_STEP = 15

function useTouchScrollToWheel(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !window.matchMedia('(pointer: coarse)').matches) return

    let lastY = window.scrollY
    let carry = 0
    const onScroll = () => {
      const y = window.scrollY
      carry += y - lastY
      lastY = y
      while (Math.abs(carry) >= PX_PER_STEP) {
        const dir = Math.sign(carry)
        window.dispatchEvent(new WheelEvent('wheel', { deltaY: dir * 100, bubbles: true }))
        carry -= dir * PX_PER_STEP
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])
}

function App() {
  const [loaded, setLoaded] = useState(false)
  useTouchScrollToWheel(loaded)

  return (
    <div className="scroll-track">
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
    </div>
  )
}

export default App
