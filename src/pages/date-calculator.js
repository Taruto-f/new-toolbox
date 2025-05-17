import { useState } from 'react';

export default function DateCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysToAdd, setDaysToAdd] = useState('');
  const [result, setResult] = useState(null);

  const calculateDateDifference = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setResult({
      days: diffDays,
      weeks: Math.floor(diffDays / 7),
      months: Math.floor(diffDays / 30.44),
      years: Math.floor(diffDays / 365.25)
    });
  };

  const calculateFutureDate = () => {
    if (!startDate || !daysToAdd) return;

    const start = new Date(startDate);
    const futureDate = new Date(start);
    futureDate.setDate(start.getDate() + parseInt(daysToAdd));

    setResult({
      futureDate: futureDate.toISOString().split('T')[0]
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
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
        日付計算ツール
      </h1>

      <div style={{
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '1.2rem',
          marginBottom: '16px'
        }}>
          日付の差分を計算
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px'
          }}>
            開始日:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
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
            終了日:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: '#3a3a67',
                color: '#eef1f7',
                marginTop: '4px'
              }}
            />
          </label>

          <button
            onClick={calculateDateDifference}
            disabled={!startDate || !endDate}
            style={{
              width: '100%',
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: (!startDate || !endDate) ? 0.7 : 1
            }}
          >
            差分を計算
          </button>
        </div>

        {result && result.days !== undefined && (
          <div style={{
            background: '#3a3a67',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '8px' }}>計算結果:</div>
            <div>日数: {result.days}日</div>
            <div>週数: {result.weeks}週間</div>
            <div>月数: {result.months}ヶ月</div>
            <div>年数: {result.years}年</div>
          </div>
        )}
      </div>

      <div style={{
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <h2 style={{
          fontSize: '1.2rem',
          marginBottom: '16px'
        }}>
          未来の日付を計算
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px'
          }}>
            基準日:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
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
            加算する日数:
            <input
              type="number"
              value={daysToAdd}
              onChange={(e) => setDaysToAdd(e.target.value)}
              placeholder="例: 30"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: '#3a3a67',
                color: '#eef1f7',
                marginTop: '4px'
              }}
            />
          </label>

          <button
            onClick={calculateFutureDate}
            disabled={!startDate || !daysToAdd}
            style={{
              width: '100%',
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: (!startDate || !daysToAdd) ? 0.7 : 1
            }}
          >
            未来の日付を計算
          </button>
        </div>

        {result && result.futureDate && (
          <div style={{
            background: '#3a3a67',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ marginBottom: '8px' }}>計算結果:</div>
            <div>{formatDate(new Date(result.futureDate))}</div>
          </div>
        )}
      </div>
    </div>
  );
} 