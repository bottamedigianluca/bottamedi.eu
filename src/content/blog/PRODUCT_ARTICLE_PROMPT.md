# Product Monograph — Engineered Authoring Pattern

Questo documento è il template riusabile per creare monografie di prodotto premium sul blog Bottamedi. Copialo ogni volta che devi scrivere un articolo del tipo *"Guida completa al [prodotto]"*.

Obiettivo editoriale: dominare la SERP italiana per query "che cos'è X", "come cucinare X", "X di stagione". Standard di riferimento: Serious Eats, NYT Cooking, Gambero Rosso.

---

## 1. Prompt operativo per la routine task

Quando ti viene chiesto *"scrivi una monografia sul prodotto X"*, segui questo flusso:

### Step A — Ricerca (obbligatoria prima di scrivere)

1. **WebSearch** sulla keyword principale (`"cos'è il [prodotto]"`, `"ricetta [prodotto]"`, `"stagione [prodotto] Italia"`).
2. **Apri i top 3** risultati con WebFetch. Annota:
   - Lunghezza (parole)
   - Struttura H2
   - Cosa *non* coprono (gap da colmare)
3. **Fact check** su fonti autorevoli:
   - CREA (Consiglio per la ricerca in agricoltura)
   - CSO Italy (Centro Servizi Ortofrutticoli)
   - Slow Food — Presìdi / Arca del Gusto
   - Portali DOP/IGP/De.Co. regionali
   - FAO, Eurostat per dati macro
4. **Angolo Bottamedi**: individua l'aggancio locale (Mezzolombardo, Val di Non, Rotaliana, Trentino, fornitori reali citabili).

### Step B — Compilazione frontmatter

Parti dal blocco YAML sotto. Compila *tutti* i campi, inclusi `produce`, `recipes` e `faq`: questi generano JSON-LD strutturato (`ProduceItem`, `Recipe`, `FAQPage`) che dà vantaggio SERP sui competitor.

### Step C — Scrittura body

Segui la struttura canonica a 8 sezioni H2 (vedi schema sotto). Ogni sezione ha uno scopo preciso: non saltare sezioni, non invertire l'ordine.

### Step D — Pre-commit

```bash
npm run blog:validate  # Zod valida frontmatter
npm run type-check
npm run build          # verifica che il post entri nell'index
```

Aggiorna `.editorial-calendar.json` (publishedSlugs + rimuovi da upcomingIdeas).

---

## 2. Frontmatter template (copia-incolla)

```yaml
---
title: "[Prodotto]: cos'è, come riconoscerlo e N ricette dal banchetto"
slug: "[prodotto]-guida-completa"
excerpt: "Il [prodotto] [angolo locale/stagionale]. Come riconoscerlo, conservarlo e cucinarlo: N ricette testate al banchetto di Mezzolombardo." # 80-170 char
publishedAt: "YYYY-MM-DD"
category: stagionalita # oppure territorio / ricette / guide
tags: ["[prodotto]", "[varietà]", "Trentino", "ricette", "stagionalità"] # 3-6 tag
locale: it
animation: editorial # springy per primavera, organic per territorio, cinema per heritage
mood: spring # spring | summer | autumn | winter | warm | heritage

author:
  name: "Famiglia Bottamedi"
  role: "Fruttivendoli dal 1974"

cover:
  src: "/images/[esistente].webp" # o URL esterno completo https://...
  alt: "[Prodotto]: guida completa al banchetto Bottamedi di Mezzolombardo" # <125 char, include keyword

targetKeyword: "[prodotto] [attributo]"
seo:
  metaTitle: "[Prodotto]: guida completa (cos'è, come cucinarlo, ricette)" # opzionale override, <70 char
  metaDescription: "[prompt che include keyword + benefit + Mezzolombardo]" # 80-170 char
  keywords: ["[prodotto]", "ricette [prodotto]", "stagione [prodotto]"]

# --- Schema.org: MONOGRAFIA PRODOTTO ---
produce:
  name: "[Prodotto]"
  alternateName: ["[sinonimi regionali]", "[nome scientifico popolare]"]
  scientificName: "[Genus species]"
  category: "Verdura" # Verdura | Frutta | Erba aromatica | Fungo | Tubero | Legume
  origin: "[Regione/paese d'origine]"
  seasonMonths: [3, 4, 5] # 1=gen ... 12=dic

recipes:
  - name: "Nome ricetta 1"
    description: "Una frase che descrive la ricetta in contesto."
    image: "/images/[opzionale].webp"
    prepTimeMin: 15
    cookTimeMin: 20
    servings: 4
    cuisine: "Italiana"
    category: "Primo" # Antipasto | Primo | Secondo | Contorno | Dolce
    ingredients:
      - "400 g di [prodotto], puliti"
      - "2 cucchiai di olio EVO trentino"
      - "..."
    instructions:
      - name: "Preparazione"
        text: "Descrivi lo step in 1-2 frasi concrete."
      - name: "Cottura"
        text: "..."
    nutrition:
      calories: "320 kcal"
      protein: "8 g"
      carbs: "45 g"
      fat: "12 g"
    keywords: ["ricetta [prodotto]", "primo piatto stagionale"]

faq:
  - q: "Quando è di stagione il [prodotto] in Trentino?"
    a: "Risposta concreta di 1-3 frasi. Include il mese esatto e il riferimento territoriale."
  - q: "Come si conserva il [prodotto]?"
    a: "..."
  - q: "Qual è la differenza tra [prodotto] e [prodotto simile]?"
    a: "..."

draft: false
featured: false
relatedSlugs: ["altro-slug"]
---
```

