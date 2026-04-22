# Istruzioni per Claude — Routine Blog Bottamedi

**Obiettivo**: creare un nuovo post del blog di **livello editoriale internazionale**, SEO-oriented, data-driven, in linea con il brand Bottamedi (fruttivendolo trentino familiare dal 1974, retail + HORECA).

**Standard di qualità**: ogni post deve poter stare a fianco di un articolo di *Serious Eats*, *Food52*, *Bon Appétit*, *NYT Cooking* o *Gambero Rosso*. Niente post "da blog aziendale": scrittura autorevole, analisi, dati concreti, prospettiva originale.

## Workflow automatico

### Step 0 — Market research obbligatoria (PRIMA di scrivere)

Non scrivere NULLA prima di aver fatto i seguenti controlli con gli strumenti disponibili (WebSearch, WebFetch):

1. **SERP analysis** della keyword primaria scelta:
   - Cerca la keyword su Google (usa WebSearch).
   - Apri i **top 3 risultati** e analizza: struttura (H1/H2), lunghezza (parole), angoli trattati, cosa NON viene detto (gap da riempire).
   - Obiettivo: il nostro post deve essere **più completo, più specifico localmente (Trentino), più aggiornato** dei top 3.

2. **Trend check**:
   - Verifica che il topic sia attuale (stagione, notizie, food trends). Se la keyword è troppo evergreen, aggiungi un angolo 2026 o un dato aggiornato.

3. **Competitor internazionali** — prendi spunto da questi quando pertinente (fai WebFetch mirato):
   - **Food blog premium**: seriouseats.com, food52.com, bonappetit.com, cooking.nytimes.com, thekitchn.com, epicurious.com, bbcgoodfood.com, eater.com
   - **Ortofrutta professionale / trade**: freshplaza.com, freshplaza.it, italiafruit.net, producebusiness.com, fruitlogistica.com
   - **Food system / sostenibilità**: civileats.com, modernfarmer.com, slowfood.it, foodnavigator.com
   - **Italia food culture**: gamberorosso.it, identitagolose.it, dissapore.com, cookcorriere.it, lacucinaitaliana.it
   - **HORECA verticale**: horecanews.it, ristorazioneitalianamagazine.it, distribuzionemoderna.info
   - **Retail food insights**: wholefoodsmarket.com/blog, eataly.com/journal, mercadona.es (newsroom)

4. **Analizza i format vincenti globali** e scegli quello giusto:

   | Format | Quando usarlo | Esempio di fonte ispiratrice |
   |---|---|---|
   | **Ultimate Guide** (2000-3000 parole) | Topic evergreen ad alto volume di ricerca | Serious Eats "The Food Lab" |
   | **Seasonal round-up con calendario** | Stagionalità, "what's in season" | NYT Cooking, BBC Good Food |
   | **"The Science of X"** — dati e perché | Conservazione, maturazione, nutrizione | Serious Eats, ChefSteps |
   | **Behind-the-scenes / Day-in-the-life** | Storie fornitori, dietro al banco | Modern Farmer, Eater |
   | **"X vs Y" comparison** | Varietà, tecniche, certificazioni | The Kitchn, Food52 |
   | **"Why X is having a moment"** | Trend emergenti con dati di mercato | Bon Appétit, Eater |
   | **Listicle ben strutturato** (5-10 punti) | Guide pratiche, scelta, consigli | BBC Good Food, The Kitchn |
   | **Case study HORECA** | Fornitura, margini, esperienze reali | Produce Business, Eater Restaurants |
   | **Recipe con storia** | Ricette con contesto culturale + tecnica | NYT Cooking, Food52 |

5. **Dati e fonti**: cita almeno 2-3 fonti esterne autorevoli (stats, certificazioni, studi). Esempi utili:
   - **CSO Italy** (Centro Servizi Ortofrutticoli) — dati mercato italiano
   - **Istat**, **CREA** — dati consumi e produzione
   - **Melinda.it**, **Trentinoagricolturabio.it**, **DOP IGP portali**
   - **FAO**, **Eurostat** per dati macro
   - **Fruit Logistica trends** (report annuali)

