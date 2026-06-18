import React, { useState } from "react";
import { KATAKANA_DATA, WORD_DATA, GROUP_LABELS } from "./data.js";
import Quiz from "./components/Quiz.jsx";
import WordQuiz from "./components/WordQuiz.jsx";

// Styling injected in <style> tag
const styles = `
  :root {
    --bg-color: #0d0d0f;
    --text-color: #f5f0e8;
    --text-muted: #8a8680;
    --gold: #b8860b;
    --gold-light: #dfad2c;
    --card-bg: #161619;
    --card-hover: #1e1e23;
    --border: #2d2b28;
    --button-bg: #252321;
    --font-serif: 'DM Serif Display', Georgia, serif;
    --font-sans: 'Noto Sans JP', sans-serif;
  }

  body {
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: var(--font-sans);
    margin: 0;
    padding: 0;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .app-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
  }

  /* Header Styles */
  .header {
    text-align: center;
    margin-bottom: 40px;
    margin-top: 20px;
  }

  .header-eyebrow {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--gold);
    font-weight: 700;
    margin-bottom: 8px;
  }

  .header-title {
    font-family: var(--font-serif);
    font-size: 3.5rem;
    font-weight: 400;
    margin: 0 0 8px 0;
    letter-spacing: -0.01em;
    color: var(--text-color);
  }

  .header-subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
    font-weight: 300;
    margin: 0;
  }

  /* Navigation / Tabs */
  .nav-tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 30px;
    padding-bottom: 1px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .nav-tabs::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .nav-tabs {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .tab-button {
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 12px 20px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    font-family: var(--font-sans);
  }

  .tab-button:hover {
    color: var(--text-color);
  }

  .tab-button.active {
    color: var(--gold);
    border-bottom: 2px solid var(--gold);
    font-weight: 700;
  }

  /* Filters styling */
  .filters-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .filter-pill {
    background-color: var(--button-bg);
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 8px 18px;
    font-size: 0.85rem;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .filter-pill:hover {
    border-color: var(--gold);
    color: var(--text-color);
  }

  .filter-pill.active {
    background-color: var(--gold);
    border-color: var(--gold);
    color: var(--bg-color);
    font-weight: 700;
  }

  /* Overview Group Layout */
  .overview-section {
    animation: fadeIn 0.3s ease;
  }

  .group-container {
    margin-bottom: 35px;
  }

  .group-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--gold);
    border-left: 3px solid var(--gold);
    padding-left: 10px;
    margin-bottom: 15px;
    letter-spacing: 0.05em;
  }

  .kana-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
  }

  .kana-card {
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 8px;
    text-align: center;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .kana-card:hover {
    transform: translateY(-2px);
    border-color: var(--gold);
    background-color: var(--card-hover);
    box-shadow: 0 4px 12px rgba(184, 134, 11, 0.15);
  }

  .kana-char {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 4px;
    color: var(--text-color);
  }

  .kana-rom {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 400;
    text-transform: lowercase;
  }

  .no-data-msg {
    text-align: center;
    padding: 40px;
    color: var(--text-muted);
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  /* Reference rules info card */
  .info-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 50px;
    border-top: 1px solid var(--border);
    padding-top: 30px;
  }

  @media (max-width: 600px) {
    .info-sections {
      grid-template-columns: 1fr;
    }
  }

  .info-card {
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
  }

  .info-card h3 {
    margin-top: 0;
    color: var(--gold);
    font-family: var(--font-serif);
    font-size: 1.3rem;
    font-weight: 400;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 12px;
  }

  .info-card p {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.5;
  }

  .footer {
    text-align: center;
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    font-size: 0.8rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Quiz shared layout */
  .quiz-container {
    background-color: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 30px;
    max-width: 600px;
    margin: 0 auto;
    animation: fadeIn 0.3s ease;
    box-sizing: border-box;
  }

  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .score-badge {
    background-color: var(--button-bg);
    border: 1px solid var(--border);
    padding: 4px 12px;
    border-radius: 12px;
    color: var(--gold);
    font-weight: 700;
  }

  .quiz-question-box {
    text-align: center;
    padding: 40px 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--border);
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .quiz-prompt {
    font-size: 0.9rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 15px;
  }

  .quiz-char {
    font-size: 5rem;
    font-weight: 700;
    color: var(--text-color);
    line-height: 1.1;
  }

  .quiz-german-context {
    font-size: 1.3rem;
    color: var(--gold);
    margin-top: 10px;
    font-weight: 500;
  }

  /* 3-Second Countdown overlay/text */
  .countdown-box {
    text-align: center;
    font-size: 1.1rem;
    color: var(--gold);
    padding: 20px;
    animation: pulse 1s infinite alternate;
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .option-btn {
    background-color: var(--button-bg);
    border: 1px solid var(--border);
    color: var(--text-color);
    padding: 16px;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-sans);
    font-weight: 500;
    text-align: center;
  }

  .option-btn:hover:not(:disabled) {
    border-color: var(--gold);
    background-color: var(--card-hover);
    transform: translateY(-1px);
  }

  .option-btn.correct {
    background-color: #2e4d2a !important;
    border-color: #4cd137 !important;
    color: #ffffff !important;
    font-weight: 700;
  }

  .option-btn.incorrect {
    background-color: #632222 !important;
    border-color: #c23616 !important;
    color: #ffffff !important;
    font-weight: 700;
  }

  .feedback-box {
    text-align: center;
    margin-top: 25px;
    animation: fadeIn 0.2s ease;
  }

  .feedback-text {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .feedback-text.correct {
    color: #4cd137;
  }

  .feedback-text.incorrect {
    color: #e84118;
  }

  .next-btn {
    background-color: var(--gold);
    color: var(--bg-color);
    border: none;
    padding: 12px 30px;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-sans);
  }

  .next-btn:hover {
    background-color: var(--gold-light);
    transform: translateY(-1px);
  }

  /* Reset Button styles */
  .reset-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 4px 10px;
    font-size: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reset-btn:hover {
    border-color: var(--gold);
    color: var(--text-color);
  }
`;

