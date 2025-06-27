'use client';
import React, { useState } from "react";
import styles from "../page.module.css";
import styled from 'styled-components';

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

export default function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [outputType, setOutputType] = useState<string>("image/png");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOutputUrl("");
    }
  };

  const handleConvert = () => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const url = canvas.toDataURL(outputType);
          setOutputUrl(url);
        }
        setLoading(false);
      };
      if (event.target && typeof event.target.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const getFileName = () => {
    if (!file) return "converted";
    const base = file.name.replace(/\.[^.]+$/, "");
    return base + (outputType === "image/png" ? ".png" : ".jpg");
  };

  return (
    <Root>
      <Box>
        <Title>画像フォーマット変換ツール</Title>
        <div style={{ marginBottom: 24 }}>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            style={{ width: '100%', marginBottom: 8 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="radio"
              name="format"
              value="image/png"
              checked={outputType === "image/png"}
              onChange={() => setOutputType("image/png")}
            />
            PNG
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="radio"
              name="format"
              value="image/jpeg"
              checked={outputType === "image/jpeg"}
              onChange={() => setOutputType("image/jpeg")}
            />
            JPG
          </label>
        </div>
        <button
          onClick={handleConvert}
          disabled={!file || loading}
          style={{ width: '100%', background: '#7d91f6', color: '#1e1e2f', fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', marginBottom: 16, fontSize: '1rem', cursor: !file || loading ? 'not-allowed' : 'pointer', opacity: !file || loading ? 0.5 : 1, transition: 'background 0.3s' }}
        >
          変換
        </button>
        {outputUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <img src={outputUrl} alt="変換後の画像" style={{ maxWidth: '100%', maxHeight: 192, borderRadius: 8, border: '1px solid #444' }} />
            <a
              href={outputUrl}
              download={getFileName()}
              style={{ background: '#8d9ff6', color: '#1e1e2f', fontWeight: 700, padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontSize: '1rem', marginTop: 8, display: 'inline-block', transition: 'background 0.3s' }}
            >
              ダウンロード
            </a>
          </div>
        )}
      </Box>
    </Root>
  );
} 