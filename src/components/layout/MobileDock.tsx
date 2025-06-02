import React, { useState, useEffect, useCallback, useMemo } from 'react'

interface MobileDockProps {
  language: 'it' | 'de'
}

const translations = {
  it: {
    menu: 'Menu',
    call: 'Chiama',
    maps: 'Mappe',
    banchetto: 'Banchetto',
    servizi: 'Ingrosso',
    prodotti: 'Prodotti',
    banchettoPhone: 'Banchetto',
    horecaPhone: 'Ingrosso'
  },
  de: {
    menu: 'Menü',
    call: 'Anrufen',
    maps: 'Karten',
    banchetto: 'Marktstand',
    servizi: 'Großhandel',
    prodotti: 'Produkte',
    banchettoPhone: 'Marktstand',
    horecaPhone: 'Großhandel'
  }
}

const MobileDock: React.FC<MobileDockProps> = ({ language }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isUserLookingForHelp, setIsUserLookingForHelp] = useState(false)
  
  const t = translations[language]

  // 🍎 HAPTIC FEEDBACK INTEGRATO - FUNZIONANTE
  const triggerHaptic = useCallback((type: 'success' | 'warning' | 'error' | 'selection' | 'button' = 'selection') => {
    if ('vibrate' in navigator) {
      const patterns = {
        success: [40, 20, 15, 20, 45],
        warning: [35, 80, 35],
        error: [60, 60, 60],
        selection: [20],
        button: [30, 10, 25]  // FEEDBACK SOLIDO
      }
      try {
        navigator.vibrate(patterns[type])
      } catch (error) {
        // Silenzioso se non supportato
      }
    }
  }, [])

  // 📱 DEVICE DETECTION OTTIMIZZATO
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setTimeout(() => setIsReady(true), 100)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 🧠 SMART DETECTION PIÙ DISCRETO
  useEffect(() => {
    if (!isMobile || !isReady) return

    let scrollTimeout: NodeJS.Timeout
    let rapidScrollCount = 0
    let scrollSpeedTimer: NodeJS.Timeout
    let mounted = true
    
    const handleScroll = () => {
      if (!mounted) return
      
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const direction = currentScrollY > lastScrollY ? 'down' : 'up'
      
      setLastScrollY(currentScrollY)
      setScrollDirection(direction)

      // 🎯 LOGICA PIÙ DISCRETA - Solo quando davvero necessario
      const hasScrolledSignificantly = currentScrollY > windowHeight * 0.5
      const notAtBottom = currentScrollY < documentHeight - windowHeight - 300
      
      // Comportamento di ricerca più evidente
      clearTimeout(scrollSpeedTimer)
      rapidScrollCount++
      scrollSpeedTimer = setTimeout(() => {
        if (mounted) rapidScrollCount = 0
      }, 1000)
      
      const isActivelySearching = rapidScrollCount > 4
      
      // Pausa più lunga per essere sicuri che serve
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (mounted && hasScrolledSignificantly && notAtBottom) {
          setIsUserLookingForHelp(true)
        }
      }, 3000)
      
      // Solo con comportamento di ricerca molto evidente
      if (isActivelySearching && hasScrolledSignificantly && notAtBottom) {
        setIsUserLookingForHelp(true)
      }
      
      // Reset se in cima o in fondo
      if (currentScrollY < windowHeight * 0.3 || !notAtBottom) {
        setIsUserLookingForHelp(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      mounted = false
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      clearTimeout(scrollSpeedTimer)
    }
  }, [lastScrollY, isMobile, isReady])

  // 👁️ VISIBILITY LOGIC PIÙ RIGOROSA
  useEffect(() => {
    if (!isMobile) return
    setIsVisible(isUserLookingForHelp && scrollDirection === 'up')
  }, [isUserLookingForHelp, scrollDirection, isMobile])

  // 🎯 NAVIGAZIONE PRECISA - Mapping corretto delle sezioni
  const sectionMapping = useMemo(() => ({
    'hero': 'hero',
    'services': 'services',
    'banchetto': 'dettaglio',
    'ingrosso': 'wholesale',
    'products': 'products',
    'about': 'about',
    'contact': 'contact'
  }), [])

  const scrollToSection = useCallback((sectionId: string) => {
    triggerHaptic('success')
    
    const targetId = sectionMapping[sectionId as keyof typeof sectionMapping] || sectionId
    const element = document.getElementById(targetId)
    
    if (element) {
      const offset = 80
      const elementPosition = element.offsetTop - offset
      
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      })
    }
    
    setActiveSubmenu(null)
    setTimeout(() => setIsUserLookingForHelp(false), 1000)
  }, [sectionMapping, triggerHaptic])

  const toggleSubmenu = useCallback((submenu: string) => {
    triggerHaptic('button')
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu)
  }, [activeSubmenu, triggerHaptic])

  const handleCall = useCallback((phone: string) => {
    triggerHaptic('success')
    window.open(`tel:${phone}`, '_self')
    setActiveSubmenu(null)
    setTimeout(() => setIsUserLookingForHelp(false), 500)
  }, [triggerHaptic])

  const handleMaps = useCallback((url: string) => {
    triggerHaptic('success')
    window.open(url, '_blank')
    setActiveSubmenu(null)
    setTimeout(() => setIsUserLookingForHelp(false), 500)
  }, [triggerHaptic])

  // 🚫 NON MOSTRARE SE NON NECESSARIO
  if (!isMobile || !isReady) {
    return null
  }

  return (
    <>
      {/* BACKDROP ELEGANTE */}
      {activeSubmenu && (
        <div
          className="dock-backdrop"
          onClick={() => {
            triggerHaptic('selection')
            setActiveSubmenu(null)
          }}
        />
      )}

      {/* DOCK CONTAINER */}
      <div className={`dock-container ${isVisible ? 'dock-visible' : 'dock-hidden'}`}>
        
        {/* SUBMENU TELEFONI */}
        {activeSubmenu === 'phone' && (
          <div className="submenu-panel submenu-phone">
            <div className="submenu-header">
              <div className="submenu-indicator"></div>
              <span>Contattaci</span>
            </div>
            
            <div className="submenu-item" onClick={() => handleCall('+393515776198')}>
              <div className="submenu-icon-wrapper">
                <div className="submenu-icon banchetto-icon">🛒</div>
                <div className="submenu-glow banchetto-glow"></div>
              </div>
              <div className="submenu-content">
                <div className="submenu-title">{t.banchettoPhone}</div>
                <div className="submenu-subtitle">351 577 6198</div>
                <div className="submenu-description">Chiama il banchetto direttamente</div>
              </div>
              <div className="submenu-arrow">→</div>
            </div>
            
            <div className="submenu-item" onClick={() => handleCall('+390461602534')}>
              <div className="submenu-icon-wrapper">
                <div className="submenu-icon ingrosso-icon">🚛</div>
                <div className="submenu-glow ingrosso-glow"></div>
              </div>
              <div className="submenu-content">
                <div className="submenu-title">{t.horecaPhone}</div>
                <div className="submenu-subtitle">0461 602534</div>
                <div className="submenu-description">Servizio dedicato alle attività</div>
              </div>
              <div className="submenu-arrow">→</div>
            </div>
          </div>
        )}

        {/* SUBMENU NAVIGAZIONE */}
        {activeSubmenu === 'menu' && (
          <div className="submenu-panel submenu-navigation">
            <div className="submenu-header">
              <div className="submenu-indicator"></div>
              <span>Vai a</span>
            </div>
            
            {[
              { id: 'hero', icon: '🏠', label: 'Home', color: 'home', desc: 'Torna all\'inizio' },
              { id: 'banchetto', icon: '🛒', label: t.banchetto, color: 'banchetto', desc: 'Scopri il nostro banchetto' },
              { id: 'ingrosso', icon: '🚛', label: t.servizi, color: 'ingrosso', desc: 'Servizio HORECA' },
              { id: 'products', icon: '🍎', label: t.prodotti, color: 'products', desc: 'I nostri prodotti freschi' },
              { id: 'about', icon: '🌱', label: 'La Nostra Storia', color: 'about', desc: 'Chi siamo' },
              { id: 'contact', icon: '📞', label: 'Contatti', color: 'contact', desc: 'Come raggiungerci' }
            ].map((item) => (
              <div 
                key={item.id}
                className="submenu-item" 
                onClick={() => scrollToSection(item.id)}
              >
                <div className="submenu-icon-wrapper">
                  <div className={`submenu-icon ${item.color}-icon`}>{item.icon}</div>
                  <div className={`submenu-glow ${item.color}-glow`}></div>
                </div>
                <div className="submenu-content">
                  <div className="submenu-title">{item.label}</div>
                  <div className="submenu-description">{item.desc}</div>
                </div>
                <div className="submenu-arrow">→</div>
              </div>
            ))}
          </div>
        )}

        {/* SUBMENU MAPPE */}
        {activeSubmenu === 'maps' && (
          <div className="submenu-panel submenu-maps">
            <div className="submenu-header">
              <div className="submenu-indicator"></div>
              <span>Trovaci</span>
            </div>
            
            <div className="submenu-item" onClick={() => handleMaps('https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN')}>
              <div className="submenu-icon-wrapper">
                <div className="submenu-icon banchetto-icon">🛒</div>
                <div className="submenu-glow banchetto-glow"></div>
              </div>
              <div className="submenu-content">
                <div className="submenu-title">Banchetto</div>
                <div className="submenu-description">Via Cavalleggeri, Mezzolombardo</div>
              </div>
              <div className="submenu-arrow">→</div>
            </div>
            
            <div className="submenu-item" onClick={() => handleMaps('https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6')}>
              <div className="submenu-icon-wrapper">
                <div className="submenu-icon ingrosso-icon">🚛</div>
                <div className="submenu-glow ingrosso-glow"></div>
              </div>
              <div className="submenu-content">
                <div className="submenu-title">Magazzino Ingrosso</div>
                <div className="submenu-description">Sede operativa HORECA</div>
              </div>
              <div className="submenu-arrow">→</div>
            </div>
          </div>
        )}

        {/* DOCK PRINCIPALE */}
        <div className="main-dock">
          <div className="dock-core">
            <div className="dock-core-glow"></div>
          </div>
          
          {/* Menu Button */}
          <button
            className={`dock-button ${activeSubmenu === 'menu' ? 'dock-button-active' : ''}`}
            onClick={() => toggleSubmenu('menu')}
            onTouchStart={() => triggerHaptic('button')}
          >
            <div className="dock-button-glow"></div>
            <div className="dock-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className="dock-label">{t.menu}</span>
          </button>

          {/* Phone Button */}
          <button
            className={`dock-button ${activeSubmenu === 'phone' ? 'dock-button-active' : ''}`}
            onClick={() => toggleSubmenu('phone')}
            onTouchStart={() => triggerHaptic('button')}
          >
            <div className="dock-button-glow"></div>
            <div className="dock-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="dock-label">{t.call}</span>
          </button>

          {/* Maps Button */}
          <button
            className={`dock-button ${activeSubmenu === 'maps' ? 'dock-button-active' : ''}`}
            onClick={() => toggleSubmenu('maps')}
            onTouchStart={() => triggerHaptic('button')}
          >
            <div className="dock-button-glow"></div>
            <div className="dock-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="dock-label">{t.maps}</span>
          </button>
        </div>
      </div>

      {/* STILI CSS COMPLETI */}
      <style>{`
        /* BACKDROP */
        .dock-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999998;
          background: radial-gradient(circle at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%);
          backdrop-filter: blur(15px) saturate(150%);
          -webkit-backdrop-filter: blur(15px) saturate(150%);
          animation: backdropIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* CONTAINER */
        .dock-container {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 0 24px 24px;
          padding-bottom: max(24px, env(safe-area-inset-bottom, 24px));
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
        }

        .dock-container * {
          pointer-events: auto;
        }

        .dock-hidden {
          opacity: 0;
          transform: translateX(-50%) translateY(100px) scale(0.9);
          filter: blur(8px);
        }

        .dock-visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
          filter: blur(0px);
        }

        /* DOCK PRINCIPALE */
        .main-dock {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0.95) 100%);
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border-radius: 28px;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          min-width: 280px;
          max-width: 90vw;
        }

        /* BOTTONI */
        .dock-button {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          min-width: 60px;
        }

        .dock-button:hover {
          color: #3b82f6;
          transform: translateY(-4px) scale(1.03);
          background: rgba(59, 130, 246, 0.05);
        }

        .dock-button-active {
          color: #3b82f6;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.12),
            rgba(59, 130, 246, 0.05));
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.25);
        }

        .dock-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dock-label {
          font-size: 10px;
          font-weight: 600;
          line-height: 1;
          white-space: nowrap;
        }

        /* PANNELLI SUBMENU */
        .submenu-panel {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.97) 0%, 
            rgba(255, 255, 255, 0.9) 100%);
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border-radius: 24px;
          padding: 20px;
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.8);
          border: 1.5px solid rgba(255, 255, 255, 0.5);
          min-width: 280px;
          max-width: 90vw;
          animation: submenuIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .submenu-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          font-weight: 600;
          font-size: 15px;
          color: #1e293b;
        }

        .submenu-indicator {
          width: 6px;
          height: 6px;
          background: linear-gradient(45deg, #3b82f6, #10b981);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .submenu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0.3));
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .submenu-item:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.08),
            rgba(16, 185, 129, 0.08));
        }

        .submenu-item:last-child {
          margin-bottom: 0;
        }

        .submenu-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .submenu-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          position: relative;
          z-index: 2;
        }

        .submenu-content {
          flex: 1;
        }

        .submenu-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .submenu-subtitle {
          font-size: 13px;
          color: #3b82f6;
          font-weight: 500;
          margin-bottom: 1px;
        }

        .submenu-description {
          font-size: 11px;
          color: #64748b;
          line-height: 1.3;
        }

        .submenu-arrow {
          font-size: 16px;
          color: #94a3b8;
          transition: all 0.25s ease;
        }

        .submenu-item:hover .submenu-arrow {
          color: #3b82f6;
          transform: translateX(3px);
        }

        /* COLORI ICONE */
        .banchetto-icon { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .ingrosso-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
        .home-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
        .about-icon { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        .products-icon { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
        .contact-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; }

        /* CORE MAGNETICO */
        .dock-core {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .dock-core-glow {
          position: absolute;
          inset: -6px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: coreGlow 3s ease-in-out infinite;
        }

        /* ANIMAZIONI */
        @keyframes backdropIn {
          from { 
            opacity: 0; 
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1; 
            backdrop-filter: blur(15px);
          }
        }

        @keyframes submenuIn {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes coreGlow {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.8;
          }
        }

        /* RESPONSIVE */
        @media (min-width: 768px) {
          .dock-container {
            display: none !important;
          }
        }

        @media (max-width: 380px) {
          .main-dock {
            min-width: 260px;
            padding: 8px 18px;
          }
          
          .dock-button {
            padding: 10px 14px;
            min-width: 55px;
          }
          
          .submenu-panel {
            min-width: 260px;
            padding: 18px;
          }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .dock-container {
            padding-bottom: calc(24px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  )
}

export default MobileDock
