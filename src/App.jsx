import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import {
  Terminal, Shield, Heart, Lightbulb, HelpCircle, ThumbsDown,
  Volume2, VolumeX, Award, BookOpen, Briefcase, ExternalLink,
  Mail, Maximize2, Minimize2, Server, Cpu,
  CheckCircle2, Lock, Sparkles
} from 'lucide-react'

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_mPqmK2pVhoDlErdvRKrUDNWWByfs1OQ",
  authDomain: "charla-hardening-demo.firebaseapp.com",
  projectId: "charla-hardening-demo",
  storageBucket: "charla-hardening-demo.firebasestorage.app",
  messagingSenderId: "104199378602",
  appId: "1:104199378602:web:287cc58cf63fb9647962d3",
  measurementId: "G-VW05PPL833"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Import styles and assets
import './App.css'
import yoImg from './assets/yo.jpg'
import logoImg from './assets/1Asset 4@4x.png'

function App() {
  // --- STATE ---
  const [votes, setVotes] = useState({ love: 0, interest: 0, confuse: 0, dislike: 0 })

  // --- FIRESTORE SYNC ---
  useEffect(() => {
    const votesRef = doc(db, 'polls', 'charlaaws');
    const unsubscribe = onSnapshot(votesRef, (docSnap) => {
      if (docSnap.exists()) {
        setVotes(docSnap.data());
      } else {
        // Inicializar si el documento no existe
        setDoc(votesRef, { love: 0, interest: 0, confuse: 0, dislike: 0 });
      }
    });

    return () => unsubscribe();
  }, []);

  const [presenterMode, setPresenterMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activePipelineStep, setActivePipelineStep] = useState(0)
  const [currentUrl, setCurrentUrl] = useState('https://charlaaws.levosolution.com')

  // --- AUDIO SYNTH (Web Audio API) ---
  const audioCtxRef = useRef(null)

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
  }

  const playSound = (type) => {
    if (!soundEnabled) return
    try {
      initAudio()
      const ctx = audioCtxRef.current
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'love') {
        // Double retro coin chime (E5 -> B5)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(659.25, now) // E5
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05)
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15)
        
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(987.77, now + 0.1) // B5
        gain2.gain.setValueAtTime(0, now + 0.1)
        gain2.gain.linearRampToValueAtTime(0.15, now + 0.15)
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
        
        osc.start(now)
        osc.stop(now + 0.2)
        osc2.start(now + 0.1)
        osc2.stop(now + 0.5)

      } else if (type === 'interest') {
        // Rising synth chime
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(440, now) // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3) // A5
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.45)

      } else if (type === 'confuse') {
        // Bending sweep (wobble)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(300, now)
        osc.frequency.linearRampToValueAtTime(450, now + 0.15)
        osc.frequency.linearRampToValueAtTime(250, now + 0.4)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.linearRampToValueAtTime(0.15, now + 0.2)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.45)

      } else if (type === 'dislike') {
        // Low bass drop
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(120, now)
        osc.frequency.linearRampToValueAtTime(40, now + 0.5)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
        osc.start(now)
        osc.stop(now + 0.65)
      }
    } catch (err) {
      console.warn("Web Audio Blocked or Not Supported: ", err)
    }
  }

  // --- CONFETTI & PARTICLES ---
  const triggerConfetti = (type) => {
    if (type === 'love') {
      // Massive explosion from the center
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#619eff', '#ff9900', '#ffffff', '#eab308']
      })
    } else if (type === 'interest') {
      // Firework chimes from sides
      const duration = 1.5 * 1000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#619eff', '#a855f7', '#3b82f6']
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#619eff', '#a855f7', '#3b82f6']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    } else if (type === 'confuse') {
      // Star showers
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#ff9900', '#fbbf24', '#f59e0b'],
        scalar: 1.2
      })
    } else if (type === 'dislike') {
      // Red rain drops
      const duration = 0.5 * 1000
      const end = Date.now() + duration

      const rain = () => {
        confetti({
          particleCount: 2,
          angle: 270,
          spread: 15,
          velocity: 15,
          origin: { y: 0.2 },
          colors: ['#ef4444', '#7f1d1d', '#991b1b']
        })
        if (Date.now() < end) {
          requestAnimationFrame(rain)
        }
      }
      rain()
    }
  }

  // --- CAST VOTE ---
  const handleVote = async (type) => {
    playSound(type)
    triggerConfetti(type)
    
    // Incremento atómico en Firestore
    const voteRef = doc(db, 'polls', 'charlaaws');
    await setDoc(voteRef, {
      [type]: increment(1)
    }, { merge: true });
  }

  // --- RESET VOTES (SecOps Password Check) ---
  const handleReset = async () => {
    const password = prompt("Ingrese la contraseña de seguridad (DevSecOps):")
    if (password === 'ReX0908!!') {
      const reseted = { love: 0, interest: 0, confuse: 0, dislike: 0 }
      const voteRef = doc(db, 'polls', 'charlaaws');
      await setDoc(voteRef, reseted)
      alert("Contadores reseteados correctamente en Firestore.")
    } else if (password !== null) {
      alert("Acceso denegado: Firma de seguridad inválida 🔒")
    }
  }

  // --- DETECT CURRENT URL ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Include port if running locally
      setCurrentUrl(window.location.href)
    }
  }, [])

  // --- DEVOPS PIPELINE TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePipelineStep(prev => (prev + 1) % 5)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // --- CANVAS PARTICLE BACKGROUND ---
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: null, y: null, radius: 120 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Handle mouse move
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.x
      mouseRef.current.y = e.y
    }
    const handleMouseLeave = () => {
      mouseRef.current.x = null
      mouseRef.current.y = null
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Setup particles
    const particles = []
    const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000))
    
    // Brand Colors for particles
    const colors = [
      'rgba(97, 158, 255, 0.4)', // Levo Blue
      'rgba(255, 153, 0, 0.3)', // AWS Orange
      'rgba(57, 57, 120, 0.4)',  // Levo Indigo
      'rgba(255, 255, 255, 0.2)' // White/Soft
    ]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.005)'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      particles.forEach((p, idx) => {
        // Move particle
        p.x += p.speedX
        p.y += p.speedY

        // Bounce on boundaries
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1

        // Mouse interaction (repel)
        if (mouseRef.current.x !== null) {
          const dx = mouseRef.current.x - p.x
          const dy = mouseRef.current.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - dist) / mouseRef.current.radius
            const angle = Math.atan2(dy, dx)
            p.x -= Math.cos(angle) * force * 1.5
            p.y -= Math.sin(angle) * force * 1.5
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = p.size * 2
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0 // reset shadow

        // Connect particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            const opacity = (120 - dist) / 120 * 0.15
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(97, 158, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // --- STATS HELPER ---
  const totalVotes = votes.love + votes.interest + votes.confuse + votes.dislike
  const getPercentage = (count) => {
    if (totalVotes === 0) return 0
    return Math.round((count / totalVotes) * 100)
  }

  // Generate QR Code URL
  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=0b0f19&data=${encodeURIComponent(currentUrl)}`

  // Pipeline steps definition
  const pipelineSteps = [
    { name: 'Git Commit', tool: 'gitlab-ci', status: 'success' },
    { name: 'Sast Scan', tool: 'semgrep', status: 'success' },
    { name: 'Terraform Plan', tool: 'iac-aws', status: 'active' },
    { name: 'EC2 Provision', tool: 'ansible', status: 'pending' },
    { name: 'Hardening Audit', tool: 'cis-bench', status: 'pending' }
  ]

  return (
    <div className="app-container animate-slide-up">
      {/* Background Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <header className="app-header">
        <div className="brand-title">
          <img src={logoImg} alt="Levosolution Logo" className="brand-logo-img" />
          <span>Dario MS. | DevOps</span>
        </div>
        <div className="header-controls">
          {/* Sound Toggle */}
          <button 
            className="sound-toggle" 
            onClick={() => {
              setSoundEnabled(!soundEnabled)
              initAudio()
            }}
            title={soundEnabled ? "Silenciar sonidos" : "Activar sonidos"}
          >
            {soundEnabled ? <Volume2 size={20} className="text-levo-blue" /> : <VolumeX size={20} className="text-muted" />}
          </button>
          
          {/* Presenter Mode Toggle */}
          <button className="btn-presenter" onClick={() => setPresenterMode(true)}>
            <Maximize2 size={16} />
            <span>Modo Proyector</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-grid">
        
        {/* Left Column: Profile Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Bio Glass Card */}
          <div className="profile-card glass-panel">
            <div className="avatar-container">
              <div className="avatar-ring"></div>
              <img src={yoImg} alt="Dario Michel Siñani Duran" className="avatar-image" />
            </div>

            <h2 className="profile-name">Dario M. Siñani Duran</h2>
            <div className="profile-age-badge">24 años • Cloud Practitioner</div>

            <div className="tag-list">
              <span className="tag-badge devops">DevOps</span>
              <span className="tag-badge security">DevSecOps Aspirant</span>
              <span className="tag-badge aws">AWS</span>
            </div>

            <div className="profile-bio">
              <p>
                🎓 Estudiante destacado en la <strong>Universidad Mayor, Real y Pontificia de San Francisco Xavier de Chuquisaca (USFX)</strong>.
              </p>
              <p>
                ⚡ A muy pocos meses de graduarme de las carreras de <strong>Ingeniería de Sistemas</strong> y <strong>Tecnologías de la Información y Seguridad</strong>.
              </p>
              <p>
                ☁️ Apasionado por la arquitectura cloud, la automatización de infraestructura, la seguridad en contenedores y las prácticas de despliegue continuo.
              </p>
            </div>

            <div className="startup-section">
              <div className="startup-logo-container">
                <img src={logoImg} alt="Levo Logo" className="startup-logo" />
              </div>
              <div className="startup-info">
                <h4>levosolution</h4>
                <p>Co-Founder & DevOps Engineer</p>
              </div>
            </div>
          </div>

          {/* Simulated DevOps Pipeline Visualizer */}
          <div className="pipeline-card glass-panel">
            <div className="pipeline-title">
              <Shield size={18} />
              <span>CI/CD & Hardening Pipeline</span>
            </div>
            <div className="pipeline-flow">
              {pipelineSteps.map((step, idx) => {
                let isCurrent = idx === activePipelineStep
                let isPassed = idx < activePipelineStep
                
                return (
                  <div 
                    key={idx} 
                    className={`pipeline-step ${isCurrent ? 'active' : ''} ${isPassed ? 'success' : ''}`}
                  >
                    <div className="pipeline-dot"></div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 600, color: isCurrent ? 'var(--levo-blue)' : (isPassed ? '#22c55e' : 'var(--text-secondary)') }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        stage: {step.tool}
                      </div>
                    </div>
                    {isPassed && <CheckCircle2 size={16} className="text-green-500" style={{ color: '#22c55e' }} />}
                    {isCurrent && <Sparkles size={16} className="text-levo-blue animate-float" style={{ color: 'var(--levo-blue)' }} />}
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Talk Feedback & Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quote Block */}
          <div className="quote-panel glass-panel">
            <span className="quote-icon">"</span>
            <div className="quote-text">
              "Todo lo que puedes soñar lo puedes hacer, pero es paso a paso."
            </div>
            <div className="quote-author">Dario MS. / DevOps Mindset</div>
          </div>

          {/* Talk card and Interactive Feedback */}
          <div className="talk-card glass-panel">
            <span className="talk-badge-top">
              <Server size={14} style={{ marginRight: '0.2rem' }} />
              AWS Talk Hardening EC2
            </span>
            <h1 className="talk-title">
              Tu primera instancia EC2: Despliegue práctico y hardening básico
            </h1>
            <p className="talk-subtitle">
              ¡Muchas gracias por asistir! Por favor, califica qué te pareció la charla haciendo click en una opción.
            </p>

            {/* Feedback Buttons */}
            <div className="feedback-grid">
              <button 
                className="feedback-btn feedback-btn-love"
                onClick={() => handleVote('love')}
              >
                <span className="feedback-emoji">😍</span>
                <span className="feedback-label">Me encantó</span>
              </button>

              <button 
                className="feedback-btn feedback-btn-interest"
                onClick={() => handleVote('interest')}
              >
                <span className="feedback-emoji">💡</span>
                <span className="feedback-label">Me interesó</span>
              </button>

              <button 
                className="feedback-btn feedback-btn-confuse"
                onClick={() => handleVote('confuse')}
              >
                <span className="feedback-emoji">😕</span>
                <span className="feedback-label">No la entendí</span>
              </button>

              <button 
                className="feedback-btn feedback-btn-dislike"
                onClick={() => handleVote('dislike')}
              >
                <span className="feedback-emoji">👎</span>
                <span className="feedback-label">No me gustó</span>
              </button>
            </div>

            {/* Results Live Chart */}
            <div className="results-section">
              <div className="results-header">
                <h3 className="results-title">
                  <Cpu size={18} className="text-levo-blue" style={{ color: 'var(--levo-blue)' }} />
                  Resultados en Tiempo Real
                </h3>
                <span className="total-votes">Total: {totalVotes} votos</span>
              </div>

              <div className="chart-container">
                {/* Me encantó bar */}
                <div className="chart-row">
                  <div className="chart-info">
                    <span className="chart-label">😍 Me encantó</span>
                    <div className="chart-values">
                      <span className="chart-percentage">{getPercentage(votes.love)}%</span>
                      <span>({votes.love})</span>
                    </div>
                  </div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill" 
                      style={{ 
                        width: `${getPercentage(votes.love)}%`,
                        '--bar-color': '#22c55e',
                        '--bar-color-glow': 'rgba(34, 197, 94, 0.4)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Me interesó bar */}
                <div className="chart-row">
                  <div className="chart-info">
                    <span className="chart-label">💡 Me interesó</span>
                    <div className="chart-values">
                      <span className="chart-percentage">{getPercentage(votes.interest)}%</span>
                      <span>({votes.interest})</span>
                    </div>
                  </div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill" 
                      style={{ 
                        width: `${getPercentage(votes.interest)}%`,
                        '--bar-color': 'var(--levo-blue)',
                        '--bar-color-glow': 'rgba(97, 158, 255, 0.4)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* No la entendí bar */}
                <div className="chart-row">
                  <div className="chart-info">
                    <span className="chart-label">😕 No la entendí</span>
                    <div className="chart-values">
                      <span className="chart-percentage">{getPercentage(votes.confuse)}%</span>
                      <span>({votes.confuse})</span>
                    </div>
                  </div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill" 
                      style={{ 
                        width: `${getPercentage(votes.confuse)}%`,
                        '--bar-color': 'var(--aws-orange)',
                        '--bar-color-glow': 'rgba(255, 153, 0, 0.4)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* No me gustó bar */}
                <div className="chart-row">
                  <div className="chart-info">
                    <span className="chart-label">👎 No me gustó</span>
                    <div className="chart-values">
                      <span className="chart-percentage">{getPercentage(votes.dislike)}%</span>
                      <span>({votes.dislike})</span>
                    </div>
                  </div>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill" 
                      style={{ 
                        width: `${getPercentage(votes.dislike)}%`,
                        '--bar-color': '#ef4444',
                        '--bar-color-glow': 'rgba(239, 68, 68, 0.4)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button className="btn-reset" onClick={handleReset}>
                  <Lock size={12} style={{ marginRight: '0.3rem', display: 'inline' }} />
                  Resetear Resultados
                </button>
              </div>
            </div>
          </div>

          {/* QR Code and mobile voting instructions */}
          <div className="qr-card glass-panel">
            <div className="qr-info">
              <h3>Vota en Vivo desde tu Celular</h3>
              <p>Escanea este código QR con la cámara de tu teléfono para acceder a esta página en vivo, dar tu feedback y ver tu voto reflejado instantáneamente en la pantalla.</p>
            </div>
            <div className="qr-image-container">
              <img 
                src={qrCodeSrc} 
                alt="QR de la charla" 
                className="qr-image" 
                crossOrigin="anonymous"
              />
            </div>
          </div>

        </div>

      </main>

      {/* Presenter Mode Overlay (Projector view) */}
      {presenterMode && (
        <div className="presenter-overlay">
          <div className="presenter-header">
            <div className="presenter-title-group">
              <h2>Feedback en Vivo de la Charla</h2>
              <p>Tema: "Tu primera instancia EC2: Despliegue práctico y hardening básico"</p>
            </div>
            <button className="btn-close-presenter" onClick={() => setPresenterMode(false)}>
              <Minimize2 size={16} style={{ marginRight: '0.4rem', display: 'inline' }} />
              Cerrar Vista Proyector
            </button>
          </div>

          <div className="presenter-body">
            
            {/* Live Chart Expanded */}
            <div className="presenter-chart-container">
              
              {/* Me encantó */}
              <div className="presenter-chart-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="presenter-chart-label">😍 Me encantó</span>
                  <div className="presenter-chart-values">
                    <strong style={{ color: '#22c55e', fontSize: '1.8rem' }}>{getPercentage(votes.love)}%</strong>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({votes.love} votos)</span>
                  </div>
                </div>
                <div className="chart-bar-bg presenter-chart-bar-bg">
                  <div 
                    className="chart-bar-fill" 
                    style={{ 
                      width: `${getPercentage(votes.love)}%`,
                      '--bar-color': '#22c55e',
                      '--bar-color-glow': 'rgba(34, 197, 94, 0.5)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Me interesó */}
              <div className="presenter-chart-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="presenter-chart-label">💡 Me interesó</span>
                  <div className="presenter-chart-values">
                    <strong style={{ color: 'var(--levo-blue)', fontSize: '1.8rem' }}>{getPercentage(votes.interest)}%</strong>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({votes.interest} votos)</span>
                  </div>
                </div>
                <div className="chart-bar-bg presenter-chart-bar-bg">
                  <div 
                    className="chart-bar-fill" 
                    style={{ 
                      width: `${getPercentage(votes.interest)}%`,
                      '--bar-color': 'var(--levo-blue)',
                      '--bar-color-glow': 'rgba(97, 158, 255, 0.5)'
                    }}
                  ></div>
                </div>
              </div>

              {/* No la entendí */}
              <div className="presenter-chart-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="presenter-chart-label">😕 No la entendí</span>
                  <div className="presenter-chart-values">
                    <strong style={{ color: 'var(--aws-orange)', fontSize: '1.8rem' }}>{getPercentage(votes.confuse)}%</strong>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({votes.confuse} votos)</span>
                  </div>
                </div>
                <div className="chart-bar-bg presenter-chart-bar-bg">
                  <div 
                    className="chart-bar-fill" 
                    style={{ 
                      width: `${getPercentage(votes.confuse)}%`,
                      '--bar-color': 'var(--aws-orange)',
                      '--bar-color-glow': 'rgba(255, 153, 0, 0.5)'
                    }}
                  ></div>
                </div>
              </div>

              {/* No me gustó */}
              <div className="presenter-chart-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="presenter-chart-label">👎 No me gustó</span>
                  <div className="presenter-chart-values">
                    <strong style={{ color: '#ef4444', fontSize: '1.8rem' }}>{getPercentage(votes.dislike)}%</strong>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({votes.dislike} votos)</span>
                  </div>
                </div>
                <div className="chart-bar-bg presenter-chart-bar-bg">
                  <div 
                    className="chart-bar-fill" 
                    style={{ 
                      width: `${getPercentage(votes.dislike)}%`,
                      '--bar-color': '#ef4444',
                      '--bar-color-glow': 'rgba(239, 68, 68, 0.5)'
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Total acumulado: {totalVotes} respuestas
                </span>
                <button className="btn-reset" onClick={handleReset}>
                  <Lock size={12} style={{ marginRight: '0.3rem', display: 'inline' }} />
                  Resetear
                </button>
              </div>

            </div>

            {/* QR code and url instructions */}
            <div className="presenter-qr-container">
              <div className="presenter-qr-img-box">
                <img 
                  src={qrCodeSrc} 
                  alt="QR para votar" 
                  crossOrigin="anonymous"
                />
              </div>
              <h3>¡Escanea para Votar!</h3>
              <p>Usa la cámara de tu celular y participa en tiempo real.</p>
              <div style={{
                marginTop: '1rem', 
                fontSize: '0.9rem', 
                fontFamily: 'var(--font-mono)', 
                background: 'rgba(0,0,0,0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                wordBreak: 'break-all'
              }}>
                {currentUrl}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-socials">
          <a href="https://github.com/Dario-M-Sinani" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg className="social-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '0.4rem' }}>
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/dario-michel-siñani-duran-20b1b315b" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg className="social-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '0.4rem' }}>
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>
        <p>© 2026 Dario Michel Siñani Duran. Diseñado y construido con React + AWS + Levosolution branding.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          Tecnologías de la Información y Seguridad | Ingeniería de Sistemas | USFX
        </p>
      </footer>
    </div>
  )
}

export default App
