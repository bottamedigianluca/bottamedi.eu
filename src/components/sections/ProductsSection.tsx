import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface ProductsSectionProps {
  language: 'it' | 'de'
  inView: boolean
}

const translations = {
  it: {
    title: 'I Nostri Prodotti',
    subtitle: 'Oltre 100 varietà di frutta e verdura fresca selezionata ogni giorno',
    categories: [
      {
        id: 'fruits',
        title: 'Frutta Fresca',
        shortDesc: 'Varietà di stagione dal Trentino e oltre',
        description: 'La nostra frutta viene selezionata alle prime ore del mattino dai migliori produttori del Trentino Alto Adige e da fornitori selezionati in tutta Italia.',
        longDescription: 'Ogni giorno iniziamo la nostra giornata controllando personalmente ogni cassetta di frutta che arriva al nostro deposito. Dalle famose mele Melinda del Trentino agli agrumi siciliani, dalla frutta esotica di stagione ai piccoli frutti di montagna, garantiamo sempre la massima freschezza e qualità. La nostra esperienza di 50 anni ci permette di selezionare solo i prodotti migliori per i nostri clienti.',
        icon: '🍎',
        color: 'from-red-500 to-orange-500',
        image: '/images/melinda_golden.webp',
        products: [
          { name: 'Mele Melinda', season: 'Tutto l\'anno', origin: 'Trentino' },
          { name: 'Kiwi Gold', season: 'Ott-Apr', origin: 'Trentino' },
          { name: 'Pesche & Albicocche', season: 'Giu-Set', origin: 'Emilia Romagna' },
          { name: 'Uva da tavola', season: 'Ago-Nov', origin: 'Puglia/Sicilia' },
          { name: 'Agrumi Premium', season: 'Nov-Apr', origin: 'Sicilia/Calabria' },
          { name: 'Frutti di bosco', season: 'Mag-Set', origin: 'Trentino' }
        ],
        features: [
          { icon: '🌅', title: 'Selezione Mattutina', desc: 'Controllo qualità alle prime ore' },
          { icon: '❄️', title: 'Catena del Freddo', desc: 'Conservazione ottimale garantita' },
          { icon: '🏔️', title: 'Prodotti Alpini', desc: 'Specialità del territorio trentino' },
          { icon: '📦', title: 'Packaging Curato', desc: 'Confezionamento per preservare la freschezza' }
        ]
      },
      {
        id: 'vegetables',
        title: 'Verdure Fresche',
        shortDesc: 'Dal campo alla tavola in 24 ore',
        description: 'Le nostre verdure arrivano direttamente dai campi del Trentino Alto Adige e del Veneto, garantendo freschezza e sapore autentici.',
        longDescription: 'Collaboriamo direttamente con i migliori agricoltori del territorio per offrire verdure di stagione sempre fresche e saporite. I nostri famosi pomodori cuore di bue, le zucche di Mantova, i cavoli verza del Trentino e tutte le verdure a foglia verde vengono selezionate una per una. Privilegiamo sempre i prodotti a chilometro zero quando possibile, per ridurre l\'impatto ambientale e garantire la massima freschezza.',
        icon: '🥬',
        color: 'from-green-500 to-emerald-500',
        image: '/images/pomodori_cuore_bue.webp',
        products: [
          { name: 'Pomodori Cuore di Bue', season: 'Mag-Set', origin: 'Trentino' },
          { name: 'Zucche di Mantova', season: 'Set-Feb', origin: 'Lombardia' },
          { name: 'Insalate Miste', season: 'Tutto l\'anno', origin: 'Veneto' },
          { name: 'Cavoli e Verze', season: 'Ott-Mar', origin: 'Trentino' },
          { name: 'Asparagi Bianchi', season: 'Mar-Giu', origin: 'Veneto' },
          { name: 'Funghi Porcini', season: 'Set-Nov', origin: 'Trentino' }
        ],
        features: [
          { icon: '🚚', title: 'Filiera Corta', desc: 'Dal produttore in massimo 24 ore' },
          { icon: '🌱', title: 'Prodotti Bio', desc: 'Selezione di verdure biologiche certificate' },
          { icon: '📍', title: 'Km Zero', desc: 'Priorità ai produttori locali del Trentino' },
          { icon: '🧺', title: 'Varietà Stagionali', desc: 'Seguiamo i ritmi naturali delle stagioni' }
        ]
      },
      {
        id: 'specialties',
        title: 'Specialità Locali',
        shortDesc: 'Prodotti tipici del territorio trentino',
        description: 'Selezioniamo i migliori prodotti tipici del Trentino Alto Adige per portare sulla tua tavola i sapori autentici della nostra terra.',
        longDescription: 'Il Trentino Alto Adige è ricco di eccellenze enogastronomiche che rappresentiamo con orgoglio. Dalle mele Melinda DOP alle pere della Val di Non, dai piccoli frutti di montagna alle erbe aromatiche alpine, ogni prodotto racconta la storia del nostro territorio. Lavoriamo anche con piccoli produttori locali per offrirti specialità uniche che difficilmente trovi altrove, come le antiche varietà di mele recuperate o i frutti dimenticati delle nostre montagne.',
        icon: '🏔️',
        color: 'from-blue-500 to-indigo-500',
        image: '/images/kiwi-cuore.webp',
        products: [
          { name: 'Mele Melinda DOP', season: 'Set-Lug', origin: 'Val di Non' },
          { name: 'Pere Williams', season: 'Ago-Nov', origin: 'Val di Non' },
          { name: 'Piccoli Frutti', season: 'Giu-Set', origin: 'Val di Sole' },
          { name: 'Erbe Aromatiche', season: 'Mar-Set', origin: 'Altopiani' },
          { name: 'Castagne', season: 'Set-Nov', origin: 'Valsugana' },
          { name: 'Noci', season: 'Set-Mar', origin: 'Valle dell\'Adige' }
        ],
        features: [
          { icon: '🏅', title: 'Certificazioni DOP', desc: 'Prodotti a denominazione protetta' },
          { icon: '🌸', title: 'Varietà Antiche', desc: 'Frutti tradizionali recuperati' },
          { icon: '⛰️', title: 'Alta Montagna', desc: 'Prodotti coltivati oltre i 1000m' },
          { icon: '🤝', title: 'Piccoli Produttori', desc: 'Sosteniamo l\'agricoltura familiare' }
        ]
      }
    ]
  },
  de: {
    title: 'Unsere Produkte',
    subtitle: 'Über 100 Sorten frisches Obst und Gemüse täglich ausgewählt',
    categories: [
      {
        id: 'fruits',
        title: 'Frisches Obst',
        shortDesc: 'Saisonale Sorten aus Südtirol und darüber hinaus',
        description: 'Unser Obst wird in den frühen Morgenstunden von den besten Produzenten Südtirols und ausgewählten Lieferanten aus ganz Italien ausgewählt.',
        longDescription: 'Jeden Tag beginnen wir unseren Tag damit, jede Obstkiste persönlich zu kontrollieren, die in unserem Lager ankommt. Von den berühmten Melinda-Äpfeln aus Südtirol bis zu sizilianischen Zitrusfrüchten, von exotischen Saisonfrüchten bis zu kleinen Bergfrüchten garantieren wir immer maximale Frische und Qualität.',
        icon: '🍎',
        color: 'from-red-500 to-orange-500',
        image: '/images/melinda_golden.webp',
        products: [
          { name: 'Melinda Äpfel', season: 'Ganzjährig', origin: 'Südtirol' },
          { name: 'Kiwi Gold', season: 'Okt-Apr', origin: 'Südtirol' },
          { name: 'Pfirsiche & Aprikosen', season: 'Jun-Sep', origin: 'Emilia Romagna' },
          { name: 'Tafeltrauben', season: 'Aug-Nov', origin: 'Apulien/Sizilien' },
          { name: 'Premium Zitrusfrüchte', season: 'Nov-Apr', origin: 'Sizilien/Kalabrien' },
          { name: 'Waldbeeren', season: 'Mai-Sep', origin: 'Südtirol' }
        ],
        features: [
          { icon: '🌅', title: 'Morgendliche Auswahl', desc: 'Qualitätskontrolle in den frühen Stunden' },
          { icon: '❄️', title: 'Kühlkette', desc: 'Optimale Konservierung garantiert' },
          { icon: '🏔️', title: 'Alpine Produkte', desc: 'Spezialitäten des Südtiroler Gebiets' },
          { icon: '📦', title: 'Sorgfältige Verpackung', desc: 'Verpackung zur Erhaltung der Frische' }
        ]
      },
      {
        id: 'vegetables',
        title: 'Frisches Gemüse',
        shortDesc: 'Vom Feld auf den Tisch in 24 Stunden',
        description: 'Unser Gemüse kommt direkt von den Feldern Südtirols und Venetiens und garantiert authentische Frische und Geschmack.',
        longDescription: 'Wir arbeiten direkt mit den besten Landwirten des Gebiets zusammen, um saisonales Gemüse anzubieten, das immer frisch und schmackhaft ist. Unsere berühmten Ochsenherz-Tomaten, Kürbisse aus Mantua, Südtiroler Kohl und alle Blattgemüse werden einzeln ausgewählt.',
        icon: '🥬',
        color: 'from-green-500 to-emerald-500',
        image: '/images/pomodori_cuore_bue.webp',
        products: [
          { name: 'Ochsenherz-Tomaten', season: 'Mai-Sep', origin: 'Südtirol' },
          { name: 'Mantua Kürbisse', season: 'Sep-Feb', origin: 'Lombardei' },
          { name: 'Gemischte Salate', season: 'Ganzjährig', origin: 'Venetien' },
          { name: 'Kohl und Wirsing', season: 'Okt-Mär', origin: 'Südtirol' },
          { name: 'Weißer Spargel', season: 'Mär-Jun', origin: 'Venetien' },
          { name: 'Steinpilze', season: 'Sep-Nov', origin: 'Südtirol' }
        ],
        features: [
          { icon: '🚚', title: 'Kurze Lieferkette', desc: 'Vom Produzenten in maximal 24 Stunden' },
          { icon: '🌱', title: 'Bio-Produkte', desc: 'Auswahl zertifizierter Bio-Gemüse' },
          { icon: '📍', title: 'Km Zero', desc: 'Priorität für lokale Südtiroler Produzenten' },
          { icon: '🧺', title: 'Saisonale Sorten', desc: 'Wir folgen den natürlichen Jahreszeiten' }
        ]
      },
      {
        id: 'specialties',
        title: 'Lokale Spezialitäten',
        shortDesc: 'Typische Produkte des Südtiroler Gebiets',
        description: 'Wir wählen die besten typischen Produkte Südtirols aus, um die authentischen Aromen unseres Landes auf Ihren Tisch zu bringen.',
        longDescription: 'Südtirol ist reich an gastronomischen Exzellenzen, die wir mit Stolz vertreten. Von Melinda DOP-Äpfeln bis zu Birnen aus dem Nonstal, von kleinen Bergfrüchten bis zu alpinen Kräutern erzählt jedes Produkt die Geschichte unseres Gebiets.',
        icon: '🏔️',
        color: 'from-blue-500 to-indigo-500',
        image: '/images/kiwi-cuore.webp',
        products: [
          { name: 'Melinda DOP Äpfel', season: 'Sep-Jul', origin: 'Nonstal' },
          { name: 'Williams Birnen', season: 'Aug-Nov', origin: 'Nonstal' },
          { name: 'Kleine Früchte', season: 'Jun-Sep', origin: 'Sulztal' },
          { name: 'Aromatische Kräuter', season: 'Mär-Sep', origin: 'Hochebenen' },
          { name: 'Kastanien', season: 'Sep-Nov', origin: 'Valsugana' },
          { name: 'Nüsse', season: 'Sep-Mär', origin: 'Etschtal' }
        ],
        features: [
          { icon: '🏅', title: 'DOP-Zertifizierungen', desc: 'Produkte mit geschützter Herkunftsbezeichnung' },
          { icon: '🌸', title: 'Alte Sorten', desc: 'Wiedergewonnene traditionelle Früchte' },
          { icon: '⛰️', title: 'Hochgebirge', desc: 'Produkte über 1000m angebaut' },
          { icon: '🤝', title: 'Kleine Produzenten', desc: 'Wir unterstützen die Familienwirtschaft' }
        ]
      }
    ]
  }
}