### Step 1-5 — Dopo la ricerca

1. **Leggi il calendario editoriale** in `src/content/blog/.editorial-calendar.json`.
   - Controlla `publishedSlugs` per non duplicare.
   - Scegli un topic da `upcomingIdeas`, o proponi un topic migliore basato sulla market research appena fatta.

2. **Crea il file**:
   ```bash
   npm run blog:new -- --title "TITOLO" --category CATEGORIA --tags tag1,tag2 --targetKeyword "keyword primaria"
   ```

3. **Scrivi il contenuto** seguendo uno dei format globali sopra + struttura Bottamedi (sezioni sotto). Obiettivo minimo: **essere più utile dei top 3 risultati Google** per la stessa keyword.

4. **Valida**:
   ```bash
   npm run blog:validate
   npm run type-check
   ```

5. **Aggiorna** il calendario:
   - Aggiungi lo slug a `publishedSlugs`.
   - Rimuovi (o marca) il topic da `upcomingIdeas`.
   - Aggiorna `lastUpdated`.

6. **Commit + push** sul branch `main` (o un branch `blog/YYYY-MM-DD-slug` se preferito).
   ```
   git add src/content/blog/ src/content/blog/.editorial-calendar.json
   git commit -m "blog: <titolo post>"
   git push
   ```
   Netlify builderà e pubblicherà automaticamente.

## Frontmatter obbligatorio

```yaml
---
title: "Titolo SEO-friendly, 40-70 caratteri, include keyword primaria"
slug: "kebab-case-slug-unico"
excerpt: "Descrizione 80-170 char. Include keyword primaria, benefit, location (Mezzolombardo/Trentino)."
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"        # solo se revisioni successive
category: stagionalita          # vedi categorie consentite
tags: ["tag-primario", "altro-tag", "..."]  # 3-6 tag
locale: it                      # it | de
author:
  name: "Famiglia Bottamedi"
  role: "Fruttivendoli dal 1974"
cover:
  src: "/images/banchetto.webp"  # usa immagini già presenti in /public/images/
  alt: "Descrizione accessibile della cover, include keyword naturalmente"
  caption: "Didascalia opzionale"  # opzionale
targetKeyword: "frutta verdura Mezzolombardo"   # keyword primaria dichiarata
seo:
  metaTitle: "Override opzionale (se diverso da title)"
  metaDescription: "Override opzionale (se diverso da excerpt)"
  keywords: ["altre", "keyword"]
featured: false                  # mettere a true solo per 1 post alla volta
draft: false
relatedSlugs: ["altro-slug"]     # opzionale, forzare related
---
```

## Struttura raccomandata

1. **H1 implicito** (viene dal `title` frontmatter, NON scrivere `# Titolo` a inizio file).
2. **Intro** (2-3 paragrafi): hook + anticipo valore + menziona keyword primaria nelle prime 100 parole.
3. **3-6 sezioni H2** con keyword correlate (LSI).
4. **Sotto-sezioni H3** dove serve.
5. **Elenchi puntati o numerati** per leggibilità (Google ama).
6. **1 Callout** (`<Callout type="tip|info|warning">...</Callout>`) con consiglio pratico.
7. **Closing + CTA** con `<CTA href="/#wholesale">Testo</CTA>` o link a `/blog/altro-post`.
8. **Link interni** minimo 2: uno al sito (`/#wholesale`, `/#products`, `/#contact`) e uno ad altro articolo del blog.

## Regole SEO (non negoziabili)

