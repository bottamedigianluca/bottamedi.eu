import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

interface MobileDockProps {
language: 'it' | 'de'
}

const translations = {
it: {
menu: 'Menu',
call: 'Chiama',
directions: 'Mappa',
close: 'Chiudi',
sections: [
{ id: 'hero', label: 'Home', icon: '🏠' },
{ id: 'about', label: 'Storia', icon: '📖' },
{ id: 'dettaglio', label: 'Banchetto', icon: '🛒' },
{ id: 'services', label: 'Servizi', icon: '⚡' },
{ id: 'products', label: 'Prodotti', icon: '🍎' },
{ id: 'wholesale', label: 'Listino', icon: '📋' },
{ id: 'contact', label: 'Contatti', icon: '📞' }
],
contacts: {
banchetto: 'Banchetto',
ingrosso: 'Ingrosso HORECA',
banchettoPhone: '351 577 6198',
ingrossoPhone: '0461 602534',
banchettoAddress: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
ingrossoAddress: 'Via A. de Gasperi, 47, 38017 Mezzolombardo (TN)',
banchettoHours: 'Lun-Sab: 7:00-19:30'
}
},
de: {
menu: 'Menü',
call: 'Anrufen',
directions: 'Karte',
close: 'Schließen',
sections: [
{ id: 'hero', label: 'Home', icon: '🏠' },
{ id: 'about', label: 'Geschichte', icon: '📖' },
{ id: 'dettaglio', label: 'Marktstand', icon: '🛒' },
{ id: 'services', label: 'Service', icon: '⚡' },
{ id: 'products', label: 'Produkte', icon: '🍎' },
{ id: 'wholesale', label: 'Preisliste', icon: '📋' },
{ id: 'contact', label: 'Kontakt', icon: '📞' }
],
contacts: {
banchetto: 'Marktstand',
ingrosso: 'Großhandel HORECA',
banchettoPhone: '351 577 6198',
ingrossoPhone: '0461 602534',
banchettoAddress: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
ingrossoAddress: 'Via A. de Gasperi, 47, 38017 Mezzolombardo (TN)',
banchettoHours: 'Mo-Sa: 07:00-19:30'
}
}
}

// 🎯 HOOK INTELLIGENTE COMPLETAMENTE RISCRITTO
const useIntelligentDockVisibility = () => {
const [isVisible, setIsVisible] = useState(false)
const [currentSection, setCurrentSection] = useState('hero')
const [isMobile, setIsMobile] = useState(false)

// Refs per tracking
const lastScrollY = useRef(0)
const scrollTimeout = useRef<NodeJS.Timeout>()
const inactivityTimeout = useRef<NodeJS.Timeout>()
const scrollDirection = useRef<'up' | 'down'>('down')
const isScrolling = useRef(false)

// 📱 Mobile detection
useEffect(() => {
const checkMobile = () => {
const mobile = window.innerWidth < 1024
setIsMobile(mobile)

if (!mobile) {
    setIsVisible(false) // Hide on desktop
  }
}

checkMobile()
window.addEventListener('resize', checkMobile, { passive: true })
return () => window.removeEventListener('resize', checkMobile)


}, [])

// 📍 Section detection
useEffect(() => {
if (!isMobile) return

let rafId: number

const detectCurrentSection = () => {
  rafId = requestAnimationFrame(() => {
    const sections = ['hero', 'about', 'dettaglio', 'services', 'products', 'wholesale', 'contact']
    const scrollPosition = window.scrollY + window.innerHeight / 2
    let foundSection = 'hero'

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        const rect = element.getBoundingClientRect()
        const elementTop = window.scrollY + rect.top
        const elementBottom = elementTop + rect.height
        
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          foundSection = sectionId
          break
        }
      }
    }

    if (foundSection !== currentSection) {
      setCurrentSection(foundSection)
    }
  })
}

const handleScroll = () => detectCurrentSection()

detectCurrentSection()
window.addEventListener('scroll', handleScroll, { passive: true })

