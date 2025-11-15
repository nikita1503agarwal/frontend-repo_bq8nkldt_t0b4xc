import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function TideHeatmap({ grid = [[]], onPulse }) {
  const rows = grid.length
  const cols = grid[0]?.length || 0
  const flat = grid.flat()
  const max = useMemo(() => Math.max(1, ...flat), [flat])

  return (
    <div className="relative h-48 w-full p-2 bg-white/5 rounded-xl border border-cyan-300/20 overflow-hidden">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 6 }}>
        {grid.map((row, r) => row.map((v, c) => {
          const intensity = v / max
          return (
            <motion.div
              key={`${r}-${c}`}
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{
                scale: 1,
                opacity: 0.9,
                backgroundColor: `rgba(56,189,248,${0.15 + intensity * 0.6})`,
                boxShadow: `0 0 20px rgba(59,130,246, ${0.2 * intensity})`
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              onUpdate={() => onPulse?.()}
              className="aspect-square rounded-md backdrop-blur-sm"
            />
          )
        }))}
      </div>
      {/* pulse waves */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