- **Keyword primaria** nel `title`, nei primi 100 caratteri dell'intro, in almeno un H2, nell'`alt` della cover, nell'URL slug.
- **Intent match**: prima di scrivere, classifica l'intento della keyword (informational / transactional / navigational / commercial investigation) e adatta format + CTA.
- **SERP features da conquistare**: punta a feature snippets (risposte brevi in H2/paragrafi iniziali), People Also Ask (includi 3-5 domande con risposta diretta), image pack (alt descrittivi + file name sensati).
- **Densità keyword**: naturale, 0.8-1.5%. Mai stuffing. Usa entità semantiche correlate (LSI) più che ripetere la stessa parola.
- **Lunghezza**: allineata al top 3 di Google per la keyword (fai SERP analysis). In genere: 1200-1800 parole per guide standard, 2000-3000 per ultimate guide, 600-900 per news/opinion.
- **Sinonimi e LSI**: usa variazioni ("frutta fresca" / "ortofrutta" / "prodotti stagionali"). Google valuta la comprensione semantica, non la ripetizione.
- **Internal linking**: almeno 2 link interni (sito o altri post). Usa anchor text descrittivi, non "clicca qui".
- **External linking**: 1-2 link a fonti autorevoli (Melinda.it, DOP/DOC, Comune di Mezzolombardo) solo se pertinenti. `rel="noopener noreferrer"`.
- **Immagini**: usa SEMPRE immagini esistenti in `/public/images/` (cerca prima prima di inventare path). Cover 16:10 o 16:9, 1600x900 ideale. `alt` descrittivo con keyword naturale.
- **Schema Recipe**: per post in categoria `ricette`, includi ingredienti e istruzioni in liste chiare (il renderer genera Recipe schema automaticamente dal pattern H2 "Ingredienti" + H2 "Preparazione").
- **E-E-A-T**: mostra esperienza (50 anni famiglia, conoscenza del territorio), cita aneddoti reali (anche inventati ma plausibili — es. "al mercato di Trento stamattina").

## Tone of Voice

- **Caldo, familiare, diretto** — come un fruttivendolo che ti racconta al banchetto.
- **Tu** informale (mai "Voi"/"Lei").
- **Italiano naturale**, evita anglismi ("fornitori" non "supplier"; "selezioniamo" non "seleziamo").
- **Competente ma non accademico**: storie + fatti + consigli pratici.
- **Mai superlativi vuoti** ("i migliori del mondo"). Preferire specifici: "raccolte la mattina del mercato", "2 ore dal produttore al banchetto".
- **Claim sulla bio/DOP**: solo se vero e riferito a prodotti reali (Melinda DOP, asparago Zambana, ecc.).
- **Local**: cita Mezzolombardo, Trentino, Val di Non, Rotaliana, Val di Sole, Bolzano, Trento.

## Categorie consentite

```
stagionalita   → Prodotti del mese, calendari stagionali
ricette        → Ricette con prodotti venduti
territorio     → Storie fornitori, DOP/DOC, filiera
horeca         → Guide per ristoratori
storie         → Famiglia Bottamedi, 50 anni
sostenibilita  → Filiera corta, packaging, zero spreco
guide          → Come conservare, come scegliere
news           → Novità, eventi
```

## Componenti MDX disponibili (usali per creare esperienza di lettura)

Ogni post deve usarne **almeno 3-4** per creare ritmo e varietà visiva. Non sono decorativi: sono strumenti editoriali.

### Blocchi di comunicazione
- `<Callout type="info|tip|warning">testo</Callout>` — box evidenziato per consiglio pratico, avvertenza, dato curioso.
- `<CTA href="/#wholesale">Testo pulsante</CTA>` — call-to-action principale. 1-2 per post, mai di più.
- `<PullQuote cite="Nome">Frase d'effetto</PullQuote>` — citazione grande serif, spezza il ritmo. Usala per punti di vista, frasi memorabili, insight forti.

### Dati e confronti
- `<StatGrid>...</StatGrid>` con `<Stat value="42%" label="..." delay={0.1} />` — griglia di numeri chiave animata in entrata. Perfetta per aprire articoli data-driven.
- `<Compare left={{title:'', body:<>...</>}} right={{title:'', body:<>...</>}} />` — affiancamento due colonne per confronti (buono vs cattivo, vecchio vs nuovo).