return () => {
  window.removeEventListener('scroll', handleScroll)
  if (rafId) cancelAnimationFrame(rafId)
}

}, [isMobile, currentSection])

// 🧠 LOGICA INTELLIGENTE DI VISIBILITÀ
useEffect(() => {
if (!isMobile) {
setIsVisible(false)
return
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const scrollDelta = currentScrollY - lastScrollY.current
  
  // Aggiorna direzione solo per movimenti significativi
  if (Math.abs(scrollDelta) > 5) {
    scrollDirection.current = scrollDelta > 0 ? 'down' : 'up'
    lastScrollY.current = currentScrollY
    isScrolling.current = true
  }

  // Clear timeout precedenti
  if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
  if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current)

  // 🚫 ZONE DI ESCLUSIONE SEMPLIFICATE
  const excludedSections = ['hero', 'contact']
  const isInExcludedSection = excludedSections.includes(currentSection)
  
  // Controllo documenti legali
  const legalElement = document.getElementById('legal-documents')
  const isLegalOpen = legalElement && 
                    !legalElement.classList.contains('hidden') &&
                    legalElement.getBoundingClientRect().height > 50

  // Se siamo in una zona esclusa o legal è aperto, nascondi
  if (isInExcludedSection || isLegalOpen) {
    setIsVisible(false)
    return
  }

  // 🎯 LOGICA INTELLIGENTE PRINCIPALE
  scrollTimeout.current = setTimeout(() => {
    isScrolling.current = false
    
    // Mostra immediatamente se si scrolla verso l'alto
    if (scrollDirection.current === 'up') {
      setIsVisible(true)
      return
    }

    // Se si scrolla verso il basso, aspetta inattività
    if (scrollDirection.current === 'down') {
      setIsVisible(false)
      
      // Timer di inattività più corto
      inactivityTimeout.current = setTimeout(() => {
        // Ricontrolla le condizioni
        const currentExcluded = excludedSections.includes(currentSection)
        const currentLegalOpen = legalElement && 
                               !legalElement.classList.contains('hidden') &&
                               legalElement.getBoundingClientRect().height > 50

        if (!currentExcluded && !currentLegalOpen && !isScrolling.current) {
          setIsVisible(true)
        }
      }, 800) // Ridotto a 800ms per reattività migliore
    }
  }, 50) // Debounce ridotto
}

// Inizializza immediatamente se in sezione valida
const excludedSections = ['hero', 'contact']
if (!excludedSections.includes(currentSection)) {
  const legalElement = document.getElementById('legal-documents')
  const isLegalOpen = legalElement && 
                    !legalElement.classList.contains('hidden') &&
                    legalElement.getBoundingClientRect().height > 50
  
  if (!isLegalOpen) {
    // Timer iniziale per apparizione
    inactivityTimeout.current = setTimeout(() => {
      setIsVisible(true)
    }, 500)
  }
}

window.addEventListener('scroll', handleScroll, { passive: true })

return () => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
  if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current)
}

}, [isMobile, currentSection])

return {
isVisible: isMobile && isVisible,
currentSection,
isMobile
}
}

// 🎨 ICONE OTTIMIZZATE
const MenuIcon = React.memo(() => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
<path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
))

const PhoneIcon = React.memo(() => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>
))

const MapIcon = React.memo(() => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
<circle cx="12" cy="10" r="3"/>
</svg>
))

const CloseIcon = React.memo(() => (
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
))

// 📱 COMPONENTE PRINCIPALE
const MobileDock: React.FC<MobileDockProps> = ({ language }) => {
const [activeMenu, setActiveMenu] = useState<'none' | 'menu' | 'call' | 'directions'>('none')
const { isVisible, currentSection } = useIntelligentDockVisibility()
const t = translations[language]

// 📍 Navigazione sezioni
const scrollToSection = useCallback((sectionId: string) => {
const element = document.getElementById(sectionId)
if (element) {
const offset = sectionId === 'hero' ? 0 : 80
const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
window.scrollTo({
top: Math.max(0, elementPosition),
behavior: 'smooth'
})
setActiveMenu('none')

// Haptic feedback
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(25)
    } catch (e) {
      // Silent fail
    }
  }
}
}, [])