---

## 3. Struttura body canonica (8 sezioni H2)

### `## Che cos'è il [prodotto]`

Aperta con **`<StatGrid>`** (3-4 numeri chiave: kcal/100g, mesi stagione, ettari coltivati, anni di storia).
Paragrafo di definizione: include la keyword primaria nelle prime 100 parole. Indica botanica, famiglia, nome scientifico, nome dialettale. Chiude con un hook sul territorio Bottamedi.

### `## La storia e il territorio`

Usa **`<Timeline>`** se ha una storia documentata (anni/tappe) o **`<PullQuote>`** per una frase memorabile di un produttore/chef.
Racconta origine, espansione in Trentino, fornitori reali di Bottamedi (es. "Ce lo porta Andrea da Zambana ogni martedì").

### `## Come riconoscere il [prodotto] fresco`

Usa **`<Compare>`** con due colonne: `left` = prodotto fresco/di qualità, `right` = segnali di prodotto vecchio/industriale. Insegna al lettore cosa vedere, toccare, annusare al banchetto.

### `## Conservazione`

Almeno un **`<Callout type="tip">`** con il consiglio non-ovvio (es. "Non lavare prima di riporre, l'acqua accelera la marcescenza").
Includi: frigo vs dispensa, giorni di durata, cosa succede a congelarlo, errore tipico del consumatore.

### `## Come prepararlo/cucinarlo`

Tecnica base: pulizia, taglio, pre-cottura. Tabella tempi di cottura per metodo (vapore/bollitura/forno/padella) se pertinente.
Segnala abbinamenti classici (olio, aceto, formaggi trentini, erbe).

### `## Ricette`

H3 per ogni ricetta — **una per ciascuna entry in frontmatter `recipes[]`**. Ogni ricetta ha:
- Paragrafo introduttivo (contesto: "Nella ribollita toscana il cavolo nero è protagonista, ma a Mezzolombardo lo adattiamo così...")
- Lista ingredienti in bullet
- Istruzioni numerate
- Nota finale (variante, abbinamento vino, consiglio di famiglia)

**Il contenuto MDX deve corrispondere al frontmatter**: nome, ingredienti, numero porzioni uguali. Google valida la coerenza.

### `## FAQ — Le domande frequenti`

H3 per ogni domanda — **una per ciascuna entry in frontmatter `faq[]`**. Risposte brevi (2-4 frasi) che conquistano "People Also Ask".

### `## Dove acquistarlo / HORECA`

Chiusura con **`<CTA href="/#banchetto">`** o **`<CTA href="/#wholesale">`**. 
Racconta brevemente il servizio (banchetto retail + ingrosso HORECA), dai 1-2 link interni ad altri articoli del blog.

