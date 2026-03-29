import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { StorageService, RecordData } from '../lib/storage';
import { formatDate, getDaysInMonth, getLocationStats } from '../lib/utils';
import { motion } from 'motion/react';

type ExportFormat = 'day' | 'week' | 'month' | 'year';
type ImageFormat = 'png' | 'jpg';

interface ExportOptions {
  showDate: boolean;
  showText: boolean;
  showLocation: boolean;
  reportName?: string;
  showStats?: boolean;
}

export function ExportPage() {
  const navigate = useNavigate();
  const { format } = useParams<{ format: ExportFormat }>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [records, setRecords] = useState<RecordData[]>([]);
  const [selectedImageFormat, setSelectedImageFormat] = useState<ImageFormat>('png');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    showDate: true,
    showText: true,
    showLocation: true,
    reportName: `${new Date().getFullYear()}年度报告`,
    showStats: true,
  });

  useEffect(() => {
    loadRecords();
  }, [selectedDate, format]);

  const loadRecords = () => {
    const allRecords = StorageService.getRecords();
    
    if (format === 'day') {
      const dateStr = formatDate(selectedDate);
      const record = allRecords.find(r => r.date === dateStr);
      setRecords(record ? [record] : []);
    } else if (format === 'week') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      setRecords(allRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate >= weekStart && recordDate <= weekEnd;
      }));
    } else if (format === 'month') {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      setRecords(StorageService.getRecordsByMonth(year, month));
    } else if (format === 'year') {
      const year = selectedDate.getFullYear();
      setRecords(StorageService.getRecordsByYear(year));
    }
  };

  const handleConfirmExport = () => {
    if (records.length === 0) {
      alert('该时段暂无记录');
      return;
    }
    alert(`正在导出 ${getFormatTitle(format as ExportFormat)} 为 ${selectedImageFormat.toUpperCase()} 格式，共 ${records.length} 条记录...`);
  };

  const getFormatTitle = (fmt: ExportFormat) => {
    const titles = {
      day: '单日拍立得',
      week: '一周长图',
      month: '月历拼图',
      year: '年度报告',
    };
    return titles[fmt];
  };

  const getDateDisplay = () => {
    if (format === 'day') {
      return formatDate(selectedDate);
    } else if (format === 'week') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    } else if (format === 'month') {
      return `${selectedDate.getFullYear()}年 ${selectedDate.getMonth() + 1}月`;
    } else if (format === 'year') {
      return `${selectedDate.getFullYear()}年`;
    }
  };

  const adjustDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    if (format === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (format === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (format === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (format === 'year') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/summary')}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-light">{getFormatTitle(format as ExportFormat)}</h1>
          
          <div className="w-10" />
        </div>
      </header>

      {/* Content Area - Options on top, Preview below */}
      <div className="px-6 py-8 space-y-8">
        {/* Date Selector */}
        <div>
          <p className="text-sm text-gray-500 mb-3">选择日期</p>
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
            <button
              onClick={() => adjustDate('prev')}
              className="px-4 py-2 hover:bg-white rounded-xl transition-colors"
            >
              ←
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-light">{getDateDisplay()}</span>
            </div>
            
            <button
              onClick={() => adjustDate('next')}
              className="px-4 py-2 hover:bg-white rounded-xl transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div>
          <p className="text-sm text-gray-500 mb-3">导出选项</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
            {/* Year-specific options */}
            {format === 'year' && (
              <>
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">报告名称</label>
                  <input
                    type="text"
                    value={exportOptions.reportName}
                    onChange={(e) => setExportOptions({ ...exportOptions, reportName: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400"
                    placeholder="输入报告名称"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">显示内容</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.showStats}
                        onChange={(e) => setExportOptions({ ...exportOptions, showStats: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                      <span className="text-sm">显示统计数据</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.showLocation}
                        onChange={(e) => setExportOptions({ ...exportOptions, showLocation: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                      <span className="text-sm">常在地点</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Other formats options */}
            {format !== 'year' && (
              <div>
                <label className="text-xs text-gray-600 mb-2 block">显示内容</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.showDate}
                      onChange={(e) => setExportOptions({ ...exportOptions, showDate: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm">日期</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.showText}
                      onChange={(e) => setExportOptions({ ...exportOptions, showText: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm">日记</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.showLocation}
                      onChange={(e) => setExportOptions({ ...exportOptions, showLocation: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm">{format === 'month' ? '常在地点' : '地点'}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Image Format */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">图片格式</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedImageFormat('png')}
                  className={`py-3 rounded-xl transition-colors ${
                    selectedImageFormat === 'png'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm font-medium">PNG</span>
                  <p className="text-xs opacity-70 mt-1">无损压缩</p>
                </button>
                
                <button
                  onClick={() => setSelectedImageFormat('jpg')}
                  className={`py-3 rounded-xl transition-colors ${
                    selectedImageFormat === 'jpg'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm font-medium">JPG</span>
                  <p className="text-xs opacity-70 mt-1">更小体积</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="text-sm text-gray-500 mb-3">预览</p>
          
          {records.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-400">该时段暂无记录</p>
            </div>
          ) : (
            <>
              {format === 'day' && <PolaroidDayPreview record={records[0]} options={exportOptions} />}
              {format === 'week' && <PolaroidWeekPreview records={records.slice(0, 2)} options={exportOptions} />}
              {format === 'month' && <MonthCalendarPreview records={records} selectedDate={selectedDate} options={exportOptions} />}
              {format === 'year' && <YearExportPreview records={records} year={selectedDate.getFullYear()} options={exportOptions} />}
            </>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={handleConfirmExport}
          disabled={records.length === 0}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors ${
            records.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <Download className="w-5 h-5" />
          <span>导出为 {selectedImageFormat.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
}

// Polaroid-style single day export
function PolaroidDayPreview({ record, options }: { record: RecordData; options: ExportOptions }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white shadow-lg border border-gray-200 p-6 max-w-sm mx-auto"
    >
      <div className="aspect-[4/5] overflow-hidden mb-4 bg-gray-100">
        <img src={record.photo} alt={record.date} className="w-full h-full object-cover" />
      </div>
      
      <div className="space-y-2 text-center">
        {options.showDate && (
          <p className="text-sm font-light text-gray-700">{record.date}</p>
        )}
        {options.showLocation && record.location && (
          <p className="text-xs text-gray-500">{record.location}</p>
        )}
        {options.showText && record.text && (
          <p className="text-xs text-gray-600 leading-relaxed pt-2">
            {record.text}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Polaroid-style weekly export
function PolaroidWeekPreview({ records, options }: { records: RecordData[]; options: ExportOptions }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {records.map((record) => (
        <div key={record.id} className="bg-white shadow-lg border border-gray-200 p-6">
          <div className="aspect-[4/5] overflow-hidden mb-4 bg-gray-100">
            <img src={record.photo} alt={record.date} className="w-full h-full object-cover" />
          </div>
          
          <div className="space-y-2 text-center">
            {options.showDate && (
              <p className="text-sm font-light text-gray-700">{record.date}</p>
            )}
            {options.showLocation && record.location && (
              <p className="text-xs text-gray-500">{record.location}</p>
            )}
            {options.showText && record.text && (
              <p className="text-xs text-gray-600 leading-relaxed pt-2">
                {record.text}
              </p>
            )}
          </div>
        </div>
      ))}
      {records.length > 2 && (
        <p className="text-xs text-gray-400 text-center">...还有 {records.length - 2} 条记录</p>
      )}
    </motion.div>
  );
}

// Calendar-style monthly export
function MonthCalendarPreview({ 
  records, 
  selectedDate, 
  options 
}: { 
  records: RecordData[]; 
  selectedDate: Date;
  options: ExportOptions;
}) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const recordMap = new Map(records.map(r => [r.date, r]));
  
  const mostCommonLocation = options.showLocation 
    ? Array.from(getLocationStats(records).entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white shadow-lg border border-gray-200 p-6 rounded-2xl"
    >
      <div className="mb-4 text-center">
        {options.showDate && (
          <h3 className="text-lg font-light mb-1">
            {year}年{month}月
          </h3>
        )}
        {mostCommonLocation && (
          <p className="text-xs text-gray-500">常在 {mostCommonLocation}</p>
        )}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div key={index} className="text-center text-xs text-gray-400 py-1">
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
          
          return (
            <div
              key={day}
              className="aspect-square overflow-hidden bg-gray-100 relative flex items-center justify-center text-xs"
            >
              {record ? (
                <>
                  <img 
                    src={record.photo} 
                    alt=""
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  {options.showDate && (
                    <span 
                      className="relative z-10 text-white font-light" 
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontSize: '0.65rem' }}
                    >
                      {day}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-300" style={{ fontSize: '0.65rem' }}>{day}</span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Year report preview
function YearExportPreview({ 
  records, 
  year,
  options
}: { 
  records: RecordData[]; 
  year: number;
  options: ExportOptions;
}) {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const locationStats = getLocationStats(records);
  const mostCommonLocation = Array.from(locationStats.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6"
    >
      <h3 className="text-xl font-light mb-2 text-center">
        {options.reportName || `${year}年度报告`}
      </h3>
      
      {options.showStats && (
        <div className="flex justify-center gap-6 mb-6 pb-4 border-b">
          <div className="text-center">
            <p className="text-lg font-light">{records.length}</p>
            <p className="text-xs text-gray-500">记录天数</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-light">{locationStats.size}</p>
            <p className="text-xs text-gray-500">去过地点</p>
          </div>
          {options.showLocation && mostCommonLocation && (
            <div className="text-center">
              <p className="text-sm font-light">{mostCommonLocation}</p>
              <p className="text-xs text-gray-500">常在地点</p>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-3">
        {months.slice(0, 8).map((monthName, monthIndex) => {
          const month = monthIndex + 1;
          const monthRecords = records.filter(r => 
            r.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)
          );
          
          const recordMap = new Map(monthRecords.map(r => [r.date, r]));
          const daysInMonth = getDaysInMonth(year, month);
          const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

          return (
            <div
              key={monthIndex}
              className="bg-gray-50 rounded-lg p-2"
            >
              <div className="text-left mb-1">
                <p className="text-xs font-light">{month}月</p>
              </div>
              
              <div className="grid grid-cols-7 gap-px">
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
                      className="aspect-square bg-gray-200 overflow-hidden"
                      style={{ borderRadius: '1px' }}
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
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">显示前8个月预览</p>
    </motion.div>
  );
}
