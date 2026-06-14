# Plan: Katakana-Lernapp (katakana-vhs)

## Ziel

Eine eigenständige Single-Page-App zum Erlernen der japanischen **Katakana**-Zeichen, aufgebaut als Schwester-Projekt zu `hiragana-vhs`. Die App folgt dem Lehrplan von **Minna no Nihongo** (みんなの日本語) für den VHS-Kurs A1.1.1 in Düsseldorf und deckt zunächst die **erste Katakana-Lektion** ab.

Katakana wird in Minna no Nihongo primär für Fremdwörter, Ländernamen, Eigennamen und Lautmalerei verwendet. In Lektion 1 des Lehrbuchs tauchen bereits zahlreiche Katakana-Wörter auf (Ländernamen, Firmennamen, Personennamen), was den natürlichen Einstiegspunkt bildet.

---

## Abgrenzung zu hiragana-vhs

| Aspekt | hiragana-vhs | katakana-vhs (neu) |
|---|---|---|
| Schriftsystem | Hiragana (ひらがな) | Katakana (カタカナ) |
| Kontext | Grundwortschatz, Grammatikwörter | Fremdwörter, Ländernamen, Eigennamen |
| Repository | Eigenes Git-Repo | Eigenes Git-Repo (kein Monorepo) |
| Code-Basis | Eigenständig | Eigenständig (gleiche Architektur, kein Shared Code) |

Die App wird als **unabhängiges Projekt** im selben Elternverzeichnis `/japanisch/` angelegt -- analog zur bestehenden Struktur mit `hiragana-vhs` und `japanische-zahlen`.

---

## Tech Stack (identisch zu hiragana-vhs)

| Schicht | Technologie |
|---|---|
| Framework | **React 19** (kein Routing-Library) |
| Build-Tool | **Vite 8** mit `@vitejs/plugin-react` |
| Styling | **Vanilla CSS-in-JS** -- ein einziger `<style>`-Block in `App.jsx` |
| Formatter | **Prettier** |
| Sprache | Plain JSX (kein TypeScript) |
| Tests | Keine (initial) -- Vitest bei Bedarf |
| Laufzeitabhängigkeiten | Nur `react` und `react-dom` |

---

## Projektstruktur

```
katakana-vhs/
├── index.html                    # HTML-Shell (lang="de")
├── package.json                  # Abhängigkeiten & Skripte
├── vite.config.js                # Vite-Konfiguration mit bedingtem Base-Pfad
├── netlify.toml                  # Netlify Build-Einstellungen + SPA-Redirect
├── .github/workflows/
│   └── deploy.yml                # GitHub Pages CI/CD
├── AGENTS.md                     # AI-Agent Onboarding-Dokument
├── PLAN.md                       # Dieses Planungsdokument
└── src/
    ├── main.jsx                  # Einstiegspunkt: rendert <App /> in StrictMode
    ├── App.jsx                   # Tab-Router, Header, Styles, Overview-Komponente
    ├── data.js                   # KATAKANA_DATA, WORD_DATA, GROUP_LABELS
    ├── quizUtils.js              # Reine Hilfsfunktionen (shuffle, getWrongOptions, pickWeighted)
    └── components/
        ├── Quiz.jsx              # Katakana-Zeichen-Quiz
        └── WordQuiz.jsx          # Katakana-Wort-Quiz
```

---

## Datenmodell

### 1. `KATAKANA_DATA` -- Zeichendaten

Flaches Array aller Katakana-Zeichen in Gojuon-Reihenfolge:

```js
{ char: "ア", rom: "a", group: "vowels", lesson: 1 }
```

**Felder:**
- `char` -- das Katakana-Zeichen
- `rom` -- Hepburn-Romanisierung (z. B. "shi", "tsu", "fu" fuer unregelmaessige Lesungen)
- `group` -- Reihen-Kennung (vowels, k, s, t, n, h, m, y, r, w, g, z, d, b, p)
- `lesson` -- `1` (46 Grundzeichen: Gojuon) oder `2` (25 Dakuten/Handakuten-Zeichen)

**Lektion 1 -- Grundzeichen (46 Zeichen):**