// Helper component for the character grid overview
function Overview({ selectedLesson, setSelectedLesson }) {
  // Filter the Katakana based on the selected lesson
  const filteredData = KATAKANA_DATA.filter((item) => {
    if (selectedLesson === "all") return true;
    return item.lesson === Number(selectedLesson);
  });

  // Get only the groups that have at least one character in the filtered dataset
  const activeGroups = Array.from(
    new Set(filteredData.map((item) => item.group)),
  );

  // Preserve group ordering based on GROUP_LABELS keys
  const orderedGroups = Object.keys(GROUP_LABELS).filter((groupKey) =>
    activeGroups.includes(groupKey),
  );

  return (
    <div className="overview-section">
      <div className="filters-container">
        <button
          className={`filter-pill ${selectedLesson === "all" ? "active" : ""}`}
          onClick={() => setSelectedLesson("all")}
        >
          Alle Zeichen
        </button>
        <button
          className={`filter-pill ${selectedLesson === "1" ? "active" : ""}`}
          onClick={() => setSelectedLesson("1")}
        >
          Lektion 1 (ア – ソ)
        </button>
        <button
          className={`filter-pill ${selectedLesson === "2" ? "active" : ""}`}
          onClick={() => setSelectedLesson("2")}
        >
          Lektion 2 (タ – ン)
        </button>
        <button
          className={`filter-pill ${selectedLesson === "3" ? "active" : ""}`}
          onClick={() => setSelectedLesson("3")}
        >
          Lektion 3 (Dakuten / Handakuten)
        </button>
      </div>

      {filteredData.length === 0 ? (
        <div className="no-data-msg">
          Keine Zeichen für diese Auswahl gefunden.
        </div>
      ) : (
        orderedGroups.map((groupKey) => {
          const groupChars = filteredData.filter(
            (item) => item.group === groupKey,
          );
          return (
            <div key={groupKey} className="group-container">
              <div className="group-title">{GROUP_LABELS[groupKey]}</div>
              <div className="kana-grid">
                {groupChars.map((item) => (
                  <div key={item.char} className="kana-card">
                    <span className="kana-char">{item.char}</span>
                    <span className="kana-rom">{item.rom}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      <div className="info-sections">
        <div className="info-card">
          <h3>Langvokalstrich (ー)</h3>
          <p>
            Im Katakana wird der Langvokalstrich (ー) verwendet, um Vokale zu
            verlängern (z. B. コーヒー - koohii oder マイク・ミラー - maiku
            miraa). Er folgt immer direkt auf die Silbe, die verlängert werden
            soll.
          </p>
        </div>
        <div className="info-card">
          <h3>Katakana-Kontext</h3>
          <p>
            Katakana wird primär für Wörter ausländischen Ursprungs
            (Lehnwörter), Ländernamen, ausländische Personennamen und
            Firmennamen (z. B. IMC) verwendet. Daher ist Lektion 1 stark durch
            Eigennamen geprägt.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("overview");
  const [selectedLesson, setSelectedLesson] = useState("all");

  // Shared state: tracks how often a character or word was missed/answered incorrectly
  const [wrongCounts, setWrongCounts] = useState({});

  const registerMiss = (key) => {
    setWrongCounts((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const resetProgress = () => {
    if (
      window.confirm(
        "Möchtest du deinen Lernfortschritt (Fehlergewichtung) wirklich zurücksetzen?",
      )
    ) {
      setWrongCounts({});
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <div className="header">
          <div className="header-eyebrow">みんなの日本語 · VHS Düsseldorf</div>
          <h1 className="header-title">Katakana</h1>
          <p className="header-subtitle">
            Lernapp für den VHS-Kurs A1.1.1 (Lehrwerk: Minna no Nihongo)
          </p>
        </div>

        <nav className="nav-tabs">
          <button
            className={`tab-button ${tab === "overview" ? "active" : ""}`}
            onClick={() => setTab("overview")}
          >
            Übersicht
          </button>
          <button
            className={`tab-button ${tab === "char2rom" ? "active" : ""}`}
            onClick={() => setTab("char2rom")}
          >
            Zeichen → Romaji
          </button>
          <button
            className={`tab-button ${tab === "rom2char" ? "active" : ""}`}
            onClick={() => setTab("rom2char")}
          >
            Romaji → Zeichen
          </button>
          <button
            className={`tab-button ${tab === "word2rom" ? "active" : ""}`}
            onClick={() => setTab("word2rom")}
          >
            Wort → Romaji
          </button>
          <button
            className={`tab-button ${tab === "rom2word" ? "active" : ""}`}
            onClick={() => setTab("rom2word")}
          >
            Romaji → Wort
          </button>
        </nav>

        <main>
          {tab === "overview" && (
            <Overview
              selectedLesson={selectedLesson}
              setSelectedLesson={setSelectedLesson}
            />
          )}

          {tab === "char2rom" && (
            <Quiz
              mode="char2rom"
              wrongCounts={wrongCounts}
              onRegisterMiss={registerMiss}
            />
          )}

          {tab === "rom2char" && (
            <Quiz
              mode="rom2char"
              wrongCounts={wrongCounts}
              onRegisterMiss={registerMiss}
            />
          )}

          {tab === "word2rom" && (
            <WordQuiz
              mode="word2rom"
              wrongCounts={wrongCounts}
              onRegisterMiss={registerMiss}
            />
          )}

          {tab === "rom2word" && (
            <WordQuiz
              mode="rom2word"
              wrongCounts={wrongCounts}
              onRegisterMiss={registerMiss}
            />
          )}
        </main>

        <footer className="footer">
          {Object.keys(wrongCounts).length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <button className="reset-btn" onClick={resetProgress}>
                Lernfortschritt zurücksetzen ({Object.keys(wrongCounts).length}{" "}
                fokussierte Elemente)
              </button>
            </div>
          )}
          katakana-vhs · VHS Kurs A1.1.1 Düsseldorf · 2026
        </footer>
      </div>
    </>
  );
}
