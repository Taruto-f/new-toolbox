'use client';
import { useState, useEffect } from 'react';

interface City {
  name: string;
  timeZone: string;
}

interface CityOption {
  value: string;
  label: string;
}

export default function WorldClock() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('Asia/Tokyo');

  const cityOptions: CityOption[] = [
    { value: 'Asia/Tokyo', label: '東京 (Japan)' },
    { value: 'Asia/Seoul', label: 'ソウル (Korea)' },
    { value: 'Asia/Shanghai', label: '上海 (China)' },
    { value: 'Europe/London', label: 'ロンドン (UK)' },
    { value: 'Europe/Paris', label: 'パリ (France)' },
    { value: 'Europe/Berlin', label: 'ベルリン (Germany)' },
    { value: 'America/New_York', label: 'ニューヨーク (USA)' },
    { value: 'America/Chicago', label: 'シカゴ (USA)' },
    { value: 'America/Los_Angeles', label: 'ロサンゼルス (USA)' },
    { value: 'Australia/Sydney', label: 'シドニー (Australia)' },
    { value: 'Pacific/Honolulu', label: 'ホノルル (Hawaii)' },
    { value: 'Asia/Kolkata', label: 'コルカタ (India)' },
    { value: 'Asia/Dubai', label: 'ドバイ (UAE)' },
    { value: 'Africa/Johannesburg', label: 'ヨハネスブルグ (South Africa)' }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('worldClockCities');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCities(parsed as City[]);
        }
      } catch {
        setCities([]);
      }
    }
  }, []);

  const saveCities = (newCities: City[]): void => {
    localStorage.setItem('worldClockCities', JSON.stringify(newCities));
    setCities(newCities);
  };

  const formatTime = (date: Date, timeZone: string): string => {
    return date.toLocaleTimeString('ja-JP', {
      timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date, timeZone: string): string => {
    return date.toLocaleDateString('ja-JP', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const addCity = (): void => {
    const selectedOption = cityOptions.find(option => option.value === selectedCity);
    if (!selectedOption) return;

    if (cities.some(city => city.timeZone === selectedCity)) {
      alert('すでに追加されています');
      return;
    }
    const newCities = [...cities, { name: selectedOption.label, timeZone: selectedCity }];
    saveCities(newCities);
  };

  const removeCity = (index: number): void => {
    const newCities = cities.filter((_, i) => i !== index);
    saveCities(newCities);
  };

  return (
    <div style={{
      background: '#1e1e2f',
      borderRadius: '15px',
      width: '340px',
      maxWidth: '95vw',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      padding: '20px',
      color: '#eef1f7',
      fontFamily: "'Roboto Slab', serif"
    }}>
      <header style={{
        textAlign: 'center',
        fontSize: '1.6rem',
        fontWeight: '700',
        marginBottom: '16px',
        userSelect: 'none'
      }}>
        世界時計ツール
      </header>

      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        style={{
          width: '100%',
          fontSize: '1rem',
          padding: '8px 10px',
          borderRadius: '10px',
          border: 'none',
          marginBottom: '20px',
          background: '#3a3a67',
          color: '#eef1f7',
          outline: 'none',
          boxShadow: 'inset 2px 2px 5px #273065, inset -2px -2px 5px #4555a4'
        }}
      >
        {cityOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={addCity}
        style={{
          width: '100%',
          background: '#7d91f6',
          border: 'none',
          color: '#1e1e2f',
          fontWeight: '700',
          padding: '12px 0',
          fontSize: '1.2rem',
          borderRadius: '12px',
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: '0 3px 6px rgba(125,145,246,0.7)',
          transition: 'background 0.3s ease',
          marginBottom: '20px'
        }}
      >
        都市を追加
      </button>

      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto'
        }}
      >
        {cities.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#a1a6c9'
          }}>
            都市を追加してください
          </div>
        ) : (
          cities.map((city, index) => {
            const now = new Date();
            const localTime = formatTime(now, city.timeZone);
            const localDate = formatDate(now, city.timeZone);

            return (
              <div
                key={city.timeZone}
                style={{
                  background: '#2c2c48',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '10px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ flex: '1 1 auto' }}>{city.name}</span>
                <span style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  flex: '0 0 auto'
                }}>
                  {localDate} {localTime}
                </span>
                <button
                  onClick={() => removeCity(index)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f86868',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    marginLeft: '10px',
                    transition: 'color 0.3s ease'
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 