### Immagini e media
- `<Gallery images={[{src, alt, caption}]} />` — mini galleria 2 colonne con reveal scaglionato.
- Immagine inline standard con Markdown `![alt](path)` viene già animata dal renderer.

### Narrazione
- `<Timeline>` con `<TimelineItem year="..." title="..." delay={0.1}>testo</TimelineItem>` — timeline verticale per processi, storie, step. Usa `year` anche per etichette non anagrafiche ("Step 1", "Mattina", "Dopo").
- `<Reveal preset="springy|cinema|editorial|snappy|organic">contenuto</Reveal>` — rivela blocco in scroll. Usala per chiudere sezioni con enfasi.

### Standard
- `##`, `###`, liste, tabelle, blockquote markdown: vengono già animati e stilizzati.
- Il primo paragrafo riceve automaticamente una **capolettera serif** (come negli editoriali del NYT / Financial Times).

## Frontmatter animazioni e mood (obbligatori)

```yaml
animation: editorial     # preset ingresso hero + sezioni
# Valori: springy (leggero), cinema (lento/drammatico),
#         editorial (default/neutro), snappy (veloce), organic (elastico)

mood: spring             # atmosfera colore sfondo pagina
# Valori: spring | summer | autumn | winter | warm | cool | heritage | minimal
```

**Come scegliere**:
- Post su **asparagi/fragole/primavera** → `animation: springy`, `mood: spring`.
- Post **storico/famiglia/50 anni** → `animation: cinema`, `mood: heritage`.
- Guida **HORECA/dati/analisi** → `animation: editorial`, `mood: warm`.
- **News breve/aggiornamento** → `animation: snappy`, `mood: minimal`.
- **Ricetta tradizionale/territorio** → `animation: organic`, `mood: autumn` o `warm`.

## Scelta immagini — obbligatoria

### Regola #1 — usa SOLO immagini esistenti

Il repo ha un set di immagini in `/public/images/`. **Non inventare path nuovi.** Consulta `src/content/blog/.editorial-calendar.json` → `availableImages` per l'elenco aggiornato.

### Regola #2 — matching topic/immagine

| Topic del post | Cover consigliata |
|---|---|
| Heritage, famiglia, generica | `/images/banchetto.webp` |
| Stagionalità, varietà, autunno | `/images/banco_varieta_autunno.webp` |
| HORECA, ingrosso | `/images/albicocche_ingrosso_magazzino.webp` |
| Mele Melinda, Val di Non | `/images/bottamedi_mele_melinda_montagna_cassetta.webp` o `/images/melinda_golden.webp` |
| Pink Lady, varietà premium | `/images/bottamedi_mele_pink_lady_confezione.webp` |
| Agrumi, primavera agrumi | `/images/arance_felici.webp` |
| Estate, meloni, angurie | `/images/angurie.webp` o `/images/meloni_sattin_dettaglio.webp` |
| Pomodori, insalate | `/images/pomodori_cuore_bue.webp` |
| Frutta disidratata, sottobanco | `/images/banco_frigo_disidratata_specialita.webp`, `/images/bottamedi_dettaglio_frutta_disidratata_vaschette.webp`, `/images/bottamedi_sacchetti_frutta_disidratata_mista.webp` |
| Kiwi, cuore, design | `/images/kiwi-cuore.webp` o `/images/kiwi-gialli-bg.webp` |
| Location/mappa dettaglio | `/images/mappa-banchetto-bottamedi.webp` |
| Location/mappa ingrosso | `/images/mappa-ingrosso-bottamedi.webp` |
| Autunno, zucche, Halloween | `/images/zucche_decorate_banco.webp` |
| Ananas, esotici | `/images/bottamedi_ananas_fruitpoint_freschi.webp` |

### Regola #3 — alt text SEO-friendly

