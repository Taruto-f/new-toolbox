'use client';
import React, { useState } from "react";

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
    <main className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">HTMLエスケープ／アンエスケープツール</h1>
        <textarea
          className="w-full p-2 border rounded mb-4 bg-gray-100 dark:bg-gray-700"
          rows={4}
          placeholder="ここにテキストを入力してください"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex gap-4 mb-4 justify-center">
          <button
            className={`px-4 py-2 rounded font-bold transition ${mode === "escape" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            onClick={() => setMode("escape")}
          >
            エスケープ
          </button>
          <button
            className={`px-4 py-2 rounded font-bold transition ${mode === "unescape" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            onClick={() => setMode("unescape")}
          >
            アンエスケープ
          </button>
        </div>
        <button
          onClick={handleConvert}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition"
        >
          変換
        </button>
        <textarea
          className="w-full p-2 border rounded mb-2 bg-gray-100 dark:bg-gray-700"
          rows={4}
          value={output}
          readOnly
          placeholder="ここに変換結果が表示されます"
        />
        <button
          onClick={handleCopy}
          disabled={!output}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {copied ? "コピーしました！" : "コピー"}
        </button>
      </div>
    </main>
  );
} 