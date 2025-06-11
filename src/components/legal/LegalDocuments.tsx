import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface LegalDocumentsProps {
  language: 'it' | 'de'
}

const LegalDocuments: React.FC<LegalDocumentsProps> = ({ language }) => {
  const [activeDoc, setActiveDoc] = useState<string | null>(null)

  const translations = {
    it: {
      title: 'Documenti Legali',
      subtitle: 'Informazioni legali e normative per la trasparenza aziendale',
      documents: {
        privacy: 'Privacy Policy',
        terms: 'Termini e Condizioni',
        cookies: 'Cookie Policy'
      },
      privacy: {
        title: 'INFORMATIVA SULLA PRIVACY',
        lastUpdate: 'Ultimo aggiornamento: Giugno 2025',
        content: `**TITOLARE DEL TRATTAMENTO**
Bottamedi Pierluigi - Frutta e Verdura
Via Alcide de Gasperi, 47 - 38017 Mezzolombardo (TN)
P.IVA: 02273530226
Email: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534

**DATI RACCOLTI**
• Dati di contatto (nome, cognome, email, telefono)
• Dati di navigazione (cookie tecnici necessari)
• Dati analytics anonimi (solo se consenso prestato)
• Dati per richieste preventivi e ordini HORECA
• Informazioni sull'attività commerciale (per servizi B2B)

**FINALITÀ DEL TRATTAMENTO**
• Rispondere alle richieste di informazioni e preventivi
• Gestire ordini e forniture per il settore HORECA
• Fornire assistenza clienti e supporto tecnico
• Migliorare il servizio offerto attraverso feedback
• Marketing diretto (solo con consenso esplicito e revocabile)
• Adempimenti fiscali e contabili obbligatori per legge

**BASE GIURIDICA DEL TRATTAMENTO**
• Esecuzione di misure precontrattuali (art. 6.1.b GDPR)
• Legittimo interesse per analytics e miglioramento servizi (art. 6.1.f GDPR)
• Consenso libero e specifico per marketing (art. 6.1.a GDPR)
• Obbligo legale per adempimenti fiscali (art. 6.1.c GDPR)

**PERIODO DI CONSERVAZIONE**
I dati saranno conservati per il tempo strettamente necessario alle finalità specifiche:
• Dati contrattuali: 10 anni (normativa fiscale)
• Dati marketing: fino a revoca del consenso
• Dati di navigazione: max 26 mesi (analytics)
• Cookie tecnici: durata della sessione

**COMUNICAZIONE A TERZI**
I dati non vengono comunicati a terzi, salvo:
• Obbligo di legge (autorità fiscali, tributarie)
• Prestatori di servizi tecnici (hosting, delivery)
• Partner commerciali autorizzati (solo per servizi HORECA)

**DIRITTI DELL'INTERESSATO (GDPR)**
Hai il diritto di:
• Accesso ai tuoi dati personali (art. 15 GDPR)
• Rettifica di dati inesatti (art. 16 GDPR)
• Cancellazione/oblio dei dati (art. 17 GDPR)
• Limitazione del trattamento (art. 18 GDPR)
• Portabilità dei dati (art. 20 GDPR)
• Opposizione al trattamento (art. 21 GDPR)
• Revoca del consenso in qualsiasi momento (art. 7.3 GDPR)
• Reclamo al Garante Privacy (art. 77 GDPR)

**COME ESERCITARE I DIRITTI**
Per esercitare i tuoi diritti contattaci:
Email: bottamedipierluigi@virgilio.it
Telefono: +39 0461 602534
Indirizzo: Via A. de Gasperi, 47 - 38017 Mezzolombardo (TN)

Ti risponderemo entro 30 giorni dalla richiesta.

**SICUREZZA DEI DATI**
Adottiamo misure di sicurezza adeguate per proteggere i tuoi dati personali contro accessi non autorizzati, alterazioni, divulgazioni o distruzioni illecite.`
      },
      terms: {
        title: 'TERMINI E CONDIZIONI DI UTILIZZO',
        lastUpdate: 'Ultimo aggiornamento: Giugno 2025',
        content: `**1. PREMESSA E AMBITO DI APPLICAZIONE**
I presenti termini e condizioni ("Termini") regolano l'utilizzo del sito web bottamedi.eu e l'accesso ai servizi offerti da Bottamedi Pierluigi.

**2. IDENTIFICAZIONE DEL GESTORE**
Bottamedi Pierluigi - Frutta e Verdura
Via A. de Gasperi, 47 - 38017 Mezzolombardo (TN)
P.IVA: 02273530226
Email: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534

**3. SERVIZI OFFERTI**
• Vendita al dettaglio di frutta e verdura fresca presso il banchetto
• Servizio di fornitura ingrosso per ristoranti, hotel, pizzerie (HORECA)
• Informazioni sui prodotti disponibili e stagionalità
• Servizio preventivi personalizzati per attività commerciali
• Consulenza per la selezione di prodotti ortofrutticoli

**4. MODALITÀ DI UTILIZZO DEL SITO**
Il sito è destinato esclusivamente a:
• Utenti maggiorenni o minori con autorizzazione genitoriale
• Finalità commerciali lecite e conformi alla legge
• Consultazione informazioni e richiesta preventivi

È espressamente vietato l'uso per:
• Scopi illegali o dannosi
• Invio di contenuti diffamatori o offensivi
• Tentativi di accesso non autorizzato ai sistemi

**5. ORDINI, PREVENTIVI E CONDIZIONI COMMERCIALI**
• Tutti gli ordini devono essere confermati telefonicamente
• I prezzi sono soggetti a variazioni di mercato e stagionalità
• La disponibilità dei prodotti dipende dalla stagione e dalle condizioni meteorologiche
• Le condizioni di pagamento vengono concordate caso per caso
• Le consegne sono effettuate secondo accordi specifici

**6. PROPRIETÀ INTELLETTUALE**
Tutti i contenuti del sito (testi, immagini, loghi, marchi) sono di proprietà esclusiva di Bottamedi Pierluigi e sono protetti dalle normative sul diritto d'autore. È vietata la riproduzione non autorizzata.

**7. LIMITAZIONE DI RESPONSABILITÀ**
Bottamedi Pierluigi non è responsabile per:
• Danni indiretti derivanti dall'uso del sito web
• Interruzioni temporanee del servizio per manutenzione
• Variazioni di prezzo dei prodotti dovute al mercato
• Ritardi nelle consegne dovuti a cause di forza maggiore

**8. PRIVACY E TRATTAMENTO DATI**
L'utilizzo del sito è soggetto alla Privacy Policy e Cookie Policy, consultabili sul sito stesso.

**9. MODIFICHE AI TERMINI**
Bottamedi si riserva il diritto di modificare questi termini previa comunicazione sul sito web e notifica ai clienti registrati.

**10. RISOLUZIONE CONTROVERSIE**
Per qualsiasi controversia si applica la legge italiana. 
Foro competente: Tribunale di Trento.

**11. CONTATTI PER CHIARIMENTI**
Per qualsiasi domanda sui presenti termini:
Email: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534`
      },
      cookies: {
        title: 'COOKIE POLICY',
        lastUpdate: 'Ultimo aggiornamento: Giugno 2025',
        content: `**COSA SONO I COOKIE**
I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Servono a migliorare la tua esperienza di navigazione e permettere alcune funzionalità del sito.

**TIPOLOGIE DI COOKIE UTILIZZATI**

**1. COOKIE TECNICI (sempre attivi - non richiedono consenso)**
• Cookie di sessione per il funzionamento base del sito
• Cookie di sicurezza e prevenzione frodi
• Cookie per le preferenze linguistiche (IT/DE)
• Cookie per il carrello acquisti e navigazione

**2. COOKIE ANALYTICS (richiedono consenso)**
• Google Analytics per statistiche anonime di utilizzo
• Dati aggregati su pagine più visitate
• Analisi del comportamento utenti (bounce rate, tempo di permanenza)
• Informazioni su dispositivi e browser utilizzati
• Dati geografici aggregati (solo a livello di città)

**3. COOKIE DI MARKETING (richiedono consenso)**
• Cookie per remarketing Google Ads
• Integrazione con social media (Facebook, Instagram)
• Pubblicità personalizzata basata sugli interessi
• Tracciamento delle conversioni e ROI

**COOKIE DI TERZE PARTI UTILIZZATI**
• Google Analytics: per statistiche anonime
  Info: analytics.google.com/analytics/academy
• Google Ads: per pubblicità mirata
  Info: policies.google.com/privacy
• Facebook Pixel: per integrazione social
  Info: facebook.com/privacy/explanation

**COME GESTIRE LE TUE PREFERENZE**
Puoi modificare le preferenze sui cookie in diversi modi:

1. **Banner del sito**: Al primo accesso puoi scegliere quali accettare
2. **Impostazioni browser**: 
   - Chrome: Impostazioni → Privacy e sicurezza → Cookie
   - Firefox: Opzioni → Privacy e sicurezza → Cronologia
   - Safari: Preferenze → Privacy → Cookie e dati di siti web
3. **Link "Gestisci Cookie"**: Presente nel footer del sito

**DURATA DEI COOKIE**
• Cookie di sessione: eliminati automaticamente alla chiusura del browser
• Cookie persistenti: durata variabile da 1 mese a 2 anni
• Cookie analytics: massimo 26 mesi
• Cookie marketing: massimo 13 mesi

**CONSEGUENZE DELLA DISABILITAZIONE**
La disabilitazione dei cookie può limitare alcune funzionalità:
• Cookie tecnici: possibili problemi di navigazione
• Cookie analytics: non influisce sulla navigazione
• Cookie marketing: nessun impatto sulla funzionalità

**BASE LEGALE E NORMATIVE**
La gestione dei cookie è regolata da:
• Regolamento UE 2016/679 (GDPR)
• Codice Privacy italiano (D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018)
• Linee guida del Garante per la protezione dei dati personali

**CONTATTI**
Per domande sui cookie:
Email: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534`
      }
    },
    de: {
      title: 'Rechtsdokumente',
      subtitle: 'Rechtliche Informationen und Vorschriften für Unternehmenstransparenz',
      documents: {
        privacy: 'Datenschutzerklärung',
        terms: 'Allgemeine Geschäftsbedingungen',
        cookies: 'Cookie-Richtlinie'
      },
      privacy: {
        title: 'DATENSCHUTZERKLÄRUNG',
        lastUpdate: 'Letzte Aktualisierung: Juni 2025',
        content: `**VERANTWORTLICHER FÜR DIE DATENVERARBEITUNG**
Bottamedi Pierluigi - Obst und Gemüse
Via Alcide de Gasperi, 47 - 38017 Mezzolombardo (TN)
MwSt-Nr.: 02273530226
Email: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534

**GESAMMELTE DATEN**
• Kontaktdaten (Name, Nachname, E-Mail, Telefon)
• Navigationsdaten (technische Cookies erforderlich)
• Anonyme Analytics-Daten (nur bei Zustimmung)
• Daten für Kostenvoranschläge und HORECA-Bestellungen
• Informationen über gewerbliche Tätigkeit (für B2B-Services)

**ZWECKE DER VERARBEITUNG**
• Beantwortung von Informations- und Kostenvoranschlagsanfragen
• Verwaltung von Bestellungen und Lieferungen für HORECA-Sektor
• Bereitstellung von Kundensupport und technischer Unterstützung
• Verbesserung des angebotenen Service durch Feedback
• Direktmarketing (nur mit ausdrücklicher und widerrufbarer Zustimmung)
• Steuerliche und buchhalterische Pflichten nach Gesetz

**RECHTSGRUNDLAGE DER VERARBEITUNG**
• Durchführung vorvertraglicher Maßnahmen (Art. 6.1.b DSGVO)
• Berechtigtes Interesse für Analytics und Service-Verbesserung (Art. 6.1.f DSGVO)
• Freie und spezifische Zustimmung für Marketing (Art. 6.1.a DSGVO)
• Rechtliche Verpflichtung für steuerliche Pflichten (Art. 6.1.c DSGVO)

**AUFBEWAHRUNGSDAUER**
Die Daten werden für die für spezifische Zwecke erforderliche Zeit aufbewahrt:
• Vertragsdaten: 10 Jahre (Steuervorschriften)
• Marketing-Daten: bis zum Widerruf der Zustimmung
• Navigationsdaten: max. 26 Monate (Analytics)
• Technische Cookies: Dauer der Sitzung

**ÜBERMITTLUNG AN DRITTE**
Die Daten werden nicht an Dritte übermittelt, außer:
• Gesetzliche Verpflichtung (Steuer-, Finanzbehörden)
• Technische Dienstleister (Hosting, Lieferung)
• Autorisierte Geschäftspartner (nur für HORECA-Services)

**RECHTE DER BETROFFENEN PERSON (DSGVO)**
Sie haben das Recht auf:
• Zugang zu Ihren personenbezogenen Daten (Art. 15 DSGVO)
• Berichtigung unrichtiger Daten (Art. 16 DSGVO)
• Löschung/Vergessenwerden der Daten (Art. 17 DSGVO)
• Einschränkung der Verarbeitung (Art. 18 DSGVO)
• Datenübertragbarkeit (Art. 20 DSGVO)
• Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)
• Widerruf der Zustimmung jederzeit (Art. 7.3 DSGVO)
• Beschwerde bei der Datenschutzbehörde (Art. 77 DSGVO)

**WIE DIE RECHTE AUSGEÜBT WERDEN**
Um Ihre Rechte auszuüben, kontaktieren Sie uns:
E-Mail: bottamedipierluigi@virgilio.it
Telefon: +39 0461 602534
Adresse: Via A. de Gasperi, 47 - 38017 Mezzolombardo (TN)

Wir antworten Ihnen innerhalb von 30 Tagen nach der Anfrage.

**DATENSICHERHEIT**
Wir ergreifen angemessene Sicherheitsmaßnahmen zum Schutz Ihrer personenbezogenen Daten vor unbefugtem Zugriff, Änderungen, Offenlegungen oder unrechtmäßiger Zerstörung.`
      },
      terms: {
        title: 'ALLGEMEINE GESCHÄFTSBEDINGUNGEN',
        lastUpdate: 'Letzte Aktualisierung: Juni 2025',
        content: `**1. PRÄAMBEL UND ANWENDUNGSBEREICH**
Diese Geschäftsbedingungen ("Bedingungen") regeln die Nutzung der Website bottamedi.eu und den Zugang zu den von Bottamedi Pierluigi angebotenen Dienstleistungen.

**2. IDENTIFIKATION DES BETREIBERS**
Bottamedi Pierluigi - Obst und Gemüse
Via A. de Gasperi, 47 - 38017 Mezzolombardo (TN)
MwSt-Nr.: 02273530226
E-Mail: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534

**3. ANGEBOTENE DIENSTLEISTUNGEN**
• Einzelhandel mit frischem Obst und Gemüse am Marktstand
• Großhandelslieferservice für Restaurants, Hotels, Pizzerien (HORECA)
• Informationen über verfügbare Produkte und Saisonalität
• Personalisierter Kostenvoranschlagsservice für Gewerbetreibende
• Beratung für die Auswahl von Obst- und Gemüseprodukten

**4. WEBSITE-NUTZUNGSMODALITÄTEN**
Die Website ist ausschließlich bestimmt für:
• Volljährige Nutzer oder Minderjährige mit elterlicher Genehmigung
• Rechtmäßige und gesetzeskonforme kommerzielle Zwecke
• Informationskonsultation und Kostenvoranschlagsanfragen

Ausdrücklich verboten ist die Nutzung für:
• Illegale oder schädliche Zwecke
• Versendung diffamierender oder beleidigender Inhalte
• Versuche unbefugten Zugriffs auf Systeme

**5. BESTELLUNGEN, KOSTENVORANSCHLÄGE UND GESCHÄFTSBEDINGUNGEN**
• Alle Bestellungen müssen telefonisch bestätigt werden
• Preise unterliegen Markt- und Saisonalitätsschwankungen
• Die Verfügbarkeit der Produkte hängt von Saison und Wetterbedingungen ab
• Zahlungsbedingungen werden von Fall zu Fall vereinbart
• Lieferungen erfolgen nach spezifischen Vereinbarungen

**6. GEISTIGES EIGENTUM**
Alle Website-Inhalte (Texte, Bilder, Logos, Marken) sind ausschließliches Eigentum von Bottamedi Pierluigi und durch Urheberrechtsbestimmungen geschützt. Unbefugte Reproduktion ist verboten.

**7. HAFTUNGSBESCHRÄNKUNG**
Bottamedi Pierluigi haftet nicht für:
• Indirekte Schäden aus der Website-Nutzung
• Vorübergehende Serviceunterbrechungen wegen Wartung
• Produktpreisänderungen aufgrund des Marktes
• Lieferverzögerungen aufgrund höherer Gewalt

**8. DATENSCHUTZ UND DATENVERARBEITUNG**
Die Website-Nutzung unterliegt der Datenschutzerklärung und Cookie-Richtlinie, die auf der Website selbst einsehbar sind.

**9. ÄNDERUNGEN DER BEDINGUNGEN**
Bottamedi behält sich das Recht vor, diese Bedingungen nach vorheriger Mitteilung auf der Website und Benachrichtigung der registrierten Kunden zu ändern.

**10. STREITBEILEGUNG**
Für jede Streitigkeit gilt italienisches Recht.
Zuständiger Gerichtsstand: Gericht Trient.

**11. KONTAKTE FÜR KLARSTELLUNGEN**
Für Fragen zu diesen Bedingungen:
E-Mail: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534`
      },
      cookies: {
        title: 'COOKIE-RICHTLINIE',
        lastUpdate: 'Letzte Aktualisierung: Juni 2025',
        content: `**WAS SIND COOKIES**
Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie eine Website besuchen. Sie dienen dazu, Ihr Navigationserlebnis zu verbessern und bestimmte Website-Funktionen zu ermöglichen.

**ARTEN VON VERWENDETEN COOKIES**

**1. TECHNISCHE COOKIES (immer aktiv - erfordern keine Zustimmung)**
• Session-Cookies für Grundfunktionen der Website
• Sicherheits- und Betrugsschutz-Cookies
• Cookies für Spracheinstellungen (IT/DE)
• Cookies für Warenkorb und Navigation

**2. ANALYTICS-COOKIES (erfordern Zustimmung)**
• Google Analytics für anonyme Nutzungsstatistiken
• Aggregierte Daten über meistbesuchte Seiten
• Analyse des Nutzerverhaltens (Absprungrate, Verweildauer)
• Informationen über verwendete Geräte und Browser
• Aggregierte geografische Daten (nur auf Stadtebene)

**3. MARKETING-COOKIES (erfordern Zustimmung)**
• Cookies für Google Ads Remarketing
• Integration mit sozialen Medien (Facebook, Instagram)
• Personalisierte Werbung basierend auf Interessen
• Conversion-Tracking und ROI

**VERWENDETE DRITTANBIETER-COOKIES**
• Google Analytics: für anonyme Statistiken
  Info: analytics.google.com/analytics/academy
• Google Ads: für gezielte Werbung
  Info: policies.google.com/privacy
• Facebook Pixel: für soziale Integration
  Info: facebook.com/privacy/explanation

**WIE SIE IHRE EINSTELLUNGEN VERWALTEN**
Sie können Cookie-Einstellungen auf verschiedene Weise ändern:

1. **Website-Banner**: Beim ersten Besuch können Sie wählen, welche Sie akzeptieren
2. **Browser-Einstellungen**:
   - Chrome: Einstellungen → Datenschutz und Sicherheit → Cookies
   - Firefox: Optionen → Datenschutz und Sicherheit → Chronik
   - Safari: Einstellungen → Datenschutz → Cookies und Website-Daten
3. **"Cookies verwalten"-Link**: Im Footer der Website verfügbar

**COOKIE-DAUER**
• Session-Cookies: automatisch beim Schließen des Browsers gelöscht
• Persistente Cookies: variable Dauer von 1 Monat bis 2 Jahre
• Analytics-Cookies: maximal 26 Monate
• Marketing-Cookies: maximal 13 Monate

**FOLGEN DER DEAKTIVIERUNG**
Die Deaktivierung von Cookies kann einige Funktionen einschränken:
• Technische Cookies: mögliche Navigationsprobleme
• Analytics-Cookies: beeinträchtigt die Navigation nicht
• Marketing-Cookies: keine Auswirkung auf die Funktionalität

**RECHTSGRUNDLAGE UND VORSCHRIFTEN**
Die Cookie-Verwaltung wird geregelt durch:
• EU-Verordnung 2016/679 (DSGVO)
• Italienisches Datenschutzgesetzbuch (D.Lgs. 196/2003 geändert durch D.Lgs. 101/2018)
• Richtlinien der Datenschutzbehörde

**KONTAKTE**
Für Fragen zu Cookies:
E-Mail: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534`
      }
    }
  }

  const t = translations[language]

  // NUOVO: Listener per eventi dal footer
  useEffect(() => {
    const handleLegalDocumentEvent = (event: CustomEvent) => {
      const { docType, language: eventLanguage } = event.detail
      if (eventLanguage === language) {
        setActiveDoc(docType)
        
        // Scroll smooth al documento
        setTimeout(() => {
          const element = document.getElementById('legal-documents')
          if (element) {
            const offset = 100
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth'
            })
          }
        }, 100)
      }
    }

    window.addEventListener('openLegalDocument', handleLegalDocumentEvent as EventListener)
    
    return () => {
      window.removeEventListener('openLegalDocument', handleLegalDocumentEvent as EventListener)
    }
  }, [language])

  const handleDocumentClick = useCallback((docType: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'legal_document_view', {
        event_category: 'engagement',
        event_label: docType,
        value: 1
      })
    }
    setActiveDoc(activeDoc === docType ? null : docType)
  }, [activeDoc])

  const getDocumentContent = (docType: string) => {
    const docData = t[docType as keyof typeof t] as any
    return {
      title: docData.title,
      lastUpdate: docData.lastUpdate,
      content: docData.content
    }
  }

  return (
    <section id="legal-documents" className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        {/* Header migliorato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Cards dei documenti migliorati */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(t.documents).map(([key, title], index) => (
            <motion.button
              key={key}
              onClick={() => handleDocumentClick(key)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left hover:shadow-xl ${
                activeDoc === key 
                  ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {/* Icone per ogni documento */}
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl transition-colors ${
                activeDoc === key ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-green-100'
              }`}>
                {key === 'privacy' && '🔒'}
                {key === 'terms' && '📋'}
                {key === 'cookies' && '🍪'}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold text-lg mb-2 transition-colors ${
                    activeDoc === key ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {key === 'privacy' && (language === 'it' ? 'Come trattiamo i tuoi dati' : 'Wie wir Ihre Daten verarbeiten')}
                    {key === 'terms' && (language === 'it' ? 'Condizioni di utilizzo del sito' : 'Website-Nutzungsbedingungen')}
                    {key === 'cookies' && (language === 'it' ? 'Gestione dei cookie' : 'Cookie-Verwaltung')}
                  </p>
                </div>
                
                <motion.div
                  animate={{ rotate: activeDoc === key ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-xl transition-colors ${
                    activeDoc === key ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  ▼
                </motion.div>
              </div>

              {/* Badge "NUOVO" per documenti aggiornati */}
              <div className="absolute top-4 right-4">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {language === 'it' ? 'AGGIORNATO' : 'AKTUALISIERT'}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Contenuto espanso migliorato */}
        <AnimatePresence>
          {activeDoc && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-8 lg:p-12">
                {/* Header del documento */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {getDocumentContent(activeDoc).title}
                    </h3>
                    <motion.button
                      onClick={() => setActiveDoc(null)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{getDocumentContent(activeDoc).lastUpdate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{language === 'it' ? 'Conforme GDPR' : 'DSGVO-konform'}</span>
                    </span>
                  </div>
                </div>
                
                {/* Contenuto del documento */}
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {getDocumentContent(activeDoc).content}
                  </div>
                </div>

                {/* Footer del documento */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-500 text-xl">ℹ️</div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          {language === 'it' ? 'Hai domande?' : 'Haben Sie Fragen?'}
                        </h4>
                        <p className="text-sm text-blue-700 mb-3">
                          {language === 'it' 
                            ? 'Per qualsiasi chiarimento sui tuoi diritti o sui nostri servizi, non esitare a contattarci.'
                            : 'Bei Fragen zu Ihren Rechten oder unseren Dienstleistungen zögern Sie nicht, uns zu kontaktieren.'
                          }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 text-sm">
                          <a 
                            href="mailto:bottamedipierluigi@virgilio.it" 
                            className="text-blue-600 hover:text-blue-700 underline flex items-center space-x-1"
                          >
                            <span>📧</span>
                            <span>bottamedipierluigi@virgilio.it</span>
                          </a>
                          <span className="hidden sm:inline text-blue-400">|</span>
                          <a 
                            href="tel:+390461602534" 
                            className="text-blue-600 hover:text-blue-700 underline flex items-center space-x-1"
                          >
                            <span>📞</span>
                            <span>+39 0461 602534</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informazioni aggiuntive */}
        {!activeDoc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'it' ? 'Trasparenza e Conformità' : 'Transparenz und Compliance'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              {language === 'it'
                ? 'I nostri documenti legali sono sempre aggiornati secondo le normative vigenti. Trattiamo i tuoi dati con la massima cura e rispetto per la tua privacy.'
                : 'Unsere Rechtsdokumente sind immer nach geltendem Recht aktualisiert. Wir behandeln Ihre Daten mit größter Sorgfalt und Respekt für Ihre Privatsphäre.'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                {
                  icon: '🛡️',
                  title: language === 'it' ? 'GDPR Compliant' : 'DSGVO-konform',
                  desc: language === 'it' ? 'Conformi al regolamento europeo' : 'EU-Verordnung konform'
                },
                {
                  icon: '🔒',
                  title: language === 'it' ? 'Dati Sicuri' : 'Sichere Daten',
                  desc: language === 'it' ? 'Protezione massima garantita' : 'Maximaler Schutz garantiert'
                },
                {
                  icon: '📞',
                  title: language === 'it' ? 'Supporto Diretto' : 'Direkter Support',
                  desc: language === 'it' ? 'Sempre disponibili per chiarimenti' : 'Immer verfügbar für Klarstellungen'
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default React.memo(LegalDocuments)
