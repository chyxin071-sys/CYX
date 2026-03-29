import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, MapPin, Image, X } from 'lucide-react';
import { StorageService, RecordData } from '../lib/storage';
import { getDaysInMonth, getLocationStats } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/bottom-nav';

type ViewMode = 'day' | 'week' | 'month' | 'year';
type ExportFormat = 'day' | 'week' | 'month' | 'year';

// Export options types
interface DayOptions {
  showDate: boolean;
  showText: boolean;
  showLocation: boolean;
}

interface WeekOptions {
  showTotalDate: boolean;
  showDailyDate: boolean;
  showDailyText: boolean;
  showDailyLocation: boolean;
}

interface MonthOptions {
  showDate: boolean;
  showRecordCount: boolean;
  showTopLocation: boolean;
}

interface YearOptions {
  showYear: boolean;
  showRecordCount: boolean;
  showTopLocation: boolean;
  showCityCount: boolean;
  reportName: string;
}

export function SummaryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<RecordData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat | null>(null);

  // Export options state
  const [dayOptions, setDayOptions] = useState<DayOptions>({
    showDate: true,
    showText: true,
    showLocation: true,
  });

  const [weekOptions, setWeekOptions] = useState<WeekOptions>({
    showTotalDate: true,
    showDailyDate: true,
    showDailyText: true,
    showDailyLocation: true,
  });

  const [monthOptions, setMonthOptions] = useState<MonthOptions>({
    showDate: true,
    showRecordCount: true,
    showTopLocation: true,
  });

  const [yearOptions, setYearOptions] = useState<YearOptions>({
    showYear: true,
    showRecordCount: true,
    showTopLocation: true,
    showCityCount: true,
    reportName: '年度生活报告',
  });

  useEffect(() => {
    setRecords(StorageService.getRecords());
  }, []);

  const exportFormats = [
    { id: 'day' as ExportFormat, title: '单日拍立得', description: '记录瞬间', icon: Image },
    { id: 'week' as ExportFormat, title: '一周长图', description: '本周回顾', icon: Calendar },
    { id: 'month' as ExportFormat, title: '月历拼图', description: '月度总结', icon: MapPin },
    { id: 'year' as ExportFormat, title: '年度报告', description: '年度精选', icon: Calendar },
  ];

  const handleExportPreview = (format: ExportFormat) => {
    setSelectedExportFormat(format);
  };

  const handleExportConfirm = () => {
    navigate(`/export/${selectedExportFormat}`);
  };

  // Filter records based on view mode
  const getFilteredRecords = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    if (viewMode === 'day') {
      const dateStr = selectedDate.toISOString().split('T')[0];
      return records.filter(r => r.date === dateStr);
    } else if (viewMode === 'week') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return records.filter(r => {
        const date = new Date(r.date);
        return date >= weekStart && date <= weekEnd;
      });
    } else if (viewMode === 'month') {
      return records.filter(r => r.date.startsWith(`${year}-${String(month).padStart(2, '0')}`));
    } else {
      return records.filter(r => r.date.startsWith(`${year}`));
    }
  };

  const filteredRecords = getFilteredRecords();
  const locationStats = getLocationStats(filteredRecords);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <h1 className="text-3xl font-light tracking-tight mb-2">时光印记</h1>
        <p className="text-xs text-gray-400 tracking-wider uppercase">MEMORIES</p>
      </header>

      <div className="px-6 space-y-8">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-full text-xs transition-colors ${
                viewMode === 'day' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
            >
              日
            </button>
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

        {/* Date Navigator */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              if (viewMode === 'day') newDate.setDate(newDate.getDate() - 1);
              else if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
              else if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
              else newDate.setFullYear(newDate.getFullYear() - 1);
              setSelectedDate(newDate);
            }}
            className="px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            ←
          </button>
          
          <p className="text-sm font-light">
            {viewMode === 'year' && `${selectedDate.getFullYear()}年`}
            {viewMode === 'month' && `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月`}
            {viewMode === 'week' && `${selectedDate.getFullYear()}年第${Math.ceil(selectedDate.getDate() / 7)}周`}
            {viewMode === 'day' && selectedDate.toLocaleDateString('zh-CN')}
          </p>
          
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              if (viewMode === 'day') newDate.setDate(newDate.getDate() + 1);
              else if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
              else if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
              else newDate.setFullYear(newDate.getFullYear() + 1);
              setSelectedDate(newDate);
            }}
            className="px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            →
          </button>
        </div>

        {/* Data Overview */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-2xl p-6 text-center"
          >
            <p className="text-3xl font-light mb-2">{filteredRecords.length}</p>
            <p className="text-sm text-gray-500">记录天数</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-2xl p-6 text-center"
          >
            <p className="text-3xl font-light mb-2">{locationStats.size}</p>
            <p className="text-sm text-gray-500">去过地点</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-2xl p-6 text-center"
          >
            <p className="text-3xl font-light mb-2">
              {filteredRecords.reduce((sum, r) => sum + (r.text?.length || 0), 0)}
            </p>
            <p className="text-sm text-gray-500">文字总数</p>
          </motion.div>
        </div>

        {/* Heatmap Trends */}
        {viewMode === 'month' && (
          <MonthHeatmap
            records={filteredRecords}
            year={selectedDate.getFullYear()}
            month={selectedDate.getMonth() + 1}
          />
        )}

        {viewMode === 'year' && (
          <YearHeatmap
            records={filteredRecords}
            year={selectedDate.getFullYear()}
          />
        )}

        {/* Export Preview Section */}
        {exportFormats
          .filter(format => format.id === viewMode)
          .map((format) => (
            <div key={format.id}>
              {/* Preview Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden"
              >
                {/* Preview Area */}
                <div className="bg-gray-50 p-6">
                  {viewMode === 'day' && (
                    <DayExportPreview
                      record={filteredRecords[0]}
                      selectedDate={selectedDate}
                      options={dayOptions}
                    />
                  )}
                  {viewMode === 'week' && (
                    <WeekExportPreview
                      records={filteredRecords}
                      selectedDate={selectedDate}
                      options={weekOptions}
                    />
                  )}
                  {viewMode === 'month' && (
                    <MonthExportPreview
                      records={filteredRecords}
                      selectedDate={selectedDate}
                      options={monthOptions}
                    />
                  )}
                  {viewMode === 'year' && (
                    <YearExportPreview
                      records={records}
                      selectedDate={selectedDate}
                      options={yearOptions}
                    />
                  )}
                </div>

                {/* Options Panel */}
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">显示内容</h3>
                  
                  {viewMode === 'day' && (
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={dayOptions.showDate}
                          onChange={(e) => setDayOptions({...dayOptions, showDate: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示日期</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={dayOptions.showText}
                          onChange={(e) => setDayOptions({...dayOptions, showText: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示日记</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={dayOptions.showLocation}
                          onChange={(e) => setDayOptions({...dayOptions, showLocation: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示地点</span>
                      </label>
                    </div>
                  )}

                  {viewMode === 'week' && (
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={weekOptions.showTotalDate}
                          onChange={(e) => setWeekOptions({...weekOptions, showTotalDate: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示总日期</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={weekOptions.showDailyDate}
                          onChange={(e) => setWeekOptions({...weekOptions, showDailyDate: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示每日日期</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={weekOptions.showDailyText}
                          onChange={(e) => setWeekOptions({...weekOptions, showDailyText: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示每日日记</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={weekOptions.showDailyLocation}
                          onChange={(e) => setWeekOptions({...weekOptions, showDailyLocation: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示每日地点</span>
                      </label>
                    </div>
                  )}

                  {viewMode === 'month' && (
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={monthOptions.showDate}
                          onChange={(e) => setMonthOptions({...monthOptions, showDate: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示日期</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={monthOptions.showRecordCount}
                          onChange={(e) => setMonthOptions({...monthOptions, showRecordCount: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示记录天数</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={monthOptions.showTopLocation}
                          onChange={(e) => setMonthOptions({...monthOptions, showTopLocation: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示常在地点</span>
                      </label>
                    </div>
                  )}

                  {viewMode === 'year' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-700 mb-2 block">写给自己的一句话</label>
                        <input
                          type="text"
                          value={yearOptions.reportName}
                          onChange={(e) => setYearOptions({...yearOptions, reportName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          placeholder="自定义报告名称"
                        />
                      </div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={yearOptions.showYear}
                          onChange={(e) => setYearOptions({...yearOptions, showYear: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示年份</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={yearOptions.showRecordCount}
                          onChange={(e) => setYearOptions({...yearOptions, showRecordCount: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示记录天数</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={yearOptions.showTopLocation}
                          onChange={(e) => setYearOptions({...yearOptions, showTopLocation: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示常在地点</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={yearOptions.showCityCount}
                          onChange={(e) => setYearOptions({...yearOptions, showCityCount: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">显示城市数量</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleExportPreview(format.id)}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors"
                  >
                    导出{format.title}
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {selectedExportFormat && (
          <ExportModal
            format={selectedExportFormat}
            onClose={() => setSelectedExportFormat(null)}
            onConfirm={handleExportConfirm}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

// Day Export Preview - Polaroid Style
function DayExportPreview({ 
  record, 
  selectedDate,
  options 
}: { 
  record?: RecordData;
  selectedDate: Date;
  options: DayOptions;
}) {
  if (!record) {
    return (
      <div className="max-w-sm mx-auto bg-white shadow-2xl p-8">
        <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center mb-6">
          <p className="text-gray-400 text-sm">暂无记录</p>
        </div>
        {options.showDate && (
          <div className="space-y-1">
            <p className="text-xs text-gray-400 tracking-wider">
              {selectedDate.toISOString().split('T')[0]}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white shadow-2xl p-8">
      {/* Photo Area */}
      <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-6 relative">
        <img src={record.photo} alt="" className="w-full h-full object-cover" />
      </div>
      
      {/* Info Section - Reference style */}
      <div className="space-y-2">
        {options.showLocation && record.location && (
          <p className="text-sm font-light text-gray-900">{record.location}</p>
        )}
        {options.showDate && (
          <p className="text-xs text-gray-400 tracking-wider">
            {record.date}
          </p>
        )}
        {options.showText && record.text && (
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 pt-2">
            {record.text}
          </p>
        )}
      </div>
    </div>
  );
}

// Week Export Preview - Light color, only show records
function WeekExportPreview({ 
  records, 
  selectedDate,
  options 
}: { 
  records: RecordData[];
  selectedDate: Date;
  options: WeekOptions;
}) {
  // Get all 7 days of the week
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const record = records.find(r => r.date === dateStr);
    return { date, dateStr, record };
  }).filter(day => day.record); // Only show days with records

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  if (weekDays.length === 0) {
    return (
      <div className="max-w-sm mx-auto bg-white shadow-2xl p-8">
        <p className="text-gray-400 text-center">本周暂无记录</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      {options.showTotalDate && (
        <div className="px-8 py-6 border-b border-gray-100">
          <h3 className="text-base font-light text-gray-900 mb-1">一周日常</h3>
          <p className="text-xs text-gray-400">
            {weekStart.toLocaleDateString('zh-CN')} - {weekEnd.toLocaleDateString('zh-CN')}
          </p>
        </div>
      )}
      
      {/* Photos - Seamless stack */}
      <div className="space-y-0">
        {weekDays.map((day, index) => (
          <div key={index} className="relative border-b border-gray-100 last:border-b-0">
            <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
              <img src={day.record!.photo} alt="" className="w-full h-full object-cover" />
            </div>
            
            {/* Info section below photo */}
            {(options.showDailyDate || options.showDailyText || options.showDailyLocation) && (
              <div className="px-8 py-4 bg-white">
                <div className="space-y-1">
                  {options.showDailyDate && (
                    <p className="text-xs text-gray-900 font-light">{day.dateStr}</p>
                  )}
                  {options.showDailyLocation && day.record!.location && (
                    <p className="text-xs text-gray-500">{day.record!.location}</p>
                  )}
                  {options.showDailyText && day.record!.text && (
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mt-2">
                      {day.record!.text}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 text-center border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400">Created {new Date().toLocaleDateString('zh-CN')}</p>
      </div>
    </div>
  );
}

// Month Export Preview - Reference Image 1 Style: Light with white date text overlay
function MonthExportPreview({ 
  records, 
  selectedDate,
  options 
}: { 
  records: RecordData[];
  selectedDate: Date;
  options: MonthOptions;
}) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const recordMap = new Map(records.map(r => [r.date, r]));
  
  // Get top location
  const locationStats = getLocationStats(records);
  const topLocation = Array.from(locationStats.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '未知';

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-100 shadow-2xl overflow-hidden rounded-2xl">
      {/* Top: Month Info - Left aligned like reference */}
      <div className="p-6 pb-4 bg-gray-100">
        {options.showDate && (
          <div>
            <h2 className="text-5xl font-light text-gray-900 mb-1">{String(month).padStart(2, '0')}<span className="text-2xl">月</span></h2>
            <p className="text-xs text-gray-600">{monthNames[month - 1]} {year}</p>
          </div>
        )}
      </div>

      {/* Calendar Grid - Main Focus with light background */}
      <div className="px-6 pb-4 bg-gray-100">
        {/* Week Headers - 日一二三四五六 */}
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <div key={index} className="text-center text-xs text-gray-500 font-light py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
            const day = dayIndex + 1;
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = recordMap.get(dateStr);

            return (
              <div
                key={day}
                className="aspect-square rounded-lg overflow-hidden relative"
              >
                {record ? (
                  <>
                    <img src={record.photo} alt="" className="w-full h-full object-cover" />
                    {/* White date number overlay - smaller and centered */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base font-light text-white drop-shadow-lg">{String(day).padStart(2, '0')}</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <span className="text-lg text-gray-300 font-light">{String(day).padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      {(options.showRecordCount || options.showTopLocation) && (
        <div className="px-6 pb-4 pt-2 bg-gray-100">
          <div className="flex justify-start gap-4 text-xs text-gray-600">
            {options.showRecordCount && (
              <span>{records.length}篇记录 · {getDaysInMonth(year, month)}天</span>
            )}
            {options.showTopLocation && (
              <span>{topLocation}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Year Export Preview - Vertical seamless month calendars
function YearExportPreview({ 
  records, 
  selectedDate,
  options 
}: { 
  records: RecordData[];
  selectedDate: Date;
  options: YearOptions;
}) {
  const year = selectedDate.getFullYear();
  const yearRecords = records.filter(r => r.date.startsWith(`${year}`));
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Get stats
  const locationStats = getLocationStats(yearRecords);
  const topLocation = Array.from(locationStats.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '未知';
  const cityCount = locationStats.size;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-8 bg-white border-b border-gray-100">
        <h2 className="text-2xl font-light text-gray-900 mb-3">{year} 年度小结</h2>
        {options.showYear && options.reportName && (
          <p className="text-sm text-gray-600">{options.reportName}</p>
        )}
        
        {/* Simple Stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
          {options.showRecordCount && (
            <span>记录 {yearRecords.length} 天</span>
          )}
          {options.showTopLocation && (
            <span>· 常在 {topLocation}</span>
          )}
          {options.showCityCount && (
            <span>· {cityCount} 个地点</span>
          )}
        </div>
      </div>

      {/* Vertical Month Calendars - Seamless */}
      <div className="space-y-0">
        {Array.from({ length: 12 }, (_, monthIndex) => {
          const month = monthIndex + 1;
          const monthRecords = yearRecords.filter(r => 
            r.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)
          );
          const daysInMonth = getDaysInMonth(year, month);
          const firstDay = new Date(year, month - 1, 1).getDay();
          const recordMap = new Map(monthRecords.map(r => [r.date, r]));

          return (
            <div key={month} className="bg-gray-50 border-b border-gray-200 last:border-b-0">
              {/* Month Header */}
              <div className="px-6 py-3 bg-white border-b border-gray-100">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl font-light text-gray-900">{String(month).padStart(2, '0')}</h3>
                  <p className="text-xs text-gray-500">{monthNames[monthIndex]}</p>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Week headers */}
                  {['日', '一', '二', '三', '四', '五', '六'].map((d, i) => (
                    <div key={i} className="text-center text-xs text-gray-400 font-light py-1">
                      {d}
                    </div>
                  ))}
                  
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e-${i}`} className="aspect-square" />
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const record = recordMap.get(dateStr);

                    return (
                      <div
                        key={day}
                        className="aspect-square rounded-md overflow-hidden relative"
                      >
                        {record ? (
                          <>
                            <img src={record.photo} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-light text-white drop-shadow-lg">{String(day).padStart(2, '0')}</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-white rounded-md flex items-center justify-center border border-gray-200">
                            <span className="text-sm text-gray-300 font-light">{String(day).padStart(2, '0')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export Modal
function ExportModal({
  format,
  onClose,
  onConfirm
}: {
  format: ExportFormat;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const formatTitles = {
    day: '单日拍立得',
    week: '一周长图',
    month: '月历拼图',
    year: '年度报告',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-light">确认导出</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            即将导出 <strong>{formatTitles[format]}</strong>
          </p>
          <p className="text-xs text-gray-500">
            您将进入导出设置页面，可以进行最终调整并下载图片。
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors"
          >
            确认导出
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Month Heatmap Component - Black for checked days
function MonthHeatmap({ records, year, month }: { records: RecordData[]; year: number; month: number }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const recordMap = new Map(records.map(r => [r.date, r]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-50 rounded-2xl p-6"
    >
      <h3 className="text-sm text-gray-500 mb-4">月度打卡热力</h3>
      
      <div className="grid grid-cols-7 gap-3">
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div key={index} className="text-center text-xs text-gray-400 font-light py-1">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const record = recordMap.get(dateStr);
          
          // Black for checked, gray for unchecked
          const bgColor = record ? 'bg-gray-900' : 'bg-gray-200';
          const textColor = record ? 'text-white' : 'text-gray-400';

          return (
            <motion.div
              key={day}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: dayIndex * 0.01 }}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${bgColor} ${textColor}`}
            >
              {day}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Year Heatmap Component - Bar Chart with hover
function YearHeatmap({ records, year }: { records: RecordData[]; year: number }) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  
  // Count records per month
  const monthCounts = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return records.filter(r => 
      r.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)
    ).length;
  });

  const maxCount = Math.max(...monthCounts, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-50 rounded-2xl p-6"
    >
      <h3 className="text-sm text-gray-500 mb-4">年度记录分布</h3>
      
      {/* Bar Chart - One row, 12 months */}
      <div className="flex items-end justify-between gap-1.5 h-40">
        {monthCounts.map((count, index) => {
          const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <motion.div
              key={index}
              className="flex-1 flex flex-col items-center relative group"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredMonth(index)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              <div className="w-full flex flex-col items-center gap-1">
                {/* Hover tooltip */}
                {hoveredMonth === index && count > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                  >
                    {count}篇
                  </motion.div>
                )}
                
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPercent, count > 0 ? 8 : 0)}%` }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className={`w-full rounded-t transition-colors ${
                    hoveredMonth === index && count > 0 ? 'bg-gray-700' : 'bg-gray-900'
                  }`}
                  style={{ minHeight: count > 0 ? '8px' : '0px' }}
                />
                
                {/* Month Label - No "月" suffix */}
                <span className="text-xs text-gray-500 font-light mt-1">{index + 1}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}