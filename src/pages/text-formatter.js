import { useState } from 'react';

export default function TextFormatter() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const formatText = (formatType) => {
    let formattedText = inputText;

    switch (formatType) {
      case 'uppercase':
        formattedText = inputText.toUpperCase();
        break;
      case 'lowercase':
        formattedText = inputText.toLowerCase();
        break;
      case 'capitalize':
        formattedText = inputText
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        break;
      case 'removeSpaces':
        formattedText = inputText.replace(/\s+/g, '');
        break;
      case 'removeLineBreaks':
        formattedText = inputText.replace(/[\r\n]+/g, ' ');
        break;
      case 'removeExtraSpaces':
        formattedText = inputText.replace(/\s+/g, ' ').trim();
        break;
      case 'reverse':
        formattedText = inputText.split('').reverse().join('');
        break;
      case 'count':
        setCharCount(inputText.length);
        setWordCount(inputText.trim().split(/\s+/).filter(word => word.length > 0).length);
        return;
      case 'clear':
        setInputText('');
        setResultText('');
        setCharCount(0);
        setWordCount(0);
        return;
      default:
        formattedText = inputText;
    }

    setResultText(formattedText);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{
      background: '#1e1e2f',
      borderRadius: '15px',
      padding: '20px',
      maxWidth: '800px',
      width: '100%',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      margin: '20px auto',
      color: '#eef1f7',
      fontFamily: "'Roboto Slab', serif"
    }}>
      <h1 style={{
        fontWeight: '700',
        fontSize: '1.5rem',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        テキストフォーマッター
      </h1>

      <div style={{
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px'
          }}>
            入力テキスト:
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="テキストを入力してください..."
              style={{
                width: '100%',
                height: '150px',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: '#3a3a67',
                color: '#eef1f7',
                resize: 'vertical',
                marginTop: '4px'
              }}
            />
          </label>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => formatText('uppercase')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            大文字に変換
          </button>
          <button
            onClick={() => formatText('lowercase')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            小文字に変換
          </button>
          <button
            onClick={() => formatText('capitalize')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            先頭大文字
          </button>
          <button
            onClick={() => formatText('removeSpaces')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            空白を削除
          </button>
          <button
            onClick={() => formatText('removeLineBreaks')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            改行を削除
          </button>
          <button
            onClick={() => formatText('removeExtraSpaces')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            余分な空白を削除
          </button>
          <button
            onClick={() => formatText('reverse')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            文字列を反転
          </button>
          <button
            onClick={() => formatText('count')}
            style={{
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            文字数・単語数をカウント
          </button>
          <button
            onClick={() => formatText('clear')}
            style={{
              background: '#dc3545',
              border: 'none',
              color: '#ffffff',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            クリア
          </button>
        </div>

        {resultText && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px'
            }}>
              変換結果:
              <div style={{
                position: 'relative'
              }}>
                <textarea
                  value={resultText}
                  readOnly
                  style={{
                    width: '100%',
                    height: '150px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3a3a67',
                    color: '#eef1f7',
                    resize: 'vertical',
                    marginTop: '4px'
                  }}
                />
                <button
                  onClick={() => copyToClipboard(resultText)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#7d91f6',
                    border: 'none',
                    color: '#1e1e2f',
                    fontWeight: '700',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  コピー
                </button>
              </div>
            </label>
          </div>
        )}

        {(charCount > 0 || wordCount > 0) && (
          <div style={{
            background: '#3a3a67',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div>文字数: {charCount}文字</div>
            <div>単語数: {wordCount}単語</div>
          </div>
        )}
      </div>
    </div>
  );
} 