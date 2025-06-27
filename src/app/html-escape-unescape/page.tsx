'use client';
import React, { useState } from "react";
import styles from "../page.module.css";
import styled from 'styled-components';

function escapeHtml(text: string) {
  return text.replace(/[&<>'"]/g, (char) => {
    switch (char) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "'": return "&#39;";
      case '"': return "&quot;";
      default: return char;
    }
  });
}

function unescapeHtml(text: string) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

const Root = styled.div`
  background: #1e1e2f;
  border-radius: 15px;
  padding: 40px 0;
  max-width: 900px;
  width: 90vw;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  margin: 40px auto;
  color: #eef1f7;
  font-family: 'Roboto Slab', serif;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
`;

const Box = styled.div`
  background: #2c2c48;
  border-radius: 10px;
  padding: 32px 24px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.07);
  max-width: 420px;
  width: 100%;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 24px;
  text-align: center;
`;

export default function HtmlEscapeUnescape() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setOutput(mode === "escape" ? escapeHtml(input) : unescapeHtml(input));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    }
  };

  return (
    <Root>
      <Box>
        <Title>HTMLエスケープ／アンエスケープツール</Title>
        <textarea
          style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', background: '#3a3a67', color: '#eef1f7', marginBottom: 16 }}
          rows={4}
          placeholder="ここにテキストを入力してください"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
          <button
            style={{ padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: '1rem', background: mode === 'escape' ? '#7d91f6' : '#3a3a67', color: mode === 'escape' ? '#1e1e2f' : '#eef1f7', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
            onClick={() => setMode('escape')}
          >
            エスケープ
          </button>
          <button
            style={{ padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: '1rem', background: mode === 'unescape' ? '#7d91f6' : '#3a3a67', color: mode === 'unescape' ? '#1e1e2f' : '#eef1f7', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
            onClick={() => setMode('unescape')}
          >
            アンエスケープ
          </button>
        </div>
        <button
          onClick={handleConvert}
          style={{ width: '100%', background: '#7d91f6', color: '#1e1e2f', fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', marginBottom: 16, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.3s' }}
        >
          変換
        </button>
        <textarea
          style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', background: '#3a3a67', color: '#eef1f7', marginBottom: 12 }}
          rows={4}
          value={output}
          readOnly
          placeholder="ここに変換結果が表示されます"
        />
        <button
          onClick={handleCopy}
          disabled={!output}
          style={{ width: '100%', background: '#8d9ff6', color: '#1e1e2f', fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', fontSize: '1rem', cursor: output ? 'pointer' : 'not-allowed', opacity: output ? 1 : 0.5, transition: 'background 0.3s' }}
        >
          {copied ? "コピーしました！" : "コピー"}
        </button>
      </Box>
    </Root>
  );
} 