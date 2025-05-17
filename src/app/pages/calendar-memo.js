import { useState, useEffect, useCallback } from 'react';

const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const weekDays = ['日','月','火','水','木','金','土'];

function formatDateKey(date) {
  return `memo_${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export default function CalendarMemo() {
  const today = new Date();
  today.setHours(0,0,0,0);

  const [selectedDate, setSelectedDate] = useState(today);
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [memoText, setMemoText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allMemos, setAllMemos] = useState([]);

  // メモ保存
  const saveMemo = useCallback(() => {
    const key = formatDateKey(selectedDate);
    const trimmed = memoText.trim();
    if(trimmed.length > 0){
      localStorage.setItem(key, trimmed);
    } else {
      localStorage.removeItem(key);
    }
    loadMemos();
  }, [selectedDate, memoText]);

  // メモ読み込み
  const loadMemo = useCallback((date) => {
    const key = formatDateKey(date);
    const val = localStorage.getItem(key) || '';
    setMemoText(val);
  }, []);

  // 全メモ読み込み（memo_から始まるキーのみ）
  const loadMemos = useCallback(() => {
    const memos = [];
    for(let i=0; i<localStorage.length; i++){
      const key = localStorage.key(i);
      if(key && key.startsWith('memo_')){
        const text = localStorage.getItem(key);
        if(text && text.trim().length > 0){
          const dateStr = key.slice(5);
          memos.push({dateStr, text});
        }
      }
    }
    memos.sort((a,b) => new Date(b.dateStr) - new Date(a.dateStr));
    setAllMemos(memos);
  }, []);

  // 検索
  const performSearch = useCallback(() => {
    const kw = searchKeyword.trim().toLowerCase();
    if(kw===''){
      setSearchResults([]);
      return;
    }
    const results = allMemos.filter(m => m.text.toLowerCase().includes(kw));
    setSearchResults(results);
  }, [searchKeyword, allMemos]);

  useEffect(() => {
    loadMemo(selectedDate);
  }, [selectedDate, loadMemo]);

  useEffect(() => {
    loadMemos();
  }, [loadMemos]);

  // カレンダーのレンダー用配列作成
  const getDays = () => {
    const firstDay = new Date(displayYear, displayMonth, 1);
    const lastDay = new Date(displayYear, displayMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstWeekDay = firstDay.getDay();

    const daysArray = [];
    // 空のセル
    for(let i=0; i<firstWeekDay; i++){
      daysArray.push(null);
    }
    // 月の日
    for(let d=1; d<=daysInMonth; d++){
      daysArray.push(new Date(displayYear, displayMonth, d));
    }
    return daysArray;
  };

  // 月移動
  const handlePrevMonth = () => {
    let y = displayYear;
    let m = displayMonth - 1;
    if(m < 0){
      y = y - 1;
      m = 11;
    }
    setDisplayYear(y);
    setDisplayMonth(m);
    // 選択日が表示月に合わなければ日付更新
    if(selectedDate.getFullYear() !== y || selectedDate.getMonth() !== m){
      setSelectedDate(new Date(y, m, 1));
    }
  };
  const handleNextMonth = () => {
    let y = displayYear;
    let m = displayMonth + 1;
    if(m > 11){
      y = y + 1;
      m = 0;
    }
    setDisplayYear(y);
    setDisplayMonth(m);
    if(selectedDate.getFullYear() !== y || selectedDate.getMonth() !== m){
      setSelectedDate(new Date(y, m, 1));
    }
  };

  const selectDate = (date) => {
    if(date) setSelectedDate(date);
  };

  return (
    <div style={{maxWidth: '360px', margin: '0 auto', padding: '12px'}}>
      <button
        id="themeToggleBtn"
        style={{
          position: 'fixed', top: 12, right: 12, padding:'8px 14px', borderRadius: '12px',
          border: 'none', cursor: 'pointer', zIndex: 9999,
          background: 'var(--primary, #5567ab)', color:'var(--text, #eef1f7)'}}
        aria-label="ダークモード切り替え"
        onClick={() => {
          const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('tb_theme', newTheme);
        }}>
        {document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙'}
      </button>

      <header style={{textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px', userSelect:'none'}}>
        カレンダー＆メモ帳
      </header>

      <div style={{display: 'flex', marginBottom: '8px'}}>
        <input
          type="search"
          placeholder="メモをキーワードで検索"
          aria-label="メモ検索"
          style={{flex:1,padding:'8px 10px',borderRadius:'10px',border:'none',boxShadow:'inset 2px 2px 5px rgba(0,0,0,0.2)',marginRight:'8px'}}
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && performSearch()}
        />
        <button
          onClick={performSearch}
          style={{padding:'8px 16px', borderRadius:'12px', border:'none', background:'#7d91f6', color:'#fff',fontWeight:'700',cursor:'pointer'}}>
          検索
        </button>
      </div>

      {/* 検索結果 */}
      {searchKeyword.trim() !== '' && (
        <div style={{
          maxHeight: '100px', overflowY: 'auto', backgroundColor: 'var(--bg-darker, #292a40)',
          borderRadius:'10px', padding:'6px 8px', marginBottom:'8px', fontSize:'0.9rem'}}>
          {searchResults.length === 0
            ? <div style={{textAlign:'center',color:'#a1a6c9',padding:'8px 0'}}>該当するメモはありません</div>
            : searchResults.map(({dateStr, text}) => {
                const preview = text.length > 30 ? text.slice(0,30) + '…' : text;
                return (
                  <div
                    key={dateStr}
                    tabIndex={0}
                    role="option"
                    onClick={() => { selectDate(new Date(dateStr)); setSearchKeyword(''); setSearchResults([]); }}
                    onKeyDown={e => {if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDate(new Date(dateStr)); setSearchKeyword(''); setSearchResults([]); }}}
                    style={{padding:'6px 8px',borderRadius:'8px',cursor:'pointer',userSelect:'none',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:'var(--text, #eee)'}}
                  >
                    {dateStr} ： {preview}
                  </div>
                );
          })}
        </div>
      )}

      {/* カレンダー */}
      <div style={{
        backgroundColor: 'var(--bg-darker, #292a40)',
        borderRadius: '15px 15px 0 0',
        padding: '10px 12px',
        marginBottom: '6px',
        userSelect: 'none',
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px'}}>
          <button
            onClick={handlePrevMonth}
            aria-label="前の月"
            style={{background:'var(--primary)',border:'none',borderRadius:'6px',color:'var(--text)',padding:'6px 10px',fontWeight:'600',fontSize:'1.2rem',cursor:'pointer'}}
          >‹</button>
          <div style={{fontWeight:'700', fontSize:'1.2rem'}}>{displayYear}年 {monthNames[displayMonth]}</div>
          <button
            onClick={handleNextMonth}
            aria-label="次の月"
            style={{background:'var(--primary)',border:'none',borderRadius:'6px',color:'var(--text)',padding:'6px 10px',fontWeight:'600',fontSize:'1.2rem',cursor:'pointer'}}
          >›</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', textAlign:'center', fontWeight:'700', color:'#a1a6c9', marginBottom:'4px'}}>
          {weekDays.map(d => <div key={d}>{d}</div>)}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px', textAlign:'center'}}>
          {getDays().map((date, i) => {
            if(!date){
              return <div key={'empty-'+i}></div>;
            }
            const time = date.getTime();
            const isToday = time === today.getTime();
            const isSelected = time === selectedDate.getTime();
            return (
              <button
                key={time}
                style={{
                  padding:'6px 0',
                  borderRadius:'8px',
                  fontWeight: isSelected ? '700' : '600',
                  fontSize: '1rem',
                  backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? 'var(--bg)' : 'var(--text)',
                  border: isToday ? `2px solid var(--text)` : 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderWidth: isToday ? '2px' : '1px',
                  borderStyle: 'solid',
                  borderColor: isToday ? 'var(--text)' : 'transparent',
                  outline: 'none'
                }}
                onClick={() => selectDate(date)}
                onKeyDown={e => {
                  if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    selectDate(date);
                  }
                }}
                tabIndex={0}
                aria-label={`${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* メモ */}
      <main style={{backgroundColor:'var(--bg-darker)', borderRadius:'0 0 15px 15px', padding:'10px 12px 14px 12px'}}>
        <div style={{textAlign:'center', fontWeight:'700', fontSize:'1.1rem', marginBottom:'6px', userSelect:'none', color:'var(--text)'}}>
          メモ：{selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
        </div>
        <textarea
          value={memoText}
          onChange={e => setMemoText(e.target.value)}
          placeholder="ここにメモを入力してください…"
          aria-label="メモ入力欄"
          style={{flex:'1', resize:'none', borderRadius:'10px', border:'none', padding:'10px', fontSize:'1rem', background:'var(--bg)', color:'var(--text)', outline:'none', boxShadow:'inset 2px 2px 5px rgba(0,0,0,0.4), inset -2px -2px 5px rgba(255,255,255,0.1)', marginBottom:'10px', transition:'background-color 0.3s ease, color 0.3s ease'}}
        />
        <footer style={{display:'flex', justifyContent:'flex-end', gap:'12px'}}>
          <button
            type="button"
            className="save-btn"
            onClick={saveMemo}
            style={{
              backgroundColor: 'var(--primary)',
              border: 'none',
              color: 'var(--text)',
              fontWeight: '700',
              padding: '8px 16px',
              fontSize: '1rem',
              borderRadius: '12px',
              cursor: 'pointer',
              userSelect: 'none',
              boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
              transition: 'background-color 0.3s ease'
            }}
          >メモを保存</button>
          <button
            type="button"
            className="load-btn"
            onClick={reloadMemo}
            style={{
              backgroundColor: '#6cd17d',
              border: 'none',
              color: 'var(--text)',
              fontWeight: '700',
              padding: '8px 16px',
              fontSize: '1rem',
              borderRadius: '12px',
              cursor: 'pointer',
              userSelect: 'none',
              boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
              transition: 'background-color 0.3s ease'
            }}
          >読み込み</button>
        </footer>
      </main>
    </div>
  );
}
