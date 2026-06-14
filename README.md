# Katakana Lernapp (katakana-vhs)

Eine eigenständige, moderne Single-Page-App (SPA) zum Erlernen des japanischen **Katakana**-Schriftsystems. Diese Anwendung ist als Schwester-Projekt zu `hiragana-vhs` konzipiert und folgt dem Lehrplan von **Minna no Nihongo** (みんなの日本語) für den VHS-Kurs A1.1.1 in Düsseldorf.

## 🚀 Live Demo

Die Anwendung ist auf verschiedenen Plattformen erreichbar:

* **Netlify (Haupt-Deployment):** [https://katakana-vhs.netlify.app/](https://katakana-vhs.netlify.app/)
* **GitHub Pages:** [https://holgergp.github.io/katakana-vhs/](https://holgergp.github.io/katakana-vhs/)

---

## 📖 Hintergrund & Lehrplan

Katakana wird im Japanischen primär für Fremdwörter, Lehnwörter (Gairaigo), Ländernamen, ausländische Eigennamen und Lautmalereien verwendet. Da in Lektion 1 des Lehrbuchs *Minna no Nihongo* bereits zahlreiche Katakana-Wörter wie Länder-, Personen- oder Firmennamen vorkommen, bildet diese App den perfekten Begleiter für den Einstieg.

### Enthaltene Lektionen:
* **Lektion 1 -- Grundzeichen (46 Gojūon-Zeichen):** Von ア (a) bis ン (n).
* **Lektion 2 -- Dakuten & Handakuten (25 Zeichen):** Trübung (z. B. ガ ga, パ pa).
* **Vokabel-Modus:** Katakana-Wortschatz aus Lektion 1 des Lehrwerks (Länder, Personen, Firmen, Institute).

---

## ✨ Features

* **Zeichenübersicht:** Übersichtliches Grid aller Katakana, gruppiert nach Reihen, flexibel filterbar nach Lektionen. Erklärt auch Besonderheiten wie den Langvokalstrich (`ー`).
* **Zeichen-Trainer (2 Modi):** Multiple-Choice-Quiz (3 Optionen) für *Zeichen → Romaji* und *Romaji → Zeichen*.
* **Wortschatz-Trainer (2 Modi):** Vokabel-Quiz mit deutschem Übersetzungs-Kontext für *Wort → Romaji* und *Romaji → Wort*.
* **🧠 Fokus-Modus (Gewichtete Zufallsauswahl):** Falsch beantwortete Zeichen oder Wörter tauchen automatisch häufiger auf (`pickWeighted`-Algorithmus), um den Lerneffekt zu maximieren. Der Fortschritt kann jederzeit unten zurückgesetzt werden.
* **⏱️ Denkpause:** Ein optionaler 3-Sekunden-Countdown vor Einblenden der Antwortmöglichkeiten fördert das aktive Erinnern statt schnellem Raten (kann bei Bedarf sofort übersprungen werden).
* **📱 Mobile First & Responsive:** Wunderschönes Dark-Theme (Gold/Off-White) optimiert für Smartphones, Tablets und Desktop.

---

## 🛠️ Tech Stack

* **Framework:** React 19 (ohne schwere Routing-Bibliotheken, tab-basiertes State-Routing)
* **Build-Tool:** Vite 6
* **Styling:** Vanilla CSS-in-JS (für extrem kurze Ladezeiten ohne CSS-Dateien-Overhead)
* **Formatierung:** Prettier
* **Schnittstellen:** Nur native React-APIs, keine externen UI- oder State-Management-Bibliotheken.

---

## 💻 Entwicklung & Installation

### Voraussetzungen
Stelle sicher, dass [Node.js](https://nodejs.org/) installiert ist.

### 1. Repository klonen und installieren
```bash
git clone https://github.com/holgergp/katakana-vhs.git
cd katakana-vhs
npm install
```

### 2. Entwicklungsserver starten
```bash
npm run dev
```
Der Server läuft standardmäßig unter `http://localhost:5173`.

### 3. Produktions-Build erstellen
Erstellt einen optimierten `dist` Ordner für das Deployment:
```bash
npm run build
```

### 4. Code-Formatierung
```bash
npm run format
```

---

## 🌐 Deployment & CI/CD

* **Netlify:** Automatische Branch-Previews und Haupt-Deployment aus dem `dist`-Ordner über das integrierte `netlify.toml` Konfigurationsfile.
* **GitHub Pages:** CI/CD über GitHub Actions (`.github/workflows/deploy.yml`), das bei einem Push auf den `main`-Branch automatisch auf `gh-pages` deployt.