// 📞 Gestione chiamate
const handleCall = useCallback((phone: string) => {
const cleanPhone = phone.replace(/\s/g, '')
window.open(`tel:+39${cleanPhone}`, '_self')
setActiveMenu('none')

if ('vibrate' in navigator) {
  try {
    navigator.vibrate(50)
  } catch (e) {
    // Silent fail
  }
}

}, [])

// 🗺️ Gestione mappe
const handleDirections = useCallback((type: 'banchetto' | 'ingrosso') => {
const urls = {
banchetto: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN',
ingrosso: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
}
window.open(urls[type], '_blank')
setActiveMenu('none')

if ('vibrate' in navigator) {
  try {
    navigator.vibrate(30)
  } catch (e) {
    // Silent fail
  }
}
}, [])

// 🎛️ Toggle menu
const toggleMenu = useCallback((menu: 'menu' | 'call' | 'directions') => {
setActiveMenu(prev => prev === menu ? 'none' : menu)

if ('vibrate' in navigator) {
  try {
    navigator.vibrate(25)
  } catch (e) {
    // Silent fail
  }
}

}, [activeMenu])

const closeAllMenus = useCallback(() => {
setActiveMenu('none')
}, [])

// 🎨 VARIANTI ANIMATE OTTIMIZZATE
const backdropVariants = {
hidden: { opacity: 0 },
visible: {
opacity: 1,
transition: { duration: 0.2, ease: "easeOut" }
},
exit: {
opacity: 0,
transition: { duration: 0.15, ease: "easeIn" }
}
}

const popupVariants = {
hidden: {
opacity: 0,
y: 20,
scale: 0.95
},
visible: {
opacity: 1,
y: 0,
scale: 1,
transition: {
type: "spring",
damping: 25,
stiffness: 400,
duration: 0.3
}
},
exit: {
opacity: 0,
y: 20,
scale: 0.95,
transition: { duration: 0.2, ease: "easeIn" }
}
}

const dockVariants = {
hidden: {
y: 120,
opacity: 0,
scale: 0.95
},
visible: {
y: 0,
opacity: 1,
scale: 1,
transition: {
type: "spring",
damping: 25,
stiffness: 300,
duration: 0.4
}
},
exit: {
y: 120,
opacity: 0,
scale: 0.95,
transition: { duration: 0.25, ease: "easeIn" }
}
}

// ❌ NON RENDERIZZARE SE NON MOBILE O NON VISIBILE
if (!isVisible) {
return null
}

