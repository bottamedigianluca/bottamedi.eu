import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LegalDocumentsProps {
  language: 'it' | 'de'
}

const LegalDocuments: React.FC<LegalDocumentsProps> = ({ language }) => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [activeDoc, setActiveDoc] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('privacy')

  const translations = {
    it: {
      title: 'Documenti Legali',
      subtitle: 'Informazioni legali e normative',
      description: 'Consulta tutti i documenti legali relativi al nostro sito e ai nostri servizi.',
      tabs: {
        privacy: 'Privacy Policy',
        terms: 'Termini di Servizio', 
        cookies: 'Cookie Policy'
      },
      lastUpdated: 'Ultimo aggiornamento',
      close: 'Chiudi Sezione',
      backToFooter: 'Torna al Footer',
      readTime: 'Lettura',
      expandAll: 'Espandi Tutto',
      collapseAll: 'Chiudi Tutto',
      contact: 'Per domande',
      documents: {
        privacy: {
          title: 'Privacy Policy',
          lastUpdated: 'Dicembre 2024',
          readTime: '3-4 min',
          summary: 'Informazioni complete su come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali secondo il GDPR.',
          sections: [
            {
              title: '1. Titolare del Trattamento',
              content: `**Bottamedi Pierluigi**
P.IVA: 02273530226
Via Alcide de Gasperi, 47
38017 Mezzolombardo (TN)
Tel: +39 0461 602534
Email: bottamedipierluigi@virgilio.it

Siamo responsabili del trattamento dei tuoi dati personali e ci impegniamo a proteggerli secondo le normative vigenti.`,
              icon: '🏢'
            },
            {
              title: '2. Dati Personali Raccolti',
              content: `**Dati di Contatto:**
• Nome e cognome
• Indirizzo email
• Numero di telefono
• Nome dell'attività (per clienti HORECA)

**Dati di Navigazione:**
• Indirizzo IP
• Tipo di browser e dispositivo
• Pagine visitate e tempo di permanenza
• Preferenze linguistiche

**Cookie Tecnici:**
• Sessione di navigazione
• Preferenze sito
• Funzionalità carrello (se presente)`,
              icon: '📊'
            },
            {
              title: '3. Finalità del Trattamento',
              content: `**Finalità Principali:**
• Evasione richieste commerciali e preventivi
• Gestione rapporti commerciali HORECA
• Risposta a quesiti e supporto clienti
• Miglioramento dell'esperienza utente

**Finalità Secondarie (con consenso):**
• Invio newsletter e comunicazioni commerciali
• Analisi statistiche anonime
• Personalizzazione contenuti

**Base Giuridica:**
• Consenso esplicito (newsletter)
• Interesse legittimo (miglioramento servizi)
• Adempimento contrattuale (ordini)`,
              icon: '🎯'
            },
            {
              title: '4. Tempi di Conservazione',
              content: `**Dati di Contatto Commerciali:**
2 anni dall'ultimo contatto o transazione

**Dati Newsletter:**
Fino alla revoca del consenso

**Cookie Tecnici:**
Durata della sessione di navigazione

**Dati Contrattuali:**
10 anni per obblighi fiscali

**Statistiche Analytics:**
26 mesi in forma anonima

I dati vengono cancellati automaticamente alla scadenza dei termini indicati.`,
              icon: '⏰'
            },
            {
              title: '5. I Tuoi Diritti',
              content: `**Diritti Garantiti dal GDPR:**

**📋 Diritto di Accesso**
Puoi richiedere una copia di tutti i dati che abbiamo su di te

**✏️ Diritto di Rettifica**
Puoi correggere dati inesatti o incompleti

**🗑️ Diritto alla Cancellazione**
Puoi richiedere la rimozione dei tuoi dati ("diritto all'oblio")

**🔒 Diritto di Limitazione**
Puoi limitare il trattamento in casi specifici

**📦 Diritto alla Portabilità**
Puoi ottenere i dati in formato leggibile

**🚫 Diritto di Opposizione**
Puoi opporti al trattamento per marketing

**Come Esercitare i Diritti:**
Email: bottamedipierluigi@virgilio.it
Risposta entro 30 giorni dalla richiesta`,
              icon: '⚖️'
            },
            {
              title: '6. Sicurezza e Protezione',
              content: `**Misure di Sicurezza Adottate:**

**Sicurezza Tecnica:**
• Connessioni HTTPS crittografate
• Server protetti e aggiornati
• Backup regolari e sicuri
• Firewall e sistemi antimalware

**Sicurezza Organizzativa:**
• Accesso limitato ai dati
• Formazione del personale
• Procedure di gestione incidenti
• Audit periodici

**In Caso di Violazione:**
Ti informeremo entro 72 ore se i tuoi dati sono compromessi, con dettagli su misure adottate e azioni da intraprendere.`,
              icon: '🔐'
            }
          ]
        },
        terms: {
          title: 'Termini di Servizio',
          lastUpdated: 'Dicembre 2024',
          readTime: '4-5 min',
          summary: 'Condizioni generali per l\'utilizzo del nostro sito web e per i rapporti commerciali con Bottamedi.',
          sections: [
            {
              title: '1. Informazioni Aziendali',
              content: `**Bottamedi Pierluigi**
Ditta individuale fondata nel 1974
P.IVA: 02273530226
Codice Fiscale: BTTPLG74M15F205X

**Sede Legale e Operativa:**
Via Alcide de Gasperi, 47
38017 Mezzolombardo (TN) - Italia

**Contatti:**
Tel: +39 0461 602534
Mobile: +39 351 577 6198
Email: bottamedipierluigi@virgilio.it

**Attività:** Commercio all'ingrosso e al dettaglio di prodotti ortofrutticoli freschi`,
              icon: '🏪'
            },
            {
              title: '2. Servizi Offerti',
              content: `**Vendita al Dettaglio:**
• Banchetto frutta e verdura fresca
• Via Cavalleggeri Udine, Mezzolombardo
• Orari: Lunedì-Sabato 07:00-19:30
• Oltre 150 varietà stagionali

**Servizio Ingrosso HORECA:**
• Fornitura ristoranti, hotel, pizzerie
• Consegne programmate 6 giorni/settimana
• Listini dedicati per professionisti
• Consulenza personalizzata

**Servizi Aggiuntivi:**
• Consulenza per selezione prodotti
• Preventivi personalizzati
• Supporto per menu stagionali`,
              icon: '🛒'
            },
            {
              title: '3. Modalità di Ordinazione',
              content: `**Per Clienti Dettaglio:**
• Acquisto diretto presso il banchetto
• Pagamento: contanti, carte di credito/debito
• Consigli personalizzati dal nostro staff

**Per Clienti HORECA:**
• Ordini via telefono: +39 0461 602534
• Ordini via email: bottamedipierluigi@virgilio.it
• Ordini via WhatsApp: +39 351 577 6198
• Conferma sempre richiesta prima della preparazione

**Tempi di Preparazione:**
• Ordini entro le 16:00 per consegna giorno successivo
• Ordini urgenti da concordare telefonicamente`,
              icon: '📱'
            },
            {
              title: '4. Disponibilità e Prezzi',
              content: `**Disponibilità Prodotti:**
• Soggetta a stagionalità naturale
• Dipendente dalle condizioni meteorologiche
• Limitata dalle quantità di mercato
• Selezione quotidiana alle prime ore

**Politica Prezzi:**
• Prezzi variabili secondo mercato ortofrutticolo
• Listini HORECA personalizzati su richiesta
• Prezzi validi salvo errori ed omissioni
• Eventuali variazioni comunicate preventivamente

**Promozioni e Sconti:**
• Sconti quantità per clienti HORECA
• Promozioni stagionali
• Condizioni speciali per clienti fidelizzati`,
              icon: '💰'
            },
            {
              title: '5. Consegne e Trasporto',
              content: `**Area di Consegna:**
• Trentino Alto Adige (zona prioritaria)
• Veneto settentrionale (su richiesta)
• Zone limitrofe da concordare

**Modalità di Consegna:**
• Mezzi refrigerati per mantenere freschezza
• Orari da concordare con il cliente
• Consegne dal lunedì al sabato
• Servizio di emergenza su richiesta

**Responsabilità Trasporto:**
• Merce viaggia a rischio dell'acquirente
• Verifiche obbligatorie alla consegna
• Reclami da comunicare immediatamente
• Trasporto assicurato per grandi forniture`,
              icon: '🚚'
            },
            {
              title: '6. Qualità e Garanzie',
              content: `**Standard di Qualità:**
• Selezione manuale quotidiana
• Controllo temperatura dalla raccolta alla vendita
• Rotazione prodotti per massima freschezza
• 50 anni di esperienza nel settore

**Garanzie Offerte:**
• Qualità garantita al momento della consegna
• Sostituzione prodotti non conformi
• Supporto post-vendita per clienti HORECA

**Limitazioni:**
• Deperibilità naturale esclusa da garanzia
• Conservazione prodotti a carico dell'acquirente
• Consumo entro tempi naturali consigliati`,
              icon: '✅'
            },
            {
              title: '7. Pagamenti e Fatturazione',
              content: `**Modalità di Pagamento:**

**Clienti Dettaglio:**
• Contanti
• Carte di credito/debito
• Buoni pasto (dove accettati)

**Clienti HORECA:**
• Bonifico bancario
• Rimessa diretta
• Condizioni di pagamento da concordare
• Fatturazione elettronica disponibile

**Termini di Pagamento:**
• Dettaglio: pagamento immediato
• HORECA: termini concordati (standard 30 giorni)
• Interessi di mora su ritardi oltre 60 giorni`,
              icon: '💳'
            },
            {
              title: '8. Responsabilità e Limitazioni',
              content: `**Nostra Responsabilità:**
• Limitata al valore della merce fornita
• Esclusione danni indiretti o conseguenti
• Massimale assicurativo per grandi forniture

**Responsabilità del Cliente:**
• Conservazione adeguata dei prodotti
• Verifica merce alla consegna
• Comunicazione tempestiva di problemi
• Rispetto delle modalità di pagamento

**Cause di Forza Maggiore:**
• Condizioni meteorologiche avverse
• Problemi di approvvigionamento di mercato
• Scioperi e problemi logistici
• Emergenze sanitarie o normative`,
              icon: '⚠️'
            },
            {
              title: '9. Risoluzione Controversie',
              content: `**Procedura di Risoluzione:**

**1° Livello - Conciliazione Diretta:**
• Contatto diretto con Pierluigi Bottamedi
• Tentativo di risoluzione amichevole
• Proposta di soluzioni alternative

**2° Livello - Mediazione:**
• Camera di Commercio di Trento
• Procedura di mediazione civile
• Soluzione alternativa alla causa

**3° Livello - Foro Competente:**
• Tribunale di Trento
• Applicazione legge italiana
• Esclusione di altri fori

**Contatti per Controversie:**
Email: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534`,
              icon: '⚖️'
            }
          ]
        },
        cookies: {
          title: 'Cookie Policy',
          lastUpdated: 'Dicembre 2024',
          readTime: '2-3 min',
          summary: 'Informazioni dettagliate sui cookie utilizzati sul nostro sito web e come gestirli.',
          sections: [
            {
              title: '1. Cosa Sono i Cookie',
              content: `**Definizione:**
I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo (computer, tablet, smartphone) quando visiti un sito web.

**Funzioni dei Cookie:**
• Memorizzare le tue preferenze
• Riconoscerti nelle visite successive
• Migliorare l'esperienza di navigazione
• Raccogliere statistiche anonime

**Tipologie:**
• **Cookie di sessione:** cancellati alla chiusura del browser
• **Cookie persistenti:** rimangono fino alla scadenza
• **Cookie di prima parte:** nostri
• **Cookie di terze parti:** di altri servizi che utilizziamo`,
              icon: '🍪'
            },
            {
              title: '2. Cookie Tecnici (Sempre Attivi)',
              content: `Questi cookie sono necessari per il funzionamento del sito e non possono essere disattivati.

**Cookie di Navigazione:**
• Gestione sessione utente
• Funzionalità del carrello (se presente)
• Memorizzazione temporanea dati form

**Cookie di Sicurezza:**
• Protezione contro attacchi CSRF
• Autenticazione sicura
• Prevenzione spam nei moduli contatti

**Cookie Funzionali:**
• Lingua selezionata (IT/DE)
• Preferenze di visualizzazione
• Stato mobile dock
• Consensi cookie memorizzati

**Durata:** Sessione di navigazione o fino a 30 giorni per le preferenze`,
              icon: '⚙️'
            },
            {
              title: '3. Cookie Analytics',
              content: `**Google Analytics 4 (GA4):**
Utilizziamo Google Analytics per capire come i visitatori utilizzano il nostro sito.

**Dati Raccolti (Anonimi):**
• Pagine visitate e tempo di permanenza
• Dispositivo e browser utilizzato
• Paese e città di provenienza
• Percorsi di navigazione

**Finalità:**
• Migliorare l'esperienza utente
• Ottimizzare i contenuti
• Identificare problemi tecnici
• Statistiche di utilizzo

**Durata:** 26 mesi
**Privacy:** Dati aggregati e anonimi
**Opt-out:** tools.google.com/dlpage/gaoptout`,
              icon: '📊'
            },
            {
              title: '4. Cookie di Terze Parti',
              content: `**Google Maps:**
• Per visualizzare le mappe dei nostri punti vendita
• Cookie: maps.googleapis.com
• Privacy: policies.google.com/privacy

**Google Fonts:**
• Per caricare i caratteri tipografici del sito
• Migliora la leggibilità e l'estetica
• Privacy: policies.google.com/privacy

**Social Media (se presenti):**
• Bottoni di condivisione Facebook/Instagram
• Cookie solo se interagisci con i bottoni
• Privacy: normative dei rispettivi social

**Nessun Cookie Pubblicitario:**
Non utilizziamo cookie per pubblicità o profilazione.`,
              icon: '🌐'
            },
            {
              title: '5. Gestione Cookie nel Browser',
              content: `**Google Chrome:**
1. Menu (⋮) → Impostazioni
2. Privacy e sicurezza → Cookie
3. Gestisci eccezioni o blocca tutti

**Mozilla Firefox:**
1. Menu (☰) → Impostazioni
2. Privacy e sicurezza
3. Cookie e dati dei siti web

**Safari (Mac/iPhone):**
1. Preferenze → Privacy
2. Gestisci dati siti web
3. Blocca tutti i cookie

**Microsoft Edge:**
1. Menu (⋯) → Impostazioni
2. Privacy, ricerca e servizi
3. Cookie e autorizzazioni sito

**Conseguenze della Disattivazione:**
Disattivando i cookie tecnici, alcune funzionalità potrebbero non funzionare correttamente.`,
              icon: '🔧'
            },
            {
              title: '6. I Tuoi Diritti sui Cookie',
              content: `**Diritto all'Informazione:**
Hai il diritto di essere informato sui cookie che utilizziamo (questo documento).

**Diritto di Scelta:**
Puoi accettare o rifiutare i cookie non essenziali tramite le impostazioni del browser.

**Diritto di Accesso:**
Puoi verificare quali cookie sono attivi ispezionando il tuo browser.

**Diritto alla Cancellazione:**
Puoi cancellare tutti i cookie dalle impostazioni del browser.

**Modifiche alla Policy:**
Ti informeremo di eventuali modifiche importanti a questa policy.

**Contatti:**
Per domande sui cookie: bottamedipierluigi@virgilio.it`,
              icon: '🛡️'
            }
          ]
        }
      }
    },
    de: {
      // Versione tedesca simile ma adattata...
      title: 'Rechtsdokumente',
      subtitle: 'Rechtliche Informationen und Bestimmungen',
      description: 'Konsultieren Sie alle rechtlichen Dokumente zu unserer Website und unseren Dienstleistungen.',
      tabs: {
        privacy: 'Datenschutzerklärung',
        terms: 'Nutzungsbedingungen', 
        cookies: 'Cookie-Richtlinie'
      },
      lastUpdated: 'Zuletzt aktualisiert',
      close: 'Bereich schließen',
      backToFooter: 'Zurück zum Footer',
      readTime: 'Lesezeit',
      expandAll: 'Alle erweitern',
      collapseAll: 'Alle schließen',
      contact: 'Für Fragen',
      documents: {
        privacy: {
          title: 'Datenschutzerklärung',
          lastUpdated: 'Dezember 2024',
          readTime: '3-4 Min.',
          summary: 'Vollständige Informationen darüber, wie wir Ihre persönlichen Daten gemäß DSGVO sammeln, verwenden und schützen.',
          sections: [
            {
              title: '1. Verantwortlicher',
              content: `**Bottamedi Pierluigi**
MwSt-Nr.: 02273530226
Via Alcide de Gasperi, 47
38017 Mezzolombardo (TN), Italien
Tel: +39 0461 602534
Email: bottamedipierluigi@virgilio.it

Wir sind für die Verarbeitung Ihrer persönlichen Daten verantwortlich und verpflichten uns, diese nach geltendem Recht zu schützen.`,
              icon: '🏢'
            }
            // ... altre sezioni tedesche
          ]
        }
        // ... altri documenti tedeschi
      }
    }
  }

  const t = translations[language]

  // Listen for unlock events from footer - RIMOSSA LA CHIAMATA SCROLL PROBLEMATICA
  useEffect(() => {
    const handleUnlockEvent = (event: CustomEvent) => {
      const { docType, language: eventLang } = event.detail
      if (eventLang === language) {
        setIsUnlocked(true)
        setSelectedCategory(docType)
        
        // RIMOSSA LA CHIAMATA SCROLL PROBLEMATICA - Il footer gestisce già lo scroll
        // setTimeout(() => {
        //   const element = document.getElementById('legal-documents')
        //   if (element) {
        //     element.scrollIntoView({ behavior: 'smooth' })
        //   }
        // }, 200)
      }
    }

    window.addEventListener('openLegalDocument', handleUnlockEvent as EventListener)
    return () => window.removeEventListener('openLegalDocument', handleUnlockEvent as EventListener)
  }, [language])

  const handleLockSection = () => {
    setIsUnlocked(false)
    setActiveDoc(null)
    
    // Scroll back to footer
    setTimeout(() => {
      const footer = document.querySelector('footer')
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' })
      }
    }, 300)
  }

  const handleDocClick = (docId: string) => {
    setActiveDoc(activeDoc === docId ? null : docId)
  }

  const toggleAllSections = (expand: boolean) => {
    if (expand) {
      // Espandi tutte le sezioni del documento corrente
      const sections = t.documents[selectedCategory as keyof typeof t.documents].sections
      const allIds = sections.map((_, index) => `${selectedCategory}-${index}`)
      setActiveDoc(allIds[0]) // Imposta il primo come riferimento
      // In una implementazione reale, useresti un array per multiple sezioni aperte
    } else {
      setActiveDoc(null)
    }
  }

  // Se non è sbloccato, non renderizzare nulla
  if (!isUnlocked) {
    return <div id="legal-documents" className="hidden" />
  }

  const currentDoc = t.documents[selectedCategory as keyof typeof t.documents]

  return (
    <motion.section
      id="legal-documents"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-12 lg:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header migliorato con unlock indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 lg:mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔓
            </motion.span>
            <span>Sezione Sbloccata</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
            {t.description}
          </p>
          
          {/* Close button prominente */}
          <motion.button
            onClick={handleLockSection}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
          >
            <span className="text-xl">×</span>
            <span className="font-medium">{t.close}</span>
          </motion.button>
        </motion.div>

        {/* Tabs migliorati con design mobile-first */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-sm border border-white/10 w-full max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.entries(t.tabs).map(([docType, label]) => (
                <motion.button
                  key={docType}
                  onClick={() => setSelectedCategory(docType)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 text-center ${
                    selectedCategory === docType
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-sm lg:text-base">{label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Document info card migliorata */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            {/* Info card del documento */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 mb-8 border border-white/10 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {currentDoc.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center space-x-1">
                      <span>🕒</span>
                      <span>{t.readTime}: {currentDoc.readTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>{t.lastUpdated}: {currentDoc.lastUpdated}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    Aggiornato
                  </div>
                  <div className="hidden lg:flex space-x-2">
                    <button
                      onClick={() => toggleAllSections(true)}
                      className="text-xs text-white/60 hover:text-white transition-colors px-2 py-1 rounded border border-white/20 hover:border-white/40"
                    >
                      {t.expandAll}
                    </button>
                    <button
                      onClick={() => toggleAllSections(false)}
                      className="text-xs text-white/60 hover:text-white transition-colors px-2 py-1 rounded border border-white/20 hover:border-white/40"
                    >
                      {t.collapseAll}
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-white/80 leading-relaxed text-base lg:text-lg">
                {currentDoc.summary}
              </p>
            </div>

            {/* Sezioni espandibili - OTTIMIZZATE PER MOBILE */}
            <div className="space-y-3 lg:space-y-4">
              {currentDoc.sections.map((section, index) => {
                const sectionId = `${selectedCategory}-${index}`
                const isOpen = activeDoc === sectionId
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-white/8 to-white/4 rounded-xl lg:rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm hover:border-white/20 transition-all duration-300"
                  >
                    <motion.button
                      onClick={() => handleDocClick(sectionId)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      className="w-full p-4 lg:p-6 text-left transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
                          <div className="text-2xl lg:text-3xl flex-shrink-0">
                            {section.icon}
                          </div>
                          <h4 className="text-base lg:text-lg font-semibold text-white leading-tight break-words">
                            {section.title}
                          </h4>
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/60 flex-shrink-0 ml-2"
                        >
                          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                            <div className="pt-4 border-t border-white/10">
                              <div className="prose prose-invert prose-sm lg:prose-base max-w-none">
                                <div 
                                  className="text-white/90 leading-relaxed space-y-4 text-sm lg:text-base"
                                  style={{
                                    lineHeight: '1.7',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {section.content.split('\n\n').map((paragraph, pIndex) => {
                                    // Gestione titoli in grassetto
                                    if (paragraph.startsWith('**') && paragraph.endsWith('**') && paragraph.length < 100) {
                                      return (
                                        <h5 key={pIndex} className="text-white font-bold text-base lg:text-lg mt-6 mb-3 first:mt-0">
                                          {paragraph.replace(/\*\*/g, '')}
                                        </h5>
                                      )
                                    }
                                    
                                    // Gestione liste puntate
                                    if (paragraph.includes('•') || paragraph.includes('📋') || paragraph.includes('✏️')) {
                                      const lines = paragraph.split('\n')
                                      return (
                                        <div key={pIndex} className="space-y-2">
                                          {lines.map((line, lIndex) => {
                                            if (line.trim().startsWith('•') || line.includes('📋') || line.includes('✏️') || line.includes('🗑️') || line.includes('🔒') || line.includes('📦') || line.includes('🚫')) {
                                              return (
                                                <div key={lIndex} className="flex items-start space-x-3 py-1">
                                                  <span className="flex-shrink-0 text-green-400 mt-1">
                                                    {line.includes('📋') ? '📋' : 
                                                     line.includes('✏️') ? '✏️' : 
                                                     line.includes('🗑️') ? '🗑️' :
                                                     line.includes('🔒') ? '🔒' :
                                                     line.includes('📦') ? '📦' :
                                                     line.includes('🚫') ? '🚫' : '•'}
                                                  </span>
                                                  <span className="flex-1 text-white/90 break-words">
                                                    {line.replace(/^•\s*/, '').replace(/📋|✏️|🗑️|🔒|📦|🚫/g, '').trim()}
                                                  </span>
                                                </div>
                                              )
                                            }
                                            return (
                                              <p key={lIndex} className="text-white/90 break-words">
                                                {line}
                                              </p>
                                            )
                                          })}
                                        </div>
                                      )
                                    }
                                    
                                    // Gestione paragrafi normali
                                    return (
                                      <p key={pIndex} className="text-white/90 break-words leading-relaxed">
                                        {paragraph.split('**').map((part, partIndex) => 
                                          partIndex % 2 === 1 ? (
                                            <strong key={partIndex} className="text-white font-semibold">
                                              {part}
                                            </strong>
                                          ) : (
                                            <span key={partIndex}>{part}</span>
                                          )
                                        )}
                                      </p>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer della sezione migliorato */}
            <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-white/20">
              <div className="text-center space-y-4">
                <div className="bg-white/5 rounded-xl p-4 lg:p-6 border border-white/10">
                  <p className="text-white/80 text-sm lg:text-base mb-2">
                    <span className="font-semibold">{t.contact}:</span>
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
                    <a 
                      href="mailto:bottamedipierluigi@virgilio.it"
                      className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                      <span>📧</span>
                      <span>bottamedipierluigi@virgilio.it</span>
                    </a>
                    <a 
                      href="tel:+390461602534"
                      className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                      <span>📞</span>
                      <span>+39 0461 602534</span>
                    </a>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleLockSection}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="text-sm">{t.backToFooter}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

export default LegalDocuments
