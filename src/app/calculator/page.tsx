"use client";
import { SetStateAction, useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [history, setHistory] = useState<Array<{ equation: string; result: string }>>([]);

  const handleNumber = (num: SetStateAction<string>) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      if (display.length < 10) {
        setDisplay(display + num);
      }
    }
  };

  const handleOperator = (operator: string) => {
    if (equation === '') {
      setEquation(display + ' ' + operator + ' ');
    } else {
      try {
        const currentResult = eval(equation + display);
        setEquation(equation + display + ' ' + operator + ' ');
        setDisplay(String(currentResult));
      } catch (error) {
        setDisplay('Error');
        setEquation('');
      }
    }
    setIsNewNumber(true);
  };

  const handleEqual = () => {
    try {
      const fullEquation = equation + display;
      const result = eval(fullEquation);
      const formattedResult = Number(result).toFixed(10).replace(/\.?0+$/, '');
      setHistory(prev => [...prev, { equation: fullEquation, result: formattedResult }]);
      setDisplay(formattedResult);
      setEquation('');
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDecimal = () => {
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handlePlusMinus = () => {
    setDisplay(String(-parseFloat(display)));
  };

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        background: '#1e1e2f',
        borderRadius: '15px',
        padding: '20px',
        width: '300px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        color: '#eef1f7',
        fontFamily: "'Roboto Slab', serif"
      }}>
        <div style={{
          background: '#2c2c48',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'right'
        }}>
          <div style={{
            fontSize: '1.2rem',
            color: '#a1a6c9',
            minHeight: '1.2em',
            marginBottom: '4px'
          }}>
            {equation}
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            wordBreak: 'break-all'
          }}>
            {display}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px'
        }}>
          <button
            onClick={handleClear}
            style={{
              background: '#dc3545',
              border: 'none',
              color: '#fff',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            C
          </button>
          <button
            onClick={handlePlusMinus}
            style={{
              background: '#3a3a67',
              border: 'none',
              color: '#eef1f7',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ±
          </button>
          <button
            onClick={handlePercent}
            style={{
              background: '#3a3a67',
              border: 'none',
              color: '#eef1f7',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            %
          </button>
          <button
            onClick={() => handleOperator('/')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ÷
          </button>

          {[7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(String(num))}
              style={{
                background: '#3a3a67',
                border: 'none',
                color: '#eef1f7',
                fontWeight: '700',
                padding: '15px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperator('*')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>

          {[4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(String(num))}
              style={{
                background: '#3a3a67',
                border: 'none',
                color: '#eef1f7',
                fontWeight: '700',
                padding: '15px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperator('-')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            -
          </button>

          {[1, 2, 3].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(String(num))}
              style={{
                background: '#3a3a67',
                border: 'none',
                color: '#eef1f7',
                fontWeight: '700',
                padding: '15px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperator('+')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            +
          </button>

          <button
            onClick={() => handleNumber('0')}
            style={{
              background: '#3a3a67',
              border: 'none',
              color: '#eef1f7',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              gridColumn: 'span 2'
            }}
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            style={{
              background: '#3a3a67',
              border: 'none',
              color: '#eef1f7',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            .
          </button>
          <button
            onClick={handleEqual}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            =
          </button>
        </div>
      </div>

      <div style={{
        background: '#1e1e2f',
        borderRadius: '15px',
        padding: '20px',
        width: '300px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        color: '#eef1f7',
        fontFamily: "'Roboto Slab', serif"
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>計算履歴</h2>
          <button
            onClick={handleClearHistory}
            style={{
              background: '#dc3545',
              border: 'none',
              color: '#fff',
              fontWeight: '700',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            履歴をクリア
          </button>
        </div>
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {history.map((item, index) => (
            <div
              key={index}
              style={{
                background: '#2c2c48',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px'
              }}
            >
              <div style={{ color: '#a1a6c9', fontSize: '0.9rem' }}>
                {item.equation}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                = {item.result}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 