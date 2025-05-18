'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadTheme = () => {
      const stored = localStorage.getItem('tb_theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    setTheme(loadTheme());
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tb_theme', newTheme);
  };

  const handleToolClick = (toolUrl: string) => {
    window.open(toolUrl, '_blank');
  };

  return (
    <div className={styles.container} data-theme={theme}>
      <button
        id="themeToggleBtn"
        aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        title={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        className={styles.themeToggleBtn}
        onClick={handleThemeToggle}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <h1 className={styles.title}>ツールボックス</h1>

      <div className={styles.mainContainer}>
        <main className={styles.main}>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('calendar-memo')}
            aria-label="カレンダー＆メモ帳を開く"
          >
            カレンダー＆メモ帳
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('calculator')}
            aria-label="電卓を開く"
          >
            電卓
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('date-calculator')}
            aria-label="日付計算ツールを開く"
          >
            日付計算ツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('bmi-calculator')}
            aria-label="BMI計算ツールを開く"
          >
            BMI計算ツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('world-clock')}
            aria-label="世界時計ツールを開く"
          >
            世界時計ツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('unit-converter')}
            aria-label="単位変換ツールを開く"
          >
            単位変換ツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('color-picker')}
            aria-label="カラーピッカー＆コード変換ツールを開く"
          >
            カラーピッカー＆コード変換ツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('timer-stopwatch')}
            aria-label="タイマー＆ストップウォッチを開く"
          >
            タイマー＆ストップウォッチ
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('text-formatter')}
            aria-label="テキストフォーマッター＆カウンターを開く"
          >
            テキストフォーマッター＆カウンター
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('image-resize-compress')}
            aria-label="画像リサイズ＆圧縮ツールを開く"
          >
            画像リサイズ＆圧縮ツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('qr-code')}
            aria-label="QRコードジェネレーター＆スキャナーを開く"
          >
            QRコードジェネレーター＆スキャナー
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('word-quiz')}
            aria-label="単語学習＆クイズツールを開く"
          >
            単語学習＆クイズツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('weather')}
            aria-label="リアルタイム天気ツールを開く"
          >
            リアルタイム天気ツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('js-minifier')}
            aria-label="JavaScript圧縮ツールを開く"
          >
            JavaScript圧縮ツール
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => handleToolClick('bookmarklet-generator')}
            aria-label="ブックマークレット生成ツールを開く"
          >
            ブックマークレット生成ツール
          </button>
        </main>
      </div>

      <footer className={styles.footer}>&copy; 2025 ツールボックス</footer>
    </div>
  );
}
