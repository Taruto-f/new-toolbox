document.addEventListener('DOMContentLoaded', () => {
  // スタイルの追加
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap');
    body {
      margin: 0; font-family: 'Roboto Slab', serif;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #eef1f7;
      min-height: 100vh; 
      display: flex; flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    #app {
      background: #1e1e2f;
      border-radius: 15px;
      padding: 20px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 8px 16px rgba(0,0,0,0.4);
    }
    h1 {
      font-weight: 700;
      font-size: 1.5rem;
      margin-bottom: 16px;
      user-select: none;
      text-align: center;
    }
    label, input, button {
      display: block;
      width: 100%;
      font-size: 1rem;
      margin-bottom: 12px;
    }
    label {
      font-weight: 700;
    }
    input[type="file"] {
      padding: 6px;
      background: #3a3a67;
      border-radius: 10px;
      border: none;
      color: #eef1f7;
    }
    input[type="number"] {
      padding: 8px;
      border-radius: 10px;
      border: none;
      background: #3a3a67;
      color: #eef1f7;
      outline: none;
      box-shadow: inset 2px 2px 5px #273065, inset -2px -2px 5px #4555a4;
      -moz-appearance:textfield;
    }
    input[type="number"]::-webkit-inner-spin-button, 
    input[type="number"]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    button {
      background: #7d91f6;
      border: none;
      color: #1e1e2f;
      font-weight: 700;
      padding: 10px;
      border-radius: 12px;
      cursor: pointer;
      user-select: none;
      box-shadow: 0 3px 6px rgba(125,145,246,0.7);
      transition: background 0.3s ease;
    }
    button:active {
      background: #5a68bf;
    }
    img#preview {
      max-width: 100%;
      margin-top: 12px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      display: block;
    }
    @media (max-width: 420px) {
      #app {
        max-width: 100vw;
        border-radius: 0;
        padding: 16px 12px;
      }
    }
  `;
  document.head.appendChild(style);

  // HTMLの構造を作成
  const app = document.createElement('div');
  app.id = 'app';
  app.setAttribute('role', 'application');
  app.setAttribute('aria-label', '画像リサイズ＆圧縮ツール');

  app.innerHTML = `
    <h1>画像リサイズ＆圧縮ツール</h1>
    <label for="imageInput">画像ファイルを選択</label>
    <input type="file" id="imageInput" accept="image/*" aria-describedby="imageHelp" />
    
    <label for="widthInput">リサイズ幅 (px)</label>
    <input type="number" id="widthInput" min="1" step="1" placeholder="例: 800" aria-label="リサイズ幅" maxlength="5" />

    <label for="heightInput">リサイズ高さ (px)</label>
    <input type="number" id="heightInput" min="1" step="1" placeholder="例: 600" aria-label="リサイズ高さ" maxlength="5" />

    <label for="qualityInput">圧縮品質 (JPGのみ、0.1～1)</label>
    <input type="number" id="qualityInput" min="0.1" max="1" step="0.1" value="0.8" aria-label="圧縮品質" />

    <button id="processBtn">変換実行</button>

    <a id="downloadLink" style="display:none; margin-top:12px; user-select:none;" download="converted-image.jpg">変換画像をダウンロード</a>
    <img id="preview" alt="変換画像プレビュー" />
  `;

  document.body.appendChild(app);

  // 要素の取得
  const imageInput = document.getElementById('imageInput');
  const widthInput = document.getElementById('widthInput');
  const heightInput = document.getElementById('heightInput');
  const qualityInput = document.getElementById('qualityInput');
  const processBtn = document.getElementById('processBtn');
  const preview = document.getElementById('preview');
  const downloadLink = document.getElementById('downloadLink');

  let originalImage = null;

  // 画像選択時の処理
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) {
      originalImage = null;
      preview.src = '';
      downloadLink.style.display = 'none';
      downloadLink.href = '';
      return;
    }
    const url = URL.createObjectURL(file);
    originalImage = new Image();
    originalImage.onload = () => {
      preview.src = url;
      downloadLink.style.display = 'none';
      downloadLink.href = '';
    };
    originalImage.src = url;
  });

  // 入力欄での文字数制限
  [widthInput, heightInput].forEach(input => {
    input.addEventListener('input', () => {
      if(input.value.length > 5){
        input.value = input.value.slice(0,5);
      }
    });
  });

  // 変換実行ボタンの処理
  processBtn.addEventListener('click', () => {
    if (!originalImage) {
      alert('画像を選択してください');
      return;
    }
    let w = parseInt(widthInput.value, 10);
    let h = parseInt(heightInput.value, 10);
    let quality = parseFloat(qualityInput.value);
    if (!quality || quality < 0.1 || quality > 1) {
      quality = 0.8;
    }

    // アスペクト比維持のため、片方だけ指定時に自動計算
    if (w && !h) {
      h = Math.round((originalImage.height / originalImage.width) * w);
    } else if (!w && h) {
      w = Math.round((originalImage.width / originalImage.height) * h);
    }

    // 両方未指定は元画像サイズを使用
    if (!w && !h) {
      w = originalImage.width;
      h = originalImage.height;
    }

    // Canvas作成・描画
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0, w, h);

    // 画像データ生成(JPEG圧縮)
    canvas.toBlob(blob => {
      if (!blob) {
        alert('画像変換に失敗しました');
        return;
      }
      const url = URL.createObjectURL(blob);
      preview.src = url;
      downloadLink.href = url;
      downloadLink.style.display = 'block';
    }, 'image/jpeg', quality);
  });
}); 