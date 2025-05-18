import { useState } from 'react';

type ConversionCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume';

interface ConversionType {
  units: string[];
  conversions: Record<string, number>;
}

interface ConversionTypes {
  [key: string]: ConversionType;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');

  const conversionTypes: ConversionTypes = {
    length: {
      units: ['mm', 'cm', 'm', 'km', 'inch', 'ft', 'yd', 'mile'],
      conversions: {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        inch: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mile: 1609.344
      }
    },
    weight: {
      units: ['mg', 'g', 'kg', 't', 'oz', 'lb', 'st'],
      conversions: {
        mg: 0.001,
        g: 1,
        kg: 1000,
        t: 1000000,
        oz: 28.3495,
        lb: 453.592,
        st: 6350.29
      }
    },
    temperature: {
      units: ['C', 'F', 'K'],
      conversions: {
        C: 1,
        F: 1,
        K: 1
      }
    },
    area: {
      units: ['mm²', 'cm²', 'm²', 'ha', 'km²', 'in²', 'ft²', 'ac'],
      conversions: {
        'mm²': 0.000001,
        'cm²': 0.0001,
        'm²': 1,
        'ha': 10000,
        'km²': 1000000,
        'in²': 0.00064516,
        'ft²': 0.092903,
        'ac': 4046.86
      }
    },
    volume: {
      units: ['ml', 'l', 'm³', 'gal', 'qt', 'pt', 'fl oz'],
      conversions: {
        ml: 0.001,
        l: 1,
        'm³': 1000,
        gal: 3.78541,
        qt: 0.946353,
        pt: 0.473176,
        'fl oz': 0.0295735
      }
    }
  };

  const convertValue = () => {
    if (!fromValue || !fromUnit || !toUnit) return;

    let convertedValue: number;
    if (category === 'temperature') {
      // 温度の特殊な変換
      const value = parseFloat(fromValue);
      if (fromUnit === 'C' && toUnit === 'F') {
        convertedValue = (value * 9/5) + 32;
      } else if (fromUnit === 'F' && toUnit === 'C') {
        convertedValue = (value - 32) * 5/9;
      } else if (fromUnit === 'C' && toUnit === 'K') {
        convertedValue = value + 273.15;
      } else if (fromUnit === 'K' && toUnit === 'C') {
        convertedValue = value - 273.15;
      } else if (fromUnit === 'F' && toUnit === 'K') {
        convertedValue = ((value - 32) * 5/9) + 273.15;
      } else if (fromUnit === 'K' && toUnit === 'F') {
        convertedValue = ((value - 273.15) * 9/5) + 32;
      } else {
        convertedValue = value;
      }
    } else {
      // その他の単位の変換
      const baseValue = parseFloat(fromValue) * conversionTypes[category].conversions[fromUnit];
      convertedValue = baseValue / conversionTypes[category].conversions[toUnit];
    }

    setResult(convertedValue.toFixed(6));
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
        単位変換ツール
      </h1>

      <div style={{
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px'
          }}>
            変換タイプ:
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as ConversionCategory);
                setFromUnit('');
                setToUnit('');
                setResult('');
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: '#3a3a67',
                color: '#eef1f7'
              }}
            >
              <option value="length">長さ</option>
              <option value="weight">重さ</option>
              <option value="temperature">温度</option>
              <option value="area">面積</option>
              <option value="volume">体積</option>
            </select>
          </label>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px'
            }}>
              変換元:
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  placeholder="数値を入力"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3a3a67',
                    color: '#eef1f7'
                  }}
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3a3a67',
                    color: '#eef1f7'
                  }}
                >
                  <option value="">単位を選択</option>
                  {conversionTypes[category].units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px'
            }}>
              変換先:
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#3a3a67',
                  color: '#eef1f7'
                }}
              >
                <option value="">単位を選択</option>
                {conversionTypes[category].units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <button
          onClick={convertValue}
          disabled={!fromValue || !fromUnit || !toUnit}
          style={{
            width: '100%',
            background: '#7d91f6',
            border: 'none',
            color: '#1e1e2f',
            fontWeight: '700',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: (!fromValue || !fromUnit || !toUnit) ? 0.7 : 1
          }}
        >
          変換
        </button>

        {result && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: '#3a3a67',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            {fromValue} {fromUnit} = {result} {toUnit}
          </div>
        )}
      </div>
    </div>
  );
} 