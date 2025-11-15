import { useState } from 'react'
import { motion } from 'framer-motion'

export default function JellyTabs({ tabs, onChange }) {
  const [active, setActive] = useState(0)
  const handle = (i) => {
    setActive(i)
    onChange?.(i)
  }
  return (
    <div className="relative inline-flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-cyan-300/20">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => handle(i)}
          className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors ${i === active ? 'text-cyan-100' : 'text-cyan-300/70 hover:text-cyan-100'}`}
        >
          {t}
        </button>
      ))}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-br from-cyan-400/30 to-indigo-500/30 shadow-inner"
        layout
        initial={false}
        animate={{ left: `${active * 100}%`, width: `${100 / tabs.length}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
      <div className="absolute inset-0 -z-10 rounded-full bg-cyan-400/10 blur-xl" />
    </div>
  )
}
