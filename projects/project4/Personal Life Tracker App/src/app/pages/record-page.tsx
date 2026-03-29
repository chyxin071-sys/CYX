import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Camera, MapPin, Trash2, X } from 'lucide-react';
import { StorageService, RecordData } from '../lib/storage';
import { formatDate, extractDominantColor } from '../lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

// Sample images for demo
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1697220214526-7c06c06b3c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwbGlmZXN0eWxlfGVufDF8fHx8MTc3MTY5NDMwOHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1600120616210-f0af010134e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBuYXR1cmUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NzE2OTQzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1643875402004-22631ef914aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGNpdHklMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxNjU2NjY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1666079908235-5508cd2fa07f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwZWFjZWZ1bCUyMG1vcm5pbmd8ZW58MXx8fHwxNzcxNjk0MzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcxNjIwNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1598399929533-847def01aa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbiUyMGJlYWNofGVufDF8fHx8MTc3MTU3ODA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
];

export function RecordPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');
  const [record, setRecord] = useState<RecordData | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    photo: '',
    text: '',
    location: '',
  });
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const recordDate = date || formatDate(new Date());

  useEffect(() => {
    const existing = StorageService.getRecordByDate(recordDate);
    if (existing) {
      setRecord(existing);
      setFormData({
        photo: existing.photo,
        text: existing.text,
        location: existing.location || '',
      });
      if (existing.primaryColor) {
        setBackgroundColor(existing.primaryColor);
      }
      setMode('view');
    } else {
      setMode('create');
    }
  }, [recordDate]);

  useEffect(() => {
    if (formData.photo) {
      extractDominantColor(formData.photo).then(color => {
        setBackgroundColor(color);
      });
    }
  }, [formData.photo]);

  const handleSave = () => {
    if (!formData.photo) {
      toast.error('请选择一张照片');
      return;
    }

    const newRecord: RecordData = {
      id: record?.id || `record-${Date.now()}`,
      date: recordDate,
      photo: formData.photo,
      text: formData.text,
      location: formData.location,
      coordinates: {
        lat: 39.9 + Math.random() * 10,
        lng: 116.4 + Math.random() * 10,
      },
      primaryColor: backgroundColor,
      createdAt: Date.now(),
    };

    StorageService.saveRecord(newRecord);
    toast.success('保存成功');
    navigate('/');
  };

  const handleDelete = () => {
    if (record) {
      StorageService.deleteRecord(record.date);
      toast.success('删除成功');
      navigate('/');
    }
  };

  const selectSampleImage = (imageUrl: string) => {
    setFormData({ ...formData, photo: imageUrl });
    setShowImagePicker(false);
    
    // Auto-fetch location when selecting an image
    if (!formData.location) {
      // Mock geolocation - in real app would use navigator.geolocation
      const mockLocations = ['北京市朝阳区', '上海市浦东新区', '广州市天河区', '深圳市南山区', '杭州市西湖区'];
      const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      setFormData(prev => ({ ...prev, photo: imageUrl, location: randomLocation }));
      toast.success(`已自动定位：${randomLocation}`);
    }
  };

  if (mode === 'view' && !record) {
    return null;
  }

  const isEditing = mode === 'create' || mode === 'edit';

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{
        background: `linear-gradient(to bottom, ${backgroundColor}20, ${backgroundColor}08, #FFFFFF)`,
      }}
    >
      {/* Header */}
      <header className="px-4 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/50 rounded-full active:bg-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <h2 className="text-lg font-light">{recordDate}</h2>

        <div className="flex items-center gap-2">
          {mode === 'view' && (
            <>
              <button
                onClick={() => setMode('edit')}
                className="px-4 py-2 text-sm hover:bg-white/50 rounded-full active:bg-white transition-colors"
              >
                编辑
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full active:bg-red-100 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
          {isEditing && (
            <>
              <button
                onClick={() => mode === 'edit' ? setMode('view') : navigate('/')}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-white/50 rounded-full active:bg-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-full active:bg-gray-800 transition-colors"
              >
                保存
              </button>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 pb-8">
        {/* Photo Section */}
        <motion.div
          className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-xl relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {formData.photo ? (
            <div className="relative w-full h-full group">
              <img
                src={formData.photo}
                alt="Record"
                className="w-full h-full object-cover"
              />
              
              {/* Date Overlay - centered, white, semi-transparent */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span 
                  className="text-white text-2xl font-light tracking-wide"
                  style={{ 
                    opacity: 0.8,
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {new Date(recordDate).getDate()}
                </span>
              </div>
              
              {isEditing && (
                <button
                  onClick={() => setShowImagePicker(true)}
                  className="absolute inset-0 bg-black/50 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="w-12 h-12 text-white" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowImagePicker(true)}
              className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-4 active:bg-gray-100 transition-colors"
            >
              <Camera className="w-16 h-16 text-gray-400" />
              <p className="text-gray-500">点击添加照片</p>
            </button>
          )}
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          {isEditing ? (
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="写下今天的故事..."
              className="w-full h-40 px-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-400 resize-none text-base"
            />
          ) : (
            <div className="px-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl min-h-[160px]">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {record?.text || '暂无文字'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Location Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-gray-500" />
          </div>
          {isEditing ? (
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="添加地点"
              className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-400"
            />
          ) : (
            <span className="text-base text-gray-700">
              {record?.location || '未标记地点'}
            </span>
          )}
        </motion.div>
      </div>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-0"
          onClick={() => setShowImagePicker(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-4 pt-4 pb-3 border-b flex items-center justify-between">
              <h3 className="text-xl font-light">选择照片</h3>
              <button 
                onClick={() => setShowImagePicker(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="px-4 pt-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3 active:bg-gray-200 transition-colors">
                  <Camera className="w-10 h-10 text-gray-500" />
                  <span className="text-sm text-gray-600">拍照</span>
                </button>
                <button className="aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3 active:bg-gray-200 transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-500 rounded"></div>
                  </div>
                  <span className="text-sm text-gray-600">相册</span>
                </button>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-4">示例图片</p>
                <div className="grid grid-cols-2 gap-3">
                  {SAMPLE_IMAGES.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => selectSampleImage(img)}
                      className="aspect-[3/4] rounded-2xl overflow-hidden active:opacity-70 transition-opacity"
                    >
                      <img src={img} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}