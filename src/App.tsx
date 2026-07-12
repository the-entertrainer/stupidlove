import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const SCENE_URL = 'https://prod.spline.design/PtxdoKRiTEQr4Smp/scene.splinecode'

/* The Spline runtime advances this scene's Scroll event one step per wheel
   EVENT (sign of deltaY only). Touch devices never fire wheel events, so we
   translate scrolled distance into synthetic ones. ~15px per step lets a
   full scroll of the track comfortably complete the animation. */
const PX_PER_STEP = 15

/* Approx. wheel steps to traverse the whole animation, used to pace the
   hint fades on desktop (where the page itself does not scroll). */
const DESKTOP_FULL_STEPS = 160

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/* smooth 0→1 ramp between edges a and b */
const ramp = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

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

/* Scroll progress [0,1] for the text hints. On touch this is the page scroll
   fraction; on desktop the page doesn't scroll, so we count real wheel ticks. */
function useScrollProgress(enabled: boolean) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let raf = 0

    if (window.matchMedia('(pointer: coarse)').matches) {
      const onScroll = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          const el = document.scrollingElement
          const max = el ? el.scrollHeight - window.innerHeight : 0
          setProgress(max > 0 ? clamp01(window.scrollY / max) : 0)
        })
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
        cancelAnimationFrame(raf)
      }
    }

    let counter = 0
    const onWheel = (e: WheelEvent) => {
      counter = Math.min(DESKTOP_FULL_STEPS, Math.max(0, counter + (e.deltaY > 0 ? 1 : -1)))
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setProgress(counter / DESKTOP_FULL_STEPS))
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  return progress
}

function App() {
  const [loaded, setLoaded] = useState(false)
  useTouchScrollToWheel(loaded)
  const progress = useScrollProgress(loaded)

  /* Top hint fades out early as the journey begins; the P.S. drifts in near
     the end, once you've "found" the lovers. */
  const topOpacity = loaded ? 1 - ramp(0, 0.12, progress) : 0
  const psOpacity = loaded ? ramp(0.72, 0.96, progress) : 0

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
        <div
          className="hint hint-top"
          style={{ opacity: topOpacity }}
          aria-hidden={topOpacity < 0.05}
        >
          Scroll till you find us
        </div>
        <div
          className="hint hint-ps"
          style={{ opacity: psOpacity }}
          aria-hidden={psOpacity < 0.05}
        >
          P.S. just tell me if it's cool :P
        </div>
      </div>
    </div>
  )
}

export default App
