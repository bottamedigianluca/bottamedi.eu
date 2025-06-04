import React, { useState, useCallback } from 'react'
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
      documents: {
        privacy: 'Privacy Policy',
        terms: 'Termini e Condizioni',
        cookies: 'Cookie Policy'
      },
      privacy: {
        title: 'INFORMATIVA SULLA PRIVACY',
        lastUpdate: 'Ultimo aggiornamento: Giugno 2025',
        content: `**TITOLARE DEL TRATTAMENTO**
Bottamedi Pierluigi
Via Alcide de Gasperi, 47 - 38017 Mezzolombardo (TN)
Email: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534

**DATI RACCOLTI**
• Dati di contatto (nome, email, telefono)
• Dati di navigazione (cookie tecnici)
• Dati analytics anonimi (se consenso prestato)
• Dati per richieste preventivi e ordini

**FINALITÀ DEL TRATTAMENTO**
• Rispondere alle richieste di informazioni
• Gestire ordini e preventivi HORECA
• Fornire assistenza clienti
• Migliorare il servizio offerto
• Marketing diretto (solo con consenso esplicito)

**BASE GIURIDICA**
• Esecuzione di misure precontrattuali (art. 6.1.b GDPR)
• Legittimo interesse per analytics (art. 6.1.f GDPR)
• Consenso per marketing (art. 6.1.a GDPR)

**CONSERVAZIONE DATI**
I dati saranno conservati per il tempo necessario alle finalità o per i termini previsti dalla legge (10 anni per dati commerciali).

**COMUNICAZIONE A TERZI**
I dati non vengono comunicati a terzi, salvo obbligo di legge o per l'erogazione del servizio (corrieri, fornitori).

**DIRITTI DELL'INTERESSATO**
• Accesso, rettifica, cancellazione (art. 15-17 GDPR)
• Limitazione del trattamento (art. 18 GDPR)
• Portabilità dei dati (art. 20 GDPR)
• Opposizione al trattamento (art. 21 GDPR)
• Revoca del consenso (art. 7.3 GDPR)
• Reclamo al Garante Privacy

**COME ESERCITARE I DIRITTI**
Email: bottamedipierluigi@virgilio.it
Telefono: +39 0461 602534
Risposta entro 30 giorni dalla richiesta.`
      },
      terms: {
        title: 'TERMINI E CONDIZIONI DI UTILIZZO',
        lastUpdate: 'Ultimo aggiornamento: Giugno 2025',
        content: `**1. AMBITO DI APPLICAZIONE**
I presenti termini si applicano all'utilizzo del sito web bottamedi.eu e ai servizi offerti da Bottamedi Pierluigi.

**2. SERVIZI OFFERTI**
• Vendita al dettaglio di frutta e verdura fresca
• Servizio ingrosso per ristoranti, hotel e pizzerie (HORECA)
• Informazioni sui prodotti disponibili
• Preventivi personalizzati

**3. UTILIZZO DEL SITO**
Il sito è destinato a utenti maggiorenni per finalità commerciali lecite. È vietato l'uso per scopi illegali o dannosi.

**4. ORDINI E PREVENTIVI**
• Gli ordini devono essere confermati telefonicamente
• I prezzi sono soggetti a variazioni di mercato
• La disponibilità dei prodotti dipende dalla stagionalità

**5. PROPRIETÀ INTELLETTUALE**
Tutti i contenuti del sito (testi, immagini, loghi) sono di proprietà di Bottamedi e protetti da copyright.

**6. LIMITAZIONE DI RESPONSABILITÀ**
Bottamedi non è responsabile per:
• Danni indiretti derivanti dall'uso del sito
• Interruzioni del servizio per manutenzione
• Variazioni di prezzo dei prodotti

**7. PRIVACY E COOKIE**
L'utilizzo del sito è soggetto alla Privacy Policy e Cookie Policy.

**8. MODIFICHE**
Bottamedi si riserva il diritto di modificare questi termini previa comunicazione sul sito.

**9. LEGGE APPLICABILE**
Si applica la legge italiana. Foro competente: Tribunale di Trento.

**10. CONTATTI**
Per chiarimenti: bottamedipierluigi@virgilio.it`
      },
      cookies: {
        title: 'COOKIE POLICY',
        lastUpdate: 'Ultimo aggiornamento: Giugno 2025',
        content: `**COSA SONO I COOKIE**
I cookie sono piccoli file di testo memorizzati sul dispositivo durante la navigazione per migliorare l'esperienza utente.

**TIPOLOGIE DI COOKIE UTILIZZATI**

**1. Cookie Tecnici (sempre attivi)**
• Cookie di sessione per il funzionamento del sito
• Cookie di sicurezza e autenticazione
• Cookie per preferenze linguistiche (IT/DE)
• Cookie per il carrello acquisti

**2. Cookie Analytics (con consenso)**
• Google Analytics per statistiche anonime
• Dati aggregati su pagine visitate
• Comportamento utenti (bounce rate, tempo permanenza)
• Dispositivi e browser utilizzati

**3. Cookie di Marketing (con consenso)**
• Cookie per remarketing Google Ads
• Integrazione social media (Facebook, Instagram)
• Pubblicità personalizzata
• Tracciamento conversioni

**COOKIE DI TERZE PARTI**
• Google Analytics: analytics.google.com/analytics/academy
• Google Ads: policies.google.com/privacy
• Facebook Pixel: facebook.com/privacy

**GESTIONE DELLE PREFERENZE**
Puoi modificare le preferenze sui cookie tramite:
• Banner presente nel sito al primo accesso
• Impostazioni del browser
• Link "Gestisci Cookie" nel footer

**DURATA DEI COOKIE**
• Cookie di sessione: eliminati alla chiusura browser
• Cookie persistenti: durata variabile (da 1 mese a 2 anni)
• Cookie analytics: 26 mesi
• Cookie marketing: 13 mesi

**DISABILITAZIONE**
È possibile disabilitare i cookie dalle impostazioni del browser:
• Chrome: Impostazioni → Privacy → Cookie
• Firefox: Opzioni → Privacy → Cronologia
• Safari: Preferenze → Privacy → Cookie

**NOTA**: La disabilitazione dei cookie tecnici può limitare le funzionalità del sito.

**BASE LEGALE**
Reg. UE 2016/679 (GDPR) e Codice Privacy italiano (D.Lgs. 196/2003).`
      }
    },
    de: {
      title: 'Rechtsdokumente',
      documents: {
        privacy: 'Datenschutzerklärung',
        terms: 'Allgemeine Geschäftsbedingungen',
        cookies: 'Cookie-Richtlinie'
      },
      privacy: {
        title: 'DATENSCHUTZERKLÄRUNG',
        lastUpdate: 'Letzte Aktualisierung: Juni 2025',
        content: `**VERANTWORTLICHER**
Bottamedi Pierluigi
Via Alcide de Gasperi, 47 - 38017 Mezzolombardo (TN)
Email: bottamedipierluigi@virgilio.it
Tel: +39 0461 602534

**GESAMMELTE DATEN**
• Kontaktdaten (Name, E-Mail, Telefon)
• Navigationsdaten (technische Cookies)
• Anonyme Analytics-Daten (bei Zustimmung)
• Daten für Kostenvoranschläge und Bestellungen

**ZWECKE DER VERARBEITUNG**
• Beantwortung von Informationsanfragen
• Verwaltung von HORECA-Bestellungen und Kostenvoranschlägen
• Bereitstellung von Kundensupport
• Verbesserung des angebotenen Services
• Direktmarketing (nur mit ausdrücklicher Zustimmung)

**RECHTSGRUNDLAGE**
• Durchführung vorvertraglicher Maßnahmen (Art. 6.1.b DSGVO)
• Berechtigtes Interesse für Analytics (Art. 6.1.f DSGVO)
• Zustimmung für Marketing (Art. 6.1.a DSGVO)

**DATENAUFBEWAHRUNG**
Die Daten werden für die für die Zwecke erforderliche Zeit oder für die gesetzlichen Fristen aufbewahrt (10 Jahre für Handelsdaten).

**ÜBERMITTLUNG AN DRITTE**
Die Daten werden nicht an Dritte übermittelt, außer bei gesetzlicher Verpflichtung oder zur Erbringung der Dienstleistung (Spediteure, Lieferanten).

**RECHTE DER BETROFFENEN PERSON**
• Zugang, Berichtigung, Löschung (Art. 15-17 DSGVO)
• Einschränkung der Verarbeitung (Art. 18 DSGVO)
• Datenübertragbarkeit (Art. 20 DSGVO)
• Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)
• Widerruf der Zustimmung (Art. 7.3 DSGVO)
• Beschwerde bei der Datenschutzbehörde

**WIE DIE RECHTE AUSGEÜBT WERDEN**
E-Mail: bottamedipierluigi@virgilio.it
Telefon: +39 0461 602534
Antwort innerhalb von 30 Tagen nach der Anfrage.`
      },
      terms: {
        title: 'ALLGEMEINE GESCHÄFTSBEDINGUNGEN',
        lastUpdate: 'Letzte Aktualisierung: Juni 2025',
        content: `**1. ANWENDUNGSBEREICH**
Diese Bedingungen gelten für die Nutzung der Website bottamedi.eu und die von Bottamedi Pierluigi angebotenen Dienstleistungen.

**2. ANGEBOTENE DIENSTLEISTUNGEN**
• Einzelhandel mit frischem Obst und Gemüse
• Großhandelsservice für Restaurants, Hotels und Pizzerien (HORECA)
• Informationen über verfügbare Produkte
• Personalisierte Kostenvoranschläge

**3. NUTZUNG DER WEBSITE**
Die Website ist für volljährige Nutzer zu rechtmäßigen kommerziellen Zwecken bestimmt. Die Nutzung für illegale oder schädliche Zwecke ist verboten.

**4. BESTELLUNGEN UND KOSTENVORANSCHLÄGE**
• Bestellungen müssen telefonisch bestätigt werden
• Preise unterliegen Marktschwankungen
• Die Verfügbarkeit der Produkte hängt von der Saisonalität ab

**5. GEISTIGES EIGENTUM**
Alle Inhalte der Website (Texte, Bilder, Logos) sind Eigentum von Bottamedi und urheberrechtlich geschützt.

**6. HAFTUNGSBESCHRÄNKUNG**
Bottamedi haftet nicht für:
• Indirekte Schäden aus der Nutzung der Website
• Serviceunterbrechungen aufgrund von Wartung
• Preisänderungen bei Produkten

**7. DATENSCHUTZ UND COOKIES**
Die Nutzung der Website unterliegt der Datenschutzerklärung und Cookie-Richtlinie.

**8. ÄNDERUNGEN**
Bottamedi behält sich das Recht vor, diese Bedingungen nach vorheriger Mitteilung auf der Website zu ändern.

**9. ANWENDBARES RECHT**
Es gilt italienisches Recht. Zuständiger Gerichtsstand: Gericht Trient.

**10. KONTAKTE**
Für Klarstellungen: bottamedipierluigi@virgilio.it`
      },
      cookies: {
        title: 'COOKIE-RICHTLINIE',
        lastUpdate: 'Letzte Aktualisierung: Juni 2025',
        content: `**WAS SIND COOKIES**
Cookies sind kleine Textdateien, die während der Navigation auf dem Gerät gespeichert werden, um die Benutzererfahrung zu verbessern.

**ARTEN VON VERWENDETEN COOKIES**

**1. Technische Cookies (immer aktiv)**
• Session-Cookies für das Funktionieren der Website
• Sicherheits- und Authentifizierungs-Cookies
• Cookies für Spracheinstellungen (IT/DE)
• Cookies für den Warenkorb

**2. Analytics-Cookies (mit Zustimmung)**
• Google Analytics für anonyme Statistiken
• Aggregierte Daten über besuchte Seiten
• Nutzerverhalten (Absprungrate, Verweildauer)
• Verwendete Geräte und Browser

**3. Marketing-Cookies (mit Zustimmung)**
• Cookies für Google Ads Remarketing
• Social Media Integration (Facebook, Instagram)
• Personalisierte Werbung
• Conversion-Tracking

**DRITTANBIETER-COOKIES**
• Google Analytics: analytics.google.com/analytics/academy
• Google Ads: policies.google.com/privacy
• Facebook Pixel: facebook.com/privacy

**VERWALTUNG DER EINSTELLUNGEN**
Sie können Cookie-Einstellungen ändern über:
• Banner auf der Website beim ersten Zugriff
• Browser-Einstellungen
• Link "Cookies Verwalten" im Footer

**DAUER DER COOKIES**
• Session-Cookies: beim Schließen des Browsers gelöscht
• Persistente Cookies: variable Dauer (von 1 Monat bis 2 Jahre)
• Analytics-Cookies: 26 Monate
• Marketing-Cookies: 13 Monate

**DEAKTIVIERUNG**
Sie können Cookies in den Browser-Einstellungen deaktivieren:
• Chrome: Einstellungen → Datenschutz → Cookies
• Firefox: Optionen → Datenschutz → Chronik
• Safari: Einstellungen → Datenschutz → Cookies

**HINWEIS**: Die Deaktivierung technischer Cookies kann die Funktionen der Website einschränken.

**RECHTSGRUNDLAGE**
EU-Verordnung 2016/679 (DSGVO) und italienisches Datenschutzgesetzbuch (D.Lgs. 196/2003).`
      }
    }
  }

  const t = translations[language]

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

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(t.documents).map(([key, title]) => (
            <button
              key={key}
              onClick={() => handleDocumentClick(key)}
              className={`p-4 rounded-lg border transition-all duration-200 text-left hover:shadow-md ${
                activeDoc === key 
                  ? 'border-green-500 bg-green-50 text-green-700 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{title}</span>
                <span className={`transform transition-transform duration-200 ${activeDoc === key ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {activeDoc && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-gray-50 rounded-lg p-6 prose prose-sm max-w-none overflow-hidden"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t[activeDoc as keyof typeof t].title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t[activeDoc as keyof typeof t].lastUpdate}
                </p>
              </div>
              
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {t[activeDoc as keyof typeof t].content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-4">
            {language === 'it' 
              ? 'Per domande sui dati personali o sui cookie, contattaci:' 
              : 'Bei Fragen zu persönlichen Daten oder Cookies kontaktieren Sie uns:'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm">
            <a 
              href="mailto:bottamedipierluigi@virgilio.it" 
              className="text-green-600 hover:text-green-700 underline transition-colors"
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'email_click', {
                    event_category: 'contact',
                    event_label: 'legal_footer'
                  })
                }
              }}
            >
              📧 bottamedipierluigi@virgilio.it
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a 
              href="tel:+390461602534" 
              className="text-green-600 hover:text-green-700 underline transition-colors"
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'phone_click', {
                    event_category: 'contact',
                    event_label: 'legal_footer'
                  })
                }
              }}
            >
              📞 +39 0461 602534
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(LegalDocuments)
