// pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [theme, setTheme] = useState('light');

  // ローカルストレージからテーマを読み込み、初期設定
  useEffect(() => {
    const storedTheme = localStorage.getItem('tb_theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  // テーマ切り替え
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('tb_theme', newTheme);
  };

  // ツールリスト
  const tools = [
    { name: 'カレンダー＆メモ帳', href: '/calendar-memo' },
    { name: '電卓', href: '/calculator' },
    { name: '日付計算ツール', href: '/date-calculator' },
    { name: 'BMI計算ツール', href: '/bmi-calculator' },
    { name: '世界時計ツール', href: '/world-clock' },
    { name: '単位変換ツール', href: '/unit-converter' },
    { name: 'カラーピッカー＆コード変換ツール', href: '/color-picker' },
    { name: 'タイマー＆ストップウォッチ', href: '/timer-stopwatch' },
    { name: 'テキストフォーマッター＆カウンター', href: '/text-formatter' },
    { name: '画像リサイズ＆圧縮ツール', href: '/image-resize-compress' },
    { name: 'QRコードジェネレーター＆スキャナー', href: '/qr-code' },
    { name: '単語学習＆クイズツール', href: '/word-quiz' },
    { name: 'リアルタイム天気ツール', href: '/weather' },
    { name: 'JavaScript圧縮ツール', href: '/js-minifier' },
    { name: 'ブックマークレット生成ツール', href: '/bookmarklet-generator' },
  ];

  return (
    <>
      <style jsx>{`
        :root {
          --bg-gradient-light: linear-gradient(135deg, #667eea, #764ba2);
          --bg-gradient-dark: linear-gradient(135deg, #222436, #2e2f4d);
          --color-light: #eef1f7;
          --color-dark: #cfd1e6;
          --btn-bg-light: #4762c4;
          --btn-bg-dark: #5969ab;
          --btn-border-light: #5f74d9;
          --btn-border-dark: #707fb2;
        }
        [data-theme='light'] {
          --bg-gradient: var(--bg-gradient-light);
          --text-color: var(--color-light);
          --btn-bg: var(--btn-bg-light);
          --btn-border: var(--btn-border-light);
        }
        [data-theme='dark'] {
          --bg-gradient: var(--bg-gradient-dark);
          --text-color: var(--color-dark);
          --btn-bg: var(--btn-bg-dark);
          --btn-border: var(--btn-border-dark);
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: 'Roboto Slab', serif;
          background: var(--bg-gradient);
          color: var(--text-color);
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        header {
          font-size: 3rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 24px;
          user-select: none;
        }
        .theme-toggle {
          position: fixed;
          top: 15px;
          right: 15px;
          background: var(--btn-bg);
          border: none;
          border-radius: 12px;
          color: var(--text-color);
          font-weight: 700;
          padding: 10px 16px;
          font-size: 1.5rem;
          cursor: pointer;
          user-select: none;
          box-shadow: 0 3px 6px rgba(125,145,246,0.7);
          z-index: 1000;
          transition: background 0.3s ease;
        }
        .theme-toggle:hover {
          background: var(--btn-border);
        }
        main {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--btn-bg);
          border-radius: 20px;
          padding: 20px 0;
        }
        .tool-btn {
          background: transparent;
          border: none;
          border-top: 1px solid var(--btn-border);
          color: var(--text-color);
          font-weight: 700;
          font-size: 1.2rem;
          padding: 15px 24px;
          cursor: pointer;
          user-select: none;
          width: 100%;
          text-align: center;
          transition: background-color 0.3s ease;
          border-radius: 0;
        }
        .tool-btn:first-child {
          border-top: none;
          border-radius: 12px 12px 0 0;
        }
        .tool-btn:last-child {
          border-radius: 0 0 12px 12px;
        }
        .tool-btn:hover {
          background: var(--btn-border);
        }
        .tool-btn:active {
          background: var(--btn-bg);
        }
        @media (max-width: 400px) {
          .container {
            padding: 0 12px;
          }
          header {
            font-size: 2.4rem;
          }
          .tool-btn {
            font-size: 1rem;
            padding: 12px 20px;
          }
          .theme-toggle {
            padding: 8px 12px;
            font-size: 1.3rem;
          }
        }
      `}</style>

      <button
        className="theme-toggle"
        aria-label="テーマ切り替え"
        title="テーマ切り替え"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="container" role="main">
        <header>ツールボックス</header>
        <main>
          {tools.map(({ name, href }) => (
            <button
              key={href}
              className="tool-btn"
              onClick={() => window.open(href, '_blank')}
              aria-label={`${name}を開く`}
              type="button"
            >
              {name}
            </button>
          ))}
        </main>
      </div>
    </>
  );
}