Ogni `cover.alt` deve:
- Essere **descrittivo** (chi vede una schermata con testo alt deve capire il contenuto).
- Contenere la **keyword primaria** naturalmente.
- Menzionare **Mezzolombardo**, **Trentino** o **Bottamedi** se pertinente.
- Mai più di 125 caratteri.

### Regola #4 — Gallery per post lunghi

Per post >1500 parole, aggiungi una `<Gallery images={...} />` a metà articolo con 2-4 immagini correlate dal set disponibile. Crea respiro, aumenta tempo sulla pagina, aiuta image SEO.

## Checklist finale prima del commit

### Ricerca
- [ ] SERP analysis fatta: conosco i top 3 risultati Google per la keyword primaria.
- [ ] Ho preso spunto da almeno 1 pattern di Serious Eats / Food52 / NYT Cooking / BBC Good Food / Gambero Rosso (o fonte HORECA pertinente).
- [ ] Il post offre **qualcosa che i top 3 non hanno** (prospettiva locale, dati specifici, angolo fresco).

### Frontmatter
- [ ] Frontmatter completo e valido (`npm run blog:validate` passa).
- [ ] `targetKeyword` dichiarata.
- [ ] `animation` e `mood` scelti coerentemente con il topic.
- [ ] Title 40-70 caratteri, include keyword.
- [ ] Excerpt 80-170 caratteri, include keyword + location.
- [ ] Cover image **esiste** in `/public/images/` (consulta `.editorial-calendar.json`).
- [ ] Alt della cover descrittivo + keyword + Trentino/Mezzolombardo.

### Contenuto
- [ ] Lunghezza allineata al top 3 Google (min 800, guide 1500-3000).
- [ ] 3-6 H2, almeno uno con keyword.
- [ ] Almeno **3-4 componenti MDX** tra `<StatGrid>`, `<Compare>`, `<PullQuote>`, `<Timeline>`, `<Gallery>`, `<Callout>`, `<CTA>`.
- [ ] Almeno **2 link interni** (sito + altro post del blog).
- [ ] Almeno **1 link esterno** a fonte autorevole (CSO, Istat, Melinda, DOP/IGP, mercato).
- [ ] People Also Ask: include 3-5 domande/risposte implicite o in sezione FAQ.
- [ ] Gallery presente se post >1500 parole.

### Pubblicazione
- [ ] `.editorial-calendar.json` aggiornato (publishedSlugs + upcomingIdeas).
- [ ] Tutti i path immagine verificati (il file esiste).
- [ ] Commit message: `blog: <titolo conciso>`.
- [ ] Build passa in locale: `npm run blog:validate && npm run type-check`.

## Non fare mai

- Non cambiare file fuori da `src/content/blog/`. Niente modifiche al codice React, alla config, o all'estetica del sito.
- Non pubblicare post senza cover (usa almeno `/images/banchetto.webp` come fallback).
- Non inventare certificazioni o premi. Se incerto su un fatto, ometti.
- Non superare 8 tag. Meglio 3-4 precisi.
- Non usare emoji nel title (peggiora SERP preview).
- Non pubblicare se `npm run blog:validate` fallisce.
- **Mai fare elenchi di "cosa NON comprare"** basati su generalizzazioni stagionali ingenue. Il mercato ortofrutta italiano è integrato con Sud Italia + bacino mediterraneo: ad esempio ad aprile in banco arrivano **meloni italiani dal Sud**, **pomodori di pieno campo dalla Sicilia**, **angurie dalla Spagna** — tutti acquisti sensati. Prima di definire un prodotto "fuori stagione", verifica se esiste una filiera mediterranea attiva in quel momento. Se dubbi, scrivi "verifica l'origine al banco" invece di bandirlo.
- **Mai copiare calendari stagionali da fonti anglofone o nordeuropee**: clima e filiere sono diverse. La stagionalità italiana inizia prima e dura più a lungo di quella UK/Germania per moltissimi prodotti.
