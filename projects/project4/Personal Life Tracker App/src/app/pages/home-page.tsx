import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { StorageService, RecordData, Settings } from '../lib/storage';
import { formatDate, getDaysInMonth, getStreakCount } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/bottom-nav';

export function HomePage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'year' | 'week'>('month');
  const [records, setRecords] = useState<RecordData[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [settings, setSettings] = useState<Settings>({ username: '旅行者' });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  useEffect(() => {
    StorageService.initializeSampleData();
    loadRecords();
    setSettings(StorageService.getSettings());
  }, [currentDate, viewMode]);

  const loadRecords = () => {
    if (viewMode === 'month') {
      setRecords(StorageService.getRecordsByMonth(currentYear, currentMonth));
    } else if (viewMode === 'week') {
      const allRecords = StorageService.getRecords();
      setRecords(allRecords);
    } else {
      setRecords(StorageService.getRecordsByYear(currentYear));
    }
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPreviousYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const goToNextYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: string) => {
    const clickedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (clickedDate > today) {
      return;
    }
    
    navigate(`/record/${date}`);
  };

  const handleYearMonthSelect = (year: number, month: number) => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
    setShowDatePicker(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-lg font-light text-gray-600 mb-1">Hi, {settings.username}</h2>
          <p className="text-xs text-gray-400 tracking-wider uppercase">LIFE MUSEUM</p>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-light tracking-tight">
                {currentYear}.{String(currentMonth).padStart(2, '0')}
              </h1>
              <button 
                onClick={() => setShowDatePicker(true)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-full text-xs transition-colors ${
                viewMode === 'week' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
            >
              周
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-full text-xs transition-colors ${
                viewMode === 'month' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
            >
              月
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-4 py-2 rounded-full text-xs transition-colors ${
                viewMode === 'year' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
            >
              年
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={viewMode === 'week' ? goToPreviousWeek : viewMode === 'month' ? goToPreviousMonth : goToPreviousYear}
            className="p-2 active:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          
          <h2 className="text-xs text-gray-400 tracking-wider uppercase">
            {viewMode === 'week'
              ? 'WEEK VIEW'
              : viewMode === 'month' 
              ? 'MONTH VIEW'
              : 'YEAR VIEW'
            }
          </h2>
          
          <button
            onClick={viewMode === 'week' ? goToNextWeek : viewMode === 'month' ? goToNextMonth : goToNextYear}
            className="p-2 active:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Calendar View */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          {viewMode === 'week' ? (
            <WeekView
              key="week"
              currentDate={currentDate}
              records={records}
              onDateClick={handleDateClick}
            />
          ) : viewMode === 'month' ? (
            <MonthView
              key="month"
              year={currentYear}
              month={currentMonth}
              records={records}
              onDateClick={handleDateClick}
            />
          ) : (
            <YearView
              key="year"
              year={currentYear}
              records={records}
              onMonthClick={(month) => {
                setCurrentDate(new Date(currentYear, month - 1, 1));
                setViewMode('month');
              }}
            />
          )}
        </AnimatePresence>

        {/* Record Today Card - Week View Style */}
        {viewMode === 'month' && currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() + 1 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate(`/record/${formatDate(new Date())}`)}
            className="w-full mt-8 bg-white rounded-2xl overflow-hidden border border-gray-200 transition-transform active:scale-[0.98] shadow-sm"
          >
            <div className="p-4">
              {/* Date info at top */}
              <div className="flex items-center gap-2 mb-3">
                <p className="text-2xl font-light">{new Date().getDate()}</p>
                <p className="text-xs text-gray-500">今日</p>
              </div>
              
              {/* Horizontal photo placeholder */}
              <div className="aspect-[4/3] rounded-lg bg-gray-50 flex items-center justify-center border border-dashed border-gray-300">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">记录今日</p>
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </div>

      {/* Year & Month Picker Modal */}
      <AnimatePresence>
        {showDatePicker && (
          <DatePickerModal
            currentYear={currentYear}
            currentMonth={currentMonth}
            onClose={() => setShowDatePicker(false)}
            onSelect={handleYearMonthSelect}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

function DatePickerModal({ 
  currentYear, 
  currentMonth, 
  onClose, 
  onSelect 
}: { 
  currentYear: number; 
  currentMonth: number; 
  onClose: () => void; 
  onSelect: (year: number, month: number) => void;
}) {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-light">选择日期</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year Selector with Arrows */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-2xl font-light">{selectedYear}</span>
            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Month Selector */}
        <div>
          <p className="text-sm text-gray-500 mb-3">月份</p>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <button
                key={month}
                onClick={() => onSelect(selectedYear, month)}
                className={`py-4 rounded-2xl transition-colors ${
                  month === currentMonth && selectedYear === currentYear
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <span className="text-sm font-light">{String(month).padStart(2, '0')} 月</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function WeekView({ 
  currentDate, 
  records, 
  onDateClick 
}: { 
  currentDate: Date; 
  records: RecordData[]; 
  onDateClick: (date: string) => void;
}) {
  const daysInWeek = 7;
  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
  
  const recordMap = new Map(records.map(r => [r.date, r]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const days = [];
  
  for (let day = 0; day < daysInWeek; day++) {
    const date = new Date(firstDayOfWeek);
    date.setDate(date.getDate() + day);
    const dateStr = formatDate(date);
    const record = recordMap.get(dateStr);
    const isFuture = date > today;

    days.push({
      date,
      dateStr,
      record,
      dayName: weekDays[day],
      isFuture,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {days.map((dayData, index) => (
        <motion.button
          key={dayData.dateStr}
          onClick={() => !dayData.isFuture && onDateClick(dayData.dateStr)}
          disabled={dayData.isFuture}
          className={`w-full bg-white rounded-2xl overflow-hidden border border-gray-200 transition-transform ${
            dayData.isFuture ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98]'
          } shadow-sm`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {dayData.record ? (
            <div className="p-4">
              {/* Date info at top */}
              <div className="flex items-center gap-2 mb-3">
                <p className="text-2xl font-light">{dayData.date.getDate()}</p>
                <p className="text-xs text-gray-500">{dayData.dayName}</p>
              </div>
              
              {/* Horizontal photo */}
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                <img 
                  src={dayData.record.photo} 
                  alt={dayData.dateStr}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Text below photo */}
              {dayData.record.text && (
                <div className="text-left">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {dayData.record.text}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <p className={`text-2xl font-light ${dayData.isFuture ? 'text-gray-300' : 'text-gray-400'}`}>
                  {dayData.date.getDate()}
                </p>
                <p className="text-xs text-gray-400">{dayData.dayName}</p>
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400">
                  {dayData.isFuture ? '未来日期' : '暂无记录'}
                </p>
              </div>
            </div>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}

function MonthView({ 
  year, 
  month, 
  records, 
  onDateClick 
}: { 
  year: number; 
  month: number; 
  records: RecordData[]; 
  onDateClick: (date: string) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const recordMap = new Map(records.map(r => [r.date, r]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  
  // Empty cells for alignment
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = recordMap.get(dateStr);
    const currentDate = new Date(year, month - 1, day);
    const isFuture = currentDate > today;

    days.push(
      <motion.button
        key={day}
        onClick={() => !isFuture && onDateClick(dateStr)}
        disabled={isFuture}
        className={`aspect-square relative overflow-hidden rounded-md border transition-transform ${
          isFuture 
            ? 'border-gray-100 cursor-not-allowed opacity-40' 
            : record 
            ? 'border-gray-200 active:scale-95' 
            : 'border-gray-200 active:scale-95'
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: day * 0.01 }}
      >
        {record ? (
          <>
            <img 
              src={record.photo} 
              alt={`${dateStr}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-light" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)', opacity: 0.9 }}>
                {day}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <span className={`text-sm font-light ${isFuture ? 'text-gray-300' : 'text-gray-400'}`}>
              {day}
            </span>
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      <div className="grid grid-cols-7 gap-3 mb-4">
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div key={index} className="text-center text-xs text-gray-400 font-light">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {days}
      </div>
    </motion.div>
  );
}

function YearView({ 
  year, 
  records, 
  onMonthClick 
}: { 
  year: number; 
  records: RecordData[]; 
  onMonthClick: (month: number) => void;
}) {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-3 gap-4"
    >
      {months.map((monthName, monthIndex) => {
        const month = monthIndex + 1;
        const monthRecords = records.filter(r => 
          r.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)
        );
        
        const recordMap = new Map(monthRecords.map(r => [r.date, r]));
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

        return (
          <motion.button
            key={monthIndex}
            onClick={() => onMonthClick(month)}
            className="rounded-2xl border border-gray-200 p-3 active:scale-95 transition-transform overflow-hidden bg-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: monthIndex * 0.05 }}
          >
            <div className="text-left mb-3">
              <h3 className="text-sm font-light">{monthName}</h3>
              <p className="text-xs text-gray-400">{monthRecords.length}</p>
            </div>
            
            {/* Mini calendar grid - 7 columns */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Empty cells for alignment */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                const day = dayIndex + 1;
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const record = recordMap.get(dateStr);
                
                return (
                  <div
                    key={day}
                    className="aspect-square rounded-sm overflow-hidden bg-gray-100"
                  >
                    {record && (
                      <img 
                        src={record.photo} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}