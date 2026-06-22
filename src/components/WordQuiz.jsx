import React, { useState, useEffect } from "react";
import { WORD_DATA } from "../data.js";
import { shuffle, getWrongOptions, pickWeighted } from "../quizUtils.js";

export default function WordQuiz({ mode, wrongCounts, onRegisterMiss }) {
  const [selectedLesson, setSelectedLesson] = useState("1"); // Default to Lektion 1 for words
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3);

  // Session score
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Generate a question on component mount or lesson filter change or mode change
  useEffect(() => {
    generateQuestion(selectedLesson);
  }, [selectedLesson, mode]);

  const generateQuestion = (lessonFilter) => {
    const filteredPool = WORD_DATA.filter((item) => {
      if (lessonFilter === "all") return true;
      return item.lesson === Number(lessonFilter);
    });

    if (filteredPool.length === 0) {
      setCurrentQuestion(null);
      setOptions([]);
      return;
    }

    // Weighted random selection based on past word mistakes
    // Use the word itself as the unique key
    const nextWord = pickWeighted(
      filteredPool,
      wrongCounts,
      (item) => item.word,
    );
    setCurrentQuestion(nextWord);

    const correctVal = mode === "word2rom" ? nextWord.rom : nextWord.word;

    // Get unique list of all options in the filtered pool
    const allValsInPool = Array.from(
      new Set(
        filteredPool.map((item) =>
          mode === "word2rom" ? item.rom : item.word,
        ),
      ),
    );

    // Get 2 wrong options as distractors
    const wrongVals = getWrongOptions(correctVal, allValsInPool, 2);

    // Shuffle correct answer and wrong answers together
    const shuffled = shuffle([correctVal, ...wrongVals]);
    setOptions(shuffled);

    // Reset interaction states
    setAnswered(false);
    setSelectedOption(null);
    setTimeLeft(3); // Start 3-second countdown
  };

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft === 0 || answered) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, answered]);

  const handleOptionClick = (option) => {
    if (answered) return;

    setSelectedOption(option);
    setAnswered(true);

    const correctVal =
      mode === "word2rom" ? currentQuestion.rom : currentQuestion.word;
    const isCorrect = option === correctVal;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      // Register mistake for weight adjustment (using currentQuestion.word as key)
      onRegisterMiss(currentQuestion.word);
    }
    setTotalCount((prev) => prev + 1);
  };

  const handleNext = () => {
    generateQuestion(selectedLesson);
  };

  const handleLessonChange = (lesson) => {
    setSelectedLesson(lesson);
    // Reset session score on lesson change to make it fresh
    setCorrectCount(0);
    setTotalCount(0);
  };

  const resetSessionScore = () => {
    setCorrectCount(0);
    setTotalCount(0);
  };

  const percent =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const correctVal = currentQuestion
    ? mode === "word2rom"
      ? currentQuestion.rom
      : currentQuestion.word
    : "";

  return (
    <div className="quiz-container">
      <div className="filters-container" style={{ marginBottom: "20px" }}>
        <button
          className={`filter-pill ${selectedLesson === "all" ? "active" : ""}`}
          onClick={() => handleLessonChange("all")}
        >
          Alle
        </button>
        <button
          className={`filter-pill ${selectedLesson === "1" ? "active" : ""}`}
          onClick={() => handleLessonChange("1")}
        >
          Lektion 1 (ア – ソ)
        </button>
        <button
          className={`filter-pill ${selectedLesson === "2" ? "active" : ""}`}
          onClick={() => handleLessonChange("2")}
        >
          Lektion 2 (タ – ホ)
        </button>
        <button
          className={`filter-pill ${selectedLesson === "3" ? "active" : ""}`}
          onClick={() => handleLessonChange("3")}
        >
          Lektion 3 (マ – ン)
        </button>
        <button
          className={`filter-pill ${selectedLesson === "4" ? "active" : ""}`}
          onClick={() => handleLessonChange("4")}
        >
          Lektion 4 (Dakuten)
        </button>
      </div>

      <div className="quiz-header">
        <div>
          Modus:{" "}
          {mode === "word2rom" ? "Wort → Aussprache" : "Aussprache → Wort"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="score-badge">
            {correctCount} / {totalCount} ({percent}%)
          </span>
          {totalCount > 0 && (
            <button className="reset-btn" onClick={resetSessionScore}>
              Reset
            </button>
          )}
        </div>
      </div>

      {!currentQuestion ? (
        <div className="no-data-msg">
          Keine Wörter für diese Lektion verfügbar.
        </div>
      ) : (
        <>
          <div className="quiz-question-box">
            <div className="quiz-prompt">
              {mode === "word2rom"
                ? "Wie lautet die Aussprache für:"
                : "Finde das Katakana-Wort für:"}
            </div>
            <div className="quiz-char" style={{ fontSize: "3rem" }}>
              {mode === "word2rom" ? currentQuestion.word : currentQuestion.rom}
            </div>
            <div className="quiz-german-context">
              Bedeutung: {currentQuestion.german}
            </div>
          </div>

          {timeLeft > 0 && !answered ? (
            <div className="countdown-box">
              <span>Überlege kurz... ({timeLeft}s)</span>
              <button
                className="reset-btn"
                style={{ marginLeft: "12px", padding: "6px 12px" }}
                onClick={() => setTimeLeft(0)}
              >
                Sofort anzeigen
              </button>
            </div>
          ) : (
            <div className="options-grid">
              {options.map((option, idx) => {
                let btnClass = "option-btn";
                if (answered) {
                  if (option === correctVal) {
                    btnClass += " correct";
                  } else if (option === selectedOption) {
                    btnClass += " incorrect";
                  }
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    disabled={answered}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {answered && (
            <div className="feedback-box">
              <div
                className={`feedback-text ${
                  selectedOption === correctVal ? "correct" : "incorrect"
                }`}
              >
                {selectedOption === correctVal
                  ? "✓ Richtig!"
                  : `✗ Falsch. Richtig ist: ${correctVal}`}
              </div>
              <button className="next-btn" onClick={handleNext}>
                Nächstes Wort →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
