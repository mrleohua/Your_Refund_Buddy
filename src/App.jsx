import React, { useEffect } from 'react'
import YourRefundBuddyChat from './components/YourRefundBuddyChat.jsx'
import { motion, useAnimationControls } from 'framer-motion'

function FistCrush() {
  const controls = useAnimationControls()

  useEffect(() => {
    let cancelled = false

    const loop = async () => {
      while (!cancelled) {
        // Raise fist above the ATO pill
        await controls.start({ y: -180, transition: { duration: 0.3 } })
        // Drop/crush
        await controls.start({ y: 0, transition: { type: 'spring', stiffness: 900, damping: 16 } })
        // Squash the ATO pill
        const atoEl = document.getElementById('ato-pill')
        if (atoEl) {
          atoEl.animate([
            { transform: 'scale(1,1)' },
            { transform: 'scale(1.35,0.6)' },
            { transform: 'scale(1.05,0.95)' },
            { transform: 'scale(1,1)' },
          ], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' })
        }
        // Bounce fist slightly then lift back up
        await controls.start({ y: -30, transition: { type: 'spring', stiffness: 700, damping: 25 } })
        await controls.start({ y: -180, transition: { duration: 0.5 } })
        // Pause between loops
        await new Promise(r => setTimeout(r, 900))
      }
    }
    loop()
    return () => { cancelled = true }
  }, [controls])

  return (
    <div className="fixed top-4 right-4 z-50 select-none">
      <div className="relative flex flex-col items-center">
        {/* Fist above the ATO pill, enlarged 3x */}
        <motion.div
          animate={controls}
          initial={{ y: -180 }}
          className="origin-bottom"
          aria-hidden="true"
        >
          <svg width="120" height="120" viewBox="0 0 64 64" fill="currentColor" className="text-zinc-900 drop-shadow">
            <path d="M10 30c0-6 4-10 10-10h3v-2c0-3 3-6 6-6s6 3 6 6v2h2v-1c0-3 3-5 6-5s6 2 6 5v3c3 1 5 4 5 7v8c0 10-8 18-18 18H26C17 55 10 48 10 39v-9z"/>
            <rect x="14" y="28" width="8" height="6" rx="2"/>
            <rect x="26" y="22" width="8" height="6" rx="2"/>
            <rect x="38" y="22" width="8" height="6" rx="2"/>
          </svg>
        </motion.div>

        {/* ATO pill target (enlarged to match fist) */}
        <div id="ato-pill" className="mt-1 rounded-full bg-white/80 backdrop-blur ring-1 ring-zinc-200 px-5 py-2 text-sm font-bold text-zinc-700 shadow-sm">
          ATO
        </div>
      </div>
      <div className="text-[10px] text-white/80 mt-1 text-right pr-1">auto‑smash</div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#5E8AB4] text-zinc-900">
      <FistCrush />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <YourRefundBuddyChat />
      </div>
    </div>
  )
}
