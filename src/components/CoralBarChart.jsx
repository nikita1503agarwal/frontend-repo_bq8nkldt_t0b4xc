import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function CoralBarChart({ data = [], onPulse }) {
  const max = useMemo(() => Math.max(1, ...data.map(d => d.value)), [data])
  return (
    <div className="relative h-48 w-full flex items-end gap-2 p-2 bg-white/5 rounded-xl border border-cyan-300/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-300/10 to-transparent" />
      {data.map((d, i) => {
        const height = Math.max(6, (d.value / max) * 170)
        return (
          <div key={d.label} className="flex-1 flex items-end">
            <motion.div
              layout
              initial={{ height: 6, borderRadius: 12 }}
              animate={{ height, borderRadius: [12, 8, 12] }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              onUpdate={() => onPulse?.()}
              className="relative w-full bg-gradient-to-t from-teal-500/50 via-cyan-400/60 to-emerald-300/70 rounded-xl shadow-inner"
            >
              {/* Branching tips like coral polyps */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-cyan-200/80 shadow" />
              <div className="absolute -top-2 left-1/3 h-1.5 w-1.5 rounded-full bg-emerald-200/80" />
              <div className="absolute -top-2 right-1/4 h-1.5 w-1.5 rounded-full bg-teal-200/80" />
            </motion.div>
          </div>
        )
      })}
      {/* soft ripples */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: [
          'radial-gradient(600px 40px at 20% 110%, rgba(255,255,255,0.05), transparent)',
          'radial-gradient(600px 40px at 80% 120%, rgba(255,255,255,0.08), transparent)',
          'radial-gradient(600px 40px at 20% 110%, rgba(255,255,255,0.05), transparent)'
        ] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
