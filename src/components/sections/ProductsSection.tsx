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
    subtitle: 'Oltre 150 varietà di frutta e verdura fresca selezionata ogni giorno',
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
          { name: 'Mele Melinda DOP', season: 'Tutto l\'anno', origin: 'Val di Non' },
          { name: 'Kiwi Gold Premium', season: 'Ott-Apr', origin: 'Nuova Zelanda' },
          { name: 'Pesche & Albicocche', season: 'Giu-Set', origin: 'Emilia Romagna' },
          { name: 'Uva da tavola Italia', season: 'Ago-Nov', origin: 'Puglia/Sicilia' },
          { name: 'Agrumi Premium', season: 'Nov-Apr', origin: 'Sicilia/Calabria' },
          { name: 'Frutti di bosco', season: 'Mag-Set', origin: 'Val di Sole' },
          { name: 'Pere Williams', season: 'Lug-Ott', origin: 'Val di Non' },
          { name: 'Fragole di montagna', season: 'Mar-Giu', origin: 'Altopiani trentini' },
          { name: 'Susine Regina Claudia', season: 'Lug-Set', origin: 'Trentino' },
          { name: 'Ciliegie Duroni', season: 'Mag-Lug', origin: 'Vignola/Trentino' }
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
          { name: 'Asparagi Bianchi', season: 'Mar-Giu', origin: 'Zambana/Lungo Adige' },
          { name: 'Radicchio di Treviso', season: 'Nov-Feb', origin: 'Veneto' },
          { name: 'Patate di montagna', season: 'Ago-Mar', origin: 'Altopiani trentini' },
          { name: 'Melanzane viola', season: 'Giu-Set', origin: 'Trentino/Veneto' },
          { name: 'Zucchine tonde', season: 'Mag-Set', origin: 'Valle dei Laghi' },
          { name: 'Finocchi dolci', season: 'Ott-Mar', origin: 'Trentino' }
        ],
        features: [
          { icon: '🚚', title: 'Filiera Corta', desc: 'Dal produttore in massimo 24 ore' },
          { icon: '🌱', title: 'Coltivazione Tradizionale', desc: 'Metodi rispettosi dell\'ambiente' },
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
          { name: 'Erbe Aromatiche Alpine', season: 'Mar-Set', origin: 'Altopiani' },
          { name: 'Castagne', season: 'Set-Nov', origin: 'Valsugana' },
          { name: 'Noci della Valle', season: 'Set-Mar', origin: 'Valle dell\'Adige' },
          { name: 'Funghi Porcini', season: 'Set-Nov', origin: 'Boschi trentini' },
          { name: 'Mirtilli di montagna', season: 'Lug-Set', origin: 'Sopra i 1000m' },
          { name: 'Lamponi selvatici', season: 'Giu-Ago', origin: 'Val di Fiemme' },
          { name: 'More di rovo', season: 'Ago-Set', origin: 'Valli alpine' }
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
    subtitle: 'Über 150 Sorten frisches Obst und Gemüse täglich ausgewählt',
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
          { name: 'Melinda DOP Äpfel', season: 'Ganzjährig', origin: 'Nonstal' },
          { name: 'Kiwi Gold Premium', season: 'Okt-Apr', origin: 'Neuseeland' },
          { name: 'Pfirsiche & Aprikosen', season: 'Jun-Sep', origin: 'Emilia Romagna' },
          { name: 'Tafeltrauben Italien', season: 'Aug-Nov', origin: 'Apulien/Sizilien' },
          { name: 'Premium Zitrusfrüchte', season: 'Nov-Apr', origin: 'Sizilien/Kalabrien' },
          { name: 'Waldbeeren', season: 'Mai-Sep', origin: 'Sulztal' },
          { name: 'Williams Birnen', season: 'Jul-Okt', origin: 'Nonstal' },
          { name: 'Bergerdbeeren', season: 'Mär-Jun', origin: 'Südtiroler Hochebenen' },
          { name: 'Königin Claudia Pflaumen', season: 'Jul-Sep', origin: 'Südtirol' },
          { name: 'Duroni Kirschen', season: 'Mai-Jul', origin: 'Vignola/Südtirol' }
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
          { name: 'Weißer Spargel', season: 'Mär-Jun', origin: 'Zambana/Lungo Adige' },
          { name: 'Treviso Radicchio', season: 'Nov-Feb', origin: 'Venetien' },
          { name: 'Bergkartoffeln', season: 'Aug-Mär', origin: 'Südtiroler Hochebenen' },
          { name: 'Violette Auberginen', season: 'Jun-Sep', origin: 'Südtirol/Venetien' },
          { name: 'Runde Zucchini', season: 'Mai-Sep', origin: 'Tal der Seen' },
          { name: 'Süßer Fenchel', season: 'Okt-Mär', origin: 'Südtirol' }
        ],
        features: [
          { icon: '🚚', title: 'Kurze Lieferkette', desc: 'Vom Produzenten in maximal 24 Stunden' },
          { icon: '🌱', title: 'Traditioneller Anbau', desc: 'Umweltschonende Methoden' },
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
          { name: 'Alpine Kräuter', season: 'Mär-Sep', origin: 'Hochebenen' },
          { name: 'Kastanien', season: 'Sep-Nov', origin: 'Valsugana' },
          { name: 'Talnüsse', season: 'Sep-Mär', origin: 'Etschtal' },
          { name: 'Steinpilze', season: 'Sep-Nov', origin: 'Südtiroler Wälder' },
          { name: 'Bergblaubeeren', season: 'Jul-Sep', origin: 'Über 1000m' },
          { name: 'Wilde Himbeeren', season: 'Jun-Aug', origin: 'Fleimstal' },
          { name: 'Brombeeren', season: 'Aug-Sep', origin: 'Alpentäler' }
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

// 🎭 COMPONENTI OTTIMIZZATI CON MEMOIZZAZIONE
const MobileProductCard: React.FC<{
  category: any
  index: number
  isExpanded: boolean
  onToggle: () => void
}> = React.memo(({ category, index, isExpanded, onToggle }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const [imageLoaded, setImageLoaded] = useState(false)

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}
        
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-75`} />
        
        <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
          <div className="text-3xl mb-2">{category.icon}</div>
          <h3 className="text-xl font-bold mb-1">{category.title}</h3>
          <p className="text-white/90 text-sm">{category.shortDesc}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-gray-700 leading-relaxed mb-4 text-sm">
          {category.description}
        </p>

        {/* Quick Products Preview */}
        <div className="mb-5">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Alcuni dei nostri prodotti:</h4>
          <div className="flex flex-wrap gap-2">
            {category.products.slice(0, 3).map((product: any, i: number) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                {product.name}
              </span>
            ))}
            {category.products.length > 3 && (
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{category.products.length - 3} altri...
              </span>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <motion.button
          onClick={onToggle}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm ${
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
              transition={{ duration: 0.25 }}
              className="mt-5 pt-5 border-t border-gray-100"
            >
              <p className="text-gray-600 leading-relaxed mb-5 text-sm">
                {category.longDescription}
              </p>

              {/* Complete Products List */}
              <div className="mb-5">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">La nostra selezione:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {category.products.map((product: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm">{product.name}</h5>
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
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">I nostri plus:</h4>
                <div className="space-y-2">
                  {category.features.map((feature: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50"
                    >
                      <div className="text-lg">{feature.icon}</div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1 text-sm">{feature.title}</h5>
                        <p className="text-gray-600 text-xs">{feature.desc}</p>
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

MobileProductCard.displayName = 'MobileProductCard'

const DesktopProductCard: React.FC<{
  category: any
  index: number
  isActive: boolean
  onClick: () => void
}> = React.memo(({ category, index, isActive, onClick }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const [imageLoaded, setImageLoaded] = useState(false)

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      className="relative"
    >
      <motion.div
        onClick={onClick}
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-250
          ${isActive 
            ? 'ring-2 ring-offset-1 ring-green-400 shadow-xl' 
            : 'shadow-lg hover:shadow-xl'
          }
        `}
        style={{ willChange: 'transform' }}
      >
        <div className="relative h-56 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            style={{ 
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
              willChange: 'opacity'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-75`} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
          <div className="text-3xl mb-3">{category.icon}</div>
          <h3 className="text-lg font-bold mb-2">{category.title}</h3>
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
              transition={{ duration: 0.15 }}
              className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
})

DesktopProductCard.displayName = 'DesktopProductCard'

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
    <section id="products" className="py-20 lg:py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements OTTIMIZZATI */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header OTTIMIZZATO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-5 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-6 mb-16">
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
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 items-start mb-16">
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

        {/* Desktop Details Panel OTTIMIZZATO */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white rounded-2xl shadow-xl p-6 lg:p-8"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Header */}
              <div className="flex items-center space-x-5 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${t.categories[activeCategory].color} flex items-center justify-center text-2xl`}>
                  {t.categories[activeCategory].icon}
                </div>
                <div>
                  <h3 className="text-2xl xl:text-3xl font-bold text-gray-900">{t.categories[activeCategory].title}</h3>
                  <p className="text-gray-600">{t.categories[activeCategory].shortDesc}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-lg text-gray-700 leading-relaxed mb-3">
                  {t.categories[activeCategory].description}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {t.categories[activeCategory].longDescription}
                </p>
              </div>

              {/* Products Grid */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-5">La nostra selezione:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {t.categories[activeCategory].products.map((product: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <h5 className="font-semibold text-gray-900 mb-1 text-sm">{product.name}</h5>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">{product.origin}</span>
                        <span className="bg-white text-gray-700 px-2 py-1 rounded-full">
                          {product.season}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-5">I nostri plus:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {t.categories[activeCategory].features.map((feature: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">{feature.title}</h5>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA Section OTTIMIZZATA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 lg:p-12 mt-16"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Vieni a Scoprire la Qualità Bottamedi
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Visita il nostro banchetto in Via Cavalleggeri Udine a Mezzolombardo e lasciati guidare dalla nostra esperienza di 50 anni nella selezione dei prodotti migliori.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const element = document.getElementById('dettaglio')
                if (element) {
                  const offset = 80
                  const elementPosition = element.offsetTop - offset
                  window.scrollTo({
                    top: Math.max(0, elementPosition),
                    behavior: 'smooth'
                  })
                }
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>📍</span>
              <span>Vieni al Banchetto</span>
            </motion.button>

            <motion.button
              onClick={() => {
                const element = document.getElementById('wholesale')
                if (element) {
                  const offset = 80
                  const elementPosition = element.offsetTop - offset
                  window.scrollTo({
                    top: Math.max(0, elementPosition),
                    behavior: 'smooth'
                  })
                }
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center space-x-2 border-2 border-green-500 text-green-600 px-6 py-3 rounded-xl font-semibold text-base hover:bg-green-50 transition-all duration-300"
            >
              <span>🏢</span>
              <span>Servizio Ingrosso</span>
            </motion.button>
          </div>

          {/* Contact Info OTTIMIZZATA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 pt-6 border-t border-green-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm text-gray-600">
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
