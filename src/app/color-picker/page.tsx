import { useState, useEffect } from 'react';

export default function ColorPicker() {
  const [color, setColor] = useState('#7d91f6');
  const [rgb, setRgb] = useState({ r: 125, g: 145, b: 246 });
  const [hsl, setHsl] = useState({ h: 230, s: 89, l: 73 });
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('colorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    const newRgb = hexToRgb(newColor);
    if (newRgb) {
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }

    // 履歴に追加
    const newHistory = [newColor, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('colorHistory', JSON.stringify(newHistory));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
        カラーピッカー
      </h1>

      <div style={{
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              marginBottom: '8px'
            }}>
              カラー選択:
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              />
            </label>
          </div>

          <div style={{
            flex: 1,
            background: color,
            borderRadius: '8px',
            height: '40px'
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ marginBottom: '4px' }}>HEX</div>
            <div
              onClick={() => copyToClipboard(color)}
              style={{
                background: '#3a3a67',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {color}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '4px' }}>RGB</div>
            <div
              onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
              style={{
                background: '#3a3a67',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '4px' }}>HSL</div>
            <div
              onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
              style={{
                background: '#3a3a67',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
            </div>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '8px' }}>最近使用した色:</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px'
          }}>
            {history.map((color, index) => (
              <div
                key={index}
                onClick={() => handleColorChange(color)}
                style={{
                  background: color,
                  height: '40px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '2px solid #3a3a67'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
