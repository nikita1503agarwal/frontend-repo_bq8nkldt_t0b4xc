import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Waves, Fish, BarChart3, LineChart, Ruler, Settings } from 'lucide-react'
import UnderwaterBackground from './components/UnderwaterBackground'
import JellyTabs from './components/JellyTabs'
import CoralBarChart from './components/CoralBarChart'
import EelLineChart from './components/EelLineChart'
import TideHeatmap from './components/TideHeatmap'

function App() {
  const [burst, setBurst] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})

  const barData = useMemo(() => (
    [
      { label: 'A', value: 12 },
      { label: 'B', value: 33 },
      { label: 'C', value: 18 },
      { label: 'D', value: 44 },
      { label: 'E', value: 26 },
    ]
  ), [])

  const eelPoints = useMemo(() => (
    Array.from({ length: 24 }, (_, i) => ({ x: i, y: Math.sin(i / 3) * 10 + 20 + (Math.random() * 4 - 2) }))
  ), [])

  const heat = useMemo(() => (
    Array.from({ length: 6 }, () => Array.from({ length: 12 }, () => Math.random() * 100))
  ), [])

  const triggerLoad = async () => {
    setLoading(true)
    setBurst(b => b + 6) // trigger micro-creatures swim
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#04131c] text-cyan-50">
      <UnderwaterBackground burst={burst} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400/30 to-indigo-500/30 backdrop-blur-md border border-cyan-300/30 flex items-center justify-center">
            <Waves className="text-cyan-200" size={22} />
          </div>
          <div>
            <div className="text-cyan-100 font-semibold tracking-wide">Advanced Data Analysis</div>
            <div className="text-cyan-300/60 text-xs">Bio-lab • Living Ocean Intelligence</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={triggerLoad} className="relative px-4 py-2 rounded-full bg-cyan-900/40 border border-cyan-300/20 backdrop-blur-md text-cyan-100 hover:bg-cyan-800/40 active:scale-[0.98] transition group">
            Refresh Data
            <motion.span
              className="absolute -inset-0.5 rounded-full"
              initial={{ boxShadow: '0 0 0px rgba(34,211,238,0.0)' }}
              whileTap={{ boxShadow: '0 0 20px rgba(34,211,238,0.6)' }}
            />
            <BubbleEmitter active />
          </button>
          <button className="px-3 py-2 rounded-full bg-cyan-900/30 border border-cyan-300/20 backdrop-blur-md text-cyan-200 hover:bg-cyan-800/30">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 p-6">
        {/* Kelp filter panel */}
        <div>
          <div className="sticky top-6">
            <div className="relative">
              <div className="absolute -left-10 top-0 bottom-0 w-10 bg-gradient-to-b from-cyan-400/10 to-transparent blur-2xl animate-kelp-sway" />
            </div>
            <div className="rounded-3xl border border-cyan-300/20 bg-cyan-950/30 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4 text-cyan-100">
                <Ruler size={16} className="text-cyan-300" /> Filters
              </div>
              <KelpFilters onChange={setFilters} />
            </div>
          </div>
        </div>

        {/* Dashboard area */}
        <div className="space-y-6">
          {/* Tabs like jellyfish bells */}
          <div className="flex items-center justify-between">
            <JellyTabs tabs={["Overview", "Biometrics", "Currents"]} onChange={() => setBurst(b => b + 2)} />
            <div className="text-cyan-300/70 text-sm flex items-center gap-2">
              <Sparkles size={16} /> ambient intelligence online
            </div>
          </div>

          {/* Cards as water capsules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WaterCapsule title="Coral Growth Index" icon={<BarChart3 size={16} />}>
              <CoralBarChart data={barData} onPulse={() => setBurst(b => b + 0.02)} />
            </WaterCapsule>
            <WaterCapsule title="Eel Signal Drift" icon={<LineChart size={16} />}>
              <EelLineChart points={eelPoints} onSwim={() => setBurst(b => b + 0.02)} />
            </WaterCapsule>
            <WaterCapsule title="Bioluminescent Tide" icon={<Fish size={16} />}>
              <TideHeatmap grid={heat} onPulse={() => setBurst(b => b + 0.02)} />
            </WaterCapsule>
          </div>

          {/* Large capsule */}
          <WaterCapsule title="Oceanic Narrative" icon={<Sparkles size={16} />}>
            <div className="h-56 flex items-center justify-center text-cyan-200/80">
              Adaptive insights weaving through currents and colonies.
            </div>
          </WaterCapsule>
        </div>
      </main>

      {/* Loading nano-fish */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-20"
          >
            <NanoFish />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function WaterCapsule({ title, icon, children }) {
  return (
    <div className="relative rounded-3xl border border-cyan-300/20 bg-cyan-950/30 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_60px_at_50%_-20%,rgba(255,255,255,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(600px_30px_at_10%_120%,rgba(255,255,255,0.06),transparent)] animate-ripple-slow" />
      </div>
      <div className="relative p-4 border-b border-cyan-300/10 flex items-center gap-2 text-cyan-100">
        <div className="text-cyan-300">{icon}</div>
        <div className="font-medium tracking-wide">{title}</div>
      </div>
      <div className="relative p-3">
        {children}
      </div>
    </div>
  )
}

function BubbleEmitter({ active }) {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: 0, x: 0, opacity: 0 }}
          whileTap={{ y: -30 - i * 6, x: (Math.random() - 0.5) * 20, opacity: 1 }}
          className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300/80 shadow"
        />
      ))}
    </span>
  )
}

function NanoFish() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-4 rounded-full bg-gradient-to-r from-indigo-400/70 to-cyan-300/70 shadow"
          initial={{ x: -40, y: Math.random() * window.innerHeight, opacity: 0 }}
          animate={{ x: window.innerWidth + 40, y: `calc(${Math.random() * 100}% - 40px)`, opacity: [0, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.6 }}
        />
      ))}
    </div>
  )
}

export default App
