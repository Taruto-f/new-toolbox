'use client';
// pages/weather-forecast.js
import { useState, useEffect } from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

export default function WeatherForecast() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentCities, setRecentCities] = useState<string[]>([]);

  // 最近検索した都市をローカルストレージから読み込む
  useEffect(() => {
    const savedCities = localStorage.getItem('recentCities');
    if (savedCities) {
      setRecentCities(JSON.parse(savedCities));
    }
  }, []);

  // 最近検索した都市を保存
  const saveRecentCity = (cityName: string): void => {
    const updatedCities = [cityName, ...recentCities.filter(c => c !== cityName)].slice(0, 5);
    setRecentCities(updatedCities);
    localStorage.setItem('recentCities', JSON.stringify(updatedCities));
  };

  // 天気データの取得
  const fetchWeather = async (cityName: string): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      // 現在の天気を取得
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&lang=ja`
      );
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(weatherData.message || '天気データの取得に失敗しました');
      }

      // 5日間の予報を取得
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&lang=ja`
      );
      const forecastData = await forecastResponse.json();

      if (!forecastResponse.ok) {
        throw new Error(forecastData.message || '予報データの取得に失敗しました');
      }

      setWeather(weatherData);
      setForecast(forecastData.list);
      saveRecentCity(cityName);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 天気アイコンの取得
  const getWeatherIcon = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // 日付のフォーマット
  const formatDate = (dt: number): string => {
    return new Date(dt * 1000).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      background: '#1e1e2f',
      borderRadius: '15px',
      padding: '20px',
      maxWidth: '800px',
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
        天気予報
      </h1>

      <div style={{
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="都市名を入力..."
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: '#3a3a67',
              color: '#eef1f7'
            }}
          />
          <button
            onClick={() => fetchWeather(city)}
            disabled={!city || loading}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: (!city || loading) ? 0.7 : 1
            }}
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </div>

        {recentCities.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px' }}>最近検索した都市:</div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {recentCities.map((recentCity) => (
                <button
                  key={recentCity}
                  onClick={() => {
                    setCity(recentCity);
                    fetchWeather(recentCity);
                  }}
                  style={{
                    background: '#3a3a67',
                    border: 'none',
                    color: '#eef1f7',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {recentCity}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: '#dc3545',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {weather && (
          <div style={{
            background: '#3a3a67',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              <img
                src={getWeatherIcon(weather.weather[0].icon)}
                alt={weather.weather[0].description}
                style={{ width: '100px', height: '100px' }}
              />
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  marginBottom: '8px'
                }}>
                  {weather.name}
                </h2>
                <div style={{ marginBottom: '4px' }}>
                  気温: {Math.round(weather.main.temp)}°C
                </div>
                <div style={{ marginBottom: '4px' }}>
                  体感温度: {Math.round(weather.main.feels_like)}°C
                </div>
                <div style={{ marginBottom: '4px' }}>
                  湿度: {weather.main.humidity}%
                </div>
                <div>
                  天気: {weather.weather[0].description}
                </div>
              </div>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '16px'
            }}>
              5日間の予報
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px'
            }}>
              {forecast.filter((item, index) => index % 8 === 0).map((item) => (
                <div
                  key={item.dt}
                  style={{
                    background: '#3a3a67',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    {formatDate(item.dt)}
                  </div>
                  <img
                    src={getWeatherIcon(item.weather[0].icon)}
                    alt={item.weather[0].description}
                    style={{ width: '50px', height: '50px' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    {Math.round(item.main.temp)}°C
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#7d91f6'
                  }}>
                    {item.weather[0].description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}