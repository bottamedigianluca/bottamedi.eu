import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { haptic } from '../utils/haptics'

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

  // 🍎 HAPTIC FEEDBACK VERO E FUNZIONANTE
  const triggerHaptic = useCallback((type: 'success' | 'warning' | 'error' | 'selection' | 'button' = 'selection') => {
    haptic.trigger(type)
  }, [])

  // 📱 DEVICE DETECTION OTTIMIZZATO
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Ritardo ridotto per responsività immediata
      setTimeout(() => setIsReady(true), 100)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 🧠 SMART DETECTION OTTIMIZZATO - Più discreto e meno invadente
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
      
      // 1. Ha scrollato parecchio (più alto threshold)
      const hasScrolledSignificantly = currentScrollY > windowHeight * 0.5
      
      // 2. Non è troppo in fondo
      const notAtBottom = currentScrollY < documentHeight - windowHeight - 300
      
      // 3. Comportamento di ricerca più evidente
      clearTimeout(scrollSpeedTimer)
      rapidScrollCount++
      scrollSpeedTimer = setTimeout(() => {
        if (mounted) rapidScrollCount = 0
      }, 1000)
      
      const isActivelySearching = rapidScrollCount > 4 // Soglia più alta
      
      // 4. Pausa più lunga per essere sicuri che serve
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (mounted && hasScrolledSignificantly && notAtBottom) {
          setIsUserLookingForHelp(true)
        }
      }, 3000) // 3 secondi invece di 1.5
      
      // 5. Solo con comportamento di ricerca molto evidente
      if (isActivelySearching && hasScrolledSignificantly && notAtBottom) {
        setIsUserLookingForHelp(true)
      }
      
      // Reset se in cima o in fondo
      if (currentScrollY < windowHeight * 0.3 || !notAtBottom) {
        setIsUserLookingForHelp(false)
      }
    }

    // NESSUNA INIZIALIZZAZIONE AUTOMATICA - Solo su richiesta utente
    
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
    // Solo quando scrolling up E l'utente cerca aiuto attivamente
    setIsVisible(isUserLookingForHelp && scrollDirection === 'up')
  }, [isUserLookingForHelp, scrollDirection, isMobile])

  // 🎯 NAVIGAZIONE PRECISA - Mapping corretto delle sezioni
  const sectionMapping = useMemo(() => ({
    'hero': 'hero',
    'services': 'services', // Sezione servizi generica
    'banchetto': 'dettaglio', // Sezione specifica banchetto
    'ingrosso': 'wholesale', // Sezione specifica ingrosso
    'products': 'products',
    'about': 'about',
    'contact': 'contact'
  }), [])

  const scrollToSection = useCallback((sectionId: string) => {
    triggerHaptic('success')
    
    const targetId = sectionMapping[sectionId as keyof typeof sectionMapping] || sectionId
    const element = document.getElementById(targetId)
    
    if (element) {
      // Offset per header fisso se presente
      const offset = 80
      const elementPosition = element.offsetTop - offset
      
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      })
    }
    
    setActiveSubmenu(null)
    // Non nascondere immediatamente per permettere di vedere l'azione
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

      {/* DOCK CONTAINER CON ANIMAZIONE MAGNETICA OTTIMIZZATA */}
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

        {/* SUBMENU NAVIGAZIONE PREMIUM - MAPPING CORRETTO */}
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

      {/* STILI CSS ULTRA PREMIUM OTTIMIZZATI */}
      <style>{`
        /* PERFORMANCE OTTIMIZZAZIONI */
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
          will-change: transform, opacity;
        }

        .dock-container * {
          pointer-events: auto;
        }

        /* ANIMAZIONI OTTIMIZZATE */
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

        /* BACKDROP OTTIMIZZATO */
        .dock-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999998;
          background: radial-gradient(circle at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%);
          backdrop-filter: blur(15px) saturate(150%);
          -webkit-backdrop-filter: blur(15px) saturate(150%);
          animation: backdropIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: opacity;
        }

        /* DOCK PRINCIPALE OTTIMIZZATO */
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
          will-change: transform;
        }

        /* BOTTONI DOCK OTTIMIZZATI */
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
          will-change: transform, color;
        }

        .dock-button-glow {
          position: absolute;
          inset: 2px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.1));
          border-radius: 14px;
          opacity: 0;
          transition: all 0.25s ease;
        }

        .dock-button:hover .dock-button-glow {
          opacity: 1;
          transform: scale(1.03);
        }

        .dock-button:hover {
          color: #3b82f6;
          transform: translateY(-4px) scale(1.03);
          background: rgba(59, 130, 246, 0.05);
        }

        .dock-button:active {
          transform: translateY(-2px) scale(1.01);
        }

        .dock-button-active {
          color: #3b82f6;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.12),
            rgba(59, 130, 246, 0.05));
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.25);
        }

        /* ICONE E ETICHETTE */
        .dock-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.25s ease;
          position: relative;
          z-index: 2;
        }

        .dock-label {
          font-size: 10px;
          font-weight: 600;
          line-height: 1;
          white-space: nowrap;
          letter-spacing: 0.2px;
          position: relative;
          z-index: 2;
        }

        /* PANNELLI SUBMENU OTTIMIZZATI */
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
            0 0 0 1px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border: 1.5px solid rgba(255, 255, 255, 0.5);
          min-width: 280px;
          max-width: 90vw;
          animation: submenuIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, opacity;
        }

        /* HEADER SUBMENU */
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

        /* ITEMS SUBMENU OTTIMIZZATI */
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
          position: relative;
          overflow: hidden;
          will-change: transform;
        }

        .submenu-item:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.08),
            rgba(16, 185, 129, 0.08));
        }

        .submenu-item:active {
          transform: translateY(0) scale(1);
        }

        .submenu-item:last-child {
          margin-bottom: 0;
        }

        /* ICONE SUBMENU OTTIMIZZATE */
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
          transition: all 0.25s ease;
        }

        .submenu-glow {
          position: absolute;
          inset: -3px;
          border-radius: 15px;
          opacity: 0;
          transition: all 0.25s ease;
        }

        .submenu-item:hover .submenu-glow {
          opacity: 0.4;
          transform: scale(1.05);
        }

        /* COLORI ICONE */
        .banchetto-icon { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .banchetto-glow { background: radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%); }

        .ingrosso-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
        .ingrosso-glow { background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%); }

        .home-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
        .home-glow { background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%); }

        .about-icon { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        .about-glow { background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%); }

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
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
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
          font-weight: 400;
          line-height: 1.3;
        }

        /* FRECCIA SUBMENU */
        .submenu-arrow {
          font-size: 16px;
          color: #94a3b8;
          transition: all 0.25s ease;
          position: relative;
          z-index: 2;
        }

        .submenu-item:hover .submenu-arrow {
          color: #3b82f6;
          transform: translateX(3px);
        }

        /* ANIMAZIONI KEYFRAMES OTTIMIZZATE */
        @keyframes backdropIn {
          from { 
            opacity: 0; 
            backdrop-filter: blur(0px);
            -webkit-backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1; 
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
          }
        }

        @keyframes submenuIn {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95);
            filter: blur(4px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0px);
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

        /* RESPONSIVE OTTIMIZZATO */
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
          
          .submenu-item {
            padding: 12px 14px;
          }
        }

        /* iOS SAFE AREA */
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
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .dock-button,
        .submenu-item {
          will-change: transform;
          backface-visibility: hidden;
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
              rgba(30, 30, 30, 0.97) 0%, 
              rgba(20, 20, 20, 0.93) 100%);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .submenu-item {
            background: linear-gradient(135deg, 
              rgba(40, 40, 40, 0.7),
              rgba(30, 30, 30, 0.5));
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

        /* INDICATORE ATTIVO OTTIMIZZATO */
        .dock-button-active::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          background: #3b82f6;
          border-radius: 50%;
          animation: activeIndicator 1.5s ease-in-out infinite;
        }

        @keyframes activeIndicator {
          0%, 100% { 
            transform: translateX(-50%) scale(1);
            opacity: 0.7;
          }
          50% { 
            transform: translateX(-50%) scale(1.3);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default MobileDock
