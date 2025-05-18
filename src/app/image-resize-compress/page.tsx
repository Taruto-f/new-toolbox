"use client";
import React, { useState, useRef } from "react";

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
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2>画像リサイズツール</h2>
      <div style={{ marginBottom: 16 }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      {previewUrl && (
        <div style={{ marginBottom: 16 }}>
          <div>元画像プレビュー:</div>
          <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", maxHeight: 200, border: "1px solid #ccc", borderRadius: 8 }} />
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <label>
          幅(px):
          <input type="number" value={width} min={1} max={2000} onChange={e => setWidth(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} />
        </label>
        <label style={{ marginLeft: 16 }}>
          高さ(px):
          <input type="number" value={height} min={1} max={2000} onChange={e => setHeight(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} />
        </label>
      </div>
      <button onClick={handleResize} disabled={!originalImage} style={{ padding: "8px 16px", borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}>リサイズ</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {resizedImageUrl && (
        <div style={{ marginTop: 24 }}>
          <div>リサイズ後プレビュー:</div>
          <img src={resizedImageUrl} alt="resized" style={{ maxWidth: "100%", maxHeight: 200, border: "1px solid #ccc", borderRadius: 8 }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={handleDownload} style={{ padding: "8px 16px", borderRadius: 6, background: "#388e3c", color: "#fff", border: "none", cursor: "pointer" }}>ダウンロード</button>
          </div>
        </div>
      )}
    </div>
  );
}
