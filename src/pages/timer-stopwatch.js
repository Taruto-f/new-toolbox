import { useState, useEffect, useRef } from 'react';

export default function TimerStopwatch() {
  // タイマー用の状態
  const [timerMinutes, setTimerMinutes] = useState('');
  const [timerSeconds, setTimerSeconds] = useState('');
  const [timerTime, setTimerTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // ストップウォッチ用の状態
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const stopwatchIntervalRef = useRef(null);

  // タイマーの処理
  useEffect(() => {
    if (isTimerRunning && timerTime > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, timerTime]);

  // ストップウォッチの処理
  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(stopwatchIntervalRef.current);
  }, [isStopwatchRunning]);

  const startTimer = () => {
    const totalSeconds = (parseInt(timerMinutes) || 0) * 60 + (parseInt(timerSeconds) || 0);
    if (totalSeconds > 0 && totalSeconds <= 3600) {
      setTimerTime(totalSeconds);
      setIsTimerRunning(true);
    }
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    clearInterval(timerIntervalRef.current);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    clearInterval(timerIntervalRef.current);
    setTimerTime(0);
    setTimerMinutes('');
    setTimerSeconds('');
  };

  const startStopwatch = () => {
    setIsStopwatchRunning(true);
  };

  const stopStopwatch = () => {
    setIsStopwatchRunning(false);
    clearInterval(stopwatchIntervalRef.current);
  };

  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    clearInterval(stopwatchIntervalRef.current);
    setStopwatchTime(0);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: '#1e1e2f',
      borderRadius: '15px',
      padding: '20px',
      maxWidth: '600px',
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
      }}>
        タイマーとストップウォッチ
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        {/* タイマー */}
        <div style={{
          background: '#2c2c48',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            タイマー
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px'
              }}>
                分:
                <input
                  type="number"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(e.target.value)}
                  min="0"
                  max="60"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3a3a67',
                    color: '#eef1f7'
                  }}
                />
              </label>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px'
              }}>
                秒:
                <input
                  type="number"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(e.target.value)}
                  min="0"
                  max="59"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3a3a67',
                    color: '#eef1f7'
                  }}
                />
              </label>
            </div>
          </div>

          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {formatTime(timerTime)}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px'
          }}>
            <button
              onClick={startTimer}
              disabled={isTimerRunning}
              style={{
                background: '#7d91f6',
                border: 'none',
                color: '#1e1e2f',
                fontWeight: '700',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: isTimerRunning ? 0.7 : 1
              }}
            >
              開始
            </button>
            <button
              onClick={stopTimer}
              disabled={!isTimerRunning}
              style={{
                background: '#7d91f6',
                border: 'none',
                color: '#1e1e2f',
                fontWeight: '700',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: !isTimerRunning ? 0.7 : 1
              }}
            >
              停止
            </button>
            <button
              onClick={resetTimer}
              style={{
                background: '#dc3545',
                border: 'none',
                color: '#ffffff',
                fontWeight: '700',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              リセット
            </button>
          </div>
        </div>

        {/* ストップウォッチ */}
        <div style={{
          background: '#2c2c48',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            ストップウォッチ
          </h2>

          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {formatTime(stopwatchTime)}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px'
          }}>
            <button
              onClick={startStopwatch}
              disabled={isStopwatchRunning}
              style={{
                background: '#7d91f6',
                border: 'none',
                color: '#1e1e2f',
                fontWeight: '700',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: isStopwatchRunning ? 0.7 : 1
              }}
            >
              開始
            </button>
            <button
              onClick={stopStopwatch}
              disabled={!isStopwatchRunning}
              style={{
                background: '#7d91f6',
                border: 'none',
                color: '#1e1e2f',
                fontWeight: '700',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: !isStopwatchRunning ? 0.7 : 1
              }}
            >
              停止
            </button>
            <button
              onClick={resetStopwatch}
              style={{
                background: '#dc3545',
                border: 'none',
                color: '#ffffff',
                fontWeight: '700',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 