'use client';
import React, { useState } from "react";
import styles from "../page.module.css";
import styled from 'styled-components';

const generatePassword = (length: number, useUpper: boolean, useLower: boolean, useNumber: boolean, useSymbol: boolean) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const number = "0123456789";
  const symbol = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let chars = "";
  if (useUpper) chars += upper;
  if (useLower) chars += lower;
  if (useNumber) chars += number;
  if (useSymbol) chars += symbol;
  if (!chars) return "";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

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

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumber, setUseNumber] = useState(true);
  const [useSymbol, setUseSymbol] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setPassword(generatePassword(length, useUpper, useLower, useNumber, useSymbol));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
    }
  };

  return (
    <Root>
      <Box>
        <Title>パスワード生成ツール</Title>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>長さ: {length}</label>
          <input
            type="range"
            min={4}
            max={32}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} />
            大文字
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} />
            小文字
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={useNumber} onChange={e => setUseNumber(e.target.checked)} />
            数字
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={useSymbol} onChange={e => setUseSymbol(e.target.checked)} />
            記号
          </label>
        </div>
        <button
          onClick={handleGenerate}
          style={{ width: '100%', background: '#7d91f6', color: '#1e1e2f', fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', marginBottom: 16, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.3s' }}
        >
          生成
        </button>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            value={password}
            readOnly
            style={{ width: '100%', padding: 8, borderRadius: 8, border: 'none', background: '#3a3a67', color: '#eef1f7', textAlign: 'center', fontFamily: 'monospace' }}
            placeholder="ここに生成結果が表示されます"
          />
        </div>
        <button
          onClick={handleCopy}
          disabled={!password}
          style={{ width: '100%', background: '#8d9ff6', color: '#1e1e2f', fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', fontSize: '1rem', cursor: password ? 'pointer' : 'not-allowed', opacity: password ? 1 : 0.5, transition: 'background 0.3s' }}
        >
          {copied ? "コピーしました！" : "コピー"}
        </button>
      </Box>
    </Root>
  );
} 