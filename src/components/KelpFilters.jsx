import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function KelpFilters({ onChange }) {
  const [open, setOpen] = useState(true)
  const [filters, setFilters] = useState({ region: 'Pacific', depth: 200, species: 'All' })

  const update = (patch) => {
    const next = { ...filters, ...patch }
    setFilters(next)
    onChange?.(next)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="group pointer-events-auto mb-4 rounded-full px-4 py-2 text-cyan-100/90 bg-cyan-900/40 border border-cyan-300/20 backdrop-blur-md hover:bg-cyan-800/30 active:scale-[0.98] transition"
      >
        Filters
        <span className="ml-2 inline-block group-active:animate-bubble-pop">●</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="pointer-events-auto rounded-2xl border border-cyan-300/20 bg-cyan-950/30 p-4 backdrop-blur-xl w-72"
          >
            <KelpField label="Region">
              <select
                value={filters.region}
                onChange={(e) => update({ region: e.target.value })}
                className="w-full rounded-xl bg-cyan-900/40 text-cyan-100/90 p-2 border border-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 kelp-input"
              >
                <option>Pacific</option>
                <option>Atlantic</option>
                <option>Indian</option>
                <option>Arctic</option>
              </select>
            </KelpField>

            <KelpField label="Depth (m)">
              <input
                type="range"
                min="0"
                max="6000"
                value={filters.depth}
                onChange={(e) => update({ depth: Number(e.target.value) })}
                className="w-full accent-cyan-300 kelp-input"
              />
              <div className="mt-2 text-cyan-200/80 text-sm">{filters.depth} m</div>
            </KelpField>

            <KelpField label="Species">
              <select
                value={filters.species}
                onChange={(e) => update({ species: e.target.value })}
                className="w-full rounded-xl bg-cyan-900/40 text-cyan-100/90 p-2 border border-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 kelp-input"
              >
                <option>All</option>
                <option>Cephalopods</option>
                <option>Crustaceans</option>
                <option>Micro-plankton</option>
              </select>
            </KelpField>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function KelpField({ label, children }) {
  return (
    <div className="mb-4">
      <div className="text-xs uppercase tracking-widest text-cyan-200/60 mb-2">{label}</div>
      <div className="relative group/field">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-cyan-400/10 to-indigo-500/10 blur opacity-0 group-focus-within/field:opacity-100 transition" />
        <div className="relative rounded-2xl p-2 bg-cyan-900/30 border border-cyan-300/20 kelp-wrap">
          {children}
        </div>
      </div>
    </div>
  )
}
