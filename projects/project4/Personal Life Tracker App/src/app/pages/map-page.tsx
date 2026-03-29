import { useState, useEffect } from 'react';
import { StorageService, RecordData } from '../lib/storage';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/bottom-nav';
import { X, MapPin, Sparkles, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';

export function MapPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<RecordData[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<RecordData | null>(null);
  const [lastMonthMemory, setLastMonthMemory] = useState<RecordData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    const allRecords = StorageService.getRecords();
    setRecords(allRecords);
  }, []);

  // 提取城市名称（只保留省级或直辖市）
  const extractCity = (location: string | null): string | null => {
    if (!location) return null;
    
    // 匹配省、市、自治区、特别行政区
    const provinceMatch = location.match(/^(.+?(?:省|市|自治区|特别行政区))/);
    if (provinceMatch) {
      return provinceMatch[1];
    }
    
    return location;
  };

  // 按城市分组记录
  const groupedByCity = records.reduce((acc, record) => {
    const city = extractCity(record.location);
    if (city) {
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(record);
    }
    return acc;
  }, {} as Record<string, RecordData[]>);

  // 获取所有城市
  const cities = Object.keys(groupedByCity);

  // 随机回忆：随机抽取一条记录
  const handleRandomMemory = () => {
    if (records.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * records.length);
    setSelectedMemory(records[randomIndex]);
  };

  // 往月今日：获取上个月的今天
  const handleLastMonthToday = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    // 格式化为 YYYY-MM-DD
    const targetDate = lastMonth.toISOString().split('T')[0];
    
    // 查找匹配的记录
    const memory = records.find(r => r.date === targetDate);
    
    if (memory) {
      setLastMonthMemory(memory);
    } else {
      // 没有找到记录，显示一个空状态
      setLastMonthMemory({
        id: 'empty',
        date: targetDate,
        photo: '',
        text: '',
        location: null,
        coordinates: null
      });
    }
  };

  // 获取选中城市的记录
  const getCityRecords = (city: string) => {
    return groupedByCity[city].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <h1 className="text-3xl font-light tracking-tight mb-2">时空漫游</h1>
        <p className="text-xs text-gray-400 tracking-wider uppercase">TIME TRAVEL</p>
      </header>

      <div className="px-6 space-y-6">
        {/* 功能卡片 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 随机回忆 */}
          <motion.button
            onClick={handleRandomMemory}
            className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl p-6 text-white text-left relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
            <Sparkles className="w-6 h-6 mb-3 relative z-10" />
            <p className="text-sm font-light mb-1 relative z-10">随机回忆</p>
            <p className="text-xs opacity-70 relative z-10">Random Memory</p>
          </motion.button>

          {/* 往月今日 */}
          <motion.button
            onClick={handleLastMonthToday}
            className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 text-gray-900 text-left relative overflow-hidden border border-gray-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 rounded-full -mr-8 -mt-8" />
            <Calendar className="w-6 h-6 mb-3 relative z-10" />
            <p className="text-sm font-light mb-1 relative z-10">往月今日</p>
            <p className="text-xs text-gray-600 relative z-10">Last Month Today</p>
          </motion.button>
        </div>

        {/* 地点时间轴 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm text-gray-500 mb-4">地点时间轴 · {cities.length} 个地点</h2>
          
          {cities.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">暂无地点记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cities.map((city, index) => {
                const cityRecords = groupedByCity[city];
                
                return (
                  <motion.button
                    key={city}
                    onClick={() => setSelectedLocation(city)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-light">{city}</p>
                          <p className="text-xs text-gray-500">{cityRecords.length} 次记录</p>
                        </div>
                      </div>
                      <span className="text-gray-400">→</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* 随机回忆模态框 - 拍立得样式 */}
      <AnimatePresence>
        {selectedMemory && (
          <PolaroidModal
            record={selectedMemory}
            onClose={() => setSelectedMemory(null)}
            title="随机回忆"
          />
        )}
      </AnimatePresence>

      {/* 往月今日模态框 - 拍立得样式 */}
      <AnimatePresence>
        {lastMonthMemory && (
          <PolaroidModal
            record={lastMonthMemory}
            onClose={() => setLastMonthMemory(null)}
            title="往月今日"
          />
        )}
      </AnimatePresence>

      {/* 地点时间轴模态框 */}
      <AnimatePresence>
        {selectedLocation && (
          <LocationTimelineModal
            location={selectedLocation}
            records={getCityRecords(selectedLocation)}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

// 拍立得样式模态框
function PolaroidModal({ 
  record, 
  onClose,
  title 
}: { 
  record: RecordData; 
  onClose: () => void;
  title: string;
}) {
  const isEmpty = record.id === 'empty';

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateZ: -5 }}
        animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateZ: 5 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {title === '随机回忆' ? (
              <Sparkles className="w-5 h-5 text-gray-700" />
            ) : (
              <Calendar className="w-5 h-5 text-gray-700" />
            )}
            <h3 className="text-lg font-light">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Polaroid Card */}
        <div className="p-6">
          {isEmpty ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">这一天还没有记录</p>
              <p className="text-sm text-gray-400">{record.date}</p>
            </div>
          ) : (
            <div className="bg-white shadow-xl rounded-2xl p-4" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              {/* Date */}
              <div className="text-center mb-3">
                <p className="text-lg font-light text-gray-900">{record.date}</p>
              </div>

              {/* Photo */}
              <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                <img 
                  src={record.photo} 
                  alt={record.date}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="space-y-3">
                {record.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm font-light">{record.location}</p>
                  </div>
                )}
                
                {record.text && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{record.text}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// 地点时间轴模态框
function LocationTimelineModal({ 
  location, 
  records,
  onClose 
}: { 
  location: string; 
  records: RecordData[];
  onClose: () => void;
}) {
  const [selectedRecord, setSelectedRecord] = useState<RecordData | null>(null);

  const handleRecordClick = (record: RecordData) => {
    setSelectedRecord(record);
  };

  const handleBack = () => {
    setSelectedRecord(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h3 className="text-xl font-light">{location}</h3>
              <p className="text-xs text-gray-500">{records.length} 条记录</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Timeline */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${selectedRecord ? 'blur-md' : ''}`}>
          <div className="p-6 pb-16">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-8 w-px bg-gray-200" />
              
              <div className="space-y-6">
                {records.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    
                    <div className="flex-1 pb-2">
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRecordClick(record)}
                            className="w-20 aspect-square rounded-lg overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-gray-900 transition-all active:scale-95"
                          >
                            <img 
                              src={record.photo} 
                              alt={record.date}
                              className="w-full h-full object-cover"
                            />
                          </button>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">{record.date}</p>
                            {record.text && (
                              <p className="text-xs text-gray-600 line-clamp-3">
                                {record.text}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 浮动拍立得卡片 */}
        <AnimatePresence>
          {selectedRecord && (
            <div 
              className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
              onClick={handleBack}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateZ: -5 }}
                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateZ: 5 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-700" />
                    <h3 className="text-lg font-light">{location}</h3>
                  </div>
                  <button 
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Polaroid Card */}
                <div className="p-6">
                  <div className="bg-white shadow-xl rounded-2xl p-4" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                    {/* Date */}
                    <div className="text-center mb-3">
                      <p className="text-lg font-light text-gray-900">{selectedRecord.date}</p>
                    </div>

                    {/* Photo */}
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                      <img 
                        src={selectedRecord.photo} 
                        alt={selectedRecord.date}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                      {selectedRecord.location && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4" />
                          <p className="text-sm font-light">{selectedRecord.location}</p>
                        </div>
                      )}
                      
                      {selectedRecord.text && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedRecord.text}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}