return (
<LayoutGroup>
<div className="lg:hidden fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
{/* 🎭 Backdrop */}
<AnimatePresence>
{activeMenu !== 'none' && (
<motion.div
key="backdrop"
variants={backdropVariants}
initial="hidden"
animate="visible"
exit="exit"
className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
onClick={closeAllMenus}
/>
)}
</AnimatePresence>

{/* 📱 Menu Popup */}
    <AnimatePresence mode="wait">
      {activeMenu === 'menu' && (
        <motion.div
          key="menu-popup"
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute bottom-32 left-4 right-4 pointer-events-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <MenuIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{t.menu}</h3>
                    <p className="text-sm text-gray-600">Naviga il sito</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeAllMenus}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-md text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <CloseIcon />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {t.sections.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={
                      currentSection === item.id 
                        ? 'relative flex items-center p-4 rounded-2xl transition-all duration-200 min-h-[60px] bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' 
                        : 'relative flex items-center p-4 rounded-2xl transition-all duration-200 min-h-[60px] bg-gray-50 text-gray-700 hover:bg-gray-100 shadow-sm hover:shadow-md'
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{item.icon}</div>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    
                    {currentSection === item.id && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute right-3 w-2 h-2 bg-white rounded-full"
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* 📞 Call Popup */}
    <AnimatePresence mode="wait">
      {activeMenu === 'call' && (
        <motion.div
          key="call-popup"
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute bottom-32 left-4 right-4 pointer-events-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <PhoneIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{t.call}</h3>
                    <p className="text-sm text-gray-600">Contattaci direttamente</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeAllMenus}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-md text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <CloseIcon />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200"
                >
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg">
                      🛒
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-900 mb-1">{t.contacts.banchetto}</h4>
                      <p className="text-green-700 text-sm mb-2">{t.contacts.banchettoAddress}</p>
                      <div className="flex items-center text-green-600 text-sm">
                        <span className="mr-2">🕒</span>
                        <span>{t.contacts.banchettoHours}</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(t.contacts.banchettoPhone)}
                    className="w-full flex items-center justify-center p-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <PhoneIcon />
                    <span className="ml-2">Chiama {t.contacts.banchettoPhone}</span>
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200"
                >
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg">
                      🚛
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-1">{t.contacts.ingrosso}</h4>
                      <p className="text-blue-700 text-sm">{t.contacts.ingrossoAddress}</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(t.contacts.ingrossoPhone)}
                    className="w-full flex items-center justify-center p-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <PhoneIcon />
                    <span className="ml-2">Chiama {t.contacts.ingrossoPhone}</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* 🗺️ Directions Popup */}
    <AnimatePresence mode="wait">
      {activeMenu === 'directions' && (
        <motion.div
          key="directions-popup"
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute bottom-32 left-4 right-4 pointer-events-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <MapIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{t.directions}</h3>
                    <p className="text-sm text-gray-600">Come raggiungerci</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeAllMenus}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-md text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <CloseIcon />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('banchetto')}
                  className="w-full p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 text-left transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <MapIcon />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-900 mb-1">{t.contacts.banchetto}</h4>
                      <p className="text-green-700 text-sm leading-relaxed">{t.contacts.banchettoAddress}</p>
                      <div className="flex items-center text-green-500 text-sm mt-2 font-semibold">
                        <span>📍 Apri in Google Maps</span>
                      </div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  className="w-full p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 text-left transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <MapIcon />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-1">{t.contacts.ingrosso}</h4>
                      <p className="text-blue-700 text-sm leading-relaxed">{t.contacts.ingrossoAddress}</p>
                      <div className="flex items-center text-blue-500 text-sm mt-2 font-semibold">
                        <span>📍 Apri in Google Maps</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* 🏠 MAIN DOCK - DOCK PRINCIPALE */}
    <AnimatePresence>
      <motion.div
        key="main-dock"
        variants={dockVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute bottom-0 left-0 right-0 pointer-events-auto"
        style={{
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        <div className="flex justify-center px-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-white/20 ring-1 ring-black/5">
            <div className="flex items-center space-x-3">
              {/* 📱 Menu Button */}
              <motion.button
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleMenu('menu')}
                className={
                  activeMenu === 'menu' 
                    ? 'w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-xl' 
                    : 'w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 bg-white text-gray-700 shadow-lg hover:shadow-xl'
                }
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <MenuIcon />
                <span className="text-xs font-bold mt-1">{t.menu}</span>
              </motion.button>

              {/* 📞 Call Button */}
              <motion.button
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleMenu('call')}
                className={
                  activeMenu === 'call' 
                    ? 'w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl' 
                    : 'w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 bg-white text-gray-700 shadow-lg hover:shadow-xl'
                }
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <PhoneIcon />
                <span className="text-xs font-bold mt-1">{t.call}</span>
              </motion.button>

              {/* 🗺️ Directions Button */}
              <motion.button
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleMenu('directions')}
                className={
                  activeMenu === 'directions' 
                    ? 'w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl' 
                    : 'w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 bg-white text-gray-700 shadow-lg hover:shadow-xl'
                }
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <MapIcon />
                <span className="text-xs font-bold mt-1">{t.directions}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</LayoutGroup>

)
}

// 🎯 DISPLAY NAMES PER DEBUG
MenuIcon.displayName = 'MenuIcon'
PhoneIcon.displayName = 'PhoneIcon'
MapIcon.displayName = 'MapIcon'
CloseIcon.displayName = 'CloseIcon'

export default React.memo(MobileDock)