| Reihe | Zeichen |
|---|---|
| Vokale | ア イ ウ エ オ |
| K | カ キ ク ケ コ |
| S | サ シ ス セ ソ |
| T | タ チ ツ テ ト |
| N | ナ ニ ヌ ネ ノ |
| H | ハ ヒ フ ヘ ホ |
| M | マ ミ ム メ モ |
| Y | ヤ ユ ヨ |
| R | ラ リ ル レ ロ |
| W/N | ワ ヲ ン |

**Lektion 2 -- Dakuten & Handakuten (25 Zeichen):**

| Reihe | Zeichen |
|---|---|
| G | ガ ギ グ ゲ ゴ |
| Z | ザ ジ ズ ゼ ゾ |
| D | ダ ヂ ヅ デ ド |
| B | バ ビ ブ ベ ボ |
| P | パ ピ プ ペ ポ |

### 2. `GROUP_LABELS` -- Gruppen-Bezeichnungen

```js
{
  vowels: "Vokale",
  k: "カ行 (K)",
  s: "サ行 (S)",
  t: "タ行 (T)",
  n: "ナ行 (N)",
  h: "ハ行 (H)",
  m: "マ行 (M)",
  y: "ヤ行 (Y)",
  r: "ラ行 (R)",
  w: "ワ行 (W) · ン",
  g: "ガ行 (G)",
  z: "ザ行 (Z)",
  d: "ダ行 (D)",
  b: "バ行 (B)",
  p: "パ行 (P)",
}
```

### 3. `WORD_DATA` -- Katakana-Wortschatz

Wörter aus Minna no Nihongo, die in Katakana geschrieben werden. Fokus auf Lektion 1 des Lehrbuchs.

```js
{ word: "アメリカ", rom: "amerika", german: "USA", lesson: 1 }
```

**Felder:**
- `word` -- das Katakana-Wort
- `rom` -- Romanisierung
- `german` -- deutsche Uebersetzung
- `lesson` -- Lektionsnummer

**Lektion 1 -- Laendernamen und Eigennamen aus Minna no Nihongo:**

| Katakana | Romaji | Deutsch | Kategorie |
|---|---|---|---|
| アメリカ | amerika | USA | Land |
| イギリス | igirisu | Grossbritannien | Land |
| インド | indo | Indien | Land |
| インドネシア | indoneshia | Indonesien | Land |
| タイ | tai | Thailand | Land |
| ドイツ | doitsu | Deutschland | Land |
| ブラジル | burajiru | Brasilien | Land |
| マイク・ミラー | maiku miraa | Mike Miller | Person (fiktiv) |
| サントス | santosu | Santos | Person (fiktiv) |
| カリナ | karina | Karina | Person (fiktiv) |
| ワン | wan | Wang | Person (fiktiv) |
| タワポン | tawappon | Tawapong | Person (fiktiv) |
| テレサ | teresa | Teresa | Person (fiktiv) |
| IMC | ai-emu-shii | IMC | Firma (fiktiv) |
| パワーでんき | pawaa denki | Power Denki | Firma (fiktiv) |
| ブラジルエアー | burajiru eaa | Brasil Air | Firma (fiktiv) |
| AKC | ee-kee-shii | AKC | Institut (fiktiv) |

**Spaetere Lektionen** (hier nur als Vorschau, Umsetzung nach Bedarf):

| Lektion | Inhalte |
|---|---|
| 2 | Katakana-Langvokale (Choon: ー), z.B. コーヒー, ノート, テーブル |
| 3 | Katakana-Sonderzeichen (ティ, ファ, ヴィ etc.), moderne Fremdwortschreibung |
| 4 | Weitere Fremdwoerter aus Minna no Nihongo (Speisen, Getraenke, Gegenstaende) |

---

## Features

### Phase 1 (MVP)

| Feature | Beschreibung |
|---|---|
| **Zeichenuebersicht** | Grid aller Katakana, gruppiert nach Reihe, filterbar nach Lektion |
| **Zeichen-Quiz (2 Modi)** | Multiple-Choice mit 3 Optionen: Zeichen->Aussprache und Aussprache->Zeichen |
| **Wort-Quiz (2 Modi)** | Multiple-Choice mit 3 Optionen + deutscher Uebersetzung |
| **3-Sekunden-Denkzeit** | Countdown vor Einblenden der Antwortmoeglichkeiten |
| **Gewichtete Auswahl** | Falsch beantwortete Zeichen/Woerter erscheinen haeufiger (pickWeighted) |
| **Score-Tracking** | Korrekt / Gesamt / Prozentzahl pro Sitzung |
| **Lektions-Filter** | Filter nach Lektion (1, 2, Alle) in Uebersicht und Quiz |

