import { useState, useEffect } from 'react';
import Script from 'next/script';

// QRCodeの型定義
declare global {
  interface Window {
    QRCode: {
      new (element: HTMLElement, options: QRCodeOptions): QRCodeInstance;
      CorrectLevel: {
        L: number;
        M: number;
        Q: number;
        H: number;
      };
    };
  }
}

interface QRCodeOptions {
  text: string;
  width: number;
  height: number;
  colorDark: string;
  colorLight: string;
  correctLevel: number;
}

interface QRCodeInstance {
  clear: () => void;
}

export default function QRCode() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [qrCode, setQrCode] = useState<QRCodeInstance | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (text && window.QRCode) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // 既存のQRコードをクリア
      if (qrCode) {
        qrCode.clear();
      }

      // 新しいQRコードを生成
      const newQrCode = new window.QRCode(canvas, {
        text: text,
        width: size,
        height: size,
        colorDark: '#1e1e2f',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });

      setQrCode(newQrCode);
      setDownloadUrl(canvas.toDataURL('image/png'));
    }
  }, [text, size]);

  const handleDownload = () => {
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Script
        src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"
        strategy="afterInteractive"
      />

      <h1 style={{
        fontWeight: '700',
        fontSize: '1.5rem',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        QRコード生成ツール
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
            QRコードの内容:
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="URLやテキストを入力"
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
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px'
          }}>
            サイズ (px):
            <input
              type="range"
              min="100"
              max="500"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              style={{
                width: '100%',
                marginTop: '4px'
              }}
            />
            <div style={{ textAlign: 'center' }}>{size}px</div>
          </label>
        </div>

        {qrCode && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div
              style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                display: 'inline-block'
              }}
            >
              <canvas
                width={size}
                height={size}
                style={{
                  display: 'block'
                }}
              />
            </div>

            <button
              onClick={handleDownload}
              style={{
                background: '#7d91f6',
                border: 'none',
                color: '#1e1e2f',
                fontWeight: '700',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              QRコードをダウンロード
            </button>
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
          QRコードの使い方
        </h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          <li style={{ marginBottom: '8px' }}>• URLを入力してウェブサイトへのリンクを作成</li>
          <li style={{ marginBottom: '8px' }}>• テキストを入力して情報を共有</li>
          <li style={{ marginBottom: '8px' }}>• サイズを調整して用途に合わせる</li>
          <li>• 生成したQRコードをダウンロードして使用</li>
        </ul>
      </div>
    </div>
  );
} 