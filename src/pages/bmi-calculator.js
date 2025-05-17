import { useState } from 'react';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBMI(bmiValue.toFixed(1));

    // BMIカテゴリーの判定
    if (bmiValue < 18.5) {
      setCategory('低体重');
    } else if (bmiValue < 25) {
      setCategory('普通体重');
    } else if (bmiValue < 30) {
      setCategory('肥満（1度）');
    } else if (bmiValue < 35) {
      setCategory('肥満（2度）');
    } else if (bmiValue < 40) {
      setCategory('肥満（3度）');
    } else {
      setCategory('肥満（4度）');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case '低体重':
        return '#f8d7da';
      case '普通体重':
        return '#d4edda';
      case '肥満（1度）':
        return '#fff3cd';
      case '肥満（2度）':
        return '#ffeeba';
      case '肥満（3度）':
        return '#ffd7ba';
      case '肥満（4度）':
        return '#ffc0cb';
      default:
        return '#eef1f7';
    }
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
      }}>
        BMI計算ツール
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px'
        }}>
          身長 (cm):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value) || '')}
            placeholder="例: 170"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              background: '#3a3a67',
              color: '#eef1f7',
              marginTop: '4px'
            }}
          />
        </label>

        <label style={{
          display: 'block',
          marginBottom: '8px'
        }}>
          体重 (kg):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || '')}
            placeholder="例: 60"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '10px',
              border: 'none',
              background: '#3a3a67',
              color: '#eef1f7',
              marginTop: '4px'
            }}
          />
        </label>

        <button
          onClick={calculateBMI}
          disabled={!height || !weight}
          style={{
            width: '100%',
            background: '#7d91f6',
            border: 'none',
            color: '#1e1e2f',
            fontWeight: '700',
            padding: '10px',
            borderRadius: '12px',
            cursor: 'pointer',
            opacity: (!height || !weight) ? 0.7 : 1
          }}
        >
          BMIを計算
        </button>
      </div>

      {bmi && (
        <div style={{
          background: '#2c2c48',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            BMI: {bmi}
          </div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            padding: '8px',
            borderRadius: '8px',
            background: getCategoryColor(category),
            color: '#1e1e2f'
          }}>
            {category}
          </div>
          <div style={{
            marginTop: '12px',
            fontSize: '0.9rem',
            color: '#a1a6c9'
          }}>
            <p>BMIの基準値:</p>
            <p>18.5未満: 低体重</p>
            <p>18.5以上25未満: 普通体重</p>
            <p>25以上30未満: 肥満（1度）</p>
            <p>30以上35未満: 肥満（2度）</p>
            <p>35以上40未満: 肥満（3度）</p>
            <p>40以上: 肥満（4度）</p>
          </div>
        </div>
      )}
    </div>
  );
} 