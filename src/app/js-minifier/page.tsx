'use client';
import { useState } from 'react';

interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  savings: number;
  savingsPercent: string;
}

export default function JSCompressor() {
  const [inputCode, setInputCode] = useState('');
  const [compressedCode, setCompressedCode] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<CompressionStats | null>(null);

  // JavaScriptコードの圧縮
  const compressCode = () => {
    try {
      setError('');
      
      // 基本的な圧縮処理
      let compressed = inputCode
        // コメントを削除
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
        // 不要な空白を削除
        .replace(/\s+/g, ' ')
        // 行末の空白を削除
        .replace(/\s+$/gm, '')
        // 行頭の空白を削除
        .replace(/^\s+/gm, '')
        // セミコロンの前後の空白を削除
        .replace(/\s*;\s*/g, ';')
        // カンマの前後の空白を削除
        .replace(/\s*,\s*/g, ',')
        // 演算子の前後の空白を削除
        .replace(/\s*([+\-*/=<>!&|^%?:])\s*/g, '$1')
        // 括弧の前後の空白を削除
        .replace(/\s*([(){}[\]])\s*/g, '$1')
        // 連続する空白を1つに
        .replace(/\s+/g, ' ')
        // 最後の空白を削除
        .trim();

      // 圧縮後のコードを設定
      setCompressedCode(compressed);

      // 統計情報を計算
      const originalSize = inputCode.length;
      const compressedSize = compressed.length;
      const savings = originalSize - compressedSize;
      const savingsPercent = (savings / originalSize * 100).toFixed(2);

      setStats({
        originalSize,
        compressedSize,
        savings,
        savingsPercent
      });

    } catch (err) {
      setError('コードの圧縮中にエラーが発生しました。');
      console.error(err);
    }
  };

  // コードをクリップボードにコピー
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
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
        JavaScript圧縮ツール
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
            入力コード:
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="圧縮するJavaScriptコードを入力してください..."
              style={{
                width: '100%',
                height: '200px',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: '#3a3a67',
                color: '#eef1f7',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
          </label>
        </div>

        <button
          onClick={compressCode}
          disabled={!inputCode}
          style={{
            width: '100%',
            background: '#7d91f6',
            border: 'none',
            color: '#1e1e2f',
            fontWeight: '700',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: !inputCode ? 0.7 : 1,
            marginBottom: '20px'
          }}
        >
          圧縮
        </button>

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

        {compressedCode && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px'
            }}>
              圧縮後のコード:
              <div style={{ position: 'relative' }}>
                <textarea
                  value={compressedCode}
                  readOnly
                  style={{
                    width: '100%',
                    height: '200px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3a3a67',
                    color: '#eef1f7',
                    fontFamily: 'monospace',
                    resize: 'vertical'
                  }}
                />
                <button
                  onClick={() => copyToClipboard(compressedCode)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#7d91f6',
                    border: 'none',
                    color: '#1e1e2f',
                    fontWeight: '700',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  コピー
                </button>
              </div>
            </label>
          </div>
        )}

        {stats && (
          <div style={{
            background: '#3a3a67',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '8px' }}>
              元のサイズ: {stats.originalSize} バイト
            </div>
            <div style={{ marginBottom: '8px' }}>
              圧縮後のサイズ: {stats.compressedSize} バイト
            </div>
            <div style={{ marginBottom: '8px' }}>
              削減サイズ: {stats.savings} バイト
            </div>
            <div style={{
              color: '#7d91f6',
              fontWeight: '700'
            }}>
              削減率: {stats.savingsPercent}%
            </div>
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
          圧縮の特徴
        </h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          <li style={{ marginBottom: '8px' }}>• コメントの削除</li>
          <li style={{ marginBottom: '8px' }}>• 不要な空白の削除</li>
          <li style={{ marginBottom: '8px' }}>• 行末の空白の削除</li>
          <li style={{ marginBottom: '8px' }}>• 演算子周りの空白の最適化</li>
          <li style={{ marginBottom: '8px' }}>• 括弧周りの空白の最適化</li>
        </ul>
      </div>
    </div>
  );
}
