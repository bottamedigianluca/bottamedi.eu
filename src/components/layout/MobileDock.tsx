import React, { useState, useEffect } from 'react'

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

  // 🍎 HAPTIC FEEDBACK SOFISTICATO
  const triggerHaptic = (type: 'success' | 'warning' | 'error' | 'selection' = 'selection') => {
    if ('vibrate' in navigator) {
      const patterns = {
        success: [10, 50, 10],
        warning: [15, 100, 15],
        error: [25, 150, 25],
        selection: [5]
      }
      navigator.vibrate(patterns[type])
    }
  }

  // 📱 DEVICE DETECTION
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setTimeout(() => setIsReady(true), 200)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 🧠 SMART DETECTION - Logica avanzata per determinare quando l'utente cerca aiuto
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let rapidScrollCount = 0
    let scrollSpeedTimer: NodeJS.Timeout
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'
      
      setLastScrollY(currentScrollY)
      setScrollDirection(scrollDirection)

      // 🎯 LOGICA INTELLIGENTE: L'utente cerca aiuto quando...
      
      // 1. Ha scrollato abbastanza da aver visto contenuto
      const hasSeenContent = currentScrollY > windowHeight * 0.3
      
      // 2. Non è nel footer (ultimi 300px)
      const notInFooter = currentScrollY < documentHeight - windowHeight - 300
      
      // 3. Sta scrollando su e giù rapidamente (comportamento di ricerca)
      clearTimeout(scrollSpeedTimer)
      rapidScrollCount++
      scrollSpeedTimer = setTimeout(() => {
        rapidScrollCount = 0
      }, 1000)
      
      const isSearchingBehavior = rapidScrollCount > 3
      
      // 4. Si è fermato a scrollare per più di 2 secondi (sta leggendo/pensando)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (hasSeenContent && notInFooter) {
          setIsUserLookingForHelp(true)
        }
      }, 2000)
      
      // 5. Comportamento di ricerca immediato
      if (isSearchingBehavior && hasSeenContent && notInFooter) {
        setIsUserLookingForHelp(true)
      }
      
      // Reset se troppo in alto o in fondo
      if (!hasSeenContent || !notInFooter) {
        setIsUserLookingForHelp(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      clearTimeout(scrollSpeedTimer)
    }
  }, [lastScrollY])

  // 👁️ VISIBILITY LOGIC - Solo quando l'utente cerca davvero aiuto
  useEffect(() => {
    setIsVisible(isUserLookingForHelp && scrollDirection === 'up')
  }, [isUserLookingForHelp, scrollDirection])

  // 🎯 NAVIGATION
  const scrollToSection = (sectionId: string) => {
    triggerHaptic('success')
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setActiveSubmenu(null)
    setIsUserLookingForHelp(false) // Nascondi dopo l'uso
  }

  const toggleSubmenu = (submenu: string) => {
    triggerHaptic('selection')
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu)
  }

  const handleCall = (phone: string) => {
    triggerHaptic('success')
    window.open(`tel:${phone}`, '_self')
    setActiveSubmenu(null)
    setIsUserLookingForHelp(false)
  }

  const handleMaps = (url: string) => {
    triggerHaptic('success')
    window.open(url, '_blank')
    setActiveSubmenu(null)
    setIsUserLookingForHelp(false)
  }

  // 🚫 NON MOSTRARE SE NON NECESSARIO
  if (!isMobile || !isReady) {
    return null
  }

  return (
    <>
      {/* BACKDROP ULTRA ELEGANTE */}
      {activeSubmenu && (
        <div
          className="dock-backdrop"
          onClick={() => {
            triggerHaptic('selection')
            setActiveSubmenu(null)
          }}
        />
      )}

      {/* DOCK CONTAINER CON ANIMAZIONE MAGNETICA */}
      <div className={`dock-container ${isVisible ? 'dock-visible' : 'dock-hidden'}`}>
        
        {/* SUBMENU TELEFONI PREMIUM */}
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

        {/* SUBMENU NAVIGAZIONE PREMIUM */}
        {activeSubmenu === 'menu' && (
          <div className="submenu-panel submenu-navigation">
            <div className="submenu-header">
              <div className="submenu-indicator"></div>
              <span>Vai a</span>
            </div>
            
            {[
              { id: 'hero', icon: '🏠', label: 'Home', color: 'home', desc: 'Torna all\'inizio' },
              { id: 'services', icon: '⭐', label: 'I Nostri Servizi', color: 'services', desc: 'Banchetto e Ingrosso' },
              { id: 'products', icon: '🍎', label: t.prodotti, color: 'products', desc: 'I nostri prodotti freschi' },
              { id: 'contatti', icon: '📞', label: 'Contatti', color: 'contact', desc: 'Come raggiungerci' }
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

        {/* SUBMENU MAPPE PREMIUM */}
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

        {/* DOCK PRINCIPALE ULTRA SOFISTICATA */}
        <div className="main-dock">
          {/* Indicatore centrale magnetico */}
          <div className="dock-core">
            <div className="dock-core-glow"></div>
          </div>
          
          {/* Menu Button */}
          <button
            className={`dock-button ${activeSubmenu === 'menu' ? 'dock-button-active' : ''}`}
            onClick={() => toggleSubmenu('menu')}
            onTouchStart={() => triggerHaptic('selection')}
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
            onTouchStart={() => triggerHaptic('selection')}
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
            onTouchStart={() => triggerHaptic('selection')}
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

      {/* STILI CSS ULTRA PREMIUM */}
      <style>{`
        /* BACKDROP SOFISTICATO */
        .dock-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999998;
          background: radial-gradient(circle at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          animation: backdropMagneticIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* CONTAINER MAGNETICO */
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
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .dock-container * {
          pointer-events: auto;
        }

        /* ANIMAZIONI ENTRATA MAGNETICA */
        .dock-hidden {
          opacity: 0;
          transform: translateX(-50%) translateY(120px) scale(0.8);
          filter: blur(10px);
        }

        .dock-visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
          filter: blur(0px);
        }

        /* DOCK PRINCIPALE ULTRA SOFISTICATA */
        .main-dock {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0.95) 100%);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border-radius: 32px;
          padding: 12px 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 
            0 32px 80px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 0 20px rgba(255, 255, 255, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.4);
          min-width: 320px;
          max-width: 90vw;
          overflow: hidden;
        }

        .main-dock::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, 
            rgba(59, 130, 246, 0.3),
            rgba(16, 185, 129, 0.3),
            rgba(245, 158, 11, 0.3),
            rgba(239, 68, 68, 0.3),
            rgba(59, 130, 246, 0.3));
          border-radius: 34px;
          animation: dockBorderGlow 4s ease-in-out infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .main-dock:hover::before {
          opacity: 1;
        }

        /* CORE MAGNETICO CENTRALE */
        .dock-core {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .dock-core-glow {
          position: absolute;
          inset: -8px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: coreGlow 3s ease-in-out infinite;
        }

        /* BOTTONI DOCK SOFISTICATI */
        .dock-button {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 16px 20px;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-width: 70px;
          overflow: hidden;
        }

        .dock-button-glow {
          position: absolute;
          inset: 2px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.1));
          border-radius: 18px;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .dock-button:hover .dock-button-glow {
          opacity: 1;
          transform: scale(1.05);
        }

        .dock-button:hover {
          color: #3b82f6;
          transform: translateY(-6px) scale(1.05);
          background: rgba(59, 130, 246, 0.05);
        }

        .dock-button:active {
          transform: translateY(-3px) scale(1.02);
        }

        .dock-button-active {
          color: #3b82f6;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.15),
            rgba(59, 130, 246, 0.05));
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .dock-button-active .dock-button-glow {
          opacity: 1;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.2),
            rgba(59, 130, 246, 0.1));
        }

        /* ICONE DOCK */
        .dock-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 2;
        }

        /* ETICHETTE DOCK */
        .dock-label {
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
          letter-spacing: 0.3px;
          position: relative;
          z-index: 2;
        }

        /* PANNELLI SUBMENU ULTRA PREMIUM */
        .submenu-panel {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.98) 0%, 
            rgba(255, 255, 255, 0.92) 100%);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 
            0 40px 100px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.5);
          min-width: 320px;
          max-width: 90vw;
          animation: submenuMagneticIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          position: relative;
        }

        .submenu-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 100%);
          pointer-events: none;
        }

        /* HEADER SUBMENU */
        .submenu-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          font-weight: 700;
          font-size: 16px;
          color: #1e293b;
        }

        .submenu-indicator {
          width: 8px;
          height: 8px;
          background: linear-gradient(45deg, #3b82f6, #10b981);
          border-radius: 50%;
          animation: indicatorPulse 2s ease-in-out infinite;
        }

        /* ITEMS SUBMENU SOFISTICATI */
        .submenu-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 20px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.4));
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
        }

        .submenu-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1),
            rgba(16, 185, 129, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .submenu-item:hover::before {
          opacity: 1;
        }

        .submenu-item:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .submenu-item:active {
          transform: translateY(0) scale(1);
        }

        .submenu-item:last-child {
          margin-bottom: 0;
        }

        /* ICONE SUBMENU CON GLOW */
        .submenu-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .submenu-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .submenu-glow {
          position: absolute;
          inset: -4px;
          border-radius: 20px;
          opacity: 0;
          transition: all 0.3s ease;
          animation: glowPulse 3s ease-in-out infinite;
        }

        .submenu-item:hover .submenu-glow {
          opacity: 0.6;
          transform: scale(1.1);
        }

        /* COLORI ICONE SPECIFICI */
        .banchetto-icon { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .banchetto-glow { background: radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%); }

        .ingrosso-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
        .ingrosso-glow { background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%); }

        .home-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
        .home-glow { background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%); }

        .services-icon { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        .services-glow { background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%); }

        .products-icon { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
        .products-glow { background: radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%); }

        .contact-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; }
        .contact-glow { background: radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%); }

        /* CONTENUTO SUBMENU */
        .submenu-content {
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .submenu-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
          margin-bottom: 4px;
        }

        .submenu-subtitle {
          font-size: 14px;
          color: #3b82f6;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .submenu-description {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          line-height: 1.4;
        }

        /* FRECCIA SUBMENU */
        .submenu-arrow {
          font-size: 18px;
          color: #94a3b8;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .submenu-item:hover .submenu-arrow {
          color: #3b82f6;
          transform: translateX(4px);
        }

        /* ANIMAZIONI KEYFRAMES */
        @keyframes backdropMagneticIn {
          from { 
            opacity: 0; 
            backdrop-filter: blur(0px) saturate(100%);
            -webkit-backdrop-filter: blur(0px) saturate(100%);
          }
          to { 
            opacity: 1; 
            backdrop-filter: blur(20px) saturate(150%);
            -webkit-backdrop-filter: blur(20px) saturate(150%);
          }
        }

        @keyframes submenuMagneticIn {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.9);
            filter: blur(8px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes dockBorderGlow {
          0%, 100% { 
            transform: rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: rotate(180deg); 
            opacity: 0.7;
          }
        }

        @keyframes coreGlow {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 1;
          }
        }

        @keyframes indicatorPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes glowPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        /* RESPONSIVE OTTIMIZZATO */
        @media (min-width: 768px) {
          .dock-container {
            display: none !important;
          }
        }

        @media (max-width: 380px) {
          .main-dock {
            min-width: 280px;
            padding: 10px 20px;
          }
          
          .dock-button {
            padding: 14px 16px;
            min-width: 60px;
          }
          
          .submenu-panel {
            min-width: 280px;
            padding: 20px;
          }
          
          .submenu-item {
            padding: 16px 18px;
          }
        }

        /* iOS SAFE AREA AVANZATO */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .dock-container {
            padding-bottom: calc(24px + env(safe-area-inset-bottom));
          }
        }

        /* OTTIMIZZAZIONI PERFORMANCE */
        .dock-container,
        .main-dock,
        .submenu-panel {
          will-change: transform, opacity;
        }

        .dock-button,
        .submenu-item {
          will-change: transform;
        }

        /* ACCESSIBILITÀ */
        @media (prefers-reduced-motion: reduce) {
          .dock-container,
          .main-dock,
          .submenu-panel,
          .dock-button,
          .submenu-item {
            transition: none !important;
            animation: none !important;
          }
        }

        /* DARK MODE SUPPORT */
        @media (prefers-color-scheme: dark) {
          .main-dock {
            background: linear-gradient(135deg, 
              rgba(30, 30, 30, 0.95) 0%, 
              rgba(20, 20, 20, 0.9) 50%,
              rgba(30, 30, 30, 0.95) 100%);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .submenu-panel {
            background: linear-gradient(135deg, 
              rgba(30, 30, 30, 0.98) 0%, 
              rgba(20, 20, 20, 0.95) 100%);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .submenu-item {
            background: linear-gradient(135deg, 
              rgba(40, 40, 40, 0.8),
              rgba(30, 30, 30, 0.6));
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .submenu-title {
            color: #f1f5f9;
          }
          
          .submenu-description {
            color: #94a3b8;
          }
          
          .dock-button {
            color: #94a3b8;
          }
          
          .dock-button:hover {
            color: #60a5fa;
          }
        }

        /* EFFETTI SPECIALI PREMIUM */
        .main-dock {
          position: relative;
        }

        .main-dock::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%,
            transparent 30%,
            transparent 70%,
            rgba(255, 255, 255, 0.1) 100%);
          border-radius: inherit;
          pointer-events: none;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { 
            opacity: 0;
            transform: translateX(-100%);
          }
          50% { 
            opacity: 1;
            transform: translateX(100%);
          }
        }

        /* STATO TOUCH OTTIMIZZATO */
        .dock-button:active,
        .submenu-item:active {
          transition: transform 0.1s ease !important;
        }

        /* INDICATORI DI STATO */
        .dock-button-active::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #3b82f6;
          border-radius: 50%;
          animation: activeIndicator 1.5s ease-in-out infinite;
        }

        @keyframes activeIndicator {
          0%, 100% { 
            transform: translateX(-50%) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translateX(-50%) scale(1.5);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default MobileDock