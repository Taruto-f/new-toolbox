"use client";
import { SetStateAction, useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: SetStateAction<string>) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (operator: string) => {
    setEquation(display + ' ' + operator + ' ');
    setIsNewNumber(true);
  };

  const handleEqual = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
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
      background: '#1e1e2f',
      borderRadius: '15px',
      padding: '20px',
      maxWidth: '300px',
      width: '100%',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      margin: '20px auto',
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
  );
} 