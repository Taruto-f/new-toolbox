'use client';
import React, { useState } from "react";

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
    <main className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">画像フォーマット変換ツール</h1>
        <div className="mb-4">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="mb-4 flex gap-4 justify-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="format"
              value="image/png"
              checked={outputType === "image/png"}
              onChange={() => setOutputType("image/png")}
            />
            PNG
          </label>
          <label className="flex items-center gap-2">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition disabled:opacity-50"
        >
          変換
        </button>
        {outputUrl && (
          <div className="flex flex-col items-center gap-2">
            <img src={outputUrl} alt="変換後の画像" className="max-w-full max-h-48 border rounded" />
            <a
              href={outputUrl}
              download={getFileName()}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
            >
              ダウンロード
            </a>
          </div>
        )}
      </div>
    </main>
  );
} 