// Componenti ottimizzati con memoizzazione
const MobileProductCard: React.FC<{
  category: any
  index: number
  isExpanded: boolean
  onToggle: () => void
}> = React.memo(({ category, index, isExpanded, onToggle }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`} />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <div className="text-4xl mb-2">{category.icon}</div>
          <h3 className="text-2xl font-bold mb-1">{category.title}</h3>
          <p className="text-white/90 text-sm">{category.shortDesc}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 leading-relaxed mb-4">
          {category.description}
        </p>

        {/* Quick Products Preview */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Prodotti principali:</h4>
          <div className="flex flex-wrap gap-2">
            {category.products.slice(0, 3).map((product: any, i: number) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                {product.name}
              </span>
            ))}
            {category.products.length > 3 && (
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                +{category.products.length - 3} altri...
              </span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <motion.button
          onClick={onToggle}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
            isExpanded 
              ? `bg-gradient-to-r ${category.color} text-white` 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>{isExpanded ? 'Mostra Meno' : 'Scopri Tutti i Prodotti'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-100"
            >
              <p className="text-gray-600 leading-relaxed mb-6">
                {category.longDescription}
              </p>

              {/* Complete Products List */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Tutti i nostri prodotti:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {category.products.map((product: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <h5 className="font-medium text-gray-900">{product.name}</h5>
                        <p className="text-xs text-gray-600">{product.origin}</p>
                      </div>
                      <span className="bg-white text-gray-700 px-2 py-1 rounded-full text-xs">
                        {product.season}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">I nostri plus:</h4>
                <div className="space-y-3">
                  {category.features.map((feature: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50"
                    >
                      <div className="text-xl">{feature.icon}</div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">{feature.title}</h5>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
})

const DesktopProductCard: React.FC<{
  category: any
  index: number
  isActive: boolean
  onClick: () => void
}> = React.memo(({ category, index, isActive, onClick }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      <motion.div
        onClick={onClick}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`
          relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300
          ${isActive 
            ? 'ring-4 ring-green-500/30 shadow-2xl scale-105' 
            : 'shadow-lg hover:shadow-xl'
          }
        `}
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="text-4xl mb-3">{category.icon}</div>
          <h3 className="text-xl font-bold mb-2">{category.title}</h3>
          <p className="text-white/90 text-sm mb-3">{category.shortDesc}</p>
          
          <div className="flex flex-wrap gap-1">
            {category.products.slice(0, 2).map((product: any, i: number) => (
              <span key={i} className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                {product.name}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
})

const ProductsSection: React.FC<ProductsSectionProps> = ({ language, inView }) => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null)
  
  const t = useMemo(() => translations[language], [language])

  const handleMobileToggle = useCallback((index: number) => {
    setExpandedMobile(prev => prev === index ? null : index)
  }, [])

  const handleDesktopClick = useCallback((index: number) => {
    setActiveCategory(index)
  }, [])

  return (
    <section id="products" className="py-24 lg:py-32 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-8 mb-20">
          {t.categories.map((category, index) => (
            <MobileProductCard
              key={category.id}
              category={category}
              index={index}
              isExpanded={expandedMobile === index}
              onToggle={() => handleMobileToggle(index)}
            />
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-start mb-20">
          {t.categories.map((category, index) => (
            <DesktopProductCard
              key={category.id}
              category={category}
              index={index}
              isActive={activeCategory === index}
              onClick={() => handleDesktopClick(index)}
            />
          ))}
        </div>

        {/* Desktop Details Panel */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12"
            >
              {/* Header */}
              <div className="flex items-center space-x-6 mb-8">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${t.categories[activeCategory].color} flex items-center justify-center text-3xl`}>
                  {t.categories[activeCategory].icon}
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">{t.categories[activeCategory].title}</h3>
                  <p className="text-gray-600 text-lg">{t.categories[activeCategory].shortDesc}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {t.categories[activeCategory].description}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {t.categories[activeCategory].longDescription}
                </p>
              </div>

              {/* Products Grid */}
              <div className="mb-8">
                <h4 className="text-2xl font-semibold text-gray-900 mb-6">I nostri prodotti:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {t.categories[activeCategory].products.map((product: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-semibold text-gray-900 mb-2">{product.name}</h5>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{product.origin}</span>
                        <span className="bg-white text-gray-700 px-3 py-1 rounded-full">
                          {product.season}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-2xl font-semibold text-gray-900 mb-6">I nostri plus:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {t.categories[activeCategory].features.map((feature: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-3xl">{feature.icon}</div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">{feature.title}</h5>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-12 lg:p-16 mt-20"
        >
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Vieni a Scoprire la Qualità Bottamedi
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Visita il nostro banchetto in Via Cavalleggeri Udine a Mezzolombardo e lasciati guidare dalla nostra esperienza di 50 anni nella selezione dei prodotti migliori.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>📍</span>
              <span>Vieni al Banchetto</span>
            </motion.button>

            <motion.button
              onClick={() => {
                const element = document.getElementById('wholesale')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 border-2 border-green-500 text-green-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-green-50 transition-all duration-300"
            >
              <span>🏢</span>
              <span>Servizio Ingrosso</span>
            </motion.button>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 pt-8 border-t border-green-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <span>📍</span>
                <span>Via Cavalleggeri Udine, Mezzolombardo</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🕒</span>
                <span>Lun-Sab: 07:00-19:30</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📞</span>
                <span>+39 351 577 6198</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📧</span>
                <span>bottamedipierluigi@virgilio.it</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProductsSection