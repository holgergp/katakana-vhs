# AI Agent Onboarding: Katakana Lernapp (katakana-vhs)

Willkommen im `katakana-vhs` Repository! Dieses Dokument dient als Schnelleinstieg für KI-Assistenten und Entwickler, um die Architektur, Konventionen und Arbeitsweise dieses Projekts zu verstehen.

---

## Projektbeschreibung & Ziele

`katakana-vhs` ist eine eigenständige Single-Page-App (SPA) zum Erlernen des japanischen **Katakana**-Schriftsystems. Sie ist als Schwester-Projekt zu `hiragana-vhs` konzipiert und folgt dem Lehrplan von **Minna no Nihongo** (みんなの日本語) für den VHS-Kurs A1.1.1 in Düsseldorf.

---

## Tech Stack & Konventionen

- **Framework:** React 19 (ohne Routing-Bibliotheken, tab-basiertes Routing in `App.jsx`)
- **Build-Tool:** Vite 6 / `@vitejs/plugin-react`
- **Sprache:** Plain JSX (kein TypeScript, kein ES-Lint initial)
- **Styling:** Vanilla CSS-in-JS (ein einziger CSS-Template-String in `App.jsx` injiziert als `<style>`-Block)
- **Laufzeitabhängigkeiten:** Nur `react` und `react-dom`
- **Dev-Tools:** `prettier` für Formatierung

---

## Verzeichnisstruktur & Hauptdateien

```
katakana-vhs/
├── index.html                    # HTML-Hülle (mit Google-Fonts Noto Sans JP und DM Serif Display)
├── package.json                  # Projektabhängigkeiten und Skripte
├── vite.config.js                # Vite-Konfiguration (Netlify vs. GitHub Pages Pfade)
├── netlify.toml                  # Netlify Build-Einstellungen & SPA-Redirect
├── .github/workflows/
│   └── deploy.yml                # CI/CD-Workflow für GitHub Pages (deployt von 'main' auf 'gh-pages')
├── AGENTS.md                     # Dieses Onboarding-Dokument
├── PLAN.md                       # Das ursprüngliche Planungsdokument
└── src/
    ├── main.jsx                  # React-Einstiegspunkt (Strict Mode)
    ├── App.jsx                   # Tab-Routing, Header, CSS-Styles und Übersicht-Komponente
    ├── data.js                   # Datenmodell (KATAKANA_DATA, WORD_DATA, GROUP_LABELS)
    ├── quizUtils.js              # Reine Hilfsfunktionen (shuffle, getWrongOptions, pickWeighted)
    └── components/
        ├── Quiz.jsx              # Zeichen-Quiz (Zeichen ⇄ Aussprache)
        └── WordQuiz.jsx          # Wort-Quiz (Wort ⇄ Aussprache mit deutscher Übersetzung)
```

---

## Datenmodell (`src/data.js`)

1. **`KATAKANA_DATA`**: Array aller 71 Katakana-Zeichen.
   - `char`: Das Zeichen (z. B. `"ア"`).
   - `rom`: Die Hepburn-Romanisierung (z. B. `"a"`).
   - `group`: Reihen-Bezeichnung (`vowels`, `k`, `s`, `t`, `n`, `h`, `m`, `y`, `r`, `w`, `g`, `z`, `d`, `b`, `p`).
   - `lesson`: Lektion 1 (46 Grundzeichen) oder Lektion 2 (25 Dakuten/Handakuten).

2. **`GROUP_LABELS`**: Anzeigename der Reihen (z. B. `k: "カ行 (K)"`).

3. **`WORD_DATA`**: Katakana-Vokabeln aus Lektion 1 des Lehrbuchs.
   - `word`: Japanisches Wort (z. B. `"アメリカ"`).
   - `rom`: Romanisierung (`"amerika"`).
   - `german`: Deutsche Übersetzung (`"USA"`).
   - `category`: Kategorie (`"Land"`, `"Person"`, `"Firma"`, `"Institut"`).
   - `lesson`: Lektionsnummer (`1`).

---

## Wichtige Algorithmen & Logiken (`src/quizUtils.js`)

- **`shuffle(array)`**: Fisher-Yates Shuffle zur Randomisierung von Arrays.
- **`getWrongOptions(correct, pool, count)`**: Generiert ablenkende Falschantworten (Distraktoren) für das Multiple-Choice-Quiz.
- **`pickWeighted(pool, wrongCounts, getKey)`**: Führt eine gewichtete Zufallsauswahl durch. Elemente, die in `wrongCounts` häufiger vorkommen, werden mit einer höheren Wahrscheinlichkeit ausgewählt.

---

## Entwicklungskommandos

```bash
# Abhängigkeiten installieren
npm install

# Lokalen Entwicklungsserver starten
npm run dev

# Anwendung für Produktion bauen (erstellt den 'dist' Ordner)
npm run build

# Code formatieren
npm run format
```
