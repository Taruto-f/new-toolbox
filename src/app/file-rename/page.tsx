'use client';
import React, { useState } from "react";
import styles from "../page.module.css";
import styled from 'styled-components';

function getRenamedFiles(files: File[], prefix: string, suffix: string, start: number) {
  return files.map((file, idx) => {
    const ext = file.name.split('.').pop();
    const base = prefix + (start + idx) + suffix;
    return {
      file,
      newName: `${base}.${ext}`
    };
  });
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

export default function FileRename() {
  const [files, setFiles] = useState<File[]>([]);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [start, setStart] = useState(1);
  const [renamed, setRenamed] = useState<{file: File, newName: string}[]>([]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const arr = Array.from(fileList);
    setFiles(arr);
    setRenamed([]);
  };

  const handleRename = () => {
    setRenamed(getRenamedFiles(files, prefix, suffix, start));
  };

  const handleDownloadAll = async () => {
    for (const {file, newName} of renamed) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = newName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Root>
      <Box>
        <Title>ファイル名一括リネームツール</Title>
        <input
          type="file"
          multiple
          onChange={e => handleFiles(e.target.files)}
          style={{ width: '100%', marginBottom: 16 }}
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="接頭辞"
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: 'none', background: '#3a3a67', color: '#eef1f7', width: '33%' }}
          />
          <input
            type="number"
            placeholder="開始番号"
            value={start}
            min={1}
            onChange={e => setStart(Number(e.target.value))}
            style={{ padding: 8, borderRadius: 8, border: 'none', background: '#3a3a67', color: '#eef1f7', width: '33%' }}
          />
          <input
            type="text"
            placeholder="接尾辞"
            value={suffix}
            onChange={e => setSuffix(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: 'none', background: '#3a3a67', color: '#eef1f7', width: '33%' }}
          />
        </div>
        <button
          onClick={handleRename}
          disabled={files.length === 0}
          style={{ width: '100%', background: '#7d91f6', color: '#1e1e2f', fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', marginBottom: 16, fontSize: '1rem', cursor: files.length === 0 ? 'not-allowed' : 'pointer', opacity: files.length === 0 ? 0.5 : 1, transition: 'background 0.3s' }}
        >
          リネームプレビュー
        </button>
        {renamed.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <ul style={{ marginBottom: 8, maxHeight: 128, overflowY: 'auto', fontSize: '0.95rem' }}>
              {renamed.map(({file, newName}, idx) => (
                <li key={idx}>{file.name} → {newName}</li>
              ))}
            </ul>
            <button
              onClick={handleDownloadAll}
              style={{ width: '100%', background: '#8d9ff6', color: '#1e1e2f', fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.3s' }}
            >
              一括ダウンロード
            </button>
          </div>
        )}
      </Box>
    </Root>
  );
} 