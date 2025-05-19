"use client";
import { SetStateAction, useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [history, setHistory] = useState<Array<{ equation: string; result: string }>>([]);
  const MAX_HISTORY = 50;
  const MAX_DISPLAY_LENGTH = 10;

  // 数式のバリデーション
  const isValidNumber = (value: string): boolean => {
    return !isNaN(Number(value)) && value !== 'Error';
  };

  // 0除算チェック
  const hasDivisionByZero = (expr: string): boolean => {
    const parts = expr.split(' ');
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === '/' && Number(parts[i + 1]) === 0) {
        return true;
      }
    }
    return false;
  };

  // 安全な数式評価
  const safeEvaluate = (expr: string): number => {
    const parts = expr.split(' ');
    let result = Number(parts[0]);
    
    for (let i = 1; i < parts.length; i += 2) {
      const operator = parts[i];
      const operand = Number(parts[i + 1]);
      
      if (isNaN(operand)) {
        throw new Error('無効な数値です');
      }

      switch (operator) {
        case '+':
          result += operand;
          break;
        case '-':
          result -= operand;
          break;
        case '*':
          result *= operand;
          break;
        case '/':
          if (operand === 0) {
            throw new Error('0での除算はできません');
          }
          result /= operand;
          break;
        default:
          throw new Error('無効な演算子です');
      }
    }
    
    return result;
  };

  const handleNumber = (num: SetStateAction<string>) => {
    if (!isValidNumber(display)) return;

    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      if (display.length < MAX_DISPLAY_LENGTH) {
        if (display === '0' && num !== '0') {
          setDisplay(num);
        } else if (display === '0' && num === '0') {
          setDisplay('0');
        } else {
          setDisplay(display + num);
        }
      }
    }
  };

  const handleOperator = (operator: string) => {
    if (!isValidNumber(display)) return;

    if (equation === '') {
      setEquation(display + ' ' + operator + ' ');
    } else {
      try {
        const currentResult = safeEvaluate(equation + display);
        if (isNaN(currentResult)) {
          throw new Error('無効な計算です');
        }
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
      if (hasDivisionByZero(fullEquation)) {
        throw new Error('0での除算はできません');
      }
      const result = safeEvaluate(fullEquation);
      if (isNaN(result)) {
        throw new Error('無効な計算です');
      }
      const formattedResult = Number(result).toFixed(10).replace(/\.?0+$/, '');
      
      // 履歴の上限チェック
      setHistory(prev => {
        const newHistory = [...prev, { equation: fullEquation, result: formattedResult }];
        return newHistory.slice(-MAX_HISTORY);
      });
      
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
    if (!isValidNumber(display)) return;

    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      if (display.length < MAX_DISPLAY_LENGTH) {
        setDisplay(display + '.');
      }
    }
  };

  const handlePercent = () => {
    if (!isValidNumber(display)) return;
    
    try {
      const value = Number(display) / 100;
      const formattedValue = value.toFixed(10).replace(/\.?0+$/, '');
      setDisplay(formattedValue);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handlePlusMinus = () => {
    if (!isValidNumber(display)) return;
    
    try {
      const value = -Number(display);
      // -0の場合は0を表示
      setDisplay(value === 0 ? '0' : String(value));
    } catch (error) {
      setDisplay('Error');
    }
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