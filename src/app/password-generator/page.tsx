'use client';
import React, { useState } from "react";

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
    <main className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">パスワード生成ツール</h1>
        <div className="mb-4">
          <label className="block mb-1 font-medium">長さ: {length}</label>
          <input
            type="range"
            min={4}
            max={32}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} />
            大文字
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} />
            小文字
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useNumber} onChange={e => setUseNumber(e.target.checked)} />
            数字
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useSymbol} onChange={e => setUseSymbol(e.target.checked)} />
            記号
          </label>
        </div>
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition"
        >
          生成
        </button>
        <div className="mb-2">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-center font-mono"
            placeholder="ここに生成結果が表示されます"
          />
        </div>
        <button
          onClick={handleCopy}
          disabled={!password}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {copied ? "コピーしました！" : "コピー"}
        </button>
      </div>
    </main>
  );
} 