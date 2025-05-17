// pages/bookmark-manager.js
import { useState, useEffect } from 'react';

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [category, setCategory] = useState('');

  // ローカルストレージからブックマークを読み込む
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // ブックマークを保存
  const saveBookmarks = (newBookmarks) => {
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  // ブックマークの追加
  const addBookmark = (e) => {
    e.preventDefault();
    if (!title || !url) return;

    const newBookmark = {
      id: Date.now(),
      title,
      url,
      category,
      createdAt: new Date().toISOString()
    };

    if (editId) {
      // 編集モード
      const updatedBookmarks = bookmarks.map(bookmark =>
        bookmark.id === editId ? newBookmark : bookmark
      );
      saveBookmarks(updatedBookmarks);
      setEditId(null);
    } else {
      // 新規追加
      saveBookmarks([...bookmarks, newBookmark]);
    }

    // フォームをリセット
    setTitle('');
    setUrl('');
    setCategory('');
  };

  // ブックマークの削除
  const deleteBookmark = (id) => {
    if (window.confirm('このブックマークを削除してもよろしいですか？')) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
      saveBookmarks(updatedBookmarks);
    }
  };

  // ブックマークの編集
  const editBookmark = (bookmark) => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setCategory(bookmark.category);
    setEditId(bookmark.id);
  };

  // ブックマークの検索
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // カテゴリーの一覧を取得
  const categories = [...new Set(bookmarks.map(bookmark => bookmark.category))].filter(Boolean);

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
        ブックマーク管理
      </h1>

      <div style={{
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <form onSubmit={addBookmark}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px'
              }}>
                タイトル:
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ブックマークのタイトル"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3a3a67',
                    color: '#eef1f7'
                  }}
                />
              </label>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px'
              }}>
                URL:
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3a3a67',
                    color: '#eef1f7'
                  }}
                />
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px'
            }}>
              カテゴリー:
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="カテゴリー（任意）"
                list="categories"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#3a3a67',
                  color: '#eef1f7'
                }}
              />
              <datalist id="categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {editId ? '更新' : '追加'}
          </button>
        </form>
      </div>

      <div style={{
        background: '#2c2c48',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ブックマークを検索..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: '#3a3a67',
              color: '#eef1f7'
            }}
          />
        </div>

        <div style={{
          display: 'grid',
          gap: '10px'
        }}>
          {filteredBookmarks.map(bookmark => (
            <div
              key={bookmark.id}
              style={{
                background: '#3a3a67',
                borderRadius: '8px',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '1.1rem'
                }}>
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#7d91f6',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  {bookmark.url}
                </a>
                {bookmark.category && (
                  <span style={{
                    background: '#7d91f6',
                    color: '#1e1e2f',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    {bookmark.category}
                  </span>
                )}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                <button
                  onClick={() => editBookmark(bookmark)}
                  style={{
                    background: '#7d91f6',
                    border: 'none',
                    color: '#1e1e2f',
                    fontWeight: '700',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  編集
                </button>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  style={{
                    background: '#dc3545',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '700',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}