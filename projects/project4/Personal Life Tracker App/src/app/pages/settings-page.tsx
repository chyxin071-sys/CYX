import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { BottomNav } from '../components/bottom-nav';
import { useNavigate } from 'react-router';

export function SettingsPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const settings = StorageService.getSettings();
    setUserName(settings.username);
    setTempName(settings.username);
  }, []);

  const handleSaveName = () => {
    StorageService.saveSettings({ username: tempName });
    setUserName(tempName);
    setIsEditingName(false);
    toast.success('用户名已更新');
  };

  const handleExportData = () => {
    const records = StorageService.getRecords();
    const dataStr = JSON.stringify(records, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life-records-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('数据导出成功');
  };

  const handleClearData = () => {
    if (window.confirm('确定要清除所有数据吗？此操作不可恢复。')) {
      localStorage.clear();
      toast.success('数据已清除');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="px-4 pt-12 pb-4">
        <h1 className="text-3xl font-light tracking-tight">设置</h1>
      </header>

      <div className="px-4 space-y-6">
        {/* Personal Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-light mb-3">个人信息</h2>
          
          <div className="bg-gray-50 rounded-3xl p-4">
            {isEditingName ? (
              <div className="p-4 bg-white rounded-2xl space-y-3">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="输入你的名字"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(false);
                    }}
                    className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl active:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveName}
                    className="flex-1 px-4 py-2 text-sm bg-gray-900 text-white rounded-xl active:bg-gray-800 transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl active:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium">用户名</p>
                  <p className="text-sm text-gray-500">{userName}</p>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            )}
          </div>
        </motion.section>

        {/* Data Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h2 className="text-lg font-light mb-3">数据管理</h2>
          
          <div className="space-y-3 bg-gray-50 rounded-3xl p-4">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">导出备份</p>
                  <p className="text-sm text-gray-500">备份所有记录数据</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={handleClearData}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl active:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="font-medium text-red-600">清除数据</p>
                  <p className="text-sm text-gray-500">删除所有本地数据</p>
                </div>
              </div>
              <span className="text-red-400">→</span>
            </button>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-light mb-3">关于</h2>
          
          <div className="bg-gray-50 rounded-3xl p-6">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              一款以"每日一图一文"为核心，融合空间轨迹分析的极简私密生活记录工具。
              帮助你在快节奏生活中捕捉瞬时幸福，通过时间与空间双维度的可视化，
              构建属于个人的"数字人生博物馆"。
            </p>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">版本 1.0.0</p>
              <p className="text-sm text-gray-500 mt-1">© 2026 生活记录</p>
            </div>
          </div>
        </motion.section>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="p-4 bg-blue-50 border border-blue-100 rounded-2xl"
        >
          <p className="text-sm text-blue-900 leading-relaxed">
            <strong>隐私提示：</strong> 所有数据存储在您的设备本地，我们不会收集或上传任何个人信息。
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}