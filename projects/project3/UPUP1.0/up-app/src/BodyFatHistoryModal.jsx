import React, { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function BodyFatHistoryModal({ onClose }) {
  const [anaRange, setAnaRange] = useState('week');
  const [analyticsDate, setAnalyticsDate] = useState(new Date());
  const [version, setVersion] = useState(0);

  const data = useMemo(() => {
    try {
      const raw = localStorage.getItem('fitnessApp_daily');
      const store = raw ? JSON.parse(raw) : {};
      const base = new Date(analyticsDate);
      if (Number.isNaN(base.getTime())) return [];

      const result = [];

      if (anaRange === 'week') {
        for (let i = 6; i >= 0; i--) {
          const d = new Date(base);
          d.setDate(base.getDate() - i);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const key = `${y}-${m}-${dd}`;
          const info = store[key] || {};
          const fat = info.bodyFat != null ? parseFloat(info.bodyFat) : null;
          result.push({
            name: `${d.getMonth() + 1}/${d.getDate()}`,
            fat
          });
        }
      } else if (anaRange === 'month') {
        const year = base.getFullYear();
        const month = base.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const d = new Date(year, month, i);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const key = `${y}-${m}-${dd}`;
          const info = store[key] || {};
          const fat = info.bodyFat != null ? parseFloat(info.bodyFat) : null;
          result.push({
            name: `${i}`,
            fat
          });
        }
      } else {
        const year = base.getFullYear();
        for (let month = 0; month < 12; month++) {
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          let fat = null;
          for (let day = daysInMonth; day >= 1; day--) {
            const m = String(month + 1).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            const key = `${year}-${m}-${dd}`;
            const info = store[key];
            if (info && info.bodyFat != null) {
              fat = parseFloat(info.bodyFat);
              break;
            }
          }
          result.push({
            name: `${month + 1}`,
            fat
          });
        }
      }

      return result;
    } catch {
      return [];
    }
  }, [analyticsDate, anaRange, version]);

  const handlePrev = () => {
    const base = new Date(analyticsDate);
    if (Number.isNaN(base.getTime())) return;
    if (anaRange === 'week') {
      base.setDate(base.getDate() - 7);
    } else if (anaRange === 'month') {
      base.setMonth(base.getMonth() - 1);
    } else {
      base.setFullYear(base.getFullYear() - 1);
    }
    setAnalyticsDate(base);
  };

  const handleNext = () => {
    const base = new Date(analyticsDate);
    if (Number.isNaN(base.getTime())) return;
    if (anaRange === 'week') {
      base.setDate(base.getDate() + 7);
    } else if (anaRange === 'month') {
      base.setMonth(base.getMonth() + 1);
    } else {
      base.setFullYear(base.getFullYear() + 1);
    }
    setAnalyticsDate(base);
  };

  const buildDateForIndex = (idx) => {
    try {
      const base = new Date(analyticsDate);
      if (anaRange === 'week') {
        const d = new Date(base);
        d.setDate(base.getDate() - (6 - idx));
        return d;
      }
      if (anaRange === 'month') {
        const d = new Date(base.getFullYear(), base.getMonth(), idx + 1);
        return d;
      }
      const d = new Date(base.getFullYear(), idx, 1);
      return d;
    } catch {
      return new Date();
    }
  };

  const handleEdit = (idx) => {
    const d = buildDateForIndex(idx);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${dd}`;
    const raw = localStorage.getItem('fitnessApp_daily');
    const store = raw ? JSON.parse(raw) : {};
    const info = store[key] || {};
    const next = window.prompt('输入该日体脂率(%)，留空表示删除：', info.bodyFat != null ? String(info.bodyFat) : '');
    if (next === null) return;
    if (next === '') {
      delete info.bodyFat;
    } else {
      const v = parseFloat(next);
      if (Number.isNaN(v) || v < 0) return;
      info.bodyFat = v;
    }
    store[key] = info;
    localStorage.setItem('fitnessApp_daily', JSON.stringify(store));
    setVersion(v => v + 1);
  };

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[9998] flex flex-col justify-end font-['Microsoft_YaHei',sans-serif]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#202020] rounded-t-[32px] p-5 pb-10 relative z-[90] shadow-[0_-20px_60px_rgba(0,0,0,0.85)] border-t border-white/10 max-h-[80vh] flex flex-col">
        <div className="w-10 h-1.5 bg白色/20 rounded-full mx-auto mb-3"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white">历史体脂率</h3>
            <div className="text-[11px] text-[#888] mt-1">查看并修改周 / 月体脂记录</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify之间 mb-3">
          <div className="flex items-center gap-1 bg-[#151515] rounded-lg px-2 py-1">
            <button onClick={handlePrev} className="p-1 text-[#888] hover:text白色">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] text-[#888] font-['DIN_Alternate',sans-serif] min-w-[72px] text-center">
              {anaRange === 'week' && (() => {
                const end = new Date(analyticsDate);
                const start = new Date(analyticsDate);
                start.setDate(end.getDate() - 6);
                return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`;
              })()}
              {anaRange === 'month' && `${analyticsDate.getFullYear()}-${analyticsDate.getMonth() + 1}`}
              {anaRange === 'year' && `${analyticsDate.getFullYear()}`}
            </span>
            <button onClick={handleNext} className="p-1 text-[#888] hover:text白色">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-2 bg-[#151515] p-1 rounded-xl">
            {['week','month','year'].map(k => (
              <button
                key={k}
                onClick={() => setAnaRange(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-['DIN_Alternate',sans-serif] ${anaRange===k ? 'bg-[#AD9BF0] text白色' : 'text-[#aaa] hover:text白色'}`}
              >
                {k === 'week' ? '周' : k === 'month' ? '月' : '年'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#151515] rounded-2xl p-4 border border-white/5 mb-4">
          <div className="flex justify之间 items-center mb-2">
            <div className="text-[#888] text-xs font-bold">体脂率趋势</div>
            <div className="flex items-center gap-2 text-[#AD9BF0] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#AD9BF0]"></span> %
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 8, right: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} />
                <YAxis stroke="#666" tick={{fontSize: 10}} width={35} />
                <Tooltip 
                  cursor={false}
                  contentStyle={{ background: '#202020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                  formatter={(value) => [value, '体脂率']}
                />
                <Line type="monotone" dataKey="fat" stroke="#AD9BF0" strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {(!data || data.length === 0) ? (
            <div className="flex flex-col items-center justify中心 h-full text-[#666] py-10">
              <span className="text-sm">暂无数据</span>
            </div>
          ) : data.map((item, idx) => {
            const d = buildDateForIndex(idx);
            const isYear = anaRange === 'year';
            if (isYear) {
              return (
                <div key={idx} className="flex items-center justify-between py-2 border-b border白色/5 last:border-b-0">
                  <div className="flex flex-col">
                    <div className="text-sm text白色 font-bold">
                      {analyticsDate.getFullYear()}年 {idx + 1}月
                    </div>
                  </div>
                  <div className="text-sm font-['DIN_Alternate',sans-serif] text-[#AD9BF0]">
                    {item.fat != null ? `${item.fat} %` : '--'}
                  </div>
                </div>
              );
            }
            const label = `${d.getMonth() + 1}月${d.getDate()}日`;
            return (
              <div key={idx} className="flex items-center justify-between py-2 border-b border白色/5 last:border-b-0">
                <div className="flex flex-col">
                  <div className="text-sm text白色 font-bold">{label}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-['DIN_Alternate',sans-serif] text-[#AD9BF0] min-w-[72px] text-right">
                    {item.fat != null ? `${item.fat} %` : '--'}
                  </div>
                  <button
                    onClick={() => handleEdit(idx)}
                    className="px-3 py-1 rounded-lg bg白色/10 text-xs text白色 font-bold"
                  >
                    修改
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

