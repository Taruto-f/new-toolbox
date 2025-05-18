"use client";
import React, { useState, useRef } from "react";
import styles from "./page.module.css";

export default function ImageResizeCompressPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [resizedImageUrl, setResizedImageUrl] = useState<string>("");
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(300);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleResize = () => {
    if (!originalImage) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/png");
      setResizedImageUrl(dataUrl);
    };
    img.src = URL.createObjectURL(originalImage);
  };

  const handleDownload = () => {
    if (!resizedImageUrl) return;
    const a = document.createElement("a");
    a.href = resizedImageUrl;
    a.download = "resized-image.png";
    a.click();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>画像リサイズツール</h2>
      <div className={styles.content}>
        <div className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {previewUrl && (
          <div>
            <div>元画像プレビュー:</div>
            <img src={previewUrl} alt="preview" className={styles.preview} />
          </div>
        )}
        <div className={styles.inputGroup}>
          <label>
            幅(px):
            <input
              type="number"
              value={width}
              min={1}
              max={2000}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </label>
          <label>
            高さ(px):
            <input
              type="number"
              value={height}
              min={1}
              max={2000}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </label>
        </div>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={handleResize}
          disabled={!originalImage}
        >
          リサイズ
        </button>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {resizedImageUrl && (
          <div>
            <div>リサイズ後プレビュー:</div>
            <img src={resizedImageUrl} alt="resized" className={styles.preview} />
            <button className={`${styles.button} ${styles.secondary}`} onClick={handleDownload}>
              ダウンロード
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