### Phase 2 (spaeter)

| Feature | Beschreibung |
|---|---|
| **Referenztabellen** | Choon (Langvokale mit ー), katakana-spezifische Sonderzeichen |
| **Weitere Lektionen** | Wortschatz aus Minna no Nihongo Lektionen 2-5 |
| **Katakana-spezifische Regeln** | Erklaerung der ー (Choon), kleine Zeichen (ァ ィ ゥ ェ ォ) |

---

## UI/UX Design

### Visuelles Design (identisch zu hiragana-vhs)
- **Theme:** Dark Mode (`#0d0d0f` Hintergrund)
- **Farbpalette:** Gold-Akzent (`#b8860b`), warmes Off-White (`#e8e4dc` / `#f5f0e8`)
- **Typografie:** Google Fonts `Noto Sans JP` + `DM Serif Display`
- **Layout:** Max-Breite 900px zentriert, responsives Grid fuer Uebersicht
- **Mobile:** Responsive ab 480px Breakpoint, horizontale Scroll-Navigation

### Header
```
みんなの日本語 · A1.1.1        (Eyebrow)
Katakana                       (Haupttitel -- statt "Hiragana")
Lernapp fuer den VHS-Kurs      (Untertitel)
```

### Navigation (5 Tabs)
1. **Uebersicht** -- Zeichengrid mit Gruppenbezeichnungen
2. **Zeichen -> Aussprache** -- Katakana-Zeichen wird gezeigt, Romaji waehlen
3. **Aussprache -> Zeichen** -- Romaji wird gezeigt, Katakana waehlen
4. **Wort -> Aussprache** -- Katakana-Wort + Deutsch, Romaji waehlen
5. **Aussprache -> Wort** -- Romaji + Deutsch, Katakana-Wort waehlen

### Sprache
Alle UI-Texte auf **Deutsch** (Zielgruppe: deutschsprachige VHS-Kursteilnehmer).

---

## Komponenten

### `App.jsx`
- Tab-Router (State: `tab`)
- Header mit Titel "Katakana"
- Navigation (5 Tabs)
- Shared State: `wrongCounts` Map + `registerMiss` Callback
- CSS-Template-String mit allen Styles
- `Overview`-Komponente (inline)

### `Overview` (in App.jsx)
- Lektions-Filter-Pills ("Alle Zeichen", "Lektion 1", "Lektion 2")
- Gruppiertes Grid der Katakana-Karten (Zeichen + Romanisierung)
- Spaeter: Referenztabellen fuer Katakana-spezifische Regeln (Choon etc.)

### `Quiz.jsx`
- Props: `{ mode, wrongCounts, onRegisterMiss }`
- `mode="char2rom"`: Zeigt Katakana, Nutzer waehlt Romaji
- `mode="rom2char"`: Zeigt Romaji, Nutzer waehlt Katakana
- Lektions-Filter, Score, 3-Sekunden-Countdown, gewichtete Auswahl

### `WordQuiz.jsx`
- Identische Struktur wie Quiz, aber mit `WORD_DATA`
- Zeigt deutsche Uebersetzung als Kontext
- Lektions-Filter nach Wort-Lektionen

### `quizUtils.js`
- `shuffle(arr)` -- Fisher-Yates Shuffle
- `getWrongOptions(correct, pool, count)` -- Distraktoren generieren
- `pickWeighted(pool, weights, getKey)` -- Gewichtete Zufallsauswahl

---

## Deployment

### GitHub Pages
- Repository: `holgergp/katakana-vhs` (neu zu erstellen)
- URL: `https://holgergp.github.io/katakana-vhs/`
- CI/CD: `.github/workflows/deploy.yml` (Push auf `main`, Node 20)