---

## 4. Componenti MDX — cheat sheet obbligatori

Ogni monografia deve includere **minimo 4** di questi:

| Componente | Uso nella monografia |
|---|---|
| `<StatGrid>` + `<Stat>` | Apertura "Che cos'è" con numeri chiave |
| `<Timeline>` + `<TimelineItem>` | Sezione "Storia" (se esistono tappe) |
| `<Compare left right>` | Sezione "Come riconoscerlo fresco" |
| `<PullQuote cite>` | Frase di un produttore o della famiglia Bottamedi |
| `<Callout type="tip">` | Sezione "Conservazione" (consiglio non-ovvio) |
| `<Callout type="info">` | Fact-check o curiosità botanica |
| `<Callout type="warning">` | Errore frequente (es. cottura sbagliata) |
| `<Gallery images=[...]>` | Solo se post > 1800 parole, 2-4 immagini |
| `<CTA href>` | 1 chiusura, massimo 2 nell'articolo |
| `<Reveal preset>` | Enfasi su paragrafo di chiusura |

---

## 5. Checklist pre-commit

### Ricerca
- [ ] SERP analysis fatta (top 3 Google per `targetKeyword`)
- [ ] Fact-check su almeno 2 fonti autorevoli esterne
- [ ] Angolo locale Bottamedi identificato e integrato

### Frontmatter
- [ ] `targetKeyword` dichiarata
- [ ] `produce` completo (name, scientificName, seasonMonths, category)
- [ ] `recipes[]` con 2-4 ricette; ingredienti e istruzioni complete
- [ ] `faq[]` con 4-6 domande reali ("People Also Ask")
- [ ] `cover.alt` include keyword + Mezzolombardo/Trentino
- [ ] `animation` e `mood` coerenti con stagione

### Contenuto
- [ ] Lunghezza ≥ 1.500 parole (2.000-2.500 per "ultimate guide")
- [ ] Tutte le 8 sezioni H2 presenti, nell'ordine
- [ ] Keyword primaria nelle prime 100 parole
- [ ] Almeno 4 componenti MDX diversi
- [ ] 2 link interni (altro post del blog + `/#banchetto` o `/#wholesale`)
- [ ] 1 link esterno a fonte autorevole (CREA, CSO, DOP, Slow Food)
- [ ] Coerenza: ricette in body = ricette in frontmatter

### Pubblicazione
- [ ] `npm run blog:validate` passa
- [ ] `npm run type-check` passa
- [ ] `npm run build` passa e genera `/blog/[slug]/index.html`
- [ ] `_generated-index.json` aggiornato automaticamente
- [ ] `.editorial-calendar.json` aggiornato a mano
- [ ] Commit: `feat(blog): [prodotto] premium monograph`

---

## 6. Tono di voce — non negoziabile

- **Tu informale**. Mai "voi" o "Lei".
- **Mezzolombardo è il centro del mondo**: cita negozi reali, fornitori reali, viaggi in furgone.
- **Italiano pulito**: "fornitori" non "supplier", "banchetto" non "stand".
- **Niente superlativi vuoti**: scrivi "raccolti questa mattina alle 5" invece di "freschissimi".
- **Dati > aggettivi**: "35 kcal/100 g" vale più di "leggero".
- **Nessuna emoji** nel corpo testo (ok nelle UI, mai nel contenuto).
- **Ammetti i limiti**: "non tutti i pomodori cuore di bue sono buoni — ti spieghiamo come scegliere".

---

## 7. Fonti di ispirazione quando sei bloccato

- **Serious Eats** — `seriouseats.com` — rigore tecnico, "The Food Lab"
- **NYT Cooking** — `cooking.nytimes.com` — ricetta + storia
- **Food52** — `food52.com` — tono caldo, community
- **Gambero Rosso** — `gamberorosso.it` — autorità italiana
- **Slow Food** — `slowfood.it` — presidi e territorio
- **Fresh Plaza** — `freshplaza.it` — dati mercato ortofrutta

Non copiare: prendi il ritmo, l'angolo, la struttura. Il contenuto è tuo (e Bottamedi).
