'use client';
import { useState, useEffect } from 'react';

interface Word {
  word: string;
  meaning: string;
}

interface QuizState {
  isQuizActive: boolean;
  currentQuestionIndex: number;
  quizOrder: number[];
  correctAnswers: number;
  totalAnswered: number;
  currentQuestion: string;
  options: string[];
  showNextButton: boolean;
  result: string;
}

export default function WordQuiz() {
  const [words, setWords] = useState<Word[]>([]);
  const [wordInput, setWordInput] = useState('');
  const [meaningInput, setMeaningInput] = useState('');
  const [quizState, setQuizState] = useState<QuizState>({
    isQuizActive: false,
    currentQuestionIndex: -1,
    quizOrder: [],
    correctAnswers: 0,
    totalAnswered: 0,
    currentQuestion: '',
    options: [],
    showNextButton: false,
    result: ''
  });

  useEffect(() => {
    const savedWords = localStorage.getItem('words');
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    }
  }, []);

  const saveWords = (newWords: Word[]): void => {
    localStorage.setItem('words', JSON.stringify(newWords));
    setWords(newWords);
  };

  const addWord = (): void => {
    const w = wordInput.trim();
    const m = meaningInput.trim();
    
    if (!w || !m) {
      alert('単語と意味の両方を入力してください。');
      return;
    }
    
    if (words.some(item => item.word.toLowerCase() === w.toLowerCase())) {
      alert('この単語はすでに追加されています。');
      return;
    }

    const newWords = [...words, { word: w, meaning: m }];
    saveWords(newWords);
    setWordInput('');
    setMeaningInput('');
    alert('単語を追加しました。');
  };

  const removeWord = (index: number): void => {
    if (confirm(`「${words[index].word}」を削除しますか？`)) {
      const newWords = words.filter((_, i) => i !== index);
      saveWords(newWords);
      if (newWords.length < 4) {
        setQuizState(prev => ({ ...prev, isQuizActive: false }));
      }
    }
  };

  const startQuiz = (): void => {
    const quizOrder = shuffleArray([...words.keys()]);
    setQuizState({
      isQuizActive: true,
      currentQuestionIndex: -1,
      quizOrder,
      correctAnswers: 0,
      totalAnswered: 0,
      currentQuestion: '',
      options: [],
      showNextButton: false,
      result: ''
    });
    nextQuestion(quizOrder, -1, 0, 0);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const nextQuestion = (
    order: number[] = quizState.quizOrder,
    index: number = quizState.currentQuestionIndex,
    correct: number = quizState.correctAnswers,
    total: number = quizState.totalAnswered
  ): void => {
    const nextIndex = index + 1;
    
    if (nextIndex >= order.length) {
      const percentage = Math.round((correct / total) * 100);
      setQuizState(prev => ({
        ...prev,
        currentQuestion: 'クイズ終了！',
        options: [],
        showNextButton: false,
        result: `正答率: ${percentage}% (${correct}/${total})`
      }));
      return;
    }

    const currentWord = words[order[nextIndex]];
    const options = [currentWord.meaning];
    
    while (options.length < 4) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      if (!options.includes(randomWord.meaning)) {
        options.push(randomWord.meaning);
      }
    }

    setQuizState({
      isQuizActive: true,
      currentQuestionIndex: nextIndex,
      quizOrder: order,
      correctAnswers: correct,
      totalAnswered: total,
      currentQuestion: `「${currentWord.word}」の意味は？`,
      options: shuffleArray(options),
      showNextButton: false,
      result: ''
    });
  };

  const handleAnswer = (option: string): void => {
    const currentWord = words[quizState.quizOrder[quizState.currentQuestionIndex]];
    const isCorrect = option === currentWord.meaning;
    
    setQuizState(prev => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      totalAnswered: prev.totalAnswered + 1,
      showNextButton: true,
      result: isCorrect ? '正解！' : '不正解...'
    }));
  };

  return (
    <div style={{
      background: '#1e1e2f',
      borderRadius: '15px',
      padding: '20px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      margin: '20px auto',
      color: '#eef1f7',
      fontFamily: "'Roboto Slab', serif"
    }}>
      <h1 style={{
        fontWeight: '700',
        fontSize: '1.5rem',
        marginBottom: '16px',
        textAlign: 'center'
      }}>単語学習ツール</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontWeight: '700',
          marginBottom: '6px'
        }} htmlFor="wordInput">単語を入力</label>
        <input
          type="text"
          id="wordInput"
          value={wordInput}
          onChange={(e) => setWordInput(e.target.value)}
          placeholder="例: apple"
          maxLength={50}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            background: '#3a3a67',
            color: '#eef1f7',
            marginBottom: '12px',
            boxSizing: 'border-box'
          }}
        />

        <label style={{
          display: 'block',
          fontWeight: '700',
          marginBottom: '6px'
        }} htmlFor="meaningInput">意味を入力</label>
        <input
          type="text"
          id="meaningInput"
          value={meaningInput}
          onChange={(e) => setMeaningInput(e.target.value)}
          placeholder="例: りんご"
          maxLength={100}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            background: '#3a3a67',
            color: '#eef1f7',
            marginBottom: '12px',
            boxSizing: 'border-box'
          }}
        />

        <button
          onClick={addWord}
          style={{
            width: '100%',
            background: '#7d91f6',
            border: 'none',
            color: '#1e1e2f',
            fontWeight: '700',
            padding: '10px',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 3px 6px rgba(125,145,246,0.7)'
          }}
        >
          単語を追加
        </button>
      </div>

      <div style={{
        marginTop: '12px',
        maxHeight: '150px',
        overflowY: 'auto',
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '8px'
      }}>
        {words.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#a1a6c9'
          }}>単語が登録されていません</div>
        ) : (
          words.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '6px',
                background: index % 2 === 0 ? '#3a3a67' : 'transparent'
              }}
            >
              <span style={{
                flex: 1,
                marginRight: '8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {item.word} : {item.meaning}
              </span>
              <button
                onClick={() => removeWord(index)}
                style={{
                  background: '#dc3545',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>

      {words.length >= 4 && !quizState.isQuizActive && (
        <button
          onClick={startQuiz}
          style={{
            width: '100%',
            background: '#7d91f6',
            border: 'none',
            color: '#1e1e2f',
            fontWeight: '700',
            padding: '10px',
            borderRadius: '12px',
            cursor: 'pointer',
            marginTop: '20px',
            boxShadow: '0 3px 6px rgba(125,145,246,0.7)'
          }}
        >
          クイズを始める
        </button>
      )}

      {quizState.isQuizActive && (
        <div style={{ marginTop: '20px' }}>
          <h1 style={{
            fontWeight: '700',
            fontSize: '1.5rem',
            marginBottom: '16px',
            textAlign: 'center'
          }}>クイズ</h1>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '12px'
          }}>{quizState.currentQuestion}</div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {quizState.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={quizState.showNextButton}
                style={{
                  width: '100%',
                  background: '#7d91f6',
                  border: 'none',
                  color: '#1e1e2f',
                  fontWeight: '700',
                  padding: '10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  opacity: quizState.showNextButton ? 0.7 : 1
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {quizState.showNextButton && (
            <button
              onClick={() => nextQuestion()}
              style={{
                width: '100%',
                background: '#7d91f6',
                border: 'none',
                color: '#1e1e2f',
                fontWeight: '700',
                padding: '10px',
                borderRadius: '12px',
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              次の問題
            </button>
          )}
          <div style={{
            marginTop: '12px',
            fontWeight: '700',
            minHeight: '1.5em',
            textAlign: 'center'
          }}>{quizState.result}</div>
        </div>
      )}
    </div>
  );
} 