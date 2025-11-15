import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function EelLineChart({ points = [], onSwim }) {
  const bounds = useMemo(() => {
    const xs = points.map(p => p.x)
    const ys = points.map(p => p.y)
    const minX = Math.min(...xs, 0)
    const maxX = Math.max(...xs, 1)
    const minY = Math.min(...ys, 0)
    const maxY = Math.max(...ys, 1)
    return { minX, maxX, minY, maxY }
  }, [points])

  const pathD = useMemo(() => {
    if (!points.length) return ''
    const w = 600, h = 180
    const sx = x => (x - bounds.minX) / (bounds.maxX - bounds.minX || 1) * w
    const sy = y => h - (y - bounds.minY) / (bounds.maxY - bounds.minY || 1) * h
    let d = `M ${sx(points[0].x)} ${sy(points[0].y)}`
    for (let i = 1; i < points.length; i++) {
      const p = points[i]
      d += ` L ${sx(p.x)} ${sy(p.y)}`
    }
    return d
  }, [points, bounds])

  return (
    <div className="relative h-48 w-full p-2 bg-white/5 rounded-xl border border-cyan-300/20 overflow-hidden">
      <svg viewBox="0 0 600 180" className="w-full h-full">
        <defs>
          <linearGradient id="eel" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(34,211,238,0.5)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.6)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={pathD}
          stroke="url(#eel)"
          strokeWidth="4"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          onUpdate={() => onSwim?.()}
        />
        {/* eel head */}
        {points.length > 0 && (
          <motion.circle
            r="6"
            fill="rgba(165,243,252,0.9)"
            stroke="rgba(56,189,248,0.9)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </svg>
      {/* bioluminescent pulses */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: [
          'radial-gradient(circle at 20% 60%, rgba(56,189,248,0.08), transparent 30%)',
          'radial-gradient(circle at 80% 40%, rgba(99,102,241,0.08), transparent 35%)',
          'radial-gradient(circle at 20% 60%, rgba(56,189,248,0.08), transparent 30%)'
        ] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
