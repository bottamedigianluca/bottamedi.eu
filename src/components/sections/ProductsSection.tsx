import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface ProductsSectionProps {
  language: 'it' | 'de'
  inView: boolean
}

const translations = {
  it: {
    title: 'Cosa trovi sul banco?',
    subtitle: 'Il tuo fruttivendolo a Mezzolombardo: oltre 150 varietà di frutta e verdura fresca, ortofrutta selezionata ogni giorno al mercato per il banchetto e per ristoranti e hotel della provincia di Trento',
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
          { name: 'Ciliegie Duroni', season: 'Mag-Lug', origin: 'Vignola/Trentino' },
          { name: 'Avocado', season: `Tutto l'anno`, origin: 'Spagna/Perù' },
          { name: 'Ananas', season: `Tutto l'anno`, origin: 'Costa Rica' },
          { name: 'Banane', season: `Tutto l'anno`, origin: 'Ecuador' },
          { name: 'Meloni', season: 'Giu-Set', origin: 'Mantova/Sicilia' },
          { name: 'Angurie', season: 'Giu-Ago', origin: 'Italia' },
          { name: 'Mele Pink Lady', season: 'Nov-Giu', origin: 'Val di Non' },
          { name: 'Limoni e Arance', season: 'Nov-Apr', origin: 'Sicilia' }
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
        description: `Le verdure arrivano dai campi del Trentino e del Veneto. Quando un ortaggio è di stagione qui, è quello che trovi sul banco.`,
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
          { name: 'Pomodori San Marzano', season: 'Lug-Set', origin: 'Campania' }
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
        shortDesc: 'Vini, succhi, confetture e prodotti tipici trentini',
        description: `Prodotti che vengono dalle valli qui intorno: mele della Val di Non, asparagi di Zambana, piccoli frutti di montagna, castagne e noci in autunno.`,
        longDescription: `Dalle valli qui intorno arrivano mele Melinda e Pink Lady dalla Val di Non, asparagi di Zambana in primavera, piccoli frutti di montagna d'estate, castagne e noci in autunno. Lavoriamo con produttori che conosciamo di persona.`,
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
          { name: 'More di rovo', season: 'Ago-Set', origin: 'Valli alpine' },
          { name: 'Vini del Trentino', season: `Tutto l'anno`, origin: 'Cantine locali' },
          { name: 'Succhi di mela', season: `Tutto l'anno`, origin: 'Val di Non' },
          { name: 'Confetture artigianali', season: `Tutto l'anno`, origin: 'Produttori trentini' },
          { name: 'Frutta disidratata', season: `Tutto l'anno`, origin: 'Selezione propria' },
          { name: 'Frutta secca e semi', season: `Tutto l'anno`, origin: 'Selezione propria' },
          { name: 'Sottoli e conserve', season: `Tutto l'anno`, origin: 'Produttori locali' },
          { name: 'Aceto e olio', season: `Tutto l'anno`, origin: 'Trentino e Italia' }
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
    title: 'Was gibt es am Stand?',
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
          { name: 'San Marzano Tomaten', season: 'Jul-Sep', origin: 'Kampanien' }
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
        shortDesc: 'Weine, Säfte, Konfitüren und typische Südtiroler Produkte',
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
          { name: 'Brombeeren', season: 'Aug-Sep', origin: 'Alpentäler' },
          { name: 'Südtiroler Weine', season: 'Ganzjährig', origin: 'Lokale Kellereien' },
          { name: 'Apfelsäfte', season: 'Ganzjährig', origin: 'Nonstal' },
          { name: 'Hausgemachte Konfitüren', season: 'Ganzjährig', origin: 'Lokale Erzeuger' },
          { name: 'Trockenobst', season: 'Ganzjährig', origin: 'Eigene Auswahl' },
          { name: 'Nüsse und Samen', season: 'Ganzjährig', origin: 'Eigene Auswahl' },
          { name: 'Eingelegtes und Konserven', season: 'Ganzjährig', origin: 'Lokale Erzeuger' },
          { name: 'Essig und Öl', season: 'Ganzjährig', origin: 'Südtirol und Italien' }
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

// Componente Card Mobile semplificato
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
  const shouldReduceMotion = useReducedMotion()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}
        
        <img
          src={category.image}
          srcSet={buildSrcSet(category.image)}
          width={1200}
          height={900}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={`${category.title} freschi di stagione al banchetto Bottamedi di Mezzolombardo`}
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
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
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Cosa trovi:</h4>
          <div className="flex flex-wrap gap-2">
            {/* Tutti i nomi visibili: nasconderne sette dietro un click li
                rendeva invisibili anche a chi cerca quel prodotto */}
            {category.products.map((product: any, i: number) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                {product.name}
              </span>
            ))}
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
          <span>{isExpanded ? 'Mostra Meno' : 'Scopri Tutti'}</span>
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
              // grid-template-rows invece di height:auto: quest'ultima
              // costringe framer-motion a misurare l'elemento a ogni frame,
              // forzando un reflow sincrono. Con la griglia l'animazione
              // resta sul compositor.
              initial={{ opacity: 0, gridTemplateRows: '0fr' }}
              animate={{ opacity: 1, gridTemplateRows: '1fr' }}
              exit={{ opacity: 0, gridTemplateRows: '0fr' }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid' }}
              className="mt-5 pt-5 border-t border-gray-100"
            >
              <div className="overflow-hidden min-h-0">
              <p className="text-gray-600 leading-relaxed mb-5 text-sm">
                {category.longDescription}
              </p>

              {/* Products List */}
              <div className="mb-5">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">La nostra selezione:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {category.products.map((product: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm">{product.name}</h5>
                        <p className="text-xs text-gray-600">{product.origin}</p>
                      </div>
                      <span className="bg-white text-gray-700 px-2 py-1 rounded-full text-xs">
                        {product.season}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">I nostri plus:</h4>
                <div className="space-y-2">
                  {category.features.map((feature: any, i: number) => (
                    <div key={i} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50">
                      <div className="text-lg">{feature.icon}</div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1 text-sm">{feature.title}</h5>
                        <p className="text-gray-600 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
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

// Componente Card Desktop
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
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
      >
        <div className="relative h-56 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          
          <img
            src={category.image}
            srcSet={buildSrcSet(category.image)}
            width={1200}
            height={900}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={`${category.title} freschi di stagione al banchetto Bottamedi di Mezzolombardo`}
            className="w-full h-full object-cover"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
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


// Le card prodotto usano <img> semplici invece di OptimizedImage: senza
// srcSet scaricavano l'originale a piena risoluzione (fino a 4032px) per
// una card di poche centinaia di pixel.
const VARIANT_WIDTHS = [640, 1024, 1600]
const buildSrcSet = (src: string): string | undefined => {
  const m = src.match(/^\/images\/(.+)\.webp$/)
  if (!m) return undefined
  return VARIANT_WIDTHS.map(w => `/images/${m[1]}-${w}w.webp ${w}w`).join(', ')
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ language, inView }) => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion()
  
  const t = useMemo(() => translations[language], [language])

  const handleMobileToggle = useCallback((index: number) => {
    setExpandedMobile(prev => prev === index ? null : index)
  }, [])

  const handleDesktopClick = useCallback((index: number) => {
    setActiveCategory(index)
  }, [])

  return (
    <section id="products" className="py-20 lg:py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
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

        {/* LAYOUT RESPONSIVE SEMPLIFICATO - Solo CSS, no JavaScript mobile logic */}
        
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

        {/* Desktop Details Panel */}
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
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Esempi della nostra selezione:</h4>
                <p className="text-sm text-gray-500 mb-4 italic">*Disponibilità variabile secondo stagione, qualità e mercato</p>
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-3xl p-8 lg:p-12 mt-16 border border-green-200 shadow-lg"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              {language === 'it' 
                ? 'Vieni a Scoprire la Qualità Bottamedi' 
                : 'Entdecken Sie die Bottamedi-Qualität'
              }
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              {language === 'it'
                ? 'Visita il nostro banchetto in Via Cavalleggeri Udine a Mezzolombardo e lasciati guidare dalla nostra esperienza di 50 anni.'
                : 'Besuchen Sie unseren Marktstand in der Via Cavalleggeri Udine in Mezzolombardo und lassen Sie sich von unserer 50-jährigen Erfahrung leiten.'
              }
            </p>
          </div>
          
          {/* Grid caratteristiche */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: '🌅',
                title: language === 'it' ? 'Selezione Mattutina' : 'Morgendliche Auswahl',
                desc: language === 'it' ? 'Prodotti freschi alle prime ore' : 'Frische Produkte am frühen Morgen'
              },
              {
                icon: '🏔️',
                title: language === 'it' ? 'Territorio Trentino' : 'Südtiroler Gebiet',
                desc: language === 'it' ? 'Prodotti delle valli vicine' : 'Produkte aus den Tälern'
              },
              {
                icon: '👨‍👩‍👧‍👦',
                title: language === 'it' ? 'Dal 1974' : 'Seit 1974',
                desc: language === 'it' ? '3 generazioni di esperienza' : '3 Generationen Erfahrung'
              },
              {
                icon: '⭐',
                title: language === 'it' ? 'Qualità Garantita' : 'Garantierte Qualität',
                desc: language === 'it' ? 'Standard elevati da 50 anni' : 'Hohe Standards seit 50 Jahren'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                <div className="text-2xl mb-2 text-center">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 text-sm text-center mb-1">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-xs text-center">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const element = document.getElementById('dettaglio')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>🛒</span>
              <span>{language === 'it' ? 'Visita il Banchetto' : 'Besuchen Sie den Marktstand'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const element = document.getElementById('wholesale')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center justify-center space-x-2 border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300"
            >
              <span>🏢</span>
              <span>{language === 'it' ? 'Servizio Ingrosso' : 'Großhandel Service'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProductsSection
