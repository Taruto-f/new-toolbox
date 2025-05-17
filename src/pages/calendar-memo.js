import { useState, useEffect } from 'react';

export default function CalendarMemo() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [memos, setMemos] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [memoText, setMemoText] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const savedMemos = localStorage.getItem('calendarMemos');
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
  }, []);

  const saveMemos = (newMemos) => {
    localStorage.setItem('calendarMemos', JSON.stringify(newMemos));
    setMemos(newMemos);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setMemoText(memos[formattedDate] || '');
  };

  const handleSaveMemo = () => {
    if (selectedDate) {
      const newMemos = { ...memos, [selectedDate]: memoText };
      saveMemos(newMemos);
    }
  };

  const handleSearch = () => {
    const searchResults = Object.entries(memos).filter(([_, text]) => 
      text.toLowerCase().includes(searchText.toLowerCase())
    );
    if (searchResults.length > 0) {
      const [date] = searchResults[0];
      setSelectedDate(date);
      setMemoText(memos[date]);
      const [year, month] = date.split('-');
      setCurrentDate(new Date(year, month - 1));
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ height: '40px' }}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const formattedDate = formatDate(date);
      const hasMemo = memos[formattedDate];
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: selectedDate === formattedDate ? '#7d91f6' : hasMemo ? '#3a3a67' : 'transparent',
            borderRadius: '8px',
            color: selectedDate === formattedDate ? '#1e1e2f' : '#eef1f7'
          }}
        >
          {day}
        </div>
      );
    }

    return days;
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
        カレンダーとメモ
      </h1>

      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          flex: 1,
          background: '#2c2c48',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <button
              onClick={handlePrevMonth}
              style={{
                background: '#3a3a67',
                border: 'none',
                color: '#eef1f7',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ←
            </button>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: '700'
            }}>
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </div>
            <button
              onClick={handleNextMonth}
              style={{
                background: '#3a3a67',
                border: 'none',
                color: '#eef1f7',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px'
          }}>
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  color: '#a1a6c9'
                }}
              >
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        <div style={{
          flex: 1,
          background: '#2c2c48',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="メモを検索..."
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: '#3a3a67',
                color: '#eef1f7',
                marginBottom: '8px'
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                width: '100%',
                background: '#7d91f6',
                border: 'none',
                color: '#1e1e2f',
                fontWeight: '700',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              検索
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="メモを入力..."
              style={{
                width: '100%',
                height: '200px',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: '#3a3a67',
                color: '#eef1f7',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            onClick={handleSaveMemo}
            disabled={!selectedDate}
            style={{
              width: '100%',
              background: '#7d91f6',
              border: 'none',
              color: '#1e1e2f',
              fontWeight: '700',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: !selectedDate ? 0.7 : 1
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
} 