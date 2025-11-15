import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Drifting plankton + faint light beams
export default function UnderwaterBackground({ burst = 0 }) {
  const canvasRef = useRef(null)
  const creaturesRef = useRef([])
  const burstRef = useRef(burst)

  useEffect(() => {
    burstRef.current = burst
  }, [burst])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrame

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 120 }, () => newPlankton(canvas))

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Subtle blue gradient wash
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
      g.addColorStop(0, 'rgba(0,30,60,0.25)')
      g.addColorStop(1, 'rgba(0,10,25,0.35)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update particles
      particles.forEach(p => {
        p.x += Math.cos(p.t + p.seed) * 0.2 + p.vx
        p.y += Math.sin(p.t * 0.9) * 0.15 + p.vy
        p.t += p.speed
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10
        ctx.beginPath()
        ctx.fillStyle = `hsla(${200 + p.seed * 60}, 70%, ${60 + Math.sin(p.t) * 20}%, ${0.25 + p.alpha})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Micro-creatures swim when data bursts
      creaturesRef.current = creaturesRef.current.filter(c => c.life > 0)
      creaturesRef.current.forEach(c => {
        c.x += c.vx
        c.y += Math.sin(c.t) * 0.8
        c.t += 0.12
        c.life -= 1
        drawCreature(ctx, c)
      })

      // Occasionally spawn extra after burst
      if (burstRef.current > 0 && Math.random() < 0.1) {
        creaturesRef.current.push(newCreature(canvas))
        burstRef.current -= 1
      }

      animationFrame = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Light beams */}
      <div className="absolute inset-0 mix-blend-screen">
        <div className="absolute -left-10 top-0 h-full w-1/3 bg-gradient-to-b from-cyan-300/10 via-transparent to-transparent blur-3xl animate-beam-sway" />
        <div className="absolute left-1/2 top-0 h-full w-1/4 bg-gradient-to-b from-blue-400/10 via-transparent to-transparent blur-2xl animate-beam-sway [animation-delay:1.2s]" />
        <div className="absolute right-0 top-0 h-full w-1/5 bg-gradient-to-b from-indigo-300/10 via-transparent to-transparent blur-2xl animate-beam-slow" />
      </div>
      {/* Plankton canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Caustics overlay */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.05),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.05),transparent_55%)]"
        animate={{ opacity: [0.5, 0.8, 0.5], backgroundPosition: ['0% 0%', '100% 50%', '0% 0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function newPlankton(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    t: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.005,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.2,
    seed: Math.random(),
  }
}

function newCreature(canvas) {
  const fromLeft = Math.random() < 0.5
  return {
    x: fromLeft ? -30 : canvas.width + 30,
    y: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
    vx: fromLeft ? (Math.random() * 1.2 + 0.6) : -(Math.random() * 1.2 + 0.6),
    t: Math.random() * Math.PI * 2,
    life: 600,
    hue: 180 + Math.random() * 80,
    size: Math.random() * 3 + 1,
  }
}

function drawCreature(ctx, c) {
  ctx.save()
  ctx.shadowBlur = 12
  ctx.shadowColor = `hsla(${c.hue},90%,70%,0.8)`
  ctx.strokeStyle = `hsla(${c.hue},90%,70%,0.9)`
  ctx.lineWidth = c.size
  ctx.beginPath()
  ctx.moveTo(c.x, c.y)
  for (let i = 0; i < 6; i++) {
    const px = c.x - i * 6 * Math.sign(c.vx)
    const py = c.y + Math.sin(c.t + i) * 3
    ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.restore()
}