### Netlify
- Automatische Branch-Previews
- SPA-Redirect: `/* -> /index.html` (Status 200)

### Base-Pfad (vite.config.js)
```js
const base = process.env.NETLIFY ? '/' : '/katakana-vhs/'
```

---

## Implementierungsschritte

| # | Schritt | Geschaetzter Aufwand |
|---|---------|---------------------|
| 1 | Projekt-Scaffolding: `package.json`, `vite.config.js`, `index.html`, `netlify.toml` | Klein |
| 2 | `src/data.js`: KATAKANA_DATA (71 Zeichen), WORD_DATA (Lektion 1), GROUP_LABELS | Mittel |
| 3 | `src/quizUtils.js`: Kopie aus hiragana-vhs (identische Logik) | Klein |
| 4 | `src/main.jsx`: Entry Point | Klein |
| 5 | `src/App.jsx`: Header, Navigation, CSS, Overview-Komponente | Gross |
| 6 | `src/components/Quiz.jsx`: Zeichen-Quiz (2 Modi) | Mittel |
| 7 | `src/components/WordQuiz.jsx`: Wort-Quiz (2 Modi) | Mittel |
| 8 | GitHub-Repository erstellen + Actions-Workflow | Klein |
| 9 | AGENTS.md erstellen | Klein |
| 10 | Lokaler Test (`npm run dev`) + Feinschliff | Mittel |

---

## Besondere Ueberlegungen fuer Katakana

### Unterschiede zu Hiragana, die beim Design beruecksichtigt werden muessen

1. **Langvokalstrich (ー):** Katakana verwendet den Langvokalstrich ー (Choon) anstelle der Hiragana-Vokalverlaengerung. Z. B. コーヒー (koohii) statt こうひい. Dies sollte in den Referenztabellen erklaert werden.

2. **Sonderzeichen fuer Fremdwoerter:** Moderne Katakana kennt Kombinationen, die in Hiragana nicht existieren:
   - ティ (ti), ディ (di), ファ (fa), フィ (fi), フェ (fe), フォ (fo)
   - ヴァ (va), ヴィ (vi), ヴ (vu), ヴェ (ve), ヴォ (vo)
   Diese gehoeren nicht zur Lektion 1, sollten aber als spaetere Erweiterung eingeplant werden.

3. **Verwechslungsgefahr mit Hiragana:** Einige Katakana sehen aehnlich wie Hiragana aus (z. B. カ/か, ニ/に, ヘ/へ, リ/り). Ein spaeteres Feature koennte ein Vergleichsmodus sein.

4. **Wortlaenge:** Katakana-Woerter (Fremdwoerter) sind oft laenger als typische Hiragana-Woerter. Die UI-Schriftgroessen muessen ggf. angepasst werden.

---

## Edge-Cases

| Szenario | Verhalten |
|---|---|
| **Wort-Pool zu klein** | getWrongOptions muss >= 3 Woerter im Pool haben. Bei zu wenigen Woertern: Hinweis anzeigen oder Filter erweitern |
| **Gemischte Schreibweise** | Manche Woerter mischen Katakana und Hiragana/Kanji (z. B. パワーでんき). Diese werden als Ganzes behandelt |
| **Langvokalstrich in Quiz** | Der ー ist kein eigenstaendiges Zeichen im Quiz, erscheint aber in Woertern |
| **Aehnliche Romaji** | "shi" vs "si", "tsu" vs "tu" -- konsistent Hepburn-Romanisierung verwenden |

---

## Zusammenfassung

Die App wird als strukturelle Kopie von `hiragana-vhs` angelegt, mit folgenden Anpassungen:
- Alle Hiragana-Daten werden durch Katakana-Aequivalente ersetzt
- Der Wortschatz konzentriert sich auf Fremdwoerter/Laendernamen (Katakana-typisch)
- Header und Titel werden auf "Katakana" geaendert
- GROUP_LABELS verwenden Katakana-Reihenbezeichnungen (カ行 statt か行)
- Spaetere Phasen behandeln katakana-spezifische Besonderheiten (Choon, Sonderzeichen)

**Geschaetzter Gesamtaufwand:** ~800 Zeilen Code (inkl. Daten und CSS), verteilt auf 8-10 Dateien.
