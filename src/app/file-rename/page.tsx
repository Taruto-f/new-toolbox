'use client';
import React, { useState } from "react";
import styles from "../page.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.title}>ファイル名一括リネームツール</h2>
      <div className={styles.content}>
        <input
          type="file"
          multiple
          onChange={e => handleFiles(e.target.files)}
          className="mb-4"
        />
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="接頭辞"
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
            className="p-2 border rounded w-1/3"
          />
          <input
            type="number"
            placeholder="開始番号"
            value={start}
            min={1}
            onChange={e => setStart(Number(e.target.value))}
            className="p-2 border rounded w-1/3"
          />
          <input
            type="text"
            placeholder="接尾辞"
            value={suffix}
            onChange={e => setSuffix(e.target.value)}
            className="p-2 border rounded w-1/3"
          />
        </div>
        <button
          onClick={handleRename}
          disabled={files.length === 0}
          className={"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition disabled:opacity-50"}
        >
          リネームプレビュー
        </button>
        {renamed.length > 0 && (
          <div className="mb-4">
            <ul className="mb-2 max-h-32 overflow-y-auto text-sm">
              {renamed.map(({file, newName}, idx) => (
                <li key={idx}>{file.name} → {newName}</li>
              ))}
            </ul>
            <button
              onClick={handleDownloadAll}
              className={"w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"}
            >
              一括ダウンロード
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 