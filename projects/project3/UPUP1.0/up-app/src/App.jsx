import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, User, Plus, Flame, Clock, Play, Square, X, 
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Activity, Trophy, RefreshCcw, 
  Dumbbell, Target, Search, Trash2, CheckCircle2, GripVertical,
  Calendar, Share, Camera, Pencil, Pause, Edit3, CalendarOff
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, PieChart, Pie, Cell } from 'recharts';
import BodyFatHistoryModal from './BodyFatHistoryModal';

// --- Global Data & Utils ---
 

const CHALLENGE_MODES = [
  { id: 'novice', name: '新手模式', en: 'NOVICE', desc: '轻松唤醒身体', time: '5min' },
  { id: 'evolution', name: '进阶模式', en: 'EVOLUTION', desc: 'N+1 动态进阶', time: '10min', recommended: true },
  { id: 'crazy', name: '疯狂模式', en: 'CRAZY', desc: '挑战极限燃脂', time: '20min' },
  { id: 'custom', name: '自定义', en: 'CUSTOM', desc: '专属训练计划', time: 'Free' },
];

// 扩充任务池以支持 3 天不重复的逻辑 (每日单动作随机)
const TASK_POOL = {
  novice: [
    '20个深蹲 × 2组', '15个跪姿俯卧撑 × 2组', '20个卷腹 × 2组', '30秒平板支撑 × 2组',
    '20个臀桥 × 2组', '30秒靠墙静蹲 × 2组', '20个弓步蹲 × 2组', '30秒高抬腿 × 2组',
    '15个俯卧撑 × 2组', '20个仰卧起坐 × 2组', '30秒登山跑 × 2组', '20个侧弓步 × 2组',
    '20个俄罗斯转体 × 2组'
  ],
  evolution: [
    '30个深蹲 × 3组', '20个卷腹 × 3组', '1分钟平板支撑 × 3组', '30个弓步蹲 × 3组',
    '25个俯卧撑 × 3组', '30个仰卧抬腿 × 3组', '40个深蹲 × 3组', '30秒登山跑 × 3组',
    '20个引体向上 × 3组', '30个俯卧撑 × 3组', '50个深蹲 × 3组', '30个跳深蹲 × 3组',
    '1分钟靠墙静蹲 × 3组', '40个俄罗斯转体 × 3组'
  ],
  crazy: [
    '50个俯卧撑 × 4组', '50个深蹲 × 4组', '50个卷腹 × 4组', '1分钟平板支撑 × 4组',
    '20个引体向上 × 5组', '30个双杠臂屈伸 × 4组', '40个俯卧撑 × 4组', '40个深蹲 × 4组',
    '100个俯卧撑 × 1组', '100个深蹲 × 1组', '100个卷腹 × 1组', '平板支撑2分钟 × 5组',
    '50个仰卧抬腿 × 4组', '50个俄罗斯转体 × 4组', '80个深蹲 × 4组', '60个弓步跳 × 4组',
    '60个俯卧撑 × 4组', '1分钟登山跑 × 4组'
  ],
  custom: [
    '我的专属训练 A',
    '我的专属训练 B'
  ]
};

// 静态动作库
const STATIC_EXERCISE_DB = {
  anaerobic: {
    '胸部': [{ name: '平板卧推', equip: '杠铃' }, { name: '上斜卧推', equip: '杠铃' }, { name: '下斜卧推', equip: '杠铃' }, { name: '窄距卧推', equip: '杠铃' }, { name: '平板哑铃卧推', equip: '哑铃' }, { name: '上斜哑铃卧推', equip: '哑铃' }, { name: '平板飞鸟', equip: '哑铃' }, { name: '上斜飞鸟', equip: '哑铃' }, { name: '绳索夹胸高位到低位的', equip: '绳索' }, { name: '绳索夹胸低位到高位的', equip: '绳索' }, { name: '蝴蝶机夹胸', equip: '器械' }, { name: '器械推胸', equip: '器械' }, { name: '上斜器械推胸', equip: '器械' }, { name: '标准俯卧撑', equip: '自重' }, { name: '宽距俯卧撑', equip: '自重' }, { name: '双杠臂屈伸', equip: '自重' }],
    '背部': [{ name: '传统硬拉', equip: '杠铃' }, { name: '杠铃划船', equip: '杠铃' }, { name: '罗马尼亚硬拉', equip: '杠铃' }, { name: '单臂哑铃划船', equip: '哑铃' }, { name: '哑铃直腿硬拉', equip: '哑铃' }, { name: '高位下拉宽握', equip: '绳索' }, { name: '高位下拉窄握V把', equip: '绳索' }, { name: '坐姿绳索划船', equip: '绳索' }, { name: '直臂下压', equip: '绳索' }, { name: '坐姿划船机', equip: '器械' }, { name: '高位下拉机', equip: '器械' }, { name: '引体向上正握', equip: '自重' }, { name: '引体向上反握', equip: '自重' }, { name: '反向划船', equip: '自重' }],
    '肩部': [{ name: '站姿推举', equip: '杠铃' }, { name: '坐姿推举', equip: '杠铃' }, { name: '杠铃直立划船', equip: '杠铃' }, { name: '坐姿哑铃推举', equip: '哑铃' }, { name: '哑铃侧平举', equip: '哑铃' }, { name: '哑铃前平举', equip: '哑铃' }, { name: '哑铃俯身飞鸟', equip: '哑铃' }, { name: '绳索面拉', equip: '绳索' }, { name: '绳索侧平举', equip: '绳索' }, { name: '器械推举', equip: '器械' }, { name: '器械反向飞鸟', equip: '器械' }, { name: '倒立撑辅助', equip: '自重' }, { name: '折刀俯卧撑', equip: '自重' }],
    '二头肌': [{ name: '杠铃弯举站姿', equip: '杠铃' }, { name: '杠铃弯举坐姿', equip: '杠铃' }, { name: '哑铃弯举站姿', equip: '哑铃' }, { name: '哑铃锤式弯举', equip: '哑铃' }, { name: '哑铃集中弯举', equip: '哑铃' }, { name: '上斜哑铃弯举', equip: '哑铃' }, { name: '绳索弯举', equip: '绳索' }, { name: '绳索锤式弯举', equip: '绳索' }, { name: '器械弯举', equip: '器械' }, { name: '反握引体向上', equip: '自重' }],
    '三头肌': [{ name: '窄距卧推', equip: '杠铃' }, { name: '杠铃仰卧臂屈伸', equip: '杠铃' }, { name: '哑铃仰卧臂屈伸', equip: '哑铃' }, { name: '哑铃过顶臂屈伸', equip: '哑铃' }, { name: '哑铃单臂后摆', equip: '哑铃' }, { name: '绳索下压直杆或V把', equip: '绳索' }, { name: '绳索过顶臂屈伸', equip: '绳索' }, { name: '器械臂屈伸', equip: '器械' }, { name: '双杠臂屈伸', equip: '自重' }, { name: '窄距俯卧撑', equip: '自重' }, { name: '板凳臂屈伸', equip: '自重' }],
    '腿部': [{ name: '深蹲', equip: '杠铃' }, { name: '前蹲', equip: '杠铃' }, { name: '罗马尼亚硬拉', equip: '杠铃' }, { name: '臀推', equip: '杠铃' }, { name: '弓步蹲', equip: '杠铃' }, { name: '哑铃高脚杯深蹲', equip: '哑铃' }, { name: '哑铃保加利亚分腿蹲', equip: '哑铃' }, { name: '哑铃罗马尼亚硬拉', equip: '哑铃' }, { name: '哑铃臀推', equip: '哑铃' }, { name: '绳索后摆', equip: '绳索' }, { name: '腿举', equip: '器械' }, { name: '腿伸展', equip: '器械' }, { name: '腿弯举', equip: '器械' }, { name: '髋外展', equip: '器械' }, { name: '徒手深蹲', equip: '自重' }, { name: '徒手弓步蹲', equip: '自重' }, { name: '徒手臀桥', equip: '自重' }, { name: '徒手保加利亚分腿蹲', equip: '自重' }],
    '小腿': [{ name: '杠铃站姿提踵', equip: '杠铃' }, { name: '哑铃单腿提踵', equip: '哑铃' }, { name: '站姿提踵机', equip: '器械' }, { name: '坐姿提踵机', equip: '器械' }, { name: '自重站姿提踵', equip: '自重' }, { name: '台阶提踵', equip: '自重' }],
    '斜方肌': [{ name: '杠铃耸肩', equip: '杠铃' }, { name: '杠铃直立划船', equip: '杠铃' }, { name: '哑铃耸肩', equip: '哑铃' }, { name: '绳索耸肩', equip: '绳索' }],
    '前臂': [{ name: '杠铃腕弯举', equip: '杠铃' }, { name: '杠铃腕伸', equip: '杠铃' }, { name: '农夫行走', equip: '杠铃' }, { name: '哑铃腕弯举', equip: '哑铃' }, { name: '哑铃锤式弯举', equip: '哑铃' }, { name: '悬垂单杠', equip: '自重' }, { name: '毛巾悬垂', equip: '自重' }],
    '腹部': [{ name: '卷腹', equip: '自重' }, { name: '仰卧起坐', equip: '自重' }, { name: '悬垂举腿', equip: '自重' }, { name: '平板支撑', equip: '自重' }, { name: '俄罗斯转体', equip: '自重' }, { name: '死虫式', equip: '自重' }, { name: '绳索卷腹', equip: '绳索' }, { name: '器械卷腹', equip: '器械' }],
    '臀部': [{ name: '杠铃臀推', equip: '杠铃' }, { name: '杠铃罗马尼亚硬拉', equip: '杠铃' }, { name: '杠铃深蹲', equip: '杠铃' }, { name: '哑铃臀推', equip: '哑铃' }, { name: '哑铃罗马尼亚硬拉', equip: '哑铃' }, { name: '哑铃单腿硬拉', equip: '哑铃' }, { name: '绳索后摆', equip: '绳索' }, { name: '臀推机', equip: '器械' }, { name: '髋外展机', equip: '器械' }, { name: '徒手臀桥', equip: '自重' }, { name: '徒手单腿臀桥', equip: '自重' }, { name: '徒手臀推', equip: '自重' }, { name: '弹力带臀桥', equip: '弹力带' }, { name: '弹力带侧向行走', equip: '弹力带' }, { name: '弹力带蚌式开合', equip: '弹力带' }],
    '核心稳定': [{ name: '平板支撑', equip: '自重' }, { name: '侧平板支撑', equip: '自重' }, { name: '死虫式', equip: '自重' }, { name: '鸟狗式', equip: '自重' }, { name: '滚轮前推', equip: '自重' }, { name: 'L-sit', equip: '自重' }, { name: '土耳其起立', equip: '哑铃' }, { name: '哑铃风车', equip: '哑铃' }, { name: 'Pallof推举抗旋转', equip: '绳索' }],
    '功能性': [{ name: '壶铃摇摆', equip: '壶铃' }, { name: '壶铃高翻', equip: '壶铃' }, { name: '壶铃抓举', equip: '壶铃' }, { name: '药球摔砸', equip: '药球' }, { name: '药球抛掷', equip: '药球' }, { name: '波比跳', equip: '自重' }, { name: '箱跳', equip: '自重' }, { name: '登山者', equip: '自重' }, { name: '深蹲跳', equip: '自重' }, { name: '开合跳', equip: '自重' }, { name: '哑铃抓举', equip: '哑铃' }, { name: '哑铃摇摆', equip: '哑铃' }]
  },
  aerobic: {
    '跑步': [{ name: '跑步机慢跑', equip: '无' }, { name: '室外慢跑', equip: '无' }, { name: '冲刺跑', equip: '无' }],
    '骑行': [{ name: '动感单车', equip: '无' }, { name: '室外骑行', equip: '无' }],
    '划船': [{ name: '划船机', equip: '无' }],
    '其他': [{ name: '椭圆机', equip: '无' }, { name: '跳绳', equip: '无' }, { name: '游泳', equip: '无' }]
  },
  stretch: {
    '静态拉伸': [{ name: '胸部拉伸', equip: '无' }, { name: '背部拉伸', equip: '无' }, { name: '腘绳肌拉伸', equip: '无' }, { name: '股四头肌拉伸', equip: '无' }, { name: '臀部拉伸', equip: '无' }, { name: '肩部拉伸', equip: '无' }],
    '动态拉伸': [{ name: '手臂画圈', equip: '无' }, { name: '腿部摆动', equip: '无' }, { name: '弓步行走', equip: '无' }, { name: '世界上最伟大的拉伸', equip: '无' }],
    '瑜伽': [{ name: '下犬式', equip: '无' }, { name: '婴儿式', equip: '无' }, { name: '猫牛式', equip: '无' }, { name: '仰卧扭转', equip: '无' }],
    '泡沫轴': [{ name: '背部放松', equip: '无' }, { name: '臀部放松', equip: '无' }, { name: '大腿放松', equip: '无' }, { name: '小腿放松', equip: '无' }]
  }
};

const getEquipTypes = (type) => {
  if (type === 'anaerobic') return ['全部', '杠铃', '哑铃', '器械', '绳索', '自重', '壶铃', '药球', '弹力带'];
  return ['全部'];
};

const triggerCompletionEffects = () => {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  const colors = ['#E8F583', '#F0C7FF', '#AD9BF0', '#FFFFFF'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.left = '50%';
    p.style.top = '55%';
    p.style.width = `${Math.random() * 8 + 4}px`;
    p.style.height = p.style.width;
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.borderRadius = '50%';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '9999';
    document.body.appendChild(p);
    const angle = Math.random() * Math.PI * 2;
    const velocity = 80 + Math.random() * 150;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    p.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
    ], { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }).onfinish = () => p.remove();
  }
};

const getMuscleSummary = (exs, type) => {
  const typeMap = { 'anaerobic': '无氧训练', 'aerobic': '有氧训练', 'stretch': '拉伸恢复' };
  if (type !== 'anaerobic') return typeMap[type] || '训练';
  
  const muscles = new Set();
  exs.forEach(ex => {
    if (ex.isCustom && ex.muscle) {
      muscles.add(ex.muscle);
      return;
    }
    for (const [muscleGroup, list] of Object.entries(STATIC_EXERCISE_DB.anaerobic)) {
      if (list.find(item => item.name === ex.name)) {
        muscles.add(muscleGroup);
        break;
      }
    }
  });

  if (muscles.size === 0) return '综合力量训练';
  const arr = Array.from(muscles);
  return arr.slice(0, 3).join('/') + (arr.length > 3 ? '等' : '');
};

const getCardioTypeLabel = (entry) => {
  if (!entry || !Array.isArray(entry.exercises) || entry.exercises.length === 0) return '有氧训练';
  const first = entry.exercises[0];
  const name = (first && first.name) ? String(first.name) : '';
  if (!name) return '有氧训练';
  if (name.includes('游泳')) return '游泳';
  if (name.includes('划船')) return '划船';
  if (name.includes('骑行') || name.includes('单车') || name.includes('自行车')) return '骑行';
  if (name.includes('跑步') || name.includes('慢跑') || name.includes('冲刺')) return '跑步';
  return '有氧训练';
};

const getEntryTypeLabel = (entry) => {
  if (!entry) return '训练';
  const tag = entry.trainTag || entry.type || '';
  if (tag === 'anaerobic' || tag === '无氧训练') return '无氧训练';
  if (tag === 'stretch' || tag === '拉伸恢复') return '拉伸恢复';
  if (tag === 'aerobic' || tag === '有氧训练') return getCardioTypeLabel(entry);
  if (tag === 'challenge' || tag === 'Challenge') return '挑战';
  if (entry.type) return entry.type;
  if (tag) return tag;
  return '训练';
};

const ACTIVITY_LIBRARY = {
  RUNNING_MID: 8.0,
  SWIMMING: 7.0,
  WEIGHT_LIFTING: 6.0,
  GENERAL_CARDIO: 6.0,
  LIGHT_CARDIO: 4.0,
  BODYWEIGHT_STRENGTH: 5.0
};

const MODE_INTENSITY_FACTOR = {
  novice: 0.8,
  evolution: 1.0,
  crazy: 1.2,
  custom: 1.0
};

const calculateCalories = (activityKey, weightKg, durationMin, isAnaerobic = false, modeId = 'evolution') => {
  const metBase = ACTIVITY_LIBRARY[activityKey] || 5.0;
  const intensityFactor = MODE_INTENSITY_FACTOR[modeId] ?? 1.0;
  const met = metBase * intensityFactor;
  const hours = durationMin / 60;
  let calories = met * weightKg * hours;
  if (isAnaerobic) {
    const epocBonus = 1.15;
    calories *= epocBonus;
  }
  return Math.round(calories);
};

const computeTrainingKcalCore = (t, weightKg) => {
  if (!t || !weightKg || Number.isNaN(weightKg)) return 0;

  let durationMin = 0;
  if (t.duration) {
    const parts = String(t.duration).split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      durationMin = mins + secs / 60;
    } else {
      durationMin = parseFloat(t.duration) || 0;
    }
  } else if (typeof t.trainingTime === 'number' && t.trainingTime > 0) {
    durationMin = t.trainingTime / 60;
  }
  if (!durationMin || durationMin <= 0) return 0;

  const tag = t.trainTag || (t.type === '无氧训练' ? 'anaerobic' : t.type === '有氧训练' ? 'aerobic' : t.type === '拉伸恢复' ? 'stretch' : '');
  const isAnaerobic = tag === 'anaerobic';
  const activityKey = tag === 'aerobic' || tag === 'stretch' ? 'RUNNING_MID' : 'WEIGHT_LIFTING';
  const modeId = t.modeId || 'evolution';
  return calculateCalories(activityKey, weightKg, durationMin, isAnaerobic, modeId);
};

const computeTrainingKcal = (t) => {
  if (!t) return 0;

  let weightKg = 0;
  if (t.weight !== undefined && t.weight !== null && t.weight !== '') {
    const w = parseFloat(t.weight);
    if (!Number.isNaN(w) && w > 0) weightKg = w;
  }
  if (!weightKg) {
    try {
      const raw = localStorage.getItem('fitnessApp_profile');
      if (raw) {
        const profile = JSON.parse(raw);
        if (profile && profile.weight !== undefined && profile.weight !== null && profile.weight !== '') {
          const w = parseFloat(profile.weight);
          if (!Number.isNaN(w) && w > 0) weightKg = w;
        }
      }
    } catch {}
  }
  if (!weightKg || Number.isNaN(weightKg)) return 0;
  return computeTrainingKcalCore(t, weightKg);
};

const computeTrainingKcalWithWeight = (t, weightOverride) => {
  const w = parseFloat(weightOverride);
  if (!w || Number.isNaN(w) || w <= 0) return 0;
  return computeTrainingKcalCore(t, w);
};

// --- Components ---

const Toast = ({ message, visible, position = 'top' }) => {
  const isCenter = position === 'center';
  const baseTransform = isCenter ? '-translate-y-1/2' : '';
  const enterTransform = isCenter ? 'scale-100' : 'translate-y-0';
  const exitTransform = isCenter ? 'scale-90' : '-translate-y-4';
  
  return (
    <div className={`fixed ${isCenter ? 'top-1/2' : 'top-12'} left-1/2 -translate-x-1/2 bg-[#E8F583] text-[#202020] px-6 py-3 rounded-full font-bold shadow-[0_10px_30px_rgba(232,245,131,0.3)] transition-all duration-300 z-[99999] flex items-center gap-2 ${visible ? `opacity-100 ${baseTransform} ${enterTransform}` : `opacity-0 ${baseTransform} ${exitTransform} pointer-events-none`}`}>
      <CheckCircle2 size={18} />
      {message}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [showTrainingTypeDrawer, setShowTrainingTypeDrawer] = useState(false);
  const [showActionSelector, setShowActionSelector] = useState(false);
  const [showActiveTraining, setShowActiveTraining] = useState(false);
  const [showEndSummary, setShowEndSummary] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [shouldShowCountdown, setShouldShowCountdown] = useState(false);
  const [showWeightHistory, setShowWeightHistory] = useState(false);
  const [showBodyFatHistory, setShowBodyFatHistory] = useState(false);
  
  const [activeChallengeState, setActiveChallengeState] = useState(null); 
  
  // App State
  const [selectedModeId, setSelectedModeId] = useState('evolution'); 
  const [isCustomDaily, setIsCustomDaily] = useState(false);
  const [customTaskText, setCustomTaskText] = useState('我的专属挑战 100个俯卧撑'); 
  const [activeTaskText, setActiveTaskText] = useState(''); 
  const [recentChallenges, setRecentChallenges] = useState([]); 
  const [lastChallengeDuration, setLastChallengeDuration] = useState('00:00');
  
  const [profileData, setProfileData] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // PR Tracking
  const [personalRecords, setPersonalRecords] = useState({});

  // Training Flow State & Global Timer
  const [currentTrainingType, setCurrentTrainingType] = useState(''); 
  const [activeExercises, setActiveExercises] = useState([]);
  const [todayTrainings, setTodayTrainings] = useState([]); 
  const [history, setHistory] = useState([]);
  
  const [isTrainingOngoing, setIsTrainingOngoing] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [trainingTime, setTrainingTime] = useState(0);

  const [streak, setStreak] = useState(0);
  const [isChallengeCompletedToday, setIsChallengeCompletedToday] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
  const [toastMsg, setToastMsg] = useState({ text: '', visible: false, position: 'top' });
  const [customExercises, setCustomExercises] = useState([]);
  const [showChallengeSummary, setShowChallengeSummary] = useState(false);
  const [challengeJournal, setChallengeJournal] = useState(null);
  const [showPosterPreview, setShowPosterPreview] = useState(false);
  const [posterPayload, setPosterPayload] = useState(null);
  const openPoster = (payload) => { setPosterPayload(payload); setShowPosterPreview(true); };
  const [newTrainingTargetDate, setNewTrainingTargetDate] = useState(null);
  const [showReportCenter, setShowReportCenter] = useState(false);
  const [reportRange, setReportRange] = useState('week'); // 'week' | 'month' | 'year'
  const [reportAnchor, setReportAnchor] = useState(new Date());
  const openMonthlyReportFor = (year, monthIndex0) => {
    const s = getStats();
    const dStore = getDaily();
    const mNum = String(monthIndex0 + 1).padStart(2, '0');
    const monthKey = `${year}-${mNum}`;
    const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();
    let challengeDays = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = String(d).padStart(2, '0');
      const dayKey = `${year}-${mNum}-${dStr}`;
      const dd = dStore[dayKey];
      const done = !!(dd && (dd.training || dd.challenge));
      if (dd && dd.challenge) challengeDays += 1;
      if (done) {
        currentStreak += 1;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }
    const stats = {
      checkins: s.months?.[monthKey]?.days || 0,
      sessions: s.months?.[monthKey]?.sessions || 0,
      challengeDays,
      kcal: s.months?.[monthKey]?.kcal || 0,
      longestStreak
    };
    openPoster({
      type: 'monthly',
      profile: profileData,
      date: new Date(year, monthIndex0, 1),
      stats
    });
  };
  useEffect(() => {
    // 暴露导出预览方法与资料给子层（如月历弹窗内部按钮使用）
    window.__openPoster = openPoster;
    window.__profileData = profileData;
    return () => {
      try { delete window.__openPoster; delete window.__profileData; } catch {}
    };
  }, [profileData]);

  useEffect(() => {
    // 暴露给月历弹窗头部按钮调用
    window.__openMonthlyReportFor = openMonthlyReportFor;
    return () => { try { delete window.__openMonthlyReportFor; } catch(_) {} };
  }, [profileData]);
  const openMonthlyReport = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth()+1).padStart(2,'0');
    const s = getStats();
    const monthKey = `${y}-${m}`;
    const stats = {
      days: s.months?.[monthKey]?.days || 0,
      sessions: s.months?.[monthKey]?.sessions || 0,
      kcal: s.months?.[monthKey]?.kcal || 0,
      prCount: s.months?.[monthKey]?.prCount || 0,
      totalDays: s.totalDays || 0
    };
    openPoster({
      type: 'monthly',
      profile: profileData,
      date: now,
      stats
    });
  };

  const isTrainingCompletedToday = todayTrainings.length > 0;
  const isAnyCompleted = isChallengeCompletedToday || isTrainingCompletedToday;

  const getStats = () => {
    const raw = localStorage.getItem('fitnessApp_stats');
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed.months) parsed.months = {};
    return parsed;
  };
  const setStats = (s) => {
    localStorage.setItem('fitnessApp_stats', JSON.stringify(s));
  };
  const getDaily = () => {
    const raw = localStorage.getItem('fitnessApp_daily');
    return raw ? JSON.parse(raw) : {};
  };

  const computeCurrentStreakFromDaily = (store) => {
    if (!store || typeof store !== 'object') return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let count = 0;
    const maxDays = 3650;
    for (let i = 0; i < maxDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${dd}`;
      const v = store[key];
      const done = !!(v && (v.training || v.challenge));
      if (!done) break;
      count += 1;
    }
    return count;
  };

  const setDaily = (d) => {
    localStorage.setItem('fitnessApp_daily', JSON.stringify(d));
    try {
      const current = computeCurrentStreakFromDaily(d);
      setStreak(current);
    } catch {}
  };

  const updateWeightForDate = (targetDate, newWeight, skipProfileSync = false) => {
    if (!targetDate) return;
    // Allow deletion: newWeight === null
    if (newWeight !== null && !newWeight && newWeight !== 0) return;

    const d = new Date(targetDate);
    if (Number.isNaN(d.getTime())) return;
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    const dStore = getDaily();
    const s = getStats();
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    const monthKey = `${y}-${m}`;
    const dayKey = `${y}-${m}-${dd}`;
    const day = dStore[dayKey] || {};

    let numericWeight = null;
    if (newWeight !== null) {
      numericWeight = parseFloat(newWeight);
      if (!Number.isFinite(numericWeight) || numericWeight <= 0) return;
      day.weight = numericWeight;

      // Sync to profile if updating today's weight
      if (isToday && !skipProfileSync) {
        const newProfile = { ...(profileData || {}), weight: numericWeight };
        setProfileData(newProfile);
        localStorage.setItem('fitnessApp_profile', JSON.stringify(newProfile));
      }
    } else {
      delete day.weight;
    }
    dStore[dayKey] = day;

    let trainingKcalOld = 0;
    let trainingKcalNew = 0;
    const updatedHistory = (history || []).map(h => {
      try {
        if (new Date(h.date).toDateString() !== d.toDateString()) return h;
      } catch {
        return h;
      }
      
      trainingKcalOld += computeTrainingKcal(h);

      const newItem = { ...h };
      if (numericWeight !== null) {
        newItem.weight = numericWeight;
      } else {
        delete newItem.weight;
      }
      
      const newK = computeTrainingKcal(newItem);
      trainingKcalNew += newK;
      newItem.kcal = newK;
      return newItem;
    });

    const originalDayKcal = day.kcal || trainingKcalOld;
    const challengeKcalOld = originalDayKcal - trainingKcalOld;
    const newDayKcal = challengeKcalOld + trainingKcalNew;
    const diffKcal = newDayKcal - (day.kcal || 0);

    day.kcal = newDayKcal;
    dStore[dayKey] = day;
    setDaily(dStore);

    if (!s.months[monthKey]) s.months[monthKey] = { days: 0, sessions: 0, kcal: 0, prCount: 0 };
    s.months[monthKey].kcal = (s.months[monthKey].kcal || 0) + diffKcal;
    setStats(s);

    setHistory(updatedHistory);
    localStorage.setItem('fitnessApp_history', JSON.stringify(updatedHistory));

    if (isToday) {
      setTodayTrainings(prev => prev.map(t => {
        if (!t.date) return t;
        try {
          if (new Date(t.date).toDateString() === d.toDateString()) {
             const nt = { ...t };
             if (numericWeight !== null) nt.weight = numericWeight;
             else delete nt.weight;
             return nt;
          }
          return t;
        } catch {
          return t;
        }
      }));
    }
  };
  const estimateKcalFromTraining = (t) => computeTrainingKcal(t);
  const updateStatsOnTraining = (t, dateOverride) => {
    const s = getStats();
    const dStore = getDaily();
    const nowRef = dateOverride ? new Date(dateOverride) : new Date();
    const y = nowRef.getFullYear();
    const m = String(nowRef.getMonth()+1).padStart(2,'0');
    const d = String(nowRef.getDate()).padStart(2,'0');
    const monthKey = `${y}-${m}`;
    const dayKey = `${y}-${m}-${d}`;
    if (!s.months[monthKey]) s.months[monthKey] = { days: 0, sessions: 0, kcal: 0, prCount: 0 };
    if (s.lastCheckin !== dayKey) {
      s.totalDays = (s.totalDays || 0) + 1;
      s.months[monthKey].days += 1;
      s.lastCheckin = dayKey;
    }
    s.totalSessions = (s.totalSessions || 0) + 1;
    s.months[monthKey].sessions += 1;
    const kcal = estimateKcalFromTraining(t);
    s.months[monthKey].kcal += kcal;
    setStats(s);
    const dd = dStore[dayKey] || {};
    dd.training = true;
    dd.sessions = (dd.sessions || 0) + 1;
    dd.kcal = (dd.kcal || 0) + kcal;
    dd.duration = (dd.duration || 0) + Math.max(0, (() => {
      if (!t || !t.duration) return 0;
      const parts = String(t.duration).split(':');
      if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      return parseInt(t.duration) || 0;
    })());
    dStore[dayKey] = dd;
    setDaily(dStore);
  };
  const updateStatsOnChallenge = (durationMMSS) => {
    const s = getStats();
    const dStore = getDaily();
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth()+1).padStart(2,'0');
    const d = String(now.getDate()).padStart(2,'0');
    const monthKey = `${y}-${m}`;
    const dayKey = `${y}-${m}-${d}`;
    if (!s.months[monthKey]) s.months[monthKey] = { days: 0, sessions: 0, kcal: 0, prCount: 0 };
    if (s.lastCheckin !== dayKey) {
      s.totalDays = (s.totalDays || 0) + 1;
      s.months[monthKey].days += 1;
      s.lastCheckin = dayKey;
    }
    s.totalSessions = (s.totalSessions || 0) + 1;
    s.months[monthKey].sessions += 1;

    const weightKg = parseFloat(profileData?.weight || 65);
    let durationMin = 0;
    if (durationMMSS) {
      const parts = String(durationMMSS).split(':');
      const mins = parts.length === 2 ? (parseInt(parts[0]) || 0) : 0;
      const secs = parts.length === 2 ? (parseInt(parts[1]) || 0) : 0;
      durationMin = mins + secs / 60;
    }
    if (!durationMin) {
      const mode = CHALLENGE_MODES.find(v => v.id === selectedModeId);
      if (mode && typeof mode.time === 'string' && mode.time.endsWith('min')) {
        const baseMin = parseFloat(mode.time) || 0;
        durationMin = baseMin;
      } else {
        durationMin = 10;
      }
    }
    const challengeKcal = calculateCalories('BODYWEIGHT_STRENGTH', weightKg, durationMin, true, selectedModeId);

    s.months[monthKey].kcal += challengeKcal;
    setStats(s);
    const dd = dStore[dayKey] || {};
    dd.challenge = true;
    dd.challengeText = activeTaskText || '挑战完成';
    dd.challengeDuration = durationMMSS || null;
    dd.modeId = selectedModeId; // Save modeId for history reconstruction
    dd.sessions = (dd.sessions || 0) + 1;
    dd.kcal = (dd.kcal || 0) + challengeKcal;
    dd.duration = (dd.duration || 0) + durationMin;
    dStore[dayKey] = dd;
    setDaily(dStore);
  };
  const rebuildFromHistory = (list) => {
    const now = new Date();
    const s = { months: {}, totalDays: 0, totalSessions: 0, lastCheckin: '' };
    const dStore = {};
    const seenDays = new Set();
    const kcalOf = (t) => estimateKcalFromTraining(t);
    (Array.isArray(list) ? list : []).forEach(item => {
      try {
        const d = new Date(item.date);
        if (isNaN(d.getTime()) || d > now) return;
        const y = d.getFullYear();
        const m = String(d.getMonth()+1).padStart(2,'0');
        const dd = String(d.getDate()).padStart(2,'0');
        const monthKey = `${y}-${m}`;
        const dayKey = `${y}-${m}-${dd}`;
        if (!s.months[monthKey]) s.months[monthKey] = { days: 0, sessions: 0, kcal: 0, prCount: 0 };
        s.months[monthKey].sessions += 1;
        const kcal = kcalOf(item);
        s.months[monthKey].kcal += kcal;
        if (!seenDays.has(dayKey)) {
          s.months[monthKey].days += 1;
          s.totalDays += 1;
          s.lastCheckin = dayKey;
          seenDays.add(dayKey);
        }
        s.totalSessions += 1;
        const ddObj = dStore[dayKey] || {};
        ddObj.training = true;
        ddObj.sessions = (ddObj.sessions || 0) + 1;
        ddObj.kcal = (ddObj.kcal || 0) + kcal;
        ddObj.duration = (ddObj.duration || 0) + (() => {
          if (!item || !item.duration) return 0;
          const parts = String(item.duration).split(':');
          if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
          return parseInt(item.duration) || 0;
        })();
        dStore[dayKey] = ddObj;
      } catch {}
    });
    setStats(s);
    setDaily(dStore);
    setHistory(Array.isArray(list) ? list : []);
  };
  useEffect(() => {
    let interval = null;
    if (isTrainingOngoing) {
      interval = setInterval(() => setTrainingTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTrainingOngoing]);

  useEffect(() => {
    const savedCustom = localStorage.getItem('fitnessApp_customExercises');
    if (savedCustom) setCustomExercises(JSON.parse(savedCustom));

    const savedPRs = localStorage.getItem('fitnessApp_PRs');
    if (savedPRs) setPersonalRecords(JSON.parse(savedPRs));
    const savedProfile = localStorage.getItem('fitnessApp_profile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }

    const savedHistory = localStorage.getItem('fitnessApp_history');
    const now = new Date();
    let arr = [];
    try { arr = savedHistory ? JSON.parse(savedHistory) : []; } catch { arr = []; }
    const filtered = Array.isArray(arr) ? arr.filter(it => {
      try { return new Date(it.date) <= now; } catch { return false; }
    }) : [];
    if (filtered.length !== arr.length) {
      localStorage.setItem('fitnessApp_history', JSON.stringify(filtered));
    }
    rebuildFromHistory(filtered);
  }, []);

  const saveCustomExercise = (newEx) => {
    let item = null;
    if (newEx.id) {
      const updated = customExercises.map(e => {
        if (e.id === newEx.id) {
          item = { ...e, ...newEx };
          return item;
        }
        return e;
      });
      if (!item) {
        item = { ...newEx, id: newEx.id, isCustom: true };
        updated.push(item);
      }
      setCustomExercises(updated);
      localStorage.setItem('fitnessApp_customExercises', JSON.stringify(updated));
      showToast("自定义动作已更新");
      return item;
    }
    item = { ...newEx, id: Date.now(), isCustom: true };
    const updated = [...customExercises, item];
    setCustomExercises(updated);
    localStorage.setItem('fitnessApp_customExercises', JSON.stringify(updated));
    showToast("自定义动作已保存");
    return item;
  };

  const deleteCustomExercise = (id) => {
    const updated = customExercises.filter(e => e.id !== id);
    setCustomExercises(updated);
    localStorage.setItem('fitnessApp_customExercises', JSON.stringify(updated));
  };

  const showToast = (text, opts) => {
    const position = opts?.position || 'top';
    setToastMsg({ text, visible: true, position });
    setTimeout(() => setToastMsg({ text: '', visible: false, position: 'top' }), 2500);
  };

  // PR Handler
  const checkAndUpdatePR = (exName, weight, unit) => {
    const weightKg = unit === 'lbs' ? weight * 0.453592 : weight;
    const roundedKg = Math.round(weightKg * 10) / 10;
    const currentPR = personalRecords[exName] || 0;
    
    if (roundedKg > currentPR) {
      const newPRs = { ...personalRecords, [exName]: roundedKg };
      setPersonalRecords(newPRs);
      localStorage.setItem('fitnessApp_PRs', JSON.stringify(newPRs));
      showToast(`🎉 新纪录！${exName} ${roundedKg}kg`, { position: 'center' });
      triggerCompletionEffects();
      const s = getStats();
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth()+1).padStart(2,'0');
      const monthKey = `${y}-${m}`;
      if (!s.months[monthKey]) s.months[monthKey] = { days: 0, sessions: 0, kcal: 0, prCount: 0 };
      s.months[monthKey].prCount += 1;
      setStats(s);
    }
  };

  const handleCompleteChallenge = (taskDone, durationMMSS) => {
    setActiveChallengeState(null);
    if (!isChallengeCompletedToday && !isTrainingCompletedToday) setStreak(s => s + 1);
    setIsChallengeCompletedToday(true);
    setRecentChallenges(prev => [taskDone, ...prev].slice(0, 3));
    setLastChallengeDuration(durationMMSS || '00:00');
    triggerCompletionEffects();
    updateStatsOnChallenge(durationMMSS);
    setShowChallengeSummary(true);
  };

  const handleFinishTraining = (trainingData) => {
    setIsTrainingOngoing(false);
    setIsSessionActive(false);
    setShowActiveTraining(false);
    const target = newTrainingTargetDate ? new Date(newTrainingTargetDate) : new Date();
    const isTargetToday = target.toDateString() === new Date().toDateString();
    const typeId = currentTrainingType || '';
    const weightKg = parseFloat(profileData?.weight || 65);
    const baseItem = { 
      ...trainingData, 
      date: target.toISOString(),
      type: trainingData.type || (typeId === 'anaerobic' ? '无氧训练' : typeId === 'aerobic' ? '有氧训练' : typeId === 'stretch' ? '拉伸恢复' : '训练'),
      trainTag: typeId,
      weight: weightKg,
      modeId: selectedModeId
    };
    const kcal = computeTrainingKcal(baseItem);
    baseItem.kcal = kcal;
    if (isTargetToday) {
      setTodayTrainings(prev => [...prev, baseItem]);
    }

    // 记录训练类型（中文显示）以及类型标识，便于按类型分组渲染
    const newHistoryItem = baseItem;
    const newHistory = [...history, newHistoryItem];
    setHistory(newHistory);
    localStorage.setItem('fitnessApp_history', JSON.stringify(newHistory));

    if (isTargetToday) {
      setShowEndSummary(true);
    } else {
      const m = target.getMonth() + 1;
      const d = target.getDate();
      showToast(`已记录至 ${m}/${d}`);
    }
    triggerCompletionEffects();
    updateStatsOnTraining(baseItem, target);
    if (isTargetToday && !isChallengeCompletedToday && !isTrainingCompletedToday) {
      setStreak(s => s + 1);
    }
    setNewTrainingTargetDate(null);
  };

  const handlePlusClick = () => {
    if (isSessionActive) {
      setShouldShowCountdown(false);
      setShowActiveTraining(true);
    } else {
      setShowTrainingTypeDrawer(true);
    }
  };

  const handleUpdateHistory = (updatedItem, oldItem) => {
    if (!updatedItem || !updatedItem.date) return;
    
    // Find the item to update. 
    // If oldItem is provided, use its date to find the original record.
    // Otherwise, assume date hasn't changed and use updatedItem.date.
    const targetDate = oldItem ? oldItem.date : updatedItem.date;
    const existingIndex = history.findIndex(h => h.date === targetDate);

    let newHistory;
    if (existingIndex !== -1) {
        newHistory = [...history];
        newHistory[existingIndex] = updatedItem;
    } else {
        // Fallback: if not found (shouldn't happen usually), just add it or ignore?
        // If we can't find the old one, maybe it's a new one? 
        // But this is "Update". Let's try to find by object reference if possible? 
        // No, we rely on date.
        // If we can't find it, we might just append it, but that might duplicate.
        // Let's assume strict update for now.
        newHistory = [...history, updatedItem];
    }
    
    // Sort history by date descending
    newHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    setHistory(newHistory);
    localStorage.setItem('fitnessApp_history', JSON.stringify(newHistory));

    // 2. Update todayTrainings
    const todayStr = new Date().toDateString();
    const isToday = new Date(updatedItem.date).toDateString() === todayStr;
    const wasToday = oldItem ? (new Date(oldItem.date).toDateString() === todayStr) : (new Date(targetDate).toDateString() === todayStr);

    if (isToday || wasToday) {
       // Re-filter todayTrainings from newHistory
       const todayItems = newHistory.filter(h => new Date(h.date).toDateString() === todayStr);
       setTodayTrainings(todayItems);
    }

    // 3. Update stats (complex, for now let's rebuild stats from history to be safe?)
    // Rebuilding stats from scratch is safer if date changes across months.
    // However, it might be expensive. 
    // Let's do the incremental update if possible, handling date change.
    
    if (oldItem || existingIndex !== -1) {
       const originalItem = oldItem || history[existingIndex];
       
       const oldKcal = estimateKcalFromTraining(originalItem);
       const newKcal = estimateKcalFromTraining(updatedItem);
       
       const getDur = (item) => {
         if (!item || !item.duration) return 0;
         const parts = String(item.duration).split(':');
         if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
         return parseInt(item.duration) || 0;
       };
       const oldDur = getDur(originalItem);
       const newDur = getDur(updatedItem);

       // If month changed, we need to subtract from old month and add to new month.
       const oldD = new Date(originalItem.date);
       const newD = new Date(updatedItem.date);
       const oldMonthKey = `${oldD.getFullYear()}-${String(oldD.getMonth()+1).padStart(2,'0')}`;
       const newMonthKey = `${newD.getFullYear()}-${String(newD.getMonth()+1).padStart(2,'0')}`;

       const s = getStats();
       
       // Subtract from old
       if (s.months && s.months[oldMonthKey]) {
         s.months[oldMonthKey].kcal -= oldKcal;
         // duration? s.months doesn't store duration usually, but if it did...
       }
       
       // Add to new
       if (!s.months) s.months = {};
       if (!s.months[newMonthKey]) s.months[newMonthKey] = { kcal: 0, count: 0 };
       s.months[newMonthKey].kcal += newKcal;
       
       setStats(s);

       // Update daily
       const dStore = getDaily();
       const oldDayKey = `${oldD.getFullYear()}-${String(oldD.getMonth()+1).padStart(2,'0')}-${String(oldD.getDate()).padStart(2,'0')}`;
       const newDayKey = `${newD.getFullYear()}-${String(newD.getMonth()+1).padStart(2,'0')}-${String(newD.getDate()).padStart(2,'0')}`;

       if (dStore[oldDayKey]) {
         dStore[oldDayKey].kcal = (dStore[oldDayKey].kcal || 0) - oldKcal;
         dStore[oldDayKey].duration = (dStore[oldDayKey].duration || 0) - oldDur;
       }
       
       if (!dStore[newDayKey]) dStore[newDayKey] = { kcal: 0, duration: 0 };
       dStore[newDayKey].kcal = (dStore[newDayKey].kcal || 0) + newKcal;
       dStore[newDayKey].duration = (dStore[newDayKey].duration || 0) + newDur;
       
       // Update challenge status for the day
       const hasChallenge = (item) => {
          if (!item) return false;
          const isChallengeEntry = (e) => e && (e.isChallenge || e.type === 'challenge' || e.type === '挑战');
          if (Array.isArray(item.entries) && item.entries.length > 0) {
              return item.entries.some(isChallengeEntry);
          }
          return isChallengeEntry(item);
       };
       dStore[newDayKey].challenge = hasChallenge(updatedItem);

       setDaily(dStore);
    }

    // 4. Update selectedHistoryDate
    setSelectedHistoryDate(updatedItem);
    
    showToast("训练记录已更新");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex justify-center font-['DIN_Alternate','Microsoft_YaHei','sans-serif']">
      <style dangerouslySetInnerHTML={{__html: `
        * { -ms-overflow-style: none; scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        *:focus, *:focus-visible { outline: none !important; box-shadow: none !important; -webkit-tap-highlight-color: transparent; }
        @font-face {
          font-family: 'DIN_Alternate';
          src: local('DIN Alternate'), local('DINAlternate-Bold');
          font-weight: bold;
        }
      `}} />

      <div className="w-full max-w-md bg-[#202020] h-[100dvh] relative overflow-y-auto shadow-2xl flex flex-col">
        
        <Toast message={toastMsg.text} visible={toastMsg.visible} position={toastMsg.position} />

        {/* Content Area */}
        <div className="flex-1 pb-32">
          {showOnboarding && (
            <OnboardingScreen 
              onSubmit={(p) => {
                localStorage.setItem('fitnessApp_profile', JSON.stringify(p));
                // Ensure new users start with empty data
                setHistory([]);
                localStorage.removeItem('fitnessApp_history');
                setDaily({});
                localStorage.removeItem('fitnessApp_daily');
                setStats({ months: {}, totalDays: 0, totalSessions: 0, lastCheckin: '' });
                localStorage.removeItem('fitnessApp_stats');
                
                setProfileData(p);
                setShowOnboarding(false);
                setCurrentTab('home');
              }}
            />
          )}
          {currentTab === 'home' && (
            <HomeTab 
              profileData={profileData}
              selectedModeId={selectedModeId}
              onOpenChallenge={() => setActiveChallengeState('prep')} 
              isChallengeCompletedToday={isChallengeCompletedToday}
              isAnyCompleted={isAnyCompleted}
              streak={streak}
              todayTrainings={todayTrainings}
              history={history}
              onSelectHistory={(item) => setSelectedHistoryDate(item)}
              onOpenCalendar={() => setShowCalendar(true)}
              onOpenReportCenter={() => setShowReportCenter(true)}
              onEditProfile={() => setShowProfileEdit(true)}
              onToast={showToast}
              activeTaskText={activeTaskText}
              challengeJournal={challengeJournal}
              lastChallengeDuration={lastChallengeDuration}
            />
          )}
          {currentTab === 'profile' && (
          <ProfileTab 
              streak={streak} 
              isAnyCompleted={isAnyCompleted}
              selectedModeId={selectedModeId}
              onSelectMode={setSelectedModeId}
              isCustomDaily={isCustomDaily}
              setIsCustomDaily={setIsCustomDaily}
              customTaskText={customTaskText}
              setCustomTaskText={setCustomTaskText}
              profileData={profileData || { username: '', gender: '', weight: '', height: '', bodyFat: '' }}
              setProfileData={setProfileData}
              onOpenCalendar={() => setShowCalendar(true)}
              onOpenReportCenter={() => setShowReportCenter(true)}
              onEditProfile={() => setShowProfileEdit(true)}
              onGenerateMonthlyReport={openMonthlyReport}
              onOpenWeightHistory={() => setShowWeightHistory(true)}
              onOpenBodyFatHistory={() => setShowBodyFatHistory(true)}
            />
          )}
        </div>



        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-8 pt-4 bg-gradient-to-t from-[#151515] via-[#202020]/80 to-transparent pointer-events-none z-30">
          <div className="bg-white rounded-[40px] h-[72px] flex justify-between items-center px-10 relative pointer-events-auto shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${currentTab === 'home' ? 'bg-[#202020] text-[#E8F583]' : 'text-gray-400 bg-transparent hover:bg-gray-100'}`}
            >
              <Home size={24} />
            </button>

            {/* Central Navigation "+" / Return to Training Button */}
            <button 
              onClick={handlePlusClick}
              className={`absolute left-1/2 -top-6 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300
                ${isSessionActive && !showActiveTraining 
                  ? 'bg-[#E8F583] shadow-[0_10px_30px_rgba(232,245,131,0.5)]' 
                  : 'bg-[#AD9BF0] shadow-[0_10px_30px_rgba(173,155,240,0.4)]'}`}
            >
              {isSessionActive && !showActiveTraining ? (
                <div className="flex flex-col items-center text-[#202020] pt-1 font-['DIN_Alternate',sans-serif]">
                  <Activity size={26} className="animate-pulse mb-0.5" strokeWidth={3} />
                  <span className="font-mono text-[13px] font-bold leading-none tracking-tighter">
                    {Math.floor(trainingTime / 60).toString().padStart(2, '0')}:{(trainingTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ) : (
                <Plus size={40} color="#202020" strokeWidth={3} />
              )}
            </button>

            <button 
              onClick={() => setCurrentTab('profile')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${currentTab === 'profile' ? 'bg-[#202020] text-[#E8F583]' : 'text-gray-400 bg-transparent hover:bg-gray-100'}`}
            >
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Modals & Overlays */}
        {showProfileEdit && (
          <ProfileEditModal 
            data={profileData} 
            onSave={(newData) => { 
              setProfileData(newData); 
              localStorage.setItem('fitnessApp_profile', JSON.stringify(newData));
              
              // Sync weight to history (skipping profile sync)
              if (newData.weight !== undefined && newData.weight !== null && newData.weight !== '') {
                 updateWeightForDate(new Date(), newData.weight, true);
              }
              
              // Update BodyFat
              try {
                const dStore = getDaily();
                const now = new Date();
                const y = now.getFullYear();
                const m = String(now.getMonth()+1).padStart(2,'0');
                const d = String(now.getDate()).padStart(2,'0');
                const dayKey = `${y}-${m}-${d}`;
                const dd = dStore[dayKey] || {};
                
                if (newData.bodyFat !== undefined && newData.bodyFat !== null && newData.bodyFat !== '') {
                  const bf = parseFloat(newData.bodyFat);
                  if (!Number.isNaN(bf) && bf >= 0) dd.bodyFat = bf;
                }
                dStore[dayKey] = dd;
                setDaily(dStore);
                localStorage.setItem('fitnessApp_daily', JSON.stringify(dStore));
              } catch {}
              setShowProfileEdit(false); 
              showToast('个人资料已保存'); 
            }}
            onClose={() => setShowProfileEdit(false)}
          />
        )}
        {showWeightHistory && (
          <WeightHistoryModal
            onClose={() => setShowWeightHistory(false)}
            onUpdateWeight={updateWeightForDate}
          />
        )}
        {showBodyFatHistory && (
          <BodyFatHistoryModal
            onClose={() => setShowBodyFatHistory(false)}
          />
        )}

        {showCalendar && (
          <CalendarHistoryModal 
            onClose={() => setShowCalendar(false)} 
            isChallengeCompletedToday={isChallengeCompletedToday}
            isTrainingCompletedToday={isTrainingCompletedToday}
            todayTrainings={todayTrainings}
            activeTaskText={activeTaskText}
            challengeJournal={challengeJournal}
            onUpdateToday={(updated) => {
              setTodayTrainings(prev => {
                if (!prev || prev.length === 0) return prev;
                const arr = [...prev];
                if (updated === null) {
                  arr.pop();
                  return arr;
                }
                arr[arr.length - 1] = { ...arr[arr.length - 1], ...updated };
                return arr;
              });
            }}
            onCreateForDate={(date) => { setNewTrainingTargetDate(date); setShowCalendar(false); setShowTrainingTypeDrawer(true); }}
            onRebuildHistory={rebuildFromHistory}
            onOpenHistory={(item) => setSelectedHistoryDate(item)}
          />
        )}

        {showReportCenter && (
          <ReportCenterModal 
            range={reportRange}
            anchor={reportAnchor}
            onClose={() => setShowReportCenter(false)}
            onRangeChange={setReportRange}
            onPrev={() => {
              const d = new Date(reportAnchor);
              if (reportRange === 'week') d.setDate(d.getDate() - 7);
              else if (reportRange === 'month') d.setMonth(d.getMonth() - 1);
              else d.setFullYear(d.getFullYear() - 1);
              setReportAnchor(d);
            }}
            onNext={() => {
              const d = new Date(reportAnchor);
              if (reportRange === 'week') d.setDate(d.getDate() + 7);
              else if (reportRange === 'month') d.setMonth(d.getMonth() + 1);
              else d.setFullYear(d.getFullYear() + 1);
              setReportAnchor(d);
            }}
            onExport={() => {
              const dStore = getDaily();
              const now = reportAnchor;
              if (reportRange === 'month') {
                const y = now.getFullYear();
                const m = now.getMonth()+1;
                const mm = String(m).padStart(2,'0');
                const dim = new Date(y, m, 0).getDate();
                const days = Array.from({ length: dim }, (_, i) => {
                  const dd = String(i+1).padStart(2,'0');
                  const key = `${y}-${mm}-${dd}`;
                  const v = dStore[key] || {};
                  return (v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0);
                });
                const s = getStats();
                const stats = {
                  days: s.months?.[`${y}-${mm}`]?.days || 0,
                  sessions: s.months?.[`${y}-${mm}`]?.sessions || 0,
                  kcal: s.months?.[`${y}-${mm}`]?.kcal || 0,
                  prCount: s.months?.[`${y}-${mm}`]?.prCount || 0,
                  totalDays: s.totalDays || 0
                };
                openPoster({
                  type: 'monthly',
                  profile: profileData,
                  date: now,
                  stats,
                  heat: { type: 'month', year: y, month: m, days }
                });
              } else if (reportRange === 'year') {
                const y = now.getFullYear();
                const months = Array.from({ length: 12 }, (_, mi) => {
                  const mm = String(mi+1).padStart(2,'0');
                  const dim = new Date(y, mi+1, 0).getDate();
                  const days = Array.from({ length: dim }, (_, di) => {
                    const dd = String(di+1).padStart(2,'0');
                    const key = `${y}-${mm}-${dd}`;
                    const v = dStore[key] || {};
                    return (v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0);
                  });
                  return { month: mi+1, days };
                });
                const s = getStats();
                // 计算全年最长连胜（基于真实每日数据）
                let longestStreak = 0;
                let cur = 0;
                months.forEach(mo => {
                  mo.days.forEach(v => {
                    if (v > 0) { cur += 1; if (cur > longestStreak) longestStreak = cur; }
                    else { cur = 0; }
                  });
                });
                const agg = {
                  totalDays: s.totalDays || 0,
                  totalSessions: (() => {
                    try {
                      const arr = JSON.parse(localStorage.getItem('fitnessApp_history') || '[]');
                      return Array.isArray(arr) ? arr.length : 0;
                    } catch { 
                      return 0; 
                    }
                  })(),
                  longestStreak,
                  totalKcal: Object.entries(s.months || {}).reduce((acc, [mk, ms]) => mk.startsWith(`${now.getFullYear()}-`) ? acc + (ms.kcal || 0) : acc, 0)
                };
                openPoster({
                  type: 'annual',
                  profile: profileData,
                  date: now,
                  annual: { year: y, months },
                  agg
                });
              } else {
                const week = [];
                for (let i=6;i>=0;i--) {
                  const d = new Date(now);
                  d.setDate(now.getDate()-i);
                  const y = d.getFullYear();
                  const m = String(d.getMonth()+1).padStart(2,'0');
                  const dd = String(d.getDate()).padStart(2,'0');
                  const key = `${y}-${m}-${dd}`;
                  const v = dStore[key] || {};
                  week.push((v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0));
                }
                // 计算本周统计
                let wkSessions = 0, wkDays = 0, wkKcal = 0;
                for (let i=6;i>=0;i--) {
                  const day = new Date(now);
                  day.setDate(now.getDate()-i);
                  const y = day.getFullYear();
                  const m = String(day.getMonth()+1).padStart(2,'0');
                  const dd = String(day.getDate()).padStart(2,'0');
                  const key = `${y}-${m}-${dd}`;
                  const v = dStore[key] || {};
                  wkSessions += v.sessions || 0;
                  wkKcal += v.kcal || 0;
                  if (v.challenge || v.training) wkDays += 1;
                }
                openPoster({
                  type: 'weekly',
                  profile: profileData,
                  date: now,
                  heat: { type: 'week', values: week },
                  stats: { sessions: wkSessions, days: wkDays, kcal: wkKcal }
                });
              }
            }}
          />
        )}

        {activeChallengeState === 'prep' && (
          <ChallengePrepScreen 
            modeId={selectedModeId}
            customTaskText={customTaskText}
            recentChallenges={recentChallenges}
            onClose={() => setActiveChallengeState(null)}
            onStart={(taskName) => {
              setActiveTaskText(taskName);
              setActiveChallengeState('executing');
            }}
          />
        )}
        
        {activeChallengeState === 'executing' && (
          <ActiveChallengeScreen 
            modeId={selectedModeId} 
            taskName={activeTaskText}
            onClose={() => setActiveChallengeState(null)}
            onComplete={(dur) => handleCompleteChallenge(activeTaskText, dur)}
          />
        )}

        {showTrainingTypeDrawer && (
          <TrainingDrawer 
            onClose={() => setShowTrainingTypeDrawer(false)} 
            onSelectType={(typeId) => {
              setCurrentTrainingType(typeId);
              setShowTrainingTypeDrawer(false);
              setActiveExercises([]); 
              setTrainingTime(0);
              setIsTrainingOngoing(false);
              setIsSessionActive(true);
              setShouldShowCountdown(true);
              setShowActiveTraining(true);
            }}
          />
        )}

        {showActionSelector && (
          <ActionSelectionScreen 
            type={currentTrainingType}
            customExercises={customExercises}
            onSaveCustom={saveCustomExercise}
            onDeleteCustom={deleteCustomExercise}
            onClose={() => setShowActionSelector(false)}
            onSelectAction={(action) => {
              const isCardio = currentTrainingType === 'aerobic' || currentTrainingType === 'stretch';
              const initialSet = isCardio 
                ? { id: Date.now(), duration: 10, completed: false }
                : { id: Date.now(), weight: '', reps: 10, completed: false };

              setActiveExercises(prev => [...prev, { ...action, id: Date.now() + Math.random(), sets: [initialSet], isCollapsed: false, unit: 'kg' }]);
              setShowActionSelector(false);
            }}
          />
        )}

        {showActiveTraining && (
          <ActiveTrainingScreen 
            type={currentTrainingType}
            exercises={activeExercises}
            setExercises={setActiveExercises}
            trainingTime={trainingTime}
            personalRecords={personalRecords}
            onCheckPR={checkAndUpdatePR}
            onMinimize={() => setShowActiveTraining(false)} 
            onComplete={(data) => handleFinishTraining(data)}
            onAddAction={() => setShowActionSelector(true)}
            isRunning={isTrainingOngoing}
            onStartTimer={() => setIsTrainingOngoing(true)}
            onPauseTimer={() => setIsTrainingOngoing(false)}
            onResumeTimer={() => setIsTrainingOngoing(true)}
            shouldShowCountdown={shouldShowCountdown}
            onCountdownComplete={() => {
              setShouldShowCountdown(false);
              setIsTrainingOngoing(true);
            }}
            profileData={profileData}
            modeId={selectedModeId}
          />
        )}

        {showEndSummary && (
          <EndSummaryScreen 
            data={todayTrainings[todayTrainings.length - 1]} 
            profileData={profileData}
            modeId={selectedModeId}
            onSave={(j) => {
              if (!todayTrainings.length) return;
              const journalText = j.journalText || '';
              const journalImage = j.journalImage || null;

              const updatedToday = [...todayTrainings];
              const lastTodayIdx = updatedToday.length - 1;
              updatedToday[lastTodayIdx] = { ...updatedToday[lastTodayIdx], journalText, journalImage };
              setTodayTrainings(updatedToday);

              if (history && history.length > 0) {
                const newHistory = [...history];
                const lastHistIdx = newHistory.length - 1;
                newHistory[lastHistIdx] = { ...newHistory[lastHistIdx], journalText, journalImage };
                setHistory(newHistory);
                localStorage.setItem('fitnessApp_history', JSON.stringify(newHistory));
              }
              showToast("训练打卡成功！ 🎉");
            }}
            onClose={() => setShowEndSummary(false)}
            onExport={(j) => {
              if (!todayTrainings.length) return;
              const latest = todayTrainings[todayTrainings.length - 1] || {};
              const date = latest.date ? new Date(latest.date) : new Date();
              const journalText = (j && j.journalText) || latest.journalText || '';
              const journalImage = (j && j.journalImage) || latest.journalImage || null;
              const entries = [{
                type: latest.type || latest.trainTag || '训练',
                muscleSummary: latest.muscleSummary || latest.summary || '',
                duration: latest.duration || '',
                exercises: Array.isArray(latest.exercises) ? latest.exercises : [],
                journalText,
                journalImage,
                weight: latest.weight,
                trainTag: latest.trainTag,
                modeId: latest.modeId
              }];
              const allExercises = entries.reduce((acc, e) => {
                if (Array.isArray(e.exercises)) return acc.concat(e.exercises);
                return acc;
              }, []);
              let totalDurationSec = 0;
              entries.forEach(t => {
                if (!t || !t.duration) return;
                const parts = String(t.duration).split(':');
                if (parts.length === 2) {
                  const mins = parseInt(parts[0]) || 0;
                  const secs = parseInt(parts[1]) || 0;
                  totalDurationSec += mins * 60 + secs;
                } else {
                  const mins = parseFloat(t.duration) || 0;
                  totalDurationSec += Math.round(mins * 60);
                }
              });
              const durH = Math.floor(totalDurationSec / 3600);
              const durM = Math.floor((totalDurationSec % 3600) / 60);
              const durS = totalDurationSec % 60;
              const totalDurationStr = durH > 0
                ? `${String(durH).padStart(2,'0')}:${String(durM).padStart(2,'0')}`
                : `${String(durM).padStart(2,'0')}:${String(durS).padStart(2,'0')}`;
              const totalKcal = entries.reduce((sum, t) => sum + computeTrainingKcal(t), 0);
              openPoster({ 
                type: 'training',
                profile: profileData,
                date,
                summary: '训练记录',
                duration: totalDurationStr,
                trainType: '',
                exercises: allExercises,
                journalText: null,
                journalImage: null,
                kcal: totalKcal > 0 ? Math.round(totalKcal) : undefined,
                modeId: selectedModeId,
                entries
              });
            }}
          />
        )}

        {selectedHistoryDate && (
          <HistoryModal 
            data={selectedHistoryDate} 
            onClose={() => setSelectedHistoryDate(null)} 
            onUpdate={(newItem) => {
              handleUpdateHistory(newItem, selectedHistoryDate);
              setSelectedHistoryDate(newItem);
            }}
            onDelete={(item) => {
              try {
                const raw = localStorage.getItem('fitnessApp_history');
                const list = raw ? JSON.parse(raw) : [];
                if (!Array.isArray(list) || list.length === 0 || !item?.date) return;
                const filtered = list.filter(h => h.date !== item.date);
                localStorage.setItem('fitnessApp_history', JSON.stringify(filtered));
                rebuildFromHistory(filtered);
                setSelectedHistoryDate(null);
                showToast('训练记录已删除');
              } catch {}
            }}
            onExport={() => { 
              if (!selectedHistoryDate) return;
              const baseDate = (() => {
                try {
                  const raw = selectedHistoryDate.date;
                  if (!raw) return new Date();
                  const d = new Date(raw);
                  if (!isNaN(d.getTime())) return d;
                } catch {}
                return new Date();
              })();

              // Try to resolve challenge data if missing, similar to HistoryModal logic
              let challengeText = selectedHistoryDate._challengeText || null;
              let challengeJournalText = selectedHistoryDate._challengeJournalText || null;
              let challengeJournalImage = selectedHistoryDate._challengeJournalImage || null;
              let challengeDuration = selectedHistoryDate._challengeDuration || null;
              let challengeModeId = selectedHistoryDate._challengeModeId || selectedHistoryDate.modeId || null;

              if (!selectedHistoryDate._source) {
                  try {
                      const d = new Date(baseDate);
                      const yyyy = d.getFullYear();
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const dd = String(d.getDate()).padStart(2, '0');
                      const dayKey = `${yyyy}-${mm}-${dd}`;
                      
                      const rawDaily = localStorage.getItem('fitnessApp_daily');
                      if (rawDaily) {
                          const store = JSON.parse(rawDaily);
                          const v = store?.[dayKey] || {};
                          if (v && v.challenge) {
                              if (!challengeText) challengeText = v.challengeText || '挑战完成';
                              if (!challengeJournalText) challengeJournalText = v.challengeJournalText || null;
                              if (!challengeJournalImage) challengeJournalImage = v.challengeJournalImage || null;
                              if (!challengeDuration) challengeDuration = v.challengeDuration || null;
                              if (!challengeModeId) challengeModeId = v.challengeModeId || v.modeId || null;
                          }
                      }
                  } catch {}
              }

              const entries = Array.isArray(selectedHistoryDate.entries) && selectedHistoryDate.entries.length > 0
                ? selectedHistoryDate.entries
                : ((selectedHistoryDate.exercises && selectedHistoryDate.exercises.length) || selectedHistoryDate.duration || selectedHistoryDate.summary
                    ? [{
                        type: selectedHistoryDate.type || selectedHistoryDate.trainTag || '训练',
                        muscleSummary: selectedHistoryDate.muscleSummary || selectedHistoryDate.summary || '',
                        duration: selectedHistoryDate.duration || '',
                        exercises: selectedHistoryDate.exercises || [],
                        journalText: selectedHistoryDate.journalText || '',
                        journalImage: selectedHistoryDate.journalImage || null,
                        weight: selectedHistoryDate.weight,
                        trainTag: selectedHistoryDate.trainTag,
                        modeId: selectedHistoryDate.modeId
                      }]
                    : []);
              const allExercises = entries.reduce((acc, entry) => {
                if (Array.isArray(entry.exercises)) return acc.concat(entry.exercises);
                return acc;
              }, []);
              let totalDurationSec = 0;
              entries.forEach(t => {
                if (!t || !t.duration) return;
                const parts = String(t.duration).split(':');
                if (parts.length === 2) {
                  const mins = parseInt(parts[0]) || 0;
                  const secs = parseInt(parts[1]) || 0;
                  totalDurationSec += mins * 60 + secs;
                } else {
                  const mins = parseFloat(t.duration) || 0;
                  totalDurationSec += Math.round(mins * 60);
                }
              });
              const durH = Math.floor(totalDurationSec / 3600);
              const durM = Math.floor((totalDurationSec % 3600) / 60);
              const durS = totalDurationSec % 60;
              const totalDurationStr = durH > 0
                ? `${String(durH).padStart(2,'0')}:${String(durM).padStart(2,'0')}`
                : `${String(durM).padStart(2,'0')}:${String(durS).padStart(2,'0')}`;
              const totalKcal = entries.reduce((sum, t) => sum + computeTrainingKcal(t), 0);
              
              const isChallenge = selectedHistoryDate.type === 'challenge' || selectedHistoryDate.trainTag === 'challenge' || selectedHistoryDate.isChallenge || !!challengeText;

              openPoster({ 
                type: isChallenge ? 'challenge' : 'training',
                profile: profileData,
                date: baseDate,
                summary: isChallenge ? (challengeText || '挑战完成') : '训练记录',
                duration: totalDurationStr,
                trainType: '',
                exercises: allExercises,
                journalText: null,
                journalImage: null,
                kcal: totalKcal > 0 ? Math.round(totalKcal) : undefined,
                modeId: challengeModeId || selectedModeId,
                entries,
                challengeText,
                challengeJournalText,
                challengeJournalImage,
                challengeDuration
              });
              setSelectedHistoryDate(null);
            }}
            onExportReport={(range) => {
              const now = new Date();
              const dStore = getDaily();
              if (range === 'monthly') {
                const y = now.getFullYear();
                const m = String(now.getMonth()+1).padStart(2,'0');
                const daysInMonth = new Date(y, now.getMonth()+1, 0).getDate();
                const days = Array.from({ length: daysInMonth }, (_, i) => {
                  const d = String(i+1).padStart(2,'0');
                  const key = `${y}-${m}-${d}`;
                  const v = dStore[key] || {};
                  const status = (v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0);
                  return status;
                });
                const s = getStats();
                const stats = {
                  days: s.months?.[`${y}-${m}`]?.days || 0,
                  sessions: s.months?.[`${y}-${m}`]?.sessions || 0,
                  kcal: s.months?.[`${y}-${m}`]?.kcal || 0,
                  prCount: s.months?.[`${y}-${m}`]?.prCount || 0,
                  totalDays: s.totalDays || 0
                };
                openPoster({
                  type: 'monthly',
                  profile: profileData,
                  date: now,
                  stats,
                  heat: { type: 'month', year: y, month: now.getMonth()+1, days }
                });
              } else if (range === 'annual') {
                const y = now.getFullYear();
                const months = Array.from({ length: 12 }, (_, mi) => {
                  const mm = String(mi+1).padStart(2,'0');
                  const dim = new Date(y, mi+1, 0).getDate();
                  const days = Array.from({ length: dim }, (_, di) => {
                    const dd = String(di+1).padStart(2,'0');
                    const key = `${y}-${mm}-${dd}`;
                    const v = dStore[key] || {};
                    return (v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0);
                  });
                  return { month: mi+1, days };
                });
                const s = getStats();
                const agg = {
                  totalDays: s.totalDays || 0,
                  totalSessions: s.totalSessions || 0,
                  longestStreak: streak || 0,
                  totalKcal: Object.entries(s.months || {}).reduce((acc, [mk, ms]) => mk.startsWith(`${y}-`) ? acc + (ms.kcal || 0) : acc, 0)
                };
                openPoster({
                  type: 'annual',
                  profile: profileData,
                  date: now,
                  annual: { year: y, months },
                  agg
                });
              } else {
                const week = [];
                for (let i=6;i>=0;i--) {
                  const d = new Date(now);
                  d.setDate(now.getDate()-i);
                  const y = d.getFullYear();
                  const m = String(d.getMonth()+1).padStart(2,'0');
                  const dd = String(d.getDate()).padStart(2,'0');
                  const key = `${y}-${m}-${dd}`;
                  const v = dStore[key] || {};
                  week.push((v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0));
                }
                // 计算本周统计
                let wkSessions = 0, wkDays = 0, wkKcal = 0;
                for (let i=6;i>=0;i--) {
                  const day = new Date(now);
                  day.setDate(now.getDate()-i);
                  const y = day.getFullYear();
                  const m = String(day.getMonth()+1).padStart(2,'0');
                  const dd = String(day.getDate()).padStart(2,'0');
                  const key = `${y}-${m}-${dd}`;
                  const v = dStore[key] || {};
                  wkSessions += v.sessions || 0;
                  wkKcal += v.kcal || 0;
                  if (v.challenge || v.training) wkDays += 1;
                }
                openPoster({
                  type: 'weekly',
                  profile: profileData,
                  date: now,
                  heat: { type: 'week', values: week },
                  stats: { sessions: wkSessions, days: wkDays, kcal: wkKcal }
                });
              }
            }}
          />
        )}
        {showChallengeSummary && (
        <EndSummaryScreen
          title="挑战完成！"
          data={{ type: 'challenge', taskName: activeTaskText, duration: lastChallengeDuration }}
          profileData={profileData}
          modeId={selectedModeId}
          onSave={(j) => {
            setChallengeJournal(j);
            try {
              // 1. Calculate kcal for the challenge
              let kcalVal = 0;
              const weightKg = parseFloat(profileData?.weight || 65);
              let durationMin = 0;
              if (lastChallengeDuration) {
                 const parts = String(lastChallengeDuration).split(':');
                 if (parts.length === 2) {
                   durationMin = parseInt(parts[0]) + parseInt(parts[1])/60;
                 } else {
                   durationMin = parseFloat(lastChallengeDuration) || 0;
                 }
              }
              if (durationMin <= 0) {
                 const mode = CHALLENGE_MODES.find(v => v.id === selectedModeId);
                 if (mode && typeof mode.time === 'string' && mode.time.endsWith('min')) {
                    durationMin = parseFloat(mode.time) || 10;
                 } else {
                    durationMin = 10;
                 }
              }
              kcalVal = calculateCalories('BODYWEIGHT_STRENGTH', weightKg, durationMin, true, selectedModeId);

              // 2. Add to history
              const newHistoryItem = {
                  type: '挑战',
                  summary: activeTaskText || '挑战完成',
                  duration: lastChallengeDuration,
                  journalText: j?.journalText || null,
                  journalImage: j?.journalImage || null,
                  date: new Date().toISOString(),
                  kcal: Math.round(kcalVal),
                  modeId: selectedModeId,
                  isChallenge: true
              };
              const newHistory = [...history, newHistoryItem];
              newHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
              setHistory(newHistory);
              localStorage.setItem('fitnessApp_history', JSON.stringify(newHistory));
              
              const dStore = getDaily();
              const now = new Date();
              const y = now.getFullYear();
              const m = String(now.getMonth()+1).padStart(2,'0');
              const d = String(now.getDate()).padStart(2,'0');
              const dayKey = `${y}-${m}-${d}`;
              const dd = dStore[dayKey] || {};
              dd.challengeJournalText = j?.journalText || null;
              dd.challengeJournalImage = j?.journalImage || null;
              dd.challengeText = dd.challengeText || activeTaskText || '挑战完成';
              dd.challengeDuration = dd.challengeDuration || lastChallengeDuration || null;
              dStore[dayKey] = dd;
              setDaily(dStore);
              showToast("挑战记录已保存！ 🎉");
            } catch {}
          }}
            onClose={() => setShowChallengeSummary(false)}
            onExport={(j) => {
              let kcalVal = 0;
              try {
                const weightKg = parseFloat(profileData?.weight || 65);
                let durationMin = 0;
                if (lastChallengeDuration) {
                   const parts = String(lastChallengeDuration).split(':');
                   if (parts.length === 2) {
                     durationMin = parseInt(parts[0]) + parseInt(parts[1])/60;
                   } else {
                     durationMin = parseFloat(lastChallengeDuration) || 0;
                   }
                }
                if (durationMin <= 0) {
                   const mode = CHALLENGE_MODES.find(v => v.id === selectedModeId);
                   if (mode && typeof mode.time === 'string' && mode.time.endsWith('min')) {
                      durationMin = parseFloat(mode.time) || 10;
                   } else {
                      durationMin = 10;
                   }
                }
                kcalVal = calculateCalories('BODYWEIGHT_STRENGTH', weightKg, durationMin, true, selectedModeId);
              } catch {}

              openPoster({ 
                type: 'challenge',
                profile: profileData,
                date: new Date(),
                challenge: activeTaskText,
                duration: lastChallengeDuration,
                journalText: (j && j.journalText) || challengeJournal?.journalText,
                journalImage: (j && j.journalImage) || challengeJournal?.journalImage,
                modeId: selectedModeId,
                kcal: Math.round(kcalVal)
              });
            }}
          />
        )}
        {showPosterPreview && posterPayload && (
          <PosterPreviewModal 
            data={posterPayload} 
            onClose={() => setShowPosterPreview(false)} 
          />
        )}
      </div>
    </div>
  );
}

// 报表中心：周 / 月 / 年 切换与导出
function ReportCenterModal({ range, anchor, onRangeChange, onPrev, onNext, onExport, onClose }) {
  const monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const d = new Date(anchor);
  const title = range === 'week' 
    ? `${d.getFullYear()}年 ${d.getMonth()+1}月 第${Math.ceil(d.getDate()/7)}周`
    : range === 'month'
      ? `${d.getFullYear()}年 ${d.getMonth()+1}月`
      : `${d.getFullYear()}年`;
  
  const getDaily = () => {
    try { return JSON.parse(localStorage.getItem('fitnessApp_daily') || '{}'); } catch { return {}; }
  };
  const getStats = () => {
    try { 
      const raw = JSON.parse(localStorage.getItem('fitnessApp_stats') || '{}'); 
      if (!raw.months) raw.months = {};
      return raw;
    } catch { 
      return { months: {} }; 
    }
  };
  const dStore = getDaily();
  const stats = getStats();
  const y = d.getFullYear();
  const mIdx = d.getMonth(); // 0-based
  const mm = String(mIdx+1).padStart(2,'0');
  
  // compute weekly heat values (0/1/2)
  const weeklyValues = (() => {
    const vals = [];
    for (let i=6;i>=0;i--) {
      const day = new Date(d);
      day.setHours(0,0,0,0);
      day.setDate(d.getDate() - i);
      const ym = String(day.getMonth()+1).padStart(2,'0');
      const yd = String(day.getDate()).padStart(2,'0');
      const key = `${day.getFullYear()}-${ym}-${yd}`;
      const v = dStore[key] || {};
      vals.push((v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0));
    }
    return vals;
  })();
  
  // compute monthly heat and metrics
  const monthDim = new Date(y, mIdx+1, 0).getDate();
  const monthDaysHeat = Array.from({ length: monthDim }, (_, i) => {
    const dd = String(i+1).padStart(2,'0');
    const key = `${y}-${mm}-${dd}`;
    const v = dStore[key] || {};
    return (v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0);
  });
  // month longest streak within current month
  const monthLongestStreak = (() => {
    let longest = 0, current = 0;
    for (let i=1;i<=monthDim;i++) {
      const dd = String(i).padStart(2,'0');
      const key = `${y}-${mm}-${dd}`;
      const v = dStore[key] || {};
      const done = !!(v.challenge || v.training);
      if (done) { current += 1; if (current > longest) longest = current; }
      else current = 0;
    }
    return longest;
  })();
  const monthKey = `${y}-${mm}`;
  const monthMetrics = {
    days: stats.months?.[monthKey]?.days || 0,
    sessions: stats.months?.[monthKey]?.sessions || 0,
    kcal: stats.months?.[monthKey]?.kcal || 0,
    prCount: stats.months?.[monthKey]?.prCount || 0,
    totalDays: stats.totalDays || 0
  };
  
  // compute annual months heat and aggregate
  const annualMonths = Array.from({ length: 12 }, (_, mi) => {
    const dim = new Date(y, mi+1, 0).getDate();
    const mstr = String(mi+1).padStart(2,'0');
    const days = Array.from({ length: dim }, (_, di) => {
      const dstr = String(di+1).padStart(2,'0');
      const key = `${y}-${mstr}-${dstr}`;
      const v = dStore[key] || {};
      return (v.challenge && v.training) ? 2 : ((v.challenge || v.training) ? 1 : 0);
    });
    return { month: mi+1, days };
  });
  const annualAgg = {
    totalDays: stats.totalDays || 0,
    totalSessions: stats.totalSessions || 0,
    totalKcal: Object.entries(stats.months || {}).reduce((acc, [mk, ms]) => mk.startsWith(`${y}-`) ? acc + (ms.kcal || 0) : acc, 0)
  };
  // annual longest streak for the year
  const annualLongestStreak = (() => {
    let longest = 0, current = 0;
    for (let mi=0; mi<12; mi++) {
      const dim = new Date(y, mi+1, 0).getDate();
      const mstr = String(mi+1).padStart(2,'0');
      for (let di=1; di<=dim; di++) {
        const dstr = String(di).padStart(2,'0');
        const key = `${y}-${mstr}-${dstr}`;
        const v = dStore[key] || {};
        const done = !!(v.challenge || v.training);
        if (done) { current += 1; if (current > longest) longest = current; }
        else current = 0;
      }
    }
    return longest;
  })();
  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[80] bg-[#121212] flex flex-col animate-in slide-in-from-right duration-300 font-['Microsoft_YaHei',sans-serif] overflow-y-auto">
      <div className="px-6 pt-14 pb-4 flex items-center justify-between bg-[#1A1A1A] border-b border-white/5">
        <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white active:scale-90"><X size={20} /></button>
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="text-[#888] hover:text-white p-1"><ChevronLeft size={20}/></button>
          <div className="text-white font-bold text-sm">{title}</div>
          <button onClick={onNext} className="text-[#888] hover:text-white p-1"><ChevronRight size={20}/></button>
        </div>
        <div className="w-10"></div>
      </div>
      <div className="px-6 py-4">
        <div className="flex gap-2 mb-4">
          <button onClick={() => onRangeChange('week')} className={`flex-1 py-2 rounded-xl text-sm font-bold ${range==='week' ? 'bg-[#E8F583] text-[#202020]' : 'bg-[#151515] text-[#bbb]'}`}>周记录</button>
          <button onClick={() => onRangeChange('month')} className={`flex-1 py-2 rounded-xl text-sm font-bold ${range==='month' ? 'bg-[#E8F583] text-[#202020]' : 'bg-[#151515] text-[#bbb]'}`}>月度报告</button>
          <button onClick={() => onRangeChange('year')} className={`flex-1 py-2 rounded-xl text-sm font-bold ${range==='year' ? 'bg-[#E8F583] text-[#202020]' : 'bg-[#151515] text-[#bbb]'}`}>年度报告</button>
        </div>
        <div className="bg-[#151515] rounded-2xl p-5 border border-white/5 min-h-[220px] text-[#ccc]">
          {range==='week' && (
            <div>
              <div className="text-white font-bold mb-3">WEEKLY CHECK-IN</div>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weeklyValues.map((v, i) => (
                  <div key={i} className={`h-6 rounded-md ${v===2 ? 'bg-[#E8F583]' : v===1 ? 'border border-[#E8F583]' : 'bg-[#1a1a1a]'}`}></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <div className="text-[10px] text-[#888] font-bold">本周训练</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif]">
                    {(() => {
                      // sum sessions in 7 days
                      let sum = 0;
                      for (let i=6;i>=0;i--) {
                        const day = new Date(d);
                        day.setHours(0,0,0,0);
                        day.setDate(d.getDate() - i);
                        const ym = String(day.getMonth()+1).padStart(2,'0');
                        const yd = String(day.getDate()).padStart(2,'0');
                        const key = `${day.getFullYear()}-${ym}-${yd}`;
                        const v = dStore[key] || {};
                        sum += v.sessions || 0;
                      }
                      return sum;
                    })()}
                  </div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold">本周打卡</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif]">
                    {weeklyValues.filter(v=>v>0).length}
                  </div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold whitespace-nowrap">总消耗/kcal</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">
                    {(() => {
                      let sum = 0;
                      for (let i=6;i>=0;i--) {
                        const day = new Date(d);
                        day.setHours(0,0,0,0);
                        day.setDate(d.getDate() - i);
                        const ym = String(day.getMonth()+1).padStart(2,'0');
                        const yd = String(day.getDate()).padStart(2,'0');
                        const key = `${day.getFullYear()}-${ym}-${yd}`;
                        const v = dStore[key] || {};
                        sum += v.kcal || 0;
                      }
                      return sum;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
          {range==='month' && (
            <div>
              <div className="text-white font-bold mb-3">MONTHLY REPORT</div>
              <div className="grid grid-cols-7 gap-2 mb-2 text-[10px] text-[#888] font-bold text-center">
                {['S','M','T','W','T','F','S'].map((w,i)=><div key={i}>{w}</div>)}
              </div>
              {(() => {
                const firstDow = new Date(y, mIdx, 1).getDay();
                const dim = monthDim;
                const cells = [];
                for (let i=0;i<firstDow;i++) cells.push(null);
                for (let i=0;i<dim;i++) cells.push(monthDaysHeat[i]);
                return (
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {cells.map((v, i) => (
                      <div key={i} className={`w-full aspect-square rounded-md ${v===null ? 'bg-transparent' : v===2 ? 'bg-[#E8F583]' : v===1 ? 'border border-[#E8F583]' : 'bg-[#1a1a1a]'}`}></div>
                    ))}
                  </div>
                );
              })()}
              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">本月训练</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{monthMetrics.sessions}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">本月打卡</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{monthMetrics.days}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none whitespace-nowrap">总消耗/kcal</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{monthMetrics.kcal || 0}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">最长连胜</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{monthLongestStreak}</div>
                </div>
              </div>
            </div>
          )}
          {range==='year' && (
            <div>
              <div className="text-white font-bold mb-3">ANNUAL REPORT</div>
              <div className="grid grid-cols-3 gap-3">
                {annualMonths.map((m, mi) => (
                  <div key={mi} className="bg-[#202020] p-2 rounded-xl border border-white/5">
                    <div className="text-[10px] text-[#aaa] font-bold mb-1">{['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][mi]}</div>
                    <div className="grid grid-cols-7 gap-1">
                      {m.days.map((v, i) => (
                        <div key={i} className={`w-2 h-2 rounded-sm ${v===2 ? 'bg-[#E8F583]' : v===1 ? 'border border-[#E8F583]' : 'bg-[#1a1a1a]'}`}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4 items-end">
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">总打卡数</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{annualAgg.totalDays}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">总训练数</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{annualAgg.totalSessions}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none whitespace-nowrap">总消耗/kcal</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{annualAgg.totalKcal || 0}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">最长连胜</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{annualLongestStreak}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6">
          <button onClick={onExport} className="w-full h-14 rounded-[20px] bg-[#303030] text-white font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:bg-[#3a3a3a] active:scale-95 transition-all">
            {range==='week' ? '导出周报' : range==='month' ? '导出月度报告' : '导出年度报告'}
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingScreen({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const canSubmit = username.trim() && gender && height && weight;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[100] bg-[#121212] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[#202020] rounded-[32px] p-6 shadow-2xl border border-white/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#E8F583] text-[#202020] flex items-center justify-center font-black text-2xl mx-auto mb-3">UP</div>
          <div className="text-2xl font-bold text-white">欢迎加入</div>
          <div className="text-[#888] text-sm mt-1">完成资料，开启你的训练旅程</div>
        </div>
        <div className="flex flex-col gap-3">
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="昵称" className="w-full h-12 bg-[#151515] border border-white/10 rounded-2xl px-4 text-white outline-none"/>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={()=>setGender('Male')} className={`h-12 rounded-2xl font-bold ${gender==='Male' ? 'bg-[#E8F583] text-[#202020]' : 'bg-[#151515] text-[#bbb] border border-white/10'}`}>Male</button>
            <button onClick={()=>setGender('Female')} className={`h-12 rounded-2xl font-bold ${gender==='Female' ? 'bg-[#E8F583] text-[#202020]' : 'bg-[#151515] text-[#bbb] border border-white/10'}`}>Female</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={height} onChange={(e)=>setHeight(e.target.value)} placeholder="身高(cm)" inputMode="numeric" className="h-12 bg-[#151515] border border-white/10 rounded-2xl px-4 text-white outline-none"/>
            <input value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder="体重(kg)" inputMode="numeric" className="h-12 bg-[#151515] border border-white/10 rounded-2xl px-4 text-white outline-none"/>
          </div>
          <input value={bodyFat} onChange={(e)=>setBodyFat(e.target.value)} placeholder="体脂率(可选)" inputMode="numeric" className="w-full h-12 bg-[#151515] border border-white/10 rounded-2xl px-4 text-white outline-none"/>
        </div>
        <button disabled={!canSubmit} onClick={()=>onSubmit({ username, gender, height: Number(height), weight: Number(weight), bodyFat: bodyFat? Number(bodyFat): '' })} className={`w-full h-14 rounded-2xl font-bold mt-6 ${canSubmit ? 'bg-[#E8F583] text-[#202020]' : 'bg-[#2A2A2A] text-[#666] cursor-not-allowed'}`}>开启旅程</button>
      </div>
    </div>
  );
}

// 统一的记录卡片组件，用于 HistoryModal, CalendarHistoryModal, PosterPreviewModal
function RecordCard({ data, includeJournal = true, actions, showKcal = false, forceHighlight = false }) {
  const {
    type, summary, muscleSummary, duration, exercises,
    journalText, journalImage,
    kcal
  } = data;

  const displaySummary = muscleSummary || summary;
  const entryType = typeof getEntryTypeLabel === 'function' ? getEntryTypeLabel(data) : (type || '训练');
  
  const isStandardTraining = data.trainTag && ['anaerobic', 'aerobic', 'stretch'].includes(data.trainTag);
  const isChallenge = !isStandardTraining && (data.isChallenge || 
                      entryType.includes('挑战') || 
                      type === 'challenge' || 
                      type === 'custom' || 
                      type === '自定义' || 
                      (data.modeId && ['novice', 'evolution', 'crazy', 'custom'].includes(data.modeId)));

  const trainingEn = isStandardTraining
    ? (data.trainTag === 'anaerobic'
        ? 'ANAEROBIC'
        : data.trainTag === 'aerobic'
          ? 'AEROBIC'
          : 'STRETCH')
    : null;

  let entryKcal = typeof kcal === 'number' ? kcal : (typeof computeTrainingKcal === 'function' ? computeTrainingKcal(data) : 0);

  // 如果是挑战记录且消耗为0（可能是时长格式问题导致计算失败），尝试估算
  if (isChallenge && (entryKcal === 0 || !entryKcal)) {
      let mins = 0;
      if (duration) {
          const parts = String(duration).split(':');
          if (parts.length === 2) {
              mins = (parseInt(parts[0])||0) + (parseInt(parts[1])||0)/60;
          } else {
              mins = parseFloat(duration) || 0;
          }
      }
      if (!mins) mins = 10; // 默认10分钟
      // 简单估算: ~8 kcal/min (高强度间歇/自重训练)
      entryKcal = Math.round(mins * 8);
  }

  return (
    <div className={`rounded-2xl p-4 border shadow-md mb-3 last:mb-0 ${(isChallenge || forceHighlight) ? 'bg-[#1A1A1A] border-[#E8F583]/30' : 'bg-[#151515] border-white/5'}`}>
       <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-2">
           <div className={`text-xs font-bold ${isChallenge ? 'text-[#E8F583]' : 'text-[#888]'}`}>
            {entryType}
            {isChallenge && data.modeId && (
              <span className="ml-1 opacity-80">
                · {CHALLENGE_MODES.find(m => m.id === data.modeId)?.en || data.modeId.toUpperCase()}
              </span>
            )}
            {!isChallenge && trainingEn && (
              <span className="ml-1 opacity-80">
                · {trainingEn}
              </span>
            )}
          </div>
           
           {duration && (
             <div className="text-xs font-bold font-['DIN_Alternate',sans-serif] text-white bg-white/10 px-2 py-0.5 rounded-md">
               {duration}
             </div>
           )}
           
           {(showKcal || isChallenge) && entryKcal > 0 && (
             <span className="text-[#E8F583] text-[10px] font-bold bg-[#E8F583]/10 px-2 py-0.5 rounded-lg font-['DIN_Alternate',sans-serif]">
               {entryKcal} kcal
             </span>
           )}
         </div>
         {actions && <div className="flex items-center gap-2">{actions}</div>}
       </div>

       {displaySummary && (
         <div className={`font-bold mb-2 ${isChallenge ? 'text-white text-lg leading-snug' : 'text-white text-sm'}`}>
           {displaySummary}
         </div>
       )}

       {includeJournal && (journalImage || journalText) && (
         <div className="mb-3">
           {journalImage && <img src={journalImage} alt="journal" className="w-full h-auto object-contain rounded-2xl shadow-md mb-2" />}
           {journalText && <div className="text-[#bbb] text-sm leading-relaxed whitespace-pre-wrap break-words">{journalText}</div>}
         </div>
       )}

       {Array.isArray(exercises) && exercises.length > 0 && (
          <div className="mt-2 bg-[#101010] p-3 rounded-xl border border-white/10">
            <div className="text-[#888] text-xs font-bold mb-1">动作明细</div>
            {exercises.map((ex, i) => (
              <div key={i} className="py-1.5 border-t border-white/5 first:border-none">
                 <div className="flex items-center justify-between text-[12px] text-[#888] font-bold mb-1">
                   <span className="text-white">{ex ? ex.name : ''}</span>
                   <span className="font-['DIN_Alternate',sans-serif]">{ex && Array.isArray(ex.sets) ? ex.sets.length : (ex && ex.sets) || 0} 组</span>
                 </div>
                 {ex && Array.isArray(ex.sets) && (
                   <div className="flex flex-col gap-1 mt-1">
                     {ex.sets.map((s, si) => (
                       <div key={si} className="flex justify-between text-[12px] text-[#888] font-bold">
                         <span>第 <span className="font-['DIN_Alternate',sans-serif] text-[#aaa]">{si + 1}</span> 组</span>
                         {data.trainTag === 'stretch' ? (
                            <span className="font-['DIN_Alternate',sans-serif] text-[#aaa]">
                                {s ? s.duration : 0}min
                            </span>
                         ) : (s && (s.duration || s.distance)) ? (
                           <span className="font-['DIN_Alternate',sans-serif] text-[#aaa]">
                             {s.distance ? (
                                 <>
                                     {s.distance}km
                                     {s.duration && ` · ${s.duration}min`}
                                 </>
                             ) : (
                                 <>
                                     {s.duration}{' '}
                                     {ex.cardioMetric === 'distance'
                                       ? 'm'
                                       : ex.cardioMetric === 'count'
                                         ? '次'
                                         : 'min'}
                                 </>
                             )}
                           </span>
                         ) : (
                           <span className="font-['DIN_Alternate',sans-serif] text-[#aaa]">{s ? s.weight : 0} {ex.unit || 'kg'} × {s ? s.reps : 0}</span>
                         )}
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            ))}
          </div>
       )}
    </div>
  );
}

// 导出分享预览
function PosterPreviewModal({ data, onClose }) {
  const ref = useRef(null);
  const [includeJournal, setIncludeJournal] = useState(true);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!data) return null;
  const save = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { backgroundColor: '#0f0f0f', scale: 2 });
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = data.type === 'monthly' ? 'UP-Monthly-Report.png' : data.type === 'annual' ? 'UP-Annual-Report.png' : data.type === 'weekly' ? 'UP-Weekly-Report.png' : 'UP-Training-Poster.png';
    a.click();
  };
  const date = data.date ? new Date(data.date) : new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth()+1).padStart(2,'0');
  const dd = String(date.getDate()).padStart(2,'0');
  const hh = String(date.getHours()).padStart(2,'0');
  const mi = String(date.getMinutes()).padStart(2,'0');
  const greeting = data.profile?.username || 'Athlete';
  const calcSetsAndVolume = () => {
    let sets = 0, vol = 0;
    (data.exercises || []).forEach(ex => {
      (ex.sets || []).forEach(s => {
        sets += 1;
        if (s.weight && s.reps) {
          const ratio = (ex.unit === 'lbs') ? 0.453592 : 1;
          vol += (parseFloat(s.weight)||0) * (parseInt(s.reps)||0) * ratio;
        }
      });
    });
    return { sets, volume: Math.round(vol) };
  };
  const calcKcal = () => {
    if (typeof data.kcal === 'number') return data.kcal;
    const weightKg = parseFloat(data.profile?.weight || 65);
    const baseModeId = data.modeId || 'evolution';

    if (data.type === 'challenge') {
      let durationMin = 0;
      if (data.duration) {
        const parts = String(data.duration).split(':');
        if (parts.length === 2) {
          const mins = parseInt(parts[0]) || 0;
          const secs = parseInt(parts[1]) || 0;
          durationMin = mins + secs / 60;
        }
      }
      if (!durationMin) {
        const mode = CHALLENGE_MODES.find(v => v.id === baseModeId);
        if (mode && typeof mode.time === 'string' && mode.time.endsWith('min')) {
          const baseMin = parseFloat(mode.time) || 0;
          durationMin = baseMin;
        } else {
          durationMin = 10;
        }
      }
      return calculateCalories('BODYWEIGHT_STRENGTH', weightKg, durationMin, true, baseModeId);
    }

    const t = {
      duration: data.duration,
      exercises: Array.isArray(data.exercises) ? data.exercises : []
    };
    if (!Array.isArray(t.exercises) || t.exercises.length === 0) return 0;

    let durationMin = 0;
    let hasSetDuration = false;
    t.exercises.forEach(ex => {
      if (!Array.isArray(ex.sets)) return;
      ex.sets.forEach(s => {
        if (s.duration) {
          hasSetDuration = true;
          durationMin += parseFloat(s.duration) || 0;
        }
      });
    });
    if (!hasSetDuration && t.duration) {
      const parts = String(t.duration).split(':');
      if (parts.length === 2) {
        const mins = parseInt(parts[0]) || 0;
        const secs = parseInt(parts[1]) || 0;
        durationMin += mins + Math.floor(secs / 60);
      } else {
        durationMin += parseFloat(t.duration) || 0;
      }
    }
    if (durationMin <= 0) return 0;
    const anyDurationSet = t.exercises.some(ex => Array.isArray(ex.sets) && ex.sets.some(s => s.duration));
    const isAnaerobic = !anyDurationSet;
    const activityKey = isAnaerobic ? 'WEIGHT_LIFTING' : 'RUNNING_MID';
    return calculateCalories(activityKey, weightKg, durationMin, isAnaerobic, baseModeId);
  };
  const { sets, volume } = calcSetsAndVolume();
  const kcal = data.kcal !== undefined ? data.kcal : calcKcal();

  // Normalize data into entries for unified display
  const entries = (() => {
    if (data.type === 'weekly' || data.type === 'monthly' || data.type === 'annual') return [];
    
    // Resolve challenge metadata from various possible keys
    const challengeText = data.challengeText || data._challengeText || data.challenge || null;
    const challengeDuration = data.challengeDuration || data._challengeDuration || (data.type === 'challenge' ? data.duration : null);
    const challengeJournalText = data.challengeJournalText || data._challengeJournalText || (data.type === 'challenge' ? data.journalText : null);
    const challengeJournalImage = data.challengeJournalImage || data._challengeJournalImage || (data.type === 'challenge' ? data.journalImage : null);

    let list = Array.isArray(data.entries) && data.entries.length > 0
      ? JSON.parse(JSON.stringify(data.entries))
      : ((data.exercises && data.exercises.length) || data.duration || data.summary || data.type === 'challenge'
          ? [{
              type: data.type === 'challenge' ? '挑战' : (data.type || data.trainTag || '训练'),
              muscleSummary: data.muscleSummary || data.summary || (data.type === 'challenge' ? (challengeText || '挑战完成') : ''),
              duration: data.duration || '',
              exercises: data.exercises || [],
              journalText: data.journalText || '',
              journalImage: data.journalImage || null,
              weight: data.weight,
              trainTag: data.trainTag,
              modeId: data.modeId,
              kcal: kcal,
              isChallenge: data.type === 'challenge'
            }]
          : []);

    // Handle Challenge if not already in entries
    if (challengeText || data.type === 'challenge' || (data.modeId && ['novice', 'evolution', 'crazy', 'custom'].includes(data.modeId))) {
         const challengeIndex = list.findIndex(e => e.type === 'Challenge' || e.type === 'challenge' || e.type === '挑战' || e.isChallenge || (e.modeId && ['novice', 'evolution', 'crazy', 'custom'].includes(e.modeId)));
         
         if (challengeIndex >= 0) {
             // Patch existing challenge entry if needed to ensure display consistency
             const existing = list[challengeIndex];
             if ((!existing.muscleSummary || existing.muscleSummary === '挑战完成') && challengeText) {
                 existing.muscleSummary = challengeText;
                 existing.summary = challengeText;
             }
             if (!existing.duration && challengeDuration) existing.duration = challengeDuration;
             if (!existing.journalText && challengeJournalText) existing.journalText = challengeJournalText;
             if (!existing.journalImage && challengeJournalImage) existing.journalImage = challengeJournalImage;
             if (!existing.modeId && data.modeId) existing.modeId = data.modeId;
             if ((existing.kcal === undefined || existing.kcal === 0)) {
                 let cDur = existing.duration || challengeDuration;
                 let cMins = 0;
                 if (cDur) {
                    const parts = String(cDur).split(':');
                    if (parts.length === 2) {
                        cMins = (parseInt(parts[0])||0) + (parseInt(parts[1])||0)/60;
                    } else {
                        cMins = parseFloat(cDur)||0;
                    }
                 }
                 if (!cMins) cMins = 10; // Default 10 mins for challenge if unknown
                 
                 const weightKg = parseFloat(data.profile?.weight || 65);
                 existing.kcal = calculateCalories('BODYWEIGHT_STRENGTH', weightKg, cMins, true, data.modeId || 'evolution');
             }
             existing.isChallenge = true;
         } else if (challengeText || challengeDuration) {
             // Calculate kcal for new entry
             let cMins = 0;
             if (challengeDuration) {
                const parts = String(challengeDuration).split(':');
                if (parts.length === 2) {
                    cMins = (parseInt(parts[0])||0) + (parseInt(parts[1])||0)/60;
                } else {
                    cMins = parseFloat(challengeDuration)||0;
                }
             }
             if (!cMins) cMins = 10;
             const weightKg = parseFloat(data.profile?.weight || 65);
             const cKcal = calculateCalories('BODYWEIGHT_STRENGTH', weightKg, cMins, true, data.modeId || 'evolution');

             list.unshift({
                 type: '挑战',
                 summary: challengeText || '挑战完成',
                 muscleSummary: challengeText || '挑战完成',
                 duration: challengeDuration,
                 journalText: challengeJournalText,
                 journalImage: challengeJournalImage,
                 kcal: cKcal,
                 modeId: data.modeId,
                 isChallenge: true
             });
         }
    }
    return list;
  })();

  return (
    <div className="fixed inset-0 z-[10000] bg-[#111]/80 backdrop-blur-sm overflow-y-auto font-['Microsoft_YaHei',sans-serif]" onClick={onClose}>
      <div className="w-full max-w-md mx-auto p-6" onClick={e=>e.stopPropagation()}>
        {!(data.type === 'weekly' || data.type === 'monthly' || data.type === 'annual') && (
          <div className="flex items-center justify-end mb-3">
            <span className="text-[#bbb] text-sm font-bold mr-2">健身日记</span>
            <button
              type="button"
              aria-pressed={includeJournal}
              onClick={()=>setIncludeJournal(v=>!v)}
              className={`w-10 h-6 rounded-xl relative transition-colors ${includeJournal ? 'bg-[#E8F583]' : 'bg-[#444]'}`}
              title="包含健身日记"
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-lg bg-[#202020] transition-transform ${includeJournal ? 'translate-x-4' : 'translate-x-0'}`}></span>
            </button>
          </div>
        )}
        <div ref={ref} className="rounded-[28px] p-6 bg-[#121212] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#E8F583] flex items-center justify-center text-[#202020] font-black">
              {data.profile?.avatar ? <img src={data.profile.avatar} alt="" className="w-full h-full object-cover"/> : (data.profile?.username?.[0]?.toUpperCase() || 'U')}
            </div>
            <div>
              <div className="text-white font-bold">{greeting}</div>
              <div className="text-[#888] text-xs font-bold">{yyyy}-{mm}-{dd}</div>
            </div>
          </div>
          {data.type === 'monthly' ? (
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 mb-4">
              <div className="text-white font-bold text-lg mb-3">MONTHLY REPORT</div>
              {data.heat?.type === 'month' && (
                <div className="mb-4">
                  <div className="grid grid-cols-7 gap-2 mb-2 text-[10px] text-[#888] font-bold text-center">
                    {['S','M','T','W','T','F','S'].map((w,i)=><div key={i}>{w}</div>)}
                  </div>
                  {(() => {
                    const y = data.heat?.year;
                    const m0 = (data.heat?.month || 1) - 1;
                    const firstDow = new Date(y || date.getFullYear(), m0, 1).getDay();
                    const days = data.heat?.days || [];
                    const cells = [];
                    for (let i=0;i<firstDow;i++) cells.push(null);
                    for (let i=0;i<days.length;i++) cells.push(days[i]);
                    return (
                      <div className="grid grid-cols-7 gap-2">
                        {cells.map((v, i) => (
                          <div key={i} className={`w-full aspect-square rounded-md ${v===null ? 'bg-transparent' : v===2 ? 'bg-[#E8F583]' : v===1 ? 'border border-[#E8F583]' : 'bg-[#1a1a1a]'}`}></div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
              {(() => {
                const days = data.heat?.days || [];
                let longest = 0, curr = 0;
                days.forEach(v => { if (v>0) { curr+=1; if (curr>longest) longest=curr; } else { curr=0; } });
                return (
                  <div className="grid grid-cols-4 gap-3 items-end">
                    <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] text-[#888] font-bold leading-none">本月训练</div>
                      <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{data.stats?.sessions || 0}</div>
                    </div>
                    <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] text-[#888] font-bold leading-none">本月打卡</div>
                      <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{data.stats?.days || 0}</div>
                    </div>
                    <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] text-[#888] font-bold leading-none whitespace-nowrap">总消耗/kcal</div>
                      <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{data.stats?.kcal || 0}</div>
                    </div>
                    <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] text-[#888] font-bold leading-none">最长连胜</div>
                      <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{longest}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : data.type === 'annual' ? (
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 mb-4">
              <div className="text-white font-bold text-lg mb-3">ANNUAL REPORT</div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(data.annual?.months || []).map((m, mi) => (
                  <div key={mi} className="bg-[#202020] p-2 rounded-xl border border-white/5">
                    <div className="text-[10px] text-[#aaa] font-bold mb-1">{['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][mi]}</div>
                    <div className="grid grid-cols-7 gap-1">
                      {m.days.map((v, i) => (
                        <div key={i} className={`w-2 h-2 rounded-sm ${v===2 ? 'bg-[#E8F583]' : v===1 ? 'border border-[#E8F583]' : 'bg-[#1a1a1a]'}`}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">总打卡数</div>
                  <div className="text-xl text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{data.agg?.totalDays || 0}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">总训练数</div>
                  <div className="text-xl text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{data.agg?.totalSessions || 0}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none whitespace-nowrap">总消耗/kcal</div>
                  <div className="text-xl text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{data.agg?.totalKcal || 0}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <div className="text-[10px] text-[#888] font-bold leading-none">最长连胜</div>
                  <div className="text-xl text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{data.agg?.longestStreak || 0}</div>
                </div>
              </div>
            </div>
          ) : data.type === 'weekly' ? (
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 mb-4">
              <div className="text-white font-bold text-lg mb-3">WEEKLY CHECK-IN</div>
              <div className="grid grid-cols-7 gap-2 mb-3">
                {(data.heat?.values || []).map((v, i) => (
                  <div key={i} className={`h-6 rounded-md ${v===2 ? 'bg-[#E8F583]' : v===1 ? 'border border-[#E8F583]' : 'bg-[#1a1a1a]'}`}></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold">本周训练</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif]">{data.stats?.sessions || 0}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold">本周打卡</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif]">{data.stats?.days || 0}</div>
                </div>
                <div className="bg-[#202020] rounded-xl p-3 text-center">
                  <div className="text-[10px] text-[#888] font-bold whitespace-nowrap">总消耗/kcal</div>
                  <div className="text-lg text-white font-['DIN_Alternate',sans-serif] mt-1 leading-none">{data.stats?.kcal || 0}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              {entries.length > 0 ? entries.map((entry, idx) => (
                <RecordCard 
                  key={idx} 
                  data={entry} 
                  includeJournal={includeJournal} 
                  showKcal={true} 
                  forceHighlight={true}
                />
              )) : (
                 <div className="text-[#888] text-center py-4">暂无数据</div>
              )}
            </div>
          )}
          <div className="text-[#666] text-[11px] font-bold uppercase tracking-widest text-center">Powered by My Fitness Journey</div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={save} className="flex-1 py-3.5 bg-[#E8F583] text-[#202020] rounded-2xl font-bold shadow-lg">保存到本地相册</button>
          <button onClick={onClose} className="flex-1 py-3.5 bg-[#303030] text-white rounded-2xl font-bold">关闭</button>
        </div>
      </div>
    </div>
  );
}

// --- Home Tab ---
function HomeTab({ profileData, selectedModeId, onOpenChallenge, isChallengeCompletedToday, isAnyCompleted, streak, todayTrainings, history, onSelectHistory, onOpenCalendar, onOpenReportCenter, onEditProfile, onToast, activeTaskText, challengeJournal, lastChallengeDuration }) {
  const hasStreak = streak > 0;
  const now = new Date();
  const [weekOffset, setWeekOffset] = useState(0); // 0 为本周，负数为过去周
  const dayOfWeek = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - dayOfWeek + weekOffset * 7);
  const monthNamesUpper = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const currentMonthTitle = `${monthNamesUpper[now.getMonth()]} ${now.getFullYear()}`;
  const dayLabels = ['M','T','W','T','F','S','S'];
  const readDaily = () => {
    try { return JSON.parse(localStorage.getItem('fitnessApp_daily') || '{}'); } catch { return {}; }
  };
  const readStats = () => {
    try { 
      const raw = JSON.parse(localStorage.getItem('fitnessApp_stats') || '{}');
      if (!raw.months) raw.months = {};
      return raw;
    } catch { return { months: {} }; }
  };
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { day: dayLabels[i], date: d.getDate(), fullDate: new Date(d), active: d.toDateString() === now.toDateString() };
  });
  const dailyStore = readDaily();
  const touchRef = useRef({x:0,y:0});
  
  let fireOuterClass = '';
  let fireInnerClass = '';
  
  if (isAnyCompleted) {
    fireOuterClass = 'fill-orange-500 drop-shadow-[0_0_15px_rgba(255,165,0,0.8)]';
    fireInnerClass = 'fill-yellow-300';
  } else if (hasStreak) {
    fireOuterClass = 'fill-orange-500 drop-shadow-[0_0_15px_rgba(255,165,0,0.6)] animate-[pulse_2.5s_ease-in-out_infinite] opacity-90';
    fireInnerClass = 'fill-yellow-300 opacity-90';
  } else {
    fireOuterClass = 'fill-[#444444] opacity-50';
    fireInnerClass = 'fill-[#666666] opacity-50';
  }

  const currentMode = CHALLENGE_MODES.find(m => m.id === selectedModeId) || CHALLENGE_MODES[1];
  const [anaRange, setAnaRange] = useState('week');
  const [showBodyFat, setShowBodyFat] = useState(false);
  const [donutType, setDonutType] = useState('strength');
  const [selectedStrengthItem, setSelectedStrengthItem] = useState(null);
  const [selectedCardioItem, setSelectedCardioItem] = useState(null);

  // Data Aggregation
  const strengthCounts = {};
  const cardioCounts = {};
  const allTrainings = history || [];

  const getMuscleGroup = (name) => {
    if (!STATIC_EXERCISE_DB?.anaerobic) return '其他';
    for (const [group, list] of Object.entries(STATIC_EXERCISE_DB.anaerobic)) {
      if (list.some(ex => ex.name === name)) return group;
    }
    return '其他';
  };
  
  const getCardioType = (name) => {
    if (!STATIC_EXERCISE_DB?.aerobic) return null;
    for (const [type, list] of Object.entries(STATIC_EXERCISE_DB.aerobic)) {
      if (list.some(ex => ex.name === name)) return type;
    }
    return null;
  };

  allTrainings.forEach(t => {
    if (t.exercises) {
      t.exercises.forEach(ex => {
         const cType = getCardioType(ex.name);
         if (cType) {
             cardioCounts[cType] = (cardioCounts[cType] || 0) + 1;
         } else {
             const key = ex.isCustom ? (ex.muscle || '其他') : getMuscleGroup(ex.name);
             strengthCounts[key] = (strengthCounts[key] || 0) + 1;
         }
      });
    }
  });

  let strengthData = Object.entries(strengthCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  let cardioData = Object.entries(cardioCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  
  if (strengthData.length === 0) strengthData = [{ name: '无记录', value: 1 }];
  if (cardioData.length === 0) cardioData = [{ name: '无记录', value: 1 }];

  const currentDonutData = donutType === 'strength' ? strengthData : cardioData;
  const selectedItem = donutType === 'strength' ? selectedStrengthItem : selectedCardioItem;
  const totalValue = currentDonutData.reduce((acc, cur) => acc + cur.value, 0);
  const displayValue = selectedItem ? selectedItem.value : totalValue;
  const displayLabel = selectedItem ? selectedItem.name : (donutType === 'strength' ? '总览' : '总览');
  const displayPercent = selectedItem ? Math.round((selectedItem.value / totalValue) * 100) + '%' : '100%';

  const [analyticsDate, setAnalyticsDate] = useState(new Date());

  const handlePrevPeriod = () => {
    const d = new Date(analyticsDate);
    if (anaRange === 'week') d.setDate(d.getDate() - 7);
    else if (anaRange === 'month') d.setMonth(d.getMonth() - 1);
    else d.setFullYear(d.getFullYear() - 1);
    setAnalyticsDate(d);
  };

  const handleNextPeriod = () => {
    const d = new Date(analyticsDate);
    if (anaRange === 'week') d.setDate(d.getDate() + 7);
    else if (anaRange === 'month') d.setMonth(d.getMonth() + 1);
    else d.setFullYear(d.getFullYear() + 1);
    setAnalyticsDate(d);
  };

  const analytics = React.useMemo(() => {
    try {
      const anchor = new Date(analyticsDate);
      const dStore = readDaily();
      const stats = readStats();

      const weekData = [];
      let weekKcalTotal = 0;
      const weekStart = new Date(anchor);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const dayStr = d.toDateString();
        const dayLabel = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
        
        const dayTrainings = (history || []).filter(h => new Date(h.date).toDateString() === dayStr);
        const sessions = dayTrainings.length;
        let duration = 0;
        dayTrainings.forEach(t => { 
          if (typeof t.duration === 'string' && t.duration.includes(':')) {
             const parts = t.duration.split(':');
             duration += parseInt(parts[0]) * 60 + parseInt(parts[1]);
          } else {
             duration += (parseInt(t.duration) || 0);
          }
        });
        const y = d.getFullYear();
        const m = String(d.getMonth()+1).padStart(2,'0');
        const dd = String(d.getDate()).padStart(2,'0');
        const key = `${y}-${m}-${dd}`;
        const dayInfo = dStore[key] || {};
        const dayKcal = dayInfo.kcal || 0;
        const dayWeight = dayInfo.weight != null ? parseFloat(dayInfo.weight) : parseFloat(profileData?.weight || 0);
        const dayFat = dayInfo.bodyFat != null ? parseFloat(dayInfo.bodyFat) : parseFloat(profileData?.bodyFat || 0);
        weekKcalTotal += dayKcal;
        
        weekData.push({
          name: dayLabel,
          durationPlot: duration, 
          durationRaw: duration,
          sessions,
          weight: dayWeight,
          fat: dayFat,
          kcal: dayKcal,
          kcalPlot: dayKcal * 0.4
        });
      }

      const monthData = [];
      const year = anchor.getFullYear();
      const month = anchor.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let monthKcalTotal = 0;
      for (let i = 1; i <= daysInMonth; i++) {
          const d = new Date(year, month, i);
          const dayStr = d.toDateString();
          const dayTrainings = (history || []).filter(h => new Date(h.date).toDateString() === dayStr);
          let duration = 0;
          dayTrainings.forEach(t => { 
            if (typeof t.duration === 'string' && t.duration.includes(':')) {
               const parts = t.duration.split(':');
               duration += parseInt(parts[0]) * 60 + parseInt(parts[1]);
            } else {
               duration += (parseInt(t.duration) || 0);
            }
          });
          const y = d.getFullYear();
          const m = String(d.getMonth()+1).padStart(2,'0');
          const dd = String(d.getDate()).padStart(2,'0');
          const key = `${y}-${m}-${dd}`;
          const dayInfo = dStore[key] || {};
          const kcal = dayInfo.kcal || 0;
          const dayWeight = dayInfo.weight != null ? parseFloat(dayInfo.weight) : parseFloat(profileData?.weight || 0);
          const dayFat = dayInfo.bodyFat != null ? parseFloat(dayInfo.bodyFat) : parseFloat(profileData?.bodyFat || 0);
          monthKcalTotal += kcal;
          monthData.push({ 
            name: `${i}`, 
            durationPlot: duration, 
            durationRaw: duration,
            sessions: dayTrainings.length,
            kcal,
            kcalPlot: kcal * 0.4,
            weight: dayWeight,
            fat: dayFat
          });
      }

      const yearData = [];
      let yearKcalTotal = 0;
      for (let i = 0; i < 12; i++) {
          const d = new Date(anchor.getFullYear(), i, 1);
          const monthKey = `${d.getFullYear()}-${String(i+1).padStart(2,'0')}`;
          const monthTrainings = (history || []).filter(h => {
              const hd = new Date(h.date);
              return hd.getFullYear() === d.getFullYear() && hd.getMonth() === i;
          });
          let duration = 0;
          monthTrainings.forEach(t => { 
              if (typeof t.duration === 'string' && t.duration.includes(':')) {
                 const parts = t.duration.split(':');
                 duration += parseInt(parts[0]) * 60 + parseInt(parts[1]);
              } else {
                 duration += (parseInt(t.duration) || 0);
              }
          });
          const monthStats = stats.months?.[monthKey] || {};
          const kcal = monthStats.kcal || 0;
          yearKcalTotal += kcal;

          let monthWeight = parseFloat(profileData?.weight || 0);
          let monthFat = parseFloat(profileData?.bodyFat || 0);
          const daysInThisMonth = new Date(d.getFullYear(), i + 1, 0).getDate();
          for (let day = daysInThisMonth; day >= 1; day--) {
            const dd = String(day).padStart(2,'0');
            const key = `${d.getFullYear()}-${String(i+1).padStart(2,'0')}-${dd}`;
            const info = dStore[key];
            if (info && (info.weight != null || info.bodyFat != null)) {
              if (info.weight != null) monthWeight = parseFloat(info.weight);
              if (info.bodyFat != null) monthFat = parseFloat(info.bodyFat);
              break;
            }
          }

          yearData.push({ 
            name: monthNamesUpper[i].substring(0,3), 
            durationPlot: duration, 
            durationRaw: duration,
            sessions: monthTrainings.length,
            sessionsPlot: monthTrainings.length * 10,
            kcal,
            kcalPlot: kcal * 0.4,
            weight: monthWeight,
            fat: monthFat
          });
      }

      return { 
        week: weekData, 
        month: monthData, 
        year: yearData,
        weekKcal: weekKcalTotal,
        monthKcal: monthKcalTotal,
        yearKcal: yearKcalTotal
      };
    } catch (e) {
      console.error('Analytics error:', e);
      return { week: [], month: [], year: [], weekKcal: 0, monthKcal: 0, yearKcal: 0 };
    }
  }, [history, profileData, analyticsDate]);
  const safeAnalytics = analytics || { week: [], month: [], year: [], weekKcal: 0, monthKcal: 0, yearKcal: 0 };
  const data = Array.isArray(safeAnalytics[anaRange]) ? safeAnalytics[anaRange] : [];
  const totalKcal = anaRange === 'week'
    ? (safeAnalytics.weekKcal || 0)
    : (anaRange === 'month'
        ? (safeAnalytics.monthKcal || 0)
        : (safeAnalytics.yearKcal || 0));
  const kcalDigits = String(totalKcal).length;
  const kcalSizeClass = kcalDigits >= 6 ? 'text-xl' : (kcalDigits >= 5 ? 'text-2xl' : 'text-3xl');

  return (
    <div className="px-6 pt-14 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Microsoft_YaHei',sans-serif]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-light text-[#CCCCCC] mb-1 tracking-wider font-['DIN_Alternate',sans-serif] uppercase">Your Activity</h2>
          <h1 className="text-3xl font-bold text-white tracking-wide font-['DIN_Alternate',sans-serif]">{currentMonthTitle}</h1>
        </div>
        <div 
          onClick={onEditProfile}
          className="w-12 h-12 rounded-full bg-[#c4b5fd] flex items-center justify-center border-2 border-[#202020] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] cursor-pointer active:scale-95 transition-transform"
        >
          <User size={24} className="text-[#202020]" />
        </div>
      </div>
 

      <div 
        className="flex justify-between items-center mb-8"
        onTouchStart={(e)=>{ touchRef.current.x = e.changedTouches[0].clientX; touchRef.current.y = e.changedTouches[0].clientY; }}
        onTouchEnd={(e)=>{ 
          const dx = e.changedTouches[0].clientX - touchRef.current.x;
          const dy = e.changedTouches[0].clientY - touchRef.current.y;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx > 0) setWeekOffset(v => v - 1); // 右滑看更早的周
            else setWeekOffset(v => Math.min(v + 1, 0)); // 左滑回到更近的周，最多到本周
          }
        }}
      >
        {days.map((d, i) => {
          const isToday = d.active;
          const dayDate = new Date(d.fullDate);
          dayDate.setHours(0,0,0,0);
          const y = dayDate.getFullYear();
          const m = String(dayDate.getMonth()+1).padStart(2,'0');
          const dd = String(dayDate.getDate()).padStart(2,'0');
          const dayKey = `${y}-${m}-${dd}`;
          const dayInfo = dailyStore[dayKey] || {};
          const isCheckedIn = !!(dayInfo.training || dayInfo.challenge);
          return (
            <div 
              key={i} 
              className="flex flex-col items-center gap-3 cursor-pointer"
              onClick={() => {
                const clicked = d.fullDate;
                const today0 = new Date();
                today0.setHours(0,0,0,0);
                if (clicked.getTime() > today0.getTime()) return;
                  const dayItems = (history || []).filter(h => new Date(h.date).toDateString() === clicked.toDateString());
                  const dStore = readDaily();
                  const y = clicked.getFullYear();
                  const m = String(clicked.getMonth()+1).padStart(2,'0');
                  const dNum = String(clicked.getDate()).padStart(2,'0');
                  const dayKey = `${y}-${m}-${dNum}`;
                  const dd = dStore[dayKey] || {};
                  if (dayItems.length > 0) {
                    onSelectHistory({
                      date: dayKey,
                      entries: dayItems.map(it => ({
                        type: it.type || it.trainTag || '训练',
                        muscleSummary: it.muscleSummary || it.summary || '',
                        duration: it.duration || '',
                        exercises: it.exercises || [],
                        journalText: it.journalText || '',
                        journalImage: it.journalImage || null,
                        weight: it.weight,
                        trainTag: it.trainTag,
                        modeId: it.modeId
                      })),
                      _source: 'week',
                      _challengeText: dd.challenge ? (dd.challengeText || activeTaskText || '今日挑战完成') : null,
                      _challengeJournalText: dd.challengeJournalText || null,
                      _challengeJournalImage: dd.challengeJournalImage || null,
                      _challengeDuration: dd.challengeDuration || (isToday ? (lastChallengeDuration || null) : null),
                      _dailyKcal: typeof dd.kcal === 'number' ? dd.kcal : 0
                    });
                  } else if (isToday && todayTrainings.length > 0) {
                    const todaysTrainings = todayTrainings.filter(t => {
                      try {
                        return t.date && new Date(t.date).toDateString() === clicked.toDateString();
                      } catch {
                        return false;
                      }
                    });
                    const latest = todaysTrainings[todaysTrainings.length - 1];
                    if (latest) {
                      onSelectHistory({
                        date: dayKey,
                        entries: [{
                          type: latest.type || latest.trainTag || '训练',
                          muscleSummary: latest.muscleSummary || latest.summary || '',
                          duration: latest.duration || '',
                          exercises: latest.exercises || [],
                          journalText: latest.journalText || '',
                          journalImage: latest.journalImage || null,
                          weight: latest.weight,
                          trainTag: latest.trainTag,
                          modeId: latest.modeId
                        }],
                        _source: 'week',
                        _challengeText: dd.challenge ? (dd.challengeText || activeTaskText || '今日挑战完成') : null,
                        _challengeJournalText: dd.challengeJournalText || null,
                        _challengeJournalImage: dd.challengeJournalImage || null,
                        _challengeDuration: dd.challengeDuration || (isToday ? (lastChallengeDuration || null) : null),
                        _dailyKcal: typeof dd.kcal === 'number' ? dd.kcal : 0
                      });
                    } else {
                      onSelectHistory({
                        date: dayKey,
                        entries: [],
                        _source: 'week',
                        _challengeText: dd.challenge ? (dd.challengeText || activeTaskText || '今日挑战完成') : null,
                        _challengeJournalText: dd.challengeJournalText || null,
                        _challengeJournalImage: dd.challengeJournalImage || null,
                        _challengeDuration: dd.challengeDuration || (isToday ? (lastChallengeDuration || null) : null),
                        _dailyKcal: typeof dd.kcal === 'number' ? dd.kcal : 0
                      });
                    }
                  } else {
                    onSelectHistory({
                      date: dayKey,
                      entries: [],
                      _source: 'week',
                      _challengeText: dd.challenge ? (dd.challengeText || activeTaskText || '今日挑战完成') : null,
                      _challengeJournalText: dd.challengeJournalText || null,
                      _challengeJournalImage: dd.challengeJournalImage || null,
                      _challengeDuration: dd.challengeDuration || (isToday ? (lastChallengeDuration || null) : null),
                      _dailyKcal: typeof dd.kcal === 'number' ? dd.kcal : 0
                    });
                  }
              }}
            >
              <span className="text-[#888888] text-[13px] font-bold font-['DIN_Alternate',sans-serif]">{d.day}</span>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold font-['DIN_Alternate',sans-serif] transition-all relative
                ${isToday ? 'scale-110 shadow-[0_0_15px_rgba(232,245,131,0.2)]' : ''}
                ${isCheckedIn 
                  ? 'bg-[#E8F583] text-[#202020]' 
                  : isToday 
                    ? 'border-2 border-[#E8F583] text-[#E8F583] bg-transparent' 
                    : 'text-[#CCCCCC] border border-white/10 hover:border-white/30'}`}
              >
                {d.date}
              </div>
            </div>
          );
        })}
      </div>

      <div 
        onClick={isChallengeCompletedToday ? undefined : onOpenChallenge}
        className={`w-full rounded-[24px] p-6 mb-6 relative overflow-hidden transition-all duration-300 shadow-xl flex justify-between items-center min-h-[120px]
          ${isChallengeCompletedToday 
            ? 'bg-[#2A2A2A] border border-white/5 cursor-default' 
            : 'bg-[#E8F583] cursor-pointer hover:scale-[0.98] active:scale-[0.95]'}`}
      >
        <div className="relative z-10 flex flex-col items-start text-left">
          <h2 className={`text-[22px] font-black tracking-widest uppercase font-['DIN_Alternate',sans-serif] ${isChallengeCompletedToday ? 'text-white/60' : 'text-[#202020]'}`}>
            READY FOR CHALLENGE?
          </h2>
          <div className={`mt-2.5 px-3 py-1 border-2 rounded-lg text-[13px] font-bold uppercase tracking-[0.1em] font-['DIN_Alternate',sans-serif] 
            ${isChallengeCompletedToday ? 'border-white/20 text-white/40' : 'border-[#202020] text-[#202020]'}`}>
            {currentMode.en}
          </div>
        </div>
        
        {!isChallengeCompletedToday ? (
          <div className="w-12 h-12 rounded-full bg-[#202020] flex items-center justify-center shrink-0 ml-4 shadow-lg">
            <Play size={22} className="text-[#E8F583] translate-x-0.5" fill="currentColor"/>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 ml-4">
            <CheckCircle2 size={26} className="text-white/40" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div 
          onClick={() => {
                if (todayTrainings.length === 1) {
                  const latest = todayTrainings[0];
                  onSelectHistory(latest);
                }
              }}
          className={`bg-[#F0C7FF] rounded-[24px] p-5 text-[#202020] flex flex-col h-40 relative overflow-hidden 
            ${todayTrainings.length === 0 
              ? 'cursor-default shadow-lg'
              : todayTrainings.length === 1
                ? 'cursor-pointer transition-all duration-300 shadow-xl hover:scale-[0.98] active:scale-[0.95]'
                : 'cursor-default shadow-xl'}`}
        >
          <span className="text-base font-bold z-10 shrink-0 font-['DIN_Alternate',sans-serif] uppercase tracking-wider">TRAINING</span>
          
          <div className={`z-10 flex-1 overflow-y-auto no-scrollbar flex flex-col ${todayTrainings.length <= 1 ? 'justify-end' : 'justify-start mt-3'}`}>
            {todayTrainings.length === 0 ? (
               <div className="text-xl font-bold opacity-60 font-['DIN_Alternate',sans-serif] tracking-wide uppercase">NO RECORD</div>
            ) : todayTrainings.length === 1 ? (
               <div>
                 <div className="text-xl font-bold leading-tight line-clamp-2 font-['Microsoft_YaHei',sans-serif]">
                   {todayTrainings[0].muscleSummary}
                 </div>
                 <div className="text-sm opacity-80 mt-1 font-bold font-['DIN_Alternate',sans-serif]">{todayTrainings[0].exercises.length} ACT · {todayTrainings[0].duration}</div>
               </div>
            ) : (
               <div className="flex flex-col gap-2 pb-1">
                 {todayTrainings.map((t, idx) => (
                   <div
                     key={idx}
                     onClick={() => onSelectHistory(t)}
                     className="bg-black/5 p-2.5 rounded-xl border border-black/5 flex justify-between items-center shrink-0 cursor-pointer hover:bg-black/10 active:scale-[0.97] transition-transform"
                   >
                     <div className="text-[14px] font-bold leading-tight line-clamp-1 text-[#202020] font-['Microsoft_YaHei',sans-serif]">{t.muscleSummary}</div>
                     <div className="text-[11px] opacity-70 font-bold whitespace-nowrap ml-2 font-['DIN_Alternate',sans-serif]">{t.exercises.length} ACT</div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>

        <div 
          onClick={onOpenCalendar} 
          className="bg-[#AD9BF0] rounded-[24px] p-5 text-[#202020] flex flex-col justify-center h-40 relative overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:scale-[0.98] active:scale-[0.95] will-change-transform group"
        >
          <div className="z-10 flex flex-col items-start relative top-1">
            <div className="text-[12px] font-bold tracking-[0.15em] mb-1.5 uppercase font-['DIN_Alternate',sans-serif] opacity-80">
              STREAK DAYS
            </div>
            <div className="text-[48px] font-bold font-['DIN_Alternate',sans-serif] leading-none tracking-tighter">
              {streak}
            </div>
          </div>
          <div className="absolute -right-4 -bottom-2 w-28 h-28 flex items-center justify-center pointer-events-none">
            <Flame size={140} strokeWidth={0} className={`absolute transition-all duration-500 ${fireOuterClass}`} />
            <Flame size={80} strokeWidth={0} className={`absolute mt-6 transition-all duration-500 ${fireInnerClass}`} />
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-[24px] p-5 border border-white/5 shadow-lg mb-10 mt-12">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white font-bold text-lg flex items-center gap-2">
            数据分析
            <div className="flex items-center gap-1 ml-2 bg-[#202020] rounded-lg p-1">
                <button onClick={handlePrevPeriod} className="p-1 hover:text-white text-[#888]"><ChevronLeft size={16}/></button>
                <span className="text-[10px] text-[#888] font-mono min-w-[60px] text-center">
                    {anaRange === 'week' && (() => {
                        const end = new Date(analyticsDate);
                        const base = new Date(end);
                        base.setHours(0,0,0,0);
                        const start = new Date(base);
                        start.setDate(base.getDate() - base.getDay());
                        const weekEnd = new Date(start);
                        weekEnd.setDate(start.getDate() + 6);
                        return `${start.getMonth() + 1}/${start.getDate()} - ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
                    })()}
                    {anaRange === 'month' && `${analyticsDate.getFullYear()}-${analyticsDate.getMonth()+1}`}
                    {anaRange === 'year' && `${analyticsDate.getFullYear()}`}
                </span>
                <button onClick={handleNextPeriod} className="p-1 hover:text-white text-[#888]"><ChevronRight size={16}/></button>
            </div>
          </div>
          <div className="flex gap-2 bg-[#151515] p-1 rounded-xl">
            {['week','month','year'].map(k => (
              <button
                key={k}
                onClick={() => setAnaRange(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-['DIN_Alternate',sans-serif] ${anaRange===k ? 'bg-[#E8F583] text-[#202020]' : 'text-[#aaa] hover:text-white'}`}
              >
                {k === 'week' ? '周' : k === 'month' ? '月' : '年'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#151515] rounded-2xl p-4 border border-white/5">
            <div className="text-[#888] text-xs font-bold mb-6">
              {anaRange === 'year' ? '训练时长 / 次数 / 总消耗' : '训练时长 / 总消耗'}
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                {anaRange === 'week' ? (
                  <LineChart data={data} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} />
                    <YAxis yAxisId="left" stroke="#666" tick={{fontSize: 10}} width={30} domain={[0, dataMax => Math.ceil(dataMax * 1.2)]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#AD9BF0" tick={{fontSize: 10}} width={30} domain={[0, dataMax => Math.ceil(dataMax * 1.2)]} />
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ background: '#202020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                      formatter={(value, name, props) => {
                        if (name === 'durationPlot') {
                           const seconds = props.payload.durationRaw ?? value ?? 0;
                           const h = Math.floor(seconds / 3600);
                           const m = Math.floor((seconds % 3600) / 60);
                           const s = seconds % 60;
                           let timeStr = '';
                           if (h > 0) timeStr += `${h}h `;
                           if (m > 0 || h > 0) timeStr += `${m}m `;
                           timeStr += `${s}s`;
                           return [timeStr, '时长'];
                        }
                        if (name === 'kcalPlot') {
                           const raw = props.payload.kcal ?? value ?? 0;
                           return [raw, '总消耗'];
                        }
                        if (name === 'sessionsPlot') {
                          const raw = props.payload.sessions ?? 0;
                          return [raw, '次数'];
                        }
                        return [value, name];
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="durationPlot" stroke="#E8F583" strokeWidth={3} dot={false}/>
                    <Line yAxisId="right" type="monotone" dataKey="kcalPlot" stroke="#AD9BF0" strokeWidth={2} dot={false} strokeDasharray="5 5"/>
                  </LineChart>
                ) : (
                <LineChart data={data} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} />
                    <YAxis yAxisId="left" stroke="#666" tick={{fontSize: 10}} width={30} />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" tick={{fontSize: 10}} width={30} />
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ background: '#202020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                      formatter={(value, name, props) => {
                        if (name === 'durationPlot') {
                           const seconds = props.payload.durationRaw ?? value ?? 0;
                           const h = Math.floor(seconds / 3600);
                           const m = Math.floor((seconds % 3600) / 60);
                           const s = seconds % 60;
                           let timeStr = '';
                           if (h > 0) timeStr += `${h}h `;
                           if (m > 0 || h > 0) timeStr += `${m}m `;
                           timeStr += `${s}s`;
                           return [timeStr, '时长'];
                        }
                        if (name === 'kcalPlot') {
                          const raw = props.payload.kcal ?? value ?? 0;
                          return [raw, '总消耗'];
                        }
                        if (name === 'sessionsPlot') {
                          const raw = props.payload.sessions ?? 0;
                          return [raw, '次数'];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(label) => {
                        if (anaRange === 'month') {
                          const m = analyticsDate.getMonth() + 1;
                          return `${m}/${label}`;
                        }
                        return label;
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="durationPlot" stroke="#E8F583" strokeWidth={3} dot={false} activeDot={false}/>
                    {anaRange === 'month' && (
                      <Line yAxisId="right" type="monotone" dataKey="kcalPlot" stroke="#AD9BF0" strokeWidth={2} dot={false} strokeDasharray="5 5" activeDot={false}/>
                    )}
                    {anaRange === 'year' && (
                      <>
                        <Line yAxisId="right" type="monotone" dataKey="sessionsPlot" stroke="#F0C7FF" strokeWidth={2} dot={false} activeDot={false}/>
                        <Line yAxisId="right" type="monotone" dataKey="kcalPlot" stroke="#AD9BF0" strokeWidth={2} dot={false} strokeDasharray="5 5" activeDot={false}/>
                      </>
                    )}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
              <div className="flex gap-4 mt-3 text-[11px] font-bold">
                <div className="flex items-center gap-2 text-[#E8F583]">
                  <span className="w-2 h-2 rounded-full bg-[#E8F583]"></span> 时长
                </div>
                {anaRange === 'week' && (
                  <div className="flex items-center gap-2 text-[#AD9BF0]">
                    <span className="w-2 h-2 rounded-full bg-[#AD9BF0]"></span> 总消耗
                  </div>
                )}
                {anaRange === 'month' && (
                  <div className="flex items-center gap-2 text-[#AD9BF0]">
                    <span className="w-2 h-2 rounded-full bg-[#AD9BF0]"></span> 总消耗
                  </div>
                )}
                {anaRange === 'year' && (
                  <>
                    <div className="flex items-center gap-2 text-[#F0C7FF]">
                      <span className="w-2 h-2 rounded-full bg-[#F0C7FF]"></span> 次数
                    </div>
                    <div className="flex items-center gap-2 text-[#AD9BF0]">
                      <span className="w-2 h-2 rounded-full bg-[#AD9BF0]"></span> 总消耗
                    </div>
                  </>
                )}
              </div>
          </div>
          <div className="bg-[#151515] rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div className="text-[#888] text-xs font-bold">体重 / 体脂率</div>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowBodyFat(!showBodyFat)}
              >
                <div className={`w-3 h-3 rounded-sm border ${showBodyFat ? 'bg-[#AD9BF0] border-[#AD9BF0]' : 'border-[#666]'}`}>
                  {showBodyFat && <CheckCircle2 size={10} className="text-white" />}
                </div>
                <span className="text-[10px] text-[#888] font-bold">显示体脂率</span>
              </div>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} />
                  <YAxis yAxisId="weight" domain={['auto', 'auto']} stroke="#666" tick={{fontSize: 10}} width={30} />
                  {showBodyFat ? (
                    <YAxis yAxisId="fat" orientation="right" domain={['auto', 'auto']} stroke="#666" tick={{fontSize: 10}} width={30} />
                  ) : (
                    <YAxis yAxisId="fat" orientation="right" width={30} tick={false} axisLine={false} tickLine={false} stroke="transparent" />
                  )}
                  <Tooltip 
                    cursor={false}
                    contentStyle={{ background: '#202020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                    labelFormatter={(label) => {
                      if (anaRange === 'month') {
                        const m = analyticsDate.getMonth() + 1;
                        return `${m}/${label}`;
                      }
                      return label;
                    }}
                  />
                  <Line yAxisId="weight" type="monotone" dataKey="weight" stroke="#F0C7FF" strokeWidth={3} dot={false} activeDot={false} />
                  {showBodyFat && (
                    <Line yAxisId="fat" type="monotone" dataKey="fat" stroke="#FFFFFF" strokeWidth={1} strokeDasharray="4 4" dot={false} activeDot={false} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-[#151515] rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-[#888] text-xs font-bold">训练分布</div>
              <div className="flex bg-[#202020] rounded-lg p-0.5">
                <button 
                  onClick={() => setDonutType('strength')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${donutType === 'strength' ? 'bg-[#AD9BF0] text-white' : 'text-[#666]'}`}
                >
                  无氧
                </button>
                <button 
                  onClick={() => setDonutType('cardio')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${donutType === 'cardio' ? 'bg-[#AD9BF0] text-white' : 'text-[#666]'}`}
                >
                  有氧
                </button>
              </div>
            </div>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%" className="focus:outline-none" style={{ outline: 'none' }}>
                <PieChart className="focus:outline-none" style={{ outline: 'none' }}>
                  <Pie
                    data={currentDonutData}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    cornerRadius={4}
                    dataKey="value"
                    labelLine={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, x, y }) => (
                      <text x={x} y={y} fill="#cccccc" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
                        {name}
                      </text>
                    )}
                    onClick={(data) => {
                      if (donutType === 'strength') setSelectedStrengthItem(data);
                      else setSelectedCardioItem(data);
                    }}
                  >
                    {currentDonutData.map((entry, index) => {
                      const opacity = [1.0, 0.6, 0.3, 0.15, 0.08, 0.05][index % 6];
                      const isSelected = selectedItem && selectedItem.name === entry.name;
                      return <Cell key={`cell-${index}`} fill={`rgba(173, 155, 240, ${opacity})`} stroke={isSelected ? 'white' : 'none'} strokeWidth={isSelected ? 2 : 0} />;
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none flex flex-col items-center justify-center">
                 <div className="text-2xl font-bold text-white font-['DIN_Alternate',sans-serif] leading-none mb-1">
                   {displayPercent}
                 </div>
                 <div className="text-[10px] text-[#888] font-bold">{displayLabel}</div>
                 {selectedItem && <div className="text-[10px] text-[#AD9BF0] font-bold font-['DIN_Alternate',sans-serif] mt-0.5">{displayValue} 次</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Challenge Prep & Execution ---
function ChallengePrepScreen({ modeId, customTaskText, recentChallenges, onClose, onStart }) {
  const mode = CHALLENGE_MODES.find(m => m.id === modeId) || CHALLENGE_MODES[1];
  
  const getAvailableTasks = () => {
    if (modeId === 'custom') return [customTaskText];
    const allTasks = TASK_POOL[modeId] || TASK_POOL['evolution'];
    const filtered = allTasks.filter(t => !recentChallenges.includes(t));
    return filtered.length > 0 ? filtered : allTasks; 
  };

  const tasks = getAvailableTasks();
  const [taskIndex, setTaskIndex] = useState(Math.floor(Math.random() * tasks.length));
  const [swaps, setSwaps] = useState(modeId === 'custom' ? 0 : 3);
  const [animState, setAnimState] = useState('idle');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSwap = () => {
    if (swaps <= 0 || animState !== 'idle' || tasks.length <= 1) return;
    setAnimState('out');
    setTimeout(() => {
      setTaskIndex(prev => (prev + 1) % tasks.length);
      setSwaps(s => s - 1);
      setAnimState('in'); 
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimState('idle')));
    }, 200); 
  };

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-50 bg-[#202020] flex flex-col animate-in zoom-in-95 fade-in duration-300 origin-top font-['Microsoft_YaHei',sans-serif]">
      <div className="px-6 pt-14 pb-4 flex justify-between items-center z-10 bg-[#202020]">
        <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
          <X size={20} />
        </button>
        <span className="text-lg font-bold tracking-wide font-['Microsoft_YaHei',sans-serif]">今日挑战</span>
        <div className="w-10"></div>
      </div>
      <div className="flex-1 flex flex-col px-6 pb-12">
        <div className="flex-1 relative mt-4 overflow-hidden rounded-[32px]">
          <div className={`w-full h-full absolute inset-0 bg-[#2A2A2A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col items-center justify-center p-8 ${animState === 'idle' ? 'translate-x-0 opacity-100 transition-all duration-300 ease-out' : ''} ${animState === 'out' ? '-translate-x-full opacity-0 transition-all duration-200 ease-in' : ''} ${animState === 'in' ? 'translate-x-full opacity-0 transition-none' : ''}`}>
            <div className="w-20 h-20 rounded-full bg-[#E8F583]/20 flex items-center justify-center mb-6">
              <Target size={40} className="text-[#E8F583]" />
            </div>
            <div className="text-[#E8F583] text-[13px] font-bold tracking-[0.1em] uppercase mb-6 bg-[#E8F583]/10 px-4 py-1.5 rounded-lg font-['DIN_Alternate',sans-serif]">{mode.en}</div>
            <h3 className="text-2xl font-bold text-white text-center leading-relaxed mb-4 whitespace-pre-wrap">{tasks[taskIndex]}</h3>
            <p className="text-[#888888] font-medium flex items-center gap-2 mt-4 font-['DIN_Alternate',sans-serif]"><Clock size={16} /> {mode.time}</p>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button onClick={handleSwap} disabled={swaps <= 0 || animState !== 'idle' || tasks.length <= 1} className={`flex-1 py-5 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 transition-all ${swaps > 0 && tasks.length > 1 ? 'bg-[#303030] text-white hover:bg-[#404040] active:scale-95' : 'bg-[#2A2A2A] text-[#555] cursor-not-allowed'}`}>
            <RefreshCcw size={20} className={animState !== 'idle' ? 'animate-spin' : ''} /> 换一换 ({swaps})
          </button>
          <button onClick={() => onStart(tasks[taskIndex])} className="flex-1 py-5 rounded-2xl bg-[#E8F583] text-[#202020] font-bold text-lg flex justify-center items-center active:scale-95 transition-all shadow-[0_0_20px_rgba(232,245,131,0.2)]">
            开始挑战
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveChallengeScreen({ modeId, taskName, onClose, onComplete }) {
  const mode = CHALLENGE_MODES.find(m => m.id === modeId) || CHALLENGE_MODES[1];
  const [timeElapsed, setTimeElapsed] = useState(0); 
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) interval = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  useEffect(() => {
    if (!showCountdown) return;
    const t = setInterval(() => {
      setCountdown(v => {
        if (v <= 1) {
          clearInterval(t);
          setShowCountdown(false);
          setIsActive(true);
          setIsPaused(false);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [showCountdown]);

  const mins = Math.floor(timeElapsed / 60);
  const secs = timeElapsed % 60;

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-50 bg-[#151515] flex flex-col animate-in slide-in-from-right duration-300 font-['Microsoft_YaHei',sans-serif]">
      <div className="px-6 pt-14 pb-4 flex justify-between items-center bg-[#151515] z-10 border-b border-white/5">
        <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white active:scale-90"><X size={20} /></button>
        <div className={`flex items-center gap-2 font-bold text-sm tracking-widest px-4 py-1.5 rounded-full ${isActive && !isPaused ? 'text-[#E8F583] bg-[#E8F583]/10' : 'text-[#777] bg-[#333]'}`}><Activity size={16} /> 执行中</div>
        <div className="w-10 flex justify-end">
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        <div className="w-full flex flex-col items-center justify-center mb-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#2A2A2A] flex items-center justify-center mb-6 shadow-lg border border-white/5"><Target size={32} className="text-[#E8F583]" /></div>
          <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed whitespace-pre-wrap">{taskName || mode.name}</h2>
          <div className="text-[#888888] font-medium tracking-widest uppercase font-['DIN_Alternate',sans-serif]">{mode.en} · GO FOR IT</div>
        </div>
        <div className={`text-[80px] font-mono font-medium mb-12 tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] font-['DIN_Alternate',sans-serif] ${isActive && !isPaused ? 'text-white' : 'text-[#666] animate-pulse'}`}>
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>
        <div className="flex gap-4 w-full max-w-sm">
          <button onClick={() => { if (isActive) { setIsActive(false); setIsPaused(false); } else { setShowCountdown(true); } }} className="w-20 h-20 shrink-0 rounded-[24px] bg-[#303030] text-white flex justify-center items-center active:scale-90 transition-all">
            {isActive ? <Square size={24} fill="currentColor" /> : <Play size={28} fill="currentColor" className="translate-x-1" />}
          </button>
          <button 
            disabled={!isActive && timeElapsed === 0}
            onClick={() => { if (isActive || timeElapsed > 0) onComplete(`${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`); }}
            className={`flex-1 h-20 rounded-[24px] ${(!isActive && timeElapsed===0) ? 'bg-[#3A3A3A] text-[#777] cursor-not-allowed' : 'bg-[#E8F583] text-[#202020] shadow-[0_10px_30px_rgba(232,245,131,0.3)]'} font-bold text-xl flex justify-center items-center active:scale-95 transition-all`}
          >
            完成打卡
          </button>
        </div>
        {showCountdown && (
          <div className="absolute inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-[#E8F583] text-[#202020] flex items-center justify-center text-7xl font-black shadow-[0_0_60px_rgba(232,245,131,0.3)] animate-[pulse_1s_ease-in-out_infinite]">
              {countdown === 0 ? 'GO' : countdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Profile & Profile Edit ---
function ProfileTab({ streak, isAnyCompleted, selectedModeId, onSelectMode, isCustomDaily, setIsCustomDaily, customTaskText, setCustomTaskText, profileData, setProfileData, onOpenCalendar, onOpenReportCenter, onEditProfile, onGenerateMonthlyReport, onOpenWeightHistory, onOpenBodyFatHistory }) {
  const hasStreak = streak > 0;
  const initial = profileData.username ? profileData.username.charAt(0).toUpperCase() : 'U';
  
  let fireOuterClass = '';
  let fireInnerClass = '';
  
  if (isAnyCompleted) {
    fireOuterClass = 'fill-orange-500 drop-shadow-[0_0_15px_rgba(255,165,0,0.8)]';
    fireInnerClass = 'fill-yellow-300';
  } else if (hasStreak) {
    fireOuterClass = 'fill-orange-500 drop-shadow-[0_0_15px_rgba(255,165,0,0.6)] animate-[pulse_2.5s_ease-in-out_infinite] opacity-90';
    fireInnerClass = 'fill-yellow-300 opacity-90';
  } else {
    fireOuterClass = 'fill-[#444444] opacity-50';
    fireInnerClass = 'fill-[#666666] opacity-50';
  }

  return (
    <div className="px-5 pt-14 pb-12 animate-in fade-in duration-500 font-['Microsoft_YaHei',sans-serif]">
      
      {/* 头部：头像与用户名 (点击即可编辑) */}
      <div className="flex items-center gap-4 mb-8 bg-[#1A1A1A] p-4 rounded-[24px] border border-white/5 shadow-md">
        <div onClick={onEditProfile} className="w-[64px] h-[64px] rounded-full bg-[#E8F583] flex items-center justify-center text-[#202020] text-3xl font-black font-['DIN_Alternate',sans-serif] relative group shadow-lg shrink-0 overflow-hidden cursor-pointer active:scale-95 transition-transform">
          {profileData.avatar ? (
            <img src={profileData.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            initial
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
            <Camera size={20} />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="text-[22px] font-bold text-white">
            Hi, {profileData.username || 'Athlete'}
          </div>
        </div>
      </div>
      
      {/* 身体数据卡片 - 全展示无滑动 */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="bg-[#2A2A2A] rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 shadow-lg min-w-0">
          <span className="text-[#888] text-[10px] font-bold mb-1 uppercase font-['DIN_Alternate',sans-serif] tracking-wider">Gender</span>
          <span className="text-white font-bold text-base truncate w-full text-center font-['DIN_Alternate',sans-serif]">{profileData.gender}</span>
        </div>
        <div 
          className="bg-[#2A2A2A] rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 shadow-lg min-w-0 cursor-pointer active:scale-95 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenWeightHistory) onOpenWeightHistory();
          }}
        >
          <span className="text-[#888] text-[10px] font-bold mb-1 uppercase font-['DIN_Alternate',sans-serif] tracking-wider">Weight</span>
          <span className="text-white font-bold text-base font-['DIN_Alternate',sans-serif] truncate w-full text-center">{profileData.weight}<span className="text-[10px] text-[#666] ml-0.5 font-['Microsoft_YaHei']">kg</span></span>
        </div>
        <div className="bg-[#2A2A2A] rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 shadow-lg min-w-0">
          <span className="text-[#888] text-[10px] font-bold mb-1 uppercase font-['DIN_Alternate',sans-serif] tracking-wider">Height</span>
          <span className="text-white font-bold text-base font-['DIN_Alternate',sans-serif] truncate w-full text-center">{profileData.height}<span className="text-[10px] text-[#666] ml-0.5 font-['Microsoft_YaHei']">cm</span></span>
        </div>
        <div 
          className="bg-[#2A2A2A] rounded-2xl p-3 flex flex-col items-center justify-center border border-white/5 shadow-lg min-w-0 cursor-pointer active:scale-95 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenBodyFatHistory) onOpenBodyFatHistory();
          }}
        >
          <span className="text-[#888] text-[10px] font-bold mb-1 uppercase font-['DIN_Alternate',sans-serif] tracking-wider">Body Fat</span>
          <span className="text-white font-bold text-base font-['DIN_Alternate',sans-serif] truncate w-full text-center">{profileData.bodyFat}<span className="text-[10px] text-[#666] ml-0.5 font-['Microsoft_YaHei']">%</span></span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-[#E8F583]" />
          <h3 className="text-lg font-bold text-white">今日挑战模式</h3>
          <span className="text-[10px] text-[#666] font-['DIN_Alternate',sans-serif] tracking-widest mt-1 ml-1">CHALLENGE MODES</span>
        </div>
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-6 pt-3 -mx-5 px-5 no-scrollbar">
          {CHALLENGE_MODES.map((mode) => {
            const isSelected = selectedModeId === mode.id;
            return (
              <div key={mode.id} onClick={() => onSelectMode(mode.id)} className={`w-[150px] h-[200px] shrink-0 snap-center rounded-[24px] p-5 shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col ${isSelected ? 'bg-[#2A2A2A] border-[#E8F583] ring-1 ring-[#E8F583]/50 shadow-[0_0_20px_rgba(232,245,131,0.15)] scale-100' : 'bg-[#222222] border-white/5 scale-[0.96] opacity-60 hover:opacity-100'}`}>
                {isSelected && <div className="absolute inset-0 bg-gradient-to-br from-[#E8F583]/10 to-transparent animate-[pulse_3s_ease-in-out_infinite] pointer-events-none"></div>}
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col">
                      <h4 className={`text-lg font-bold ${isSelected ? 'text-[#E8F583]' : 'text-white'}`}>{mode.name}</h4>
                      <span className={`text-[10px] font-['DIN_Alternate',sans-serif] tracking-widest uppercase mt-0.5 ${isSelected ? 'text-[#E8F583]/70' : 'text-[#666]'}`}>{mode.en}</span>
                    </div>
                    {mode.recommended && <span className="absolute top-0 right-0 text-[9px] bg-[#E8F583] text-[#202020] px-1.5 py-0.5 rounded-md font-bold uppercase">推荐</span>}
                  </div>
                  
                  {mode.id === 'custom' && isSelected ? (
                     <div className="mb-2 mt-4 w-full">
                       <input 
                         type="text" 
                         value={customTaskText}
                         onChange={(e) => setCustomTaskText(e.target.value)}
                         onClick={(e) => e.stopPropagation()}
                         placeholder="输入专属挑战"
                         className="w-full bg-[#1A1A1A] border border-[#E8F583]/30 rounded-lg px-2.5 py-3 text-[12px] text-white font-bold outline-none focus:border-[#E8F583] transition-colors shadow-inner"
                       />
                     </div>
                  ) : (
                     <p className="text-[#888] text-xs mb-2 mt-4 line-clamp-3 leading-relaxed">{mode.desc}</p>
                  )}

                  <div className="mt-auto flex flex-col gap-2">
                    {mode.id === 'custom' && isSelected && (
                      <div onClick={(e) => { e.stopPropagation(); setIsCustomDaily(!isCustomDaily); }} className="flex items-center gap-1.5 text-[10px] text-[#E8F583] bg-[#E8F583]/10 px-2.5 py-1.5 rounded-full cursor-pointer w-max">
                        <div className={`w-2.5 h-2.5 rounded-sm border ${isCustomDaily ? 'bg-[#E8F583] border-[#E8F583]' : 'border-[#E8F583]'} flex items-center justify-center`}>
                          {isCustomDaily && <div className="w-1.5 h-1.5 bg-[#202020]"></div>}
                        </div>
                        每日重复
                      </div>
                    )}
                    <div className={`flex items-center gap-1.5 text-xs font-medium font-['DIN_Alternate',sans-serif] ${isSelected ? 'text-white' : 'text-[#666]'}`}>
                      <Clock size={14} /> {mode.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div onClick={onOpenReportCenter} className="bg-[#AD9BF0] rounded-[24px] p-5 relative overflow-hidden mb-8 cursor-pointer active:scale-95 transition-transform shadow-lg group flex flex-col justify-center min-h-[140px]">
        <div className="z-10 flex flex-col items-start relative top-1">
          <div className="text-[13px] font-bold tracking-[0.15em] mb-1.5 uppercase font-['DIN_Alternate',sans-serif] text-[#202020]/80">
            STREAK DAYS
          </div>
          <div className="text-[54px] font-bold font-['DIN_Alternate',sans-serif] leading-none tracking-tighter text-[#202020]">
            {streak}
          </div>
        </div>
        <Flame size={120} strokeWidth={0} className={`absolute -right-6 -bottom-6 fill-[#202020]/10 transition-transform duration-500 group-hover:scale-110 ${fireOuterClass}`} />
      </div>
      
      {/* 月度报告入口已迁移至“历史训练”月历头部按钮 */}
    </div>
  );
}

function ProfileEditModal({ data, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...data });
  const avatarInputRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleAvatar = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFormData(prev => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(f);
  };

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[70] flex flex-col justify-end font-['Microsoft_YaHei',sans-serif]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="bg-[#202020] rounded-t-[36px] p-6 pb-12 relative z-[50] animate-in slide-in-from-bottom duration-300 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/10 flex flex-col gap-4">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2"></div>
        <h3 className="text-2xl font-bold text-white mb-2 px-2 text-center">个人资料</h3>
        
        <div className="flex justify-center mb-2">
          <button type="button" onClick={() => avatarInputRef && avatarInputRef.current && avatarInputRef.current.click()} className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-[#E8F583] flex items-center justify-center text-4xl font-black text-[#202020] font-['DIN_Alternate',sans-serif] shadow-lg overflow-hidden">
              {formData.avatar ? (
                <img src={formData.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (formData.username ? formData.username.charAt(0).toUpperCase() : 'U')
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <Camera size={24} />
            </div>
          </button>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-[#151515] p-4 rounded-2xl border border-white/5">
            <span className="text-[#888] font-bold">昵称</span>
            <input 
              type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="bg-transparent text-white font-bold outline-none text-right flex-1 ml-4 placeholder:text-[#444]"
              placeholder="请输入昵称"
            />
          </div>
          <div className="flex justify-between items-center bg-[#151515] p-4 rounded-2xl border border-white/5">
            <span className="text-[#888] font-bold text-sm uppercase tracking-wider font-['DIN_Alternate',sans-serif]">Gender</span>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="bg-transparent text-white font-bold outline-none text-right appearance-none font-['DIN_Alternate',sans-serif]"
            >
              <option value="Male" className="text-black">Male</option>
              <option value="Female" className="text-black">Female</option>
            </select>
          </div>
          <div className="flex justify-between items-center bg-[#151515] p-4 rounded-2xl border border-white/5">
            <span className="text-[#888] font-bold text-sm uppercase tracking-wider font-['DIN_Alternate',sans-serif]">Weight <span className="lowercase text-xs">(kg)</span></span>
            <input 
              type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="bg-transparent text-white font-bold outline-none text-right w-20 font-['DIN_Alternate',sans-serif]"
            />
          </div>
          <div className="flex justify-between items-center bg-[#151515] p-4 rounded-2xl border border-white/5">
            <span className="text-[#888] font-bold text-sm uppercase tracking-wider font-['DIN_Alternate',sans-serif]">Height <span className="lowercase text-xs">(cm)</span></span>
            <input 
              type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})}
              className="bg-transparent text-white font-bold outline-none text-right w-20 font-['DIN_Alternate',sans-serif]"
            />
          </div>
          <div className="flex justify-between items-center bg-[#151515] p-4 rounded-2xl border border-white/5">
            <span className="text-[#888] font-bold text-sm uppercase tracking-wider font-['DIN_Alternate',sans-serif]">Body Fat <span className="lowercase text-xs">(%)</span></span>
            <input 
              type="number" value={formData.bodyFat} onChange={(e) => setFormData({...formData, bodyFat: e.target.value})}
              className="bg-transparent text-white font-bold outline-none text-right w-20 font-['DIN_Alternate',sans-serif]"
            />
          </div>
        </div>

        <button 
          onClick={() => onSave(formData)}
          className="w-full h-14 bg-[#E8F583] text-[#202020] rounded-[20px] font-bold text-lg mt-2 shadow-[0_10px_20px_rgba(232,245,131,0.2)] active:scale-95 transition-transform"
        >
          保存修改
        </button>
      </div>
    </div>
  );
}

function WeightHistoryModal({ onClose, onUpdateWeight }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [anaRange, setAnaRange] = useState('week');
  const [analyticsDate, setAnalyticsDate] = useState(new Date());
  const [version, setVersion] = useState(0);

  const data = React.useMemo(() => {
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
          const weight = info.weight != null ? parseFloat(info.weight) : null;
          result.push({
            name: `${d.getMonth() + 1}/${d.getDate()}`,
            weight
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
          const weight = info.weight != null ? parseFloat(info.weight) : null;
          result.push({
            name: `${i}`,
            weight
          });
        }
      } else {
        const year = base.getFullYear();
        for (let month = 0; month < 12; month++) {
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          let weight = null;
          for (let day = daysInMonth; day >= 1; day--) {
            const m = String(month + 1).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            const key = `${year}-${m}-${dd}`;
            const info = store[key];
            if (info && info.weight != null) {
              weight = parseFloat(info.weight);
              break;
            }
          }
          result.push({
            name: `${month + 1}`,
            weight
          });
        }
      }

      return result;
    } catch (e) {
      console.error('Weight history analytics error:', e);
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
    try {
      const d = buildDateForIndex(idx);
      const key = d.toISOString();
      setEditingKey(key);
      const item = data[idx];
      setEditingValue(item && item.weight != null ? String(item.weight) : '');
    } catch {}
  };

  const handleSave = () => {
    if (!editingKey) return;
    onUpdateWeight(editingKey, editingValue);
    setEditingKey(null);
    setEditingValue('');
    setVersion(v => v + 1);
  };

  const handleDelete = () => {
    if (!editingKey) return;
    if (window.confirm('确定要删除这条体重记录吗？')) {
      onUpdateWeight(editingKey, null);
      setEditingKey(null);
      setEditingValue('');
      setVersion(v => v + 1);
    }
  };

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[9998] flex flex-col justify-end font-['Microsoft_YaHei',sans-serif]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#202020] rounded-t-[32px] p-5 pb-10 relative z-[90] shadow-[0_-20px_60px_rgba(0,0,0,0.85)] border-t border-white/10 max-h-[80vh] flex flex-col">
        <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mb-3"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white">历史体重</h3>
            <div className="text-[11px] text-[#888] mt-1">查看并修改周 / 月体重记录</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 bg-[#151515] rounded-lg px-2 py-1">
            <button onClick={handlePrev} className="p-1 text-[#888] hover:text-white">
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
            <button onClick={handleNext} className="p-1 text-[#888] hover:text-white">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-2 bg-[#151515] p-1 rounded-xl">
            {['week','month','year'].map(k => (
              <button
                key={k}
                onClick={() => setAnaRange(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-['DIN_Alternate',sans-serif] ${anaRange===k ? 'bg-[#E8F583] text-[#202020]' : 'text-[#aaa] hover:text-white'}`}
              >
                {k === 'week' ? '周' : k === 'month' ? '月' : '年'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#151515] rounded-2xl p-4 border border-white/5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[#888] text-xs font-bold">体重趋势</div>
            <div className="flex items-center gap-2 text-[#E8F583] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#E8F583]"></span> kg
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
                  formatter={(value) => [value, '体重']}
                />
                <Line type="monotone" dataKey="weight" stroke="#E8F583" strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {(!data || data.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-[#666] py-10">
              <span className="text-sm">暂无数据</span>
            </div>
          ) : data.map((item, idx) => {
            const d = buildDateForIndex(idx);
            const isYear = anaRange === 'year';
            if (isYear) {
              return (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                  <div className="flex flex-col">
                    <div className="text-sm text-white font-bold">
                      {analyticsDate.getFullYear()}年 {idx + 1}月
                    </div>
                  </div>
                  <div className="text-sm font-['DIN_Alternate',sans-serif] text-[#E8F583]">
                    {item.weight != null ? `${item.weight} kg` : '--'}
                  </div>
                </div>
              );
            }
            let key = '';
            try {
              key = d.toISOString();
            } catch {
              return null;
            }
            const isEditing = editingKey === key;
            const label = `${d.getMonth() + 1}月${d.getDate()}日`;
            return (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                <div className="flex flex-col">
                  <div className="text-sm text-white font-bold">{label}</div>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="w-20 bg-[#151515] border border-[#E8F583]/50 rounded-lg px-2 py-1 text-right text-sm text-white outline-none font-['DIN_Alternate',sans-serif]"
                    />
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 rounded-lg bg-[#E8F583] text-[#202020] text-xs font-bold"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1 rounded-lg bg-[#FF4D4F]/20 text-[#FF4D4F] text-xs font-bold"
                    >
                      删除
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-['DIN_Alternate',sans-serif] text-[#E8F583] min-w-[72px] text-right">
                      {item.weight != null ? `${item.weight} kg` : '--'}
                    </div>
                    <button
                      onClick={() => handleEdit(idx)}
                      className="px-3 py-1 rounded-lg bg-white/10 text-xs text-white font-bold"
                    >
                      修改
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 日历历史浮层
function CalendarHistoryModal({ onClose, isChallengeCompletedToday, isTrainingCompletedToday, todayTrainings, activeTaskText, challengeJournal, onUpdateToday, onCreateForDate, onRebuildHistory, onOpenHistory }) {
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDay, setSelectedDay] = useState(null); 
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [draftImage, setDraftImage] = useState(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const isSelectedToday = selectedDay !== null && new Date(viewDate.getFullYear(), viewDate.getMonth(), selectedDay).toDateString() === new Date().toDateString();
  const handleImage = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setDraftImage(r.result);
    r.readAsDataURL(f);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); 

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
    setSelectedDay(null); 
  };
  
  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
    setSelectedDay(null); 
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); 
  // 读取本地每日与历史存储
  const dStore = (() => { try { return JSON.parse(localStorage.getItem('fitnessApp_daily') || '{}'); } catch { return {}; } })();
  const hist = (() => { try { return JSON.parse(localStorage.getItem('fitnessApp_history') || '[]'); } catch { return []; } })();
    const monthData = Array.from({ length: daysInMonth }, (_, i) => {
    const date = i + 1;
    const curr = new Date(year, month, date);
    curr.setHours(0, 0, 0, 0);
    const ym = String(curr.getMonth()+1).padStart(2,'0');
    const yd = String(curr.getDate()).padStart(2,'0');
    const key = `${curr.getFullYear()}-${ym}-${yd}`;
    const v = dStore[key] || {};
    const chDone = !!v.challenge;
    const trDone = !!v.training;
    let details = null;
    if (chDone || trDone) {
      // 找到当天历史记录，并保留在总体 history 列表中的索引，便于精细删除
      const items = hist
        .map((h, idx) => ({ ...h, __idx: idx }))
        .filter(h => {
          try { return new Date(h.date).toDateString() === curr.toDateString(); } catch { return false; }
        });
      
      const entries = items.map(t => {
        const type = t.type || '训练';
        const trainTag =
          t.trainTag ||
          (type === '无氧训练'
            ? 'anaerobic'
            : type === '有氧训练'
            ? 'aerobic'
            : type === '拉伸恢复'
            ? 'stretch'
            : undefined);
        return {
          type,
          summary: t.muscleSummary || t.summary || '训练',
          duration: t.duration || '',
          exercises: t.exercises || [],
          journalText: t.journalText || '',
          journalImage: t.journalImage || null,
          histIndex: typeof t.__idx === 'number' ? t.__idx : -1,
          kcal: t.kcal,
          modeId: t.modeId,
          isChallenge: t.isChallenge,
          trainTag
        };
      });

      // 如果有打卡/挑战记录，且不在 history 中（避免重复），将其作为一个特殊的 entry 加入列表
      const hasChallengeInHistory = items.some(t => t.isChallenge || t.type === 'challenge' || t.type === '挑战');

      if (chDone && !hasChallengeInHistory) {
        entries.push({
          type: 'challenge', // Use standard type instead of '自定义'
          summary: v.challengeText || (activeTaskText || '挑战完成'),
          duration: v.challengeDuration || '',
          exercises: [],
          journalText: v.challengeJournalText || '',
          journalImage: v.challengeJournalImage || null,
          histIndex: -1,
          kcal: v.kcal,
          modeId: v.modeId, // Use saved modeId if available
          isChallenge: true
        });
      }

      details = {
        entries
      };
    }

    let styleClass = 'bg-[#252525] text-[#666] border border-transparent'; 
    if (chDone && trDone) {
      styleClass = 'bg-[#E8F583] text-[#202020] font-bold shadow-[0_0_10px_rgba(232,245,131,0.3)]'; 
    } else if (chDone || trDone) {
      styleClass = 'border-2 border-[#E8F583] text-[#E8F583] bg-transparent';
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    const isFuture = curr.getTime() > today.getTime();
    return { date, styleClass, details, isFuture };
  });

  const selectedData = selectedDay ? monthData.find(d => d.date === selectedDay) : null;
  useEffect(() => {
    if (selectedData && selectedData.details) {
      setDraft(JSON.parse(JSON.stringify(selectedData.details)));
      setDraftImage(null);
    } else {
      setDraft(null);
      setDraftImage(null);
    }
    setEditing(false);
  }, [selectedDay, viewDate.getTime()]);

  const handleDeleteEntry = (histIndex) => {
    if (histIndex === undefined || histIndex === null || histIndex < 0) return;
    try {
      const raw = localStorage.getItem('fitnessApp_history');
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list) || histIndex >= list.length) return;
      list.splice(histIndex, 1);
      localStorage.setItem('fitnessApp_history', JSON.stringify(list));
      if (typeof onRebuildHistory === 'function') {
        onRebuildHistory(list);
      }
    } catch {}
  };
  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[9999] bg-[#121212] flex flex-col animate-in slide-in-from-bottom duration-300 font-['Microsoft_YaHei',sans-serif] shadow-2xl">
      <div className="px-6 pt-14 pb-4 flex justify-between items-center bg-[#1A1A1A] border-b border-white/5">
        <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"><X size={20} /></button>
        <div className="flex items-center gap-4 flex-1 justify-center">
          <button onClick={handlePrevMonth} className="text-[#888] hover:text-white p-1"><ChevronLeft size={20}/></button>
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-white font-bold tracking-wide font-['DIN_Alternate',sans-serif]">{year} <span className="font-['Microsoft_YaHei']">{monthNames[month]}</span></span>
            <span className="text-[#888] text-[11px] font-medium tracking-widest uppercase">月度记录</span>
          </div>
          <button onClick={handleNextMonth} className="text-[#888] hover:text-white p-1"><ChevronRight size={20}/></button>
        </div>
        <div className="w-10 h-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col">
        <div className="flex justify-center gap-6 mb-8 text-xs font-bold text-[#888]">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#E8F583]"></div>全达成</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border-2 border-[#E8F583]"></div>单项达成</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#252525]"></div>未打卡</div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {['S','M','T','W','T','F','S'].map((day, i) => (
            <div key={i} className="text-center text-[#666] text-xs font-bold font-['DIN_Alternate',sans-serif]">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 mb-10">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}
          {monthData.map((d) => (
            <div 
              key={d.date} 
              onClick={() => !d.isFuture && setSelectedDay(d.date)}
              className={`aspect-square rounded-full flex items-center justify-center text-sm font-bold font-['DIN_Alternate',sans-serif] transition-all
                ${d.isFuture ? 'opacity-20 cursor-not-allowed text-[#666] bg-[#1A1A1A]' : 'cursor-pointer active:scale-90 hover:bg-white/10'}
                ${d.styleClass}
                ${selectedDay === d.date ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121212]' : ''}
              `}
            >
              {d.date}
            </div>
          ))}
        </div>

        {selectedData && !selectedData.isFuture && (
          <div className="bg-[#1A1A1A] rounded-[24px] p-5 border border-white/5 shadow-xl animate-in fade-in slide-in-from-bottom-2 mb-8">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h4 className="text-white font-bold flex items-center gap-2">
                <Calendar size={18} className="text-[#E8F583]" />
                <span className="flex flex-col leading-tight">
                  <span className="uppercase tracking-wider font-['DIN_Alternate',sans-serif]">
                    {monthShort[month]} <span className="ml-0.5">{String(selectedDay).padStart(2,'0')}</span>
                  </span>
                  <span className="text-xs text-[#888] mt-1">Training</span>
                </span>
              </h4>
              <div className="flex items-center gap-2">
                {selectedData.details && (
                  <>
                    <button 
                      onClick={() => {
                        const y = year, m = month + 1, d = selectedDay;
                        const raw = localStorage.getItem('fitnessApp_history');
                        const list = raw ? JSON.parse(raw) : [];
                        const dayStr = new Date(y, month, d).toDateString();
                        const dayItems = list.filter(it => new Date(it.date).toDateString() === dayStr);
                        if (dayItems.length === 0) return;
                        const entries = dayItems.map(item => ({
                          type: item.type || item.trainTag || '训练',
                          muscleSummary: item.muscleSummary || item.summary || '',
                          duration: item.duration || '',
                          exercises: item.exercises || [],
                          journalText: item.journalText || '',
                          journalImage: item.journalImage || null,
                          weight: item.weight,
                          trainTag: item.trainTag,
                          modeId: item.modeId
                        }));
                        const allExercises = entries.reduce((acc, e) => {
                          if (Array.isArray(e.exercises)) return acc.concat(e.exercises);
                          return acc;
                        }, []);
                        let totalDurationSec = 0;
                        entries.forEach(t => {
                          if (!t || !t.duration) return;
                          const parts = String(t.duration).split(':');
                          if (parts.length === 2) {
                            const mins = parseInt(parts[0]) || 0;
                            const secs = parseInt(parts[1]) || 0;
                            totalDurationSec += mins * 60 + secs;
                          } else {
                            const mins = parseFloat(t.duration) || 0;
                            totalDurationSec += Math.round(mins * 60);
                          }
                        });
                        const durH = Math.floor(totalDurationSec / 3600);
                        const durM = Math.floor((totalDurationSec % 3600) / 60);
                        const durS = totalDurationSec % 60;
                        const totalDurationStr = durH > 0
                          ? `${String(durH).padStart(2,'0')}:${String(durM).padStart(2,'0')}`
                          : `${String(durM).padStart(2,'0')}:${String(durS).padStart(2,'0')}`;
                        const totalKcal = entries.reduce((sum, t) => sum + computeTrainingKcal(t), 0);
                        window.__openPoster && window.__openPoster({
                          type: 'training',
                          profile: (typeof window.__profileData !== 'undefined') ? window.__profileData : null,
                          date: new Date(y, month, d),
                          summary: '训练记录',
                          duration: totalDurationStr,
                          trainType: '',
                          exercises: allExercises,
                          journalText: null,
                          journalImage: null,
                          kcal: totalKcal > 0 ? Math.round(totalKcal) : undefined,
                          entries
                        });
                      }} 
                      className="px-3 py-1.5 rounded-xl bg-[#E8F583] text-[#202020] text-sm font-bold hover:opacity-90"
                    >
                      导出
                    </button>
                  </>
                )}
                {onCreateForDate && (
                  <button
                    onClick={() => { onCreateForDate(new Date(year, month, selectedDay)); }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 text-[#ddd] text-sm font-bold hover:bg-white/20"
                  >
                    补记训练
                  </button>
                )}
                {/* 保留导出与补记入口，历史编辑统一通过记录卡片的“编辑”按钮进入 */}
              </div>
            </div>
            
            {!selectedData.details ? (
               <div className="flex flex-col items-center gap-3 py-4">
                 <div className="text-[#666] text-sm font-bold">这一天休息啦，没有留下汗水～</div>
               </div>
            ) : (
               <div className="flex flex-col gap-4">
                 {Array.isArray(selectedData.details.entries) && selectedData.details.entries.length > 0 && (
                   <div className="flex flex-col gap-4">
                     {selectedData.details.entries.map((entry, idx) => (
                       <React.Fragment key={idx}>
                       <RecordCard
                        data={entry}
                        includeJournal={true}
                        showKcal={true}
                        actions={
                           <div className="flex items-center gap-2">
                           {typeof onOpenHistory === 'function' && entry.histIndex >= 0 && !entry.isChallenge && !['challenge', '挑战', '自定义'].includes(entry.type) && (
                               <button
                                 onClick={() => {
                                   try {
                                     const raw = localStorage.getItem('fitnessApp_history');
                                     const list = raw ? JSON.parse(raw) : [];
                                     if (Array.isArray(list) && entry.histIndex < list.length) {
                                       const item = list[entry.histIndex];
                                       item._forceEditing = true;
                                       onOpenHistory && onOpenHistory(item);
                                     }
                                   } catch {}
                                 }}
                            className="text-xs font-bold px-2 py-1 rounded-lg bg-white/10 text-[#ddd] hover:bg-white/20"
                               >
                                 编辑
                               </button>
                             )}
                             {editing && entry.histIndex >= 0 && (
                               <button
                                 onClick={() => handleDeleteEntry(entry.histIndex)}
                                 className="text-[#FF4D4F] text-xs font-bold px-2 py-1 rounded-lg bg-[#FF4D4F]/10 hover:bg-[#FF4D4F]/20"
                               >
                                 删除
                               </button>
                             )}
                           </div>
                        }
                      />
                    </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Training Flow Drawers & Modals ---
function TrainingDrawer({ onClose, onSelectType }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const types = [
    { id: 'anaerobic', name: '无氧训练', en: 'Anaerobic', icon: <Trophy />, color: 'bg-[#F0C7FF] text-[#202020]' },
    { id: 'aerobic', name: '有氧训练', en: 'Aerobic', icon: <Activity />, color: 'bg-[#E8F583] text-[#202020]' },
    { id: 'stretch', name: '拉伸恢复', en: 'Stretch', icon: <User />, color: 'bg-[#AD9BF0] text-[#202020]' }
  ];

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[60] flex flex-col justify-end font-['Microsoft_YaHei',sans-serif]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="bg-[#202020] rounded-t-[36px] p-6 pb-12 relative z-[50] animate-in slide-in-from-bottom duration-300 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/10 max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8"></div>
        <h3 className="text-2xl font-bold text-white mb-6 tracking-widest text-center font-['DIN_Alternate',sans-serif] uppercase">New Training</h3>
        <div className="flex flex-col gap-4">
          {types.map(t => (
            <button key={t.id} onClick={() => onSelectType(t.id)} className={`w-full p-4 rounded-[24px] flex items-center justify-between transition-transform active:scale-[0.98] shadow-lg ${t.color}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center">{t.icon}</div>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold tracking-wide">{t.name}</span>
                  <span className="text-[11px] font-['DIN_Alternate',sans-serif] tracking-widest uppercase opacity-70 mt-0.5">{t.en}</span>
                </div>
              </div>
              <ChevronRight size={24} className="opacity-60 mr-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 核心重构：支持组数管理、折叠与智能计数的执行页
function ActiveTrainingScreen({ type, exercises, setExercises, trainingTime, personalRecords, onCheckPR, onMinimize, onComplete, onAddAction, isRunning, onStartTimer, onPauseTimer, onResumeTimer, shouldShowCountdown, onCountdownComplete, profileData, modeId }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const typeMap = { 'anaerobic': '无氧训练', 'aerobic': '有氧训练', 'stretch': '拉伸恢复' };
  const typeName = typeMap[type] || '训练';
  const isCardio = type === 'aerobic' || type === 'stretch';

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const todayStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

  let totalVolume = 0;
  let completedVolume = 0;
  exercises.forEach(ex => {
    const ratio = ex.unit === 'lbs' ? 0.453592 : 1;
    ex.sets.forEach(set => {
      const vol = (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0) * ratio;
      totalVolume += vol;
      if (set.completed) completedVolume += vol;
    });
  });
  totalVolume = Math.round(totalVolume * 10) / 10;
  completedVolume = Math.round(completedVolume * 10) / 10;
  const weightKgForCalc = parseFloat(profileData?.weight || 65);
  const minutesFromTime = trainingTime > 0 ? (trainingTime / 60) : 0;
  const activityKeyForCalc = isCardio ? 'RUNNING_MID' : 'WEIGHT_LIFTING';
  const isAnaerobicForCalc = !isCardio;
  const baseModeId = modeId || 'evolution';
  const currentKcal = minutesFromTime > 0 ? calculateCalories(activityKeyForCalc, weightKgForCalc, minutesFromTime, isAnaerobicForCalc, baseModeId) : 0;

  const [showCountdown, setShowCountdown] = useState(!!shouldShowCountdown);
  const [countdown, setCountdown] = useState(3);
  
  useEffect(() => {
    if (!showCountdown) return;
    const t = setInterval(() => {
      setCountdown(v => {
        if (v <= 1) {
          clearInterval(t);
          setShowCountdown(false);
          onCountdownComplete && onCountdownComplete();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [showCountdown]);

  const updateSet = (exIndex, setIndex, field, value) => {
    const newExs = [...exercises];
    newExs[exIndex].sets[setIndex][field] = value;
    setExercises(newExs);
  };

  const toggleSetComplete = (exIndex, setIndex) => {
    const newExs = [...exercises];
    const set = newExs[exIndex].sets[setIndex];
    set.completed = !set.completed;
    setExercises(newExs);

    // PR Check Trigger
    if (set.completed && !isCardio) {
      const weightVal = parseFloat(set.weight);
      if (weightVal > 0) {
        onCheckPR(newExs[exIndex].name, weightVal, newExs[exIndex].unit || 'kg');
      }
    }
  };

  const toggleCollapse = (exIndex) => {
    const newExs = [...exercises];
    newExs[exIndex].isCollapsed = !newExs[exIndex].isCollapsed;
    setExercises(newExs);
  };

  const toggleUnit = (exIndex) => {
    const newExs = [...exercises];
    newExs[exIndex].unit = newExs[exIndex].unit === 'kg' ? 'lbs' : 'kg';
    setExercises(newExs);
  };

  const toggleCardioMetric = (exIndex) => {
    const items = [...exercises];
    const ex = items[exIndex];
    const name = ex?.name || '';
    const isJumpRope = name.includes('跳绳');
    const current = ex.cardioMetric || 'time';
    let next = 'time';
    if (isJumpRope) {
      next = current === 'time' ? 'count' : 'time';
    } else {
      next = current === 'time' ? 'distance' : 'time';
    }
    ex.cardioMetric = next;
    setExercises(items);
  };

  const addSet = (exIndex) => {
    const newExs = [...exercises];
    const sets = newExs[exIndex].sets;
    const lastSet = sets[sets.length - 1];
    
    if (isCardio) {
      sets.push({ id: Date.now(), duration: lastSet ? lastSet.duration : 10, completed: false });
    } else {
      sets.push({ id: Date.now(), weight: lastSet ? lastSet.weight : '', reps: lastSet ? lastSet.reps : 10, completed: false });
    }
    newExs[exIndex].isCollapsed = false;
    setExercises(newExs);
  };

  const deleteSet = (exIndex, setIndex) => {
    const newExs = [...exercises];
    const sets = newExs[exIndex].sets || [];
    if (sets.length <= 1) return;
    sets.splice(setIndex, 1);
    newExs[exIndex].sets = sets;
    setExercises(newExs);
  };

  const deleteExercise = (exIndex) => {
    const items = [...exercises];
    items.splice(exIndex, 1);
    setExercises(items);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const src = result.source.index;
    const dst = result.destination.index;
    if (src === dst) return;
    const items = Array.from(exercises);
    const [moved] = items.splice(src, 1);
    items.splice(dst, 0, moved);
    setExercises(items);
  };

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[40] bg-[#121212] flex flex-col animate-in slide-in-from-bottom duration-300 font-['Microsoft_YaHei',sans-serif]">
      
      <div className="px-5 pt-12 pb-4 border-b border-white/5 bg-[#1A1A1A] relative shadow-md">
        <div className="flex justify-between items-center relative z-10">
          <button onClick={onMinimize} className="flex items-center gap-1 text-[#E8F583] hover:text-white bg-[#E8F583]/10 px-3 py-2 rounded-full text-sm font-bold transition-colors">
            <ChevronLeft size={18} /> 返回
          </button>
          
          <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="text-[#888] font-medium text-[11px] mb-1"><Calendar size={10} className="inline mr-1 mb-0.5"/>{todayStr} · {typeName}</span>
            <span className={`text-3xl font-mono font-bold tracking-tighter leading-none font-['DIN_Alternate',sans-serif] ${isRunning ? 'text-white' : 'text-[#666] animate-pulse'}`}>{formatTime(trainingTime)}</span>
          </div>
          
          <div className="w-20 flex justify-end">
            {isRunning ? (
              <button onClick={onPauseTimer} className="px-3 py-1.5 rounded-full bg-[#333] hover:bg-[#3a3a3a] text-[#ddd] text-xs font-bold">暂停</button>
            ) : (
              <button onClick={onResumeTimer} className="px-3 py-1.5 rounded-full bg-[#E8F583] text-[#202020] text-xs font-bold">继续</button>
            )}
          </div> 
        </div>
        
        <div className="flex justify-center mt-4">
          <div className="bg-[#202020] px-4 py-1.5 rounded-full flex gap-3 text-[13px] font-bold border border-white/5 shadow-inner text-[#888]">
            {!isCardio && exercises.length > 0 && (
              <>
                <Target size={14} className="text-[#E8F583] mt-[2px]" />
                <span>重量: <span className="text-white font-['DIN_Alternate',sans-serif]">{completedVolume}</span> / <span className="font-['DIN_Alternate',sans-serif]">{totalVolume}</span> kg</span>
                <span className="opacity-40">|</span>
              </>
            )}
            <span>消耗: <span className="text-white font-['DIN_Alternate',sans-serif]">{currentKcal}</span> kcal</span>
          </div>
        </div>
      </div>

      {showCountdown && (
        <div className="absolute inset-0 z-[50] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-[#E8F583] text-[#202020] flex items-center justify-center text-7xl font-black shadow-[0_0_60px_rgba(232,245,131,0.3)] animate-[pulse_1s_ease-in-out_infinite]">
            {countdown === 0 ? 'GO' : countdown}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 no-scrollbar pb-10">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="exerciseList">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {exercises.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Dumbbell size={64} className="mb-4" />
                    <div className="text-center font-bold">还没有添加任何动作</div>
                    <div className="text-sm mt-2">点击下方按钮开始组建计划</div>
                  </div>
                ) : (
                  exercises.map((ex, idx) => {
                    const cardioMetric = ex.cardioMetric || 'time';
                    const isJumpRope = (ex.name || '').includes('跳绳');
                    const cardioLabel = cardioMetric === 'distance' ? '距离' : cardioMetric === 'count' ? '次数' : '时长';
                    return (
                      <Draggable draggableId={String(ex.id)} index={idx} key={ex.id}>
                        {(dragProvided, snapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            className={`bg-[#252525] rounded-[24px] p-5 mb-4 border border-white/5 shadow-xl transition-all relative ${snapshot.isDragging ? 'bg-[#202020] ring-2 ring-[#E8F583] shadow-2xl scale-95' : ''}`}
                          >
                            <div 
                              className={`relative flex justify-between items-center text-white pb-3 font-bold cursor-pointer select-none ${!ex.isCollapsed ? 'border-b border-white/10 mb-4' : ''}`}
                              onClick={() => toggleCollapse(idx)}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[#666] pr-1" {...dragProvided.dragHandleProps}>
                                  <GripVertical size={16} />
                                </span>
                                <span className="text-[17px]">{ex.name}</span>
                                {ex.isCustom && <span className="text-[10px] bg-[#E8F583] text-[#202020] px-1.5 py-0.5 rounded-sm shrink-0">自定义</span>}
                                
                                {!isCardio && personalRecords[ex.name] > 0 && (
                                   <span className="text-[#888] text-[10px] font-bold font-['DIN_Alternate',sans-serif] bg-[#333] px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                                     <Trophy size={10} className="text-yellow-500" /> PR: {personalRecords[ex.name]}kg
                                   </span>
                                )}
                                
                                <span className="text-[#888] text-xs font-normal ml-1 font-['DIN_Alternate',sans-serif]">({ex.sets.length}组)</span>
                              </div>
                              
                              <div className="flex items-center gap-3 shrink-0">
                                {!isCardio && !ex.isCollapsed && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); toggleUnit(idx); }} 
                                    className="text-[11px] bg-[#333] px-2 py-1 rounded-md text-[#888] hover:text-white font-bold transition-colors font-['DIN_Alternate',sans-serif]"
                                  >
                                    单位: {ex.unit || 'kg'}
                                  </button>
                                )}
                                {isCardio && !ex.isCollapsed && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); toggleCardioMetric(idx); }}
                                    className="text-[11px] bg-[#333] px-2 py-1 rounded-md text-[#888] hover:text-white font-bold transition-colors font-['DIN_Alternate',sans-serif]"
                                  >
                                    {isJumpRope && cardioMetric === 'count' ? '次数' : cardioLabel}
                                  </button>
                                )}
                                {ex.isCollapsed ? <ChevronDown size={20} className="text-[#888]"/> : <ChevronUp size={20} className="text-[#888]"/>}
                                <button
                                  onClick={(e)=>{ e.stopPropagation(); deleteExercise(idx); }}
                                  className="w-8 h-8 rounded-full bg-[#333] hover:bg-red-500/20 hover:text-red-500 text-[#666] flex items-center justify-center transition-colors ml-1"
                                >
                                  <Trash2 size={14}/>
                                </button>
                              </div>
                            </div>

                            {!ex.isCollapsed && (
                              <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="flex px-1 mb-2 text-[#888] text-[11px] font-bold">
                                  <div className="w-8 text-center">组</div>
                                  <div className="flex-1 text-center">
                                    {isCardio ? (
                                      cardioMetric === 'distance'
                                        ? '距离'
                                        : cardioMetric === 'count'
                                          ? '次数'
                                          : '时长 (分)'
                                    ) : (
                                      `重量 (${ex.unit || 'kg'})`
                                    )}
                                  </div>
                                  {!isCardio && <div className="flex-1 text-center">次数</div>}
                                  <div className="w-12 text-center">打卡</div>
                                </div>

                                {ex.sets.map((set, sIdx) => (
                                  <div
                                    key={set.id}
                                    className={`relative mb-2 h-12 overflow-hidden rounded-[16px] flex items-center gap-2 p-1.5 transition-all ${set.completed ? 'bg-[#303030] opacity-60 grayscale-[0.5]' : 'bg-[#1A1A1A] border border-white/5'}`}
                                  >
                                    <div className="w-8 text-center text-[#888] font-bold text-sm font-['DIN_Alternate',sans-serif]">{sIdx + 1}</div>
                                    
                                    {isCardio ? (
                                      <div className="flex-1 bg-[#252525] rounded-xl flex items-center overflow-hidden h-9">
                                        <input 
                                          type="number" 
                                          value={set.duration} 
                                          onChange={e => updateSet(idx, sIdx, 'duration', e.target.value)} 
                                          onFocus={e => e.target.select()}
                                          disabled={set.completed} 
                                          className="w-full bg-transparent text-center text-lg text-white font-mono outline-none font-bold placeholder:text-[#555] font-['DIN_Alternate',sans-serif]" 
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex-1 bg-[#252525] rounded-xl flex items-center overflow-hidden h-9">
                                          <input 
                                            type="number" 
                                            value={set.weight === 0 ? '' : set.weight} 
                                            placeholder="0"
                                            onChange={e => updateSet(idx, sIdx, 'weight', e.target.value)} 
                                            onFocus={e => e.target.select()}
                                            disabled={set.completed} 
                                            className="w-full bg-transparent text-center text-lg text-white font-mono outline-none font-bold placeholder:text-[#555] font-['DIN_Alternate',sans-serif]" 
                                          />
                                        </div>
                                        <div className="flex-1 bg-[#252525] rounded-xl flex items-center overflow-hidden h-9">
                                          <input 
                                            type="number" 
                                            value={set.reps} 
                                            placeholder="10"
                                            onChange={e => updateSet(idx, sIdx, 'reps', e.target.value)} 
                                            onFocus={e => e.target.select()}
                                            disabled={set.completed} 
                                            className="w-full bg-transparent text-center text-lg text-white font-mono outline-none font-bold placeholder:text-[#555] font-['DIN_Alternate',sans-serif]" 
                                          />
                                        </div>
                                      </>
                                    )}
                                    
                                    <button 
                                      onClick={() => toggleSetComplete(idx, sIdx)} 
                                      className={`w-10 h-9 rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-[#E8F583] text-[#202020] shadow-[0_0_15px_rgba(232,245,131,0.2)]' : 'bg-[#333] text-[#888] hover:bg-[#404040]'}`}
                                    >
                                      <CheckCircle2 size={18} strokeWidth={set.completed ? 3 : 2} />
                                    </button>

                                    {ex.sets.length > 1 && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); deleteSet(idx, sIdx); }}
                                        className="w-8 h-9 rounded-xl flex items-center justify-center bg-[#2A2A2A] text-[#666] hover:bg-red-500/20 hover:text-red-500 transition-colors"
                                      >
                                        <X size={16} />
                                      </button>
                                    )}
                                  </div>
                                ))}

                                <button 
                                  onClick={() => addSet(idx)} 
                                  className="w-full mt-3 h-11 rounded-[16px] bg-[#202020] hover:bg-[#303030] border border-dashed border-[#555] text-[#888] hover:text-[#bbb] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Plus size={16} /> 加一组
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })
                )}
                {provided.placeholder}

                <button onClick={onAddAction} className="w-full h-14 border-2 border-dashed border-[#E8F583]/30 text-[#E8F583] font-bold rounded-[24px] hover:bg-[#E8F583]/10 transition-colors flex items-center justify-center gap-2 mt-2 shrink-0">
                  <Plus size={20} /> 继续添加动作
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="px-5 pb-8 pt-4 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent shrink-0">
        <button 
          onClick={() => onComplete({ type: typeName, duration: formatTime(trainingTime), exercises, muscleSummary: getMuscleSummary(exercises, type) })}
          className="w-full h-16 bg-[#E8F583] text-[#202020] rounded-[20px] font-bold text-xl shadow-[0_10px_30px_rgba(232,245,131,0.2)] active:scale-95 transition-transform"
        >
          结束训练
        </button>
      </div>
    </div>
  );
}

// 动作选择页
function ActionSelectionScreen({ type, customExercises, onSaveCustom, onDeleteCustom, onClose, onSelectAction }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const dbType = STATIC_EXERCISE_DB[type] ? type : 'anaerobic';
  const muscleGroups = Object.keys(STATIC_EXERCISE_DB[dbType]);
  
  const [activeMuscle, setActiveMuscle] = useState(muscleGroups[0]);
  const equips = getEquipTypes(type);
  const [activeEquip, setActiveEquip] = useState(equips[0]);

  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomEquip, setNewCustomEquip] = useState('自重');
  const [editingCustomId, setEditingCustomId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const staticList = STATIC_EXERCISE_DB[dbType][activeMuscle] || [];
  const customList = customExercises.filter(e => e.type === type && e.muscle === activeMuscle);
  const fullList = [...staticList, ...customList];

  let filteredList = activeEquip === '全部' 
    ? fullList 
    : fullList.filter(e => e.equip === activeEquip);

  if (searchQuery.trim()) {
    filteredList = filteredList.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const handleCreateOrUpdateCustom = () => {
    if (!newCustomName.trim()) return;
    const payload = {
      type,
      muscle: activeMuscle,
      equip: newCustomEquip || '自重',
      name: newCustomName,
      id: editingCustomId || undefined
    };
    onSaveCustom(payload);
    setNewCustomName('');
    setNewCustomEquip('自重');
    setEditingCustomId(null);
    setShowAddCustomModal(false);
  };

  const handleOpenCreate = () => {
    setEditingCustomId(null);
    setNewCustomName('');
    setNewCustomEquip('自重');
    setShowAddCustomModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingCustomId(item.id);
    setNewCustomName(item.name || '');
    setNewCustomEquip(item.equip || '自重');
    setShowAddCustomModal(true);
  };

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[60] bg-[#202020] flex flex-col animate-in slide-in-from-bottom duration-300 font-['Microsoft_YaHei',sans-serif]">
      
      <div className="pt-12 pb-4 px-5 flex gap-4 items-center z-10">
        <button onClick={onClose} className="w-11 h-11 shrink-0 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 rounded-full active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 bg-[#151515] rounded-full h-11 flex items-center px-5 gap-3 border border-white/5 focus-within:border-[#E8F583]/50 transition-colors shadow-inner">
          <Search size={18} className="text-[#888]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索动作..." 
            className="bg-transparent border-none outline-none text-white text-[15px] w-full placeholder:text-[#666] font-medium" 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#666] hover:text-white"><X size={16}/></button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden mt-2">
        <div className="w-[88px] overflow-y-auto no-scrollbar pb-10 flex flex-col gap-2 px-3 shrink-0">
          {muscleGroups.map(m => (
            <div 
              key={m} 
              onClick={() => setActiveMuscle(m)} 
              className={`py-3.5 px-2 text-center text-[13px] font-bold rounded-[16px] transition-all cursor-pointer flex items-center justify-center select-none active:scale-95
                ${activeMuscle === m 
                  ? 'bg-[#E8F583] text-[#202020] shadow-[0_5px_15px_rgba(232,245,131,0.2)]' 
                  : 'text-[#888] hover:bg-white/5 hover:text-white'}`}
            >
              {m}
            </div>
          ))}
        </div>

        <div className="flex-1 bg-[#151515] rounded-tl-[40px] flex flex-col overflow-hidden relative shadow-[-5px_0_30px_rgba(0,0,0,0.3)]">
          {equips.length > 1 && (
            <div className="flex gap-2.5 p-6 pb-4 overflow-x-auto shrink-0 no-scrollbar">
              {equips.map(eq => (
                <button 
                  key={eq} 
                  onClick={() => setActiveEquip(eq)} 
                  className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap font-bold transition-all active:scale-95
                    ${activeEquip === eq 
                      ? 'bg-[#AD9BF0] text-[#202020] shadow-[0_5px_15px_rgba(173,155,240,0.25)]' 
                      : 'bg-[#252525] text-[#888] hover:text-white hover:bg-[#303030]'}`}
                >
                  {eq}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 pt-2 no-scrollbar">
            <div className="flex justify-between items-end mb-4 px-1">
               <h3 className="text-white font-bold text-lg">{activeEquip === '全部' ? '所有动作' : activeEquip}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pb-24">
              
              {/* 动作卡片 */}
              {filteredList.map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  onClick={() => onSelectAction(item)} 
                  className="bg-[#222222] rounded-[24px] p-4 relative flex flex-col items-center cursor-pointer active:scale-95 transition-all shadow-lg border border-white/5 hover:border-white/10 group min-h-[140px]"
                >
                  {item.isCustom && (
                    <div className="absolute top-2.5 right-2.5 flex gap-1.5 z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }} 
                        className="text-[#E8F583] bg-[#E8F583]/10 p-1.5 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  )}

                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner
                    ${item.isCustom ? 'bg-[#F0C7FF]/10 text-[#F0C7FF]' : 'bg-[#AD9BF0]/10 text-[#AD9BF0]'}`}
                  >
                     {type === 'aerobic' ? <Activity size={24} /> : <Dumbbell size={24} />}
                  </div>
                  
                  <span className="text-[14px] font-bold text-white mb-1.5 text-center leading-tight line-clamp-2 px-1">{item.name}</span>
                  {type !== 'stretch' && item.equip && item.equip !== '无' && (
                    <span className="text-[10px] text-[#888] bg-[#151515] px-2 py-0.5 rounded-md font-medium">{item.equip}</span>
                  )}
                </div>
              ))}

              {/* 【自定义按钮】虚线卡片 */}
              <div 
                onClick={handleOpenCreate} 
                className="bg-[#202020]/50 border-2 border-dashed border-[#E8F583]/30 rounded-[24px] p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#202020] active:scale-95 transition-all min-h-[140px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#E8F583]/10 flex items-center justify-center text-[#E8F583] mb-3">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <span className="text-[#E8F583] text-[13px] font-bold tracking-wide">自定义动作</span>
              </div>

            </div>

            {searchQuery && filteredList.length === 0 && (
               <div className="text-center text-[#666] py-10 mt-10">
                 <Search size={32} className="mx-auto mb-3 opacity-20" />
                 <div className="text-sm font-bold">未搜到相关动作</div>
               </div>
            )}
          </div>
        </div>
      </div>

      {showAddCustomModal && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center px-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddCustomModal(false)}></div>
          <div className="relative bg-[#202020] w-full rounded-[32px] p-6 shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200">
             {editingCustomId && (
                <button
                    onClick={() => { onDeleteCustom(editingCustomId); setShowAddCustomModal(false); }}
                    className="absolute top-6 right-6 w-10 h-10 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition-colors"
                >
                    <Trash2 size={20} />
                </button>
             )}
             <div className="w-12 h-12 rounded-full bg-[#E8F583]/20 flex items-center justify-center mb-4 text-[#E8F583]">
                <Edit3 size={24} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-1">自定义动作</h3>
             <p className="mb-6 text-[13px] text-[#888] font-medium">
               在 <span className="text-[#E8F583] px-1">{activeMuscle}</span> 分类下{editingCustomId ? '编辑' : '创建'}
             </p>
             <input 
               type="text" 
               value={newCustomName} 
               onChange={e => setNewCustomName(e.target.value)} 
               placeholder="输入动作名称" 
               className="w-full bg-[#151515] border-2 border-white/5 rounded-[20px] px-5 py-4 text-white outline-none focus:border-[#E8F583]/50 transition-colors mb-4 font-bold text-[15px]" 
               autoFocus
             />
             <div className="mb-6">
               <div className="text-[13px] text-[#888] mb-2 font-medium">器械类型（可选）</div>
               <div className="flex flex-wrap gap-2">
                 {['自重','器械','哑铃','杠铃','绳索','其他'].map(opt => (
                   <button
                     key={opt}
                     type="button"
                     onClick={() => setNewCustomEquip(opt)}
                     className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${
                       newCustomEquip === opt
                         ? 'bg-[#E8F583] text-[#202020]'
                         : 'bg-[#151515] text-[#888]'
                     }`}
                   >
                     {opt}
                   </button>
                 ))}
               </div>
             </div>
             <div className="flex gap-4">
               <button onClick={() => setShowAddCustomModal(false)} className="flex-1 py-4 bg-[#303030] hover:bg-[#3A3A3A] text-white rounded-[20px] font-bold transition-colors">取消</button>
               <button onClick={handleCreateOrUpdateCustom} className="flex-1 py-4 bg-[#E8F583] text-[#202020] rounded-[20px] font-bold shadow-[0_10px_20px_rgba(232,245,131,0.2)] hover:scale-105 active:scale-95 transition-all">确认保存</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 结束总结与导出页
function EndSummaryScreen({ data, onClose, onExport, onSave, title, profileData, modeId }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  if (!data) return null;
  const [journalText, setJournalText] = React.useState('');
  const [journalImage, setJournalImage] = React.useState(null);
  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setJournalImage(reader.result);
    reader.readAsDataURL(f);
  };
  const estimateCalories = () => {
    if (!data) return 0;
    const weightKg = parseFloat(profileData?.weight || 65);
    const baseModeId = modeId || 'evolution';

    if (data.type === 'challenge') {
      let durationMin = 0;
      if (data.duration) {
        const parts = String(data.duration).split(':');
        if (parts.length === 2) {
          const mins = parseInt(parts[0]) || 0;
          const secs = parseInt(parts[1]) || 0;
          durationMin = mins + secs / 60;
        }
      }
      if (!durationMin) {
        const mode = CHALLENGE_MODES.find(v => v.id === baseModeId);
        if (mode && typeof mode.time === 'string' && mode.time.endsWith('min')) {
          const baseMin = parseFloat(mode.time) || 0;
          durationMin = baseMin;
        } else {
          durationMin = 10;
        }
      }
      return calculateCalories('BODYWEIGHT_STRENGTH', weightKg, durationMin, true, baseModeId);
    }

    const t = {
      duration: data.duration,
      exercises: Array.isArray(data.exercises) ? data.exercises : []
    };
    if (!Array.isArray(t.exercises) || t.exercises.length === 0) return 0;

    let durationMin = 0;
    let hasSetDuration = false;
    t.exercises.forEach(ex => {
      if (!Array.isArray(ex.sets)) return;
      ex.sets.forEach(s => {
        if (s.duration) {
          hasSetDuration = true;
          durationMin += parseFloat(s.duration) || 0;
        }
      });
    });
    if (!hasSetDuration && t.duration) {
      const parts = String(t.duration).split(':');
      if (parts.length === 2) {
        const mins = parseInt(parts[0]) || 0;
        const secs = parseInt(parts[1]) || 0;
        durationMin += mins + Math.floor(secs / 60);
      } else {
        durationMin += parseFloat(t.duration) || 0;
      }
    }
    if (durationMin <= 0) return 0;
    const anyDurationSet = t.exercises.some(ex => Array.isArray(ex.sets) && ex.sets.some(s => s.duration));
    const isAnaerobic = !anyDurationSet;
    const activityKey = isAnaerobic ? 'WEIGHT_LIFTING' : 'RUNNING_MID';
    return calculateCalories(activityKey, weightKg, durationMin, isAnaerobic, baseModeId);
  };
  const kcal = estimateCalories();

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[80] bg-[#121212] flex flex-col items-center justify-start p-6 pt-10 animate-in slide-in-from-bottom duration-300 font-['Microsoft_YaHei',sans-serif] overflow-y-auto">
      <div className="w-full max-w-sm bg-[#202020] rounded-[32px] p-6 shadow-2xl border border-[#333] relative flex flex-col items-center my-10">
        <div className="w-16 h-16 rounded-full bg-[#E8F583] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(232,245,131,0.3)]">
          <Trophy size={32} className="text-[#202020]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{title || '训练完成！'}</h2>
        <p className="text-[#888] font-medium mb-6 text-sm">伟大的付出，必有回响。</p>
        
        {data.type === 'challenge' ? (
          <div className="w-full bg-[#1A1A1A] rounded-[24px] p-5 mb-6 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#888] font-bold">挑战</span>
              <span className="text-white font-bold">{data.taskName}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
              <span className="text-[#888] font-bold">挑战时长</span>
              <span className="text-white font-mono font-bold text-lg font-['DIN_Alternate',sans-serif]">{data.duration || '00:00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#888] font-bold">总消耗/kcal</span>
              <span className="text-white font-bold font-['DIN_Alternate',sans-serif] text-lg">{kcal}</span>
            </div>
          </div>
        ) : (
          <div className="w-full bg-[#1A1A1A] rounded-[24px] p-5 mb-6 border border-white/5">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
              <span className="text-[#888] font-bold">训练总结</span>
              <span className="text-white font-bold">{data.muscleSummary}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
              <span className="text-[#888] font-bold">训练时长</span>
              <span className="text-white font-mono font-bold text-lg font-['DIN_Alternate',sans-serif]">{data.duration}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#888] font-bold">总消耗/kcal</span>
              <span className="text-white font-bold font-['DIN_Alternate',sans-serif] text-lg">{kcal}</span>
            </div>
            <div className="flex flex-col items-start mt-2">
              <span className="text-[#888] font-bold mb-3">动作记录明细</span>
              <div className="w-full flex flex-col gap-3">
                {data.exercises.length > 0 ? data.exercises.map((ex, i) => (
                  <div key={i} className="flex flex-col bg-[#151515] p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold text-[14px]">{ex.name}</span>
                      <span className="text-[#888] text-[11px] font-bold bg-[#202020] px-2 py-0.5 rounded-md">
                        <span className="font-['DIN_Alternate',sans-serif]">{Array.isArray(ex.sets) ? ex.sets.length : ex.sets}</span> 组
                      </span>
                    </div>
                    {Array.isArray(ex.sets) && (
                      <div className="flex flex-col gap-1.5 mt-1 pt-2 border-t border-white/5">
                        {ex.sets.map((s, idx) => (
                          <div key={idx} className="flex justify-between text-[12px] text-[#666] font-bold">
                            <span>第 <span className="font-['DIN_Alternate',sans-serif] text-[#888]">{idx + 1}</span> 组</span>
                            {(s.duration || s.distance) ? (
                              <span className="font-['DIN_Alternate',sans-serif] text-[#888]">
                                {s.distance ? (
                                    <>
                                        {s.distance}km
                                        {s.duration && ` · ${s.duration}min`}
                                    </>
                                ) : (
                                    <>
                                        {s.duration}{' '}
                                        {ex.cardioMetric === 'distance'
                                          ? 'm'
                                          : ex.cardioMetric === 'count'
                                            ? '次'
                                            : 'min'}
                                    </>
                                )}
                              </span>
                            ) : (
                              <span className="font-['DIN_Alternate',sans-serif] text-[#888]">{s.weight || 0} {ex.unit || 'kg'} × {s.reps}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )) : <span className="text-white font-medium text-sm">无具体动作</span>}
              </div>
            </div>
          </div>
        )}

        <div className="w-full bg-[#1A1A1A] rounded-[24px] p-5 mb-6 border border-white/5">
          <div className="text-[#888] font-bold mb-3">健身日记</div>
          {journalImage ? (
            <div className="relative group mb-4">
              <img src={journalImage} alt="journal" className="w-full h-auto object-contain rounded-2xl shadow-md" />
              <label className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/70 transition-colors" title="更换图片">
                 <Pencil size={18} className="text-white" />
                 <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
              <button 
                type="button"
                onClick={() => setJournalImage(null)}
                className="absolute top-2 left-2 bg-black/50 backdrop-blur-md p-2 rounded-full hover:bg-black/70 transition-colors"
                title="删除图片"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <label className="w-full h-32 border-2 border-dashed border-white/10 hover:border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 text-[#888] cursor-pointer bg-[#151515]">
              <Camera size={22} className="opacity-80" />
              <span className="text-sm font-bold">上传今日照片</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          )}
          <textarea
            className="mt-4 w-full h-28 bg-[#151515] border border-white/10 rounded-2xl p-3 text-sm text-white placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#E8F583]/40"
            placeholder="记录今天的心得、感受或进步..."
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-3">
          <button onClick={() => onExport && onExport({ journalText, journalImage })} className="w-full py-3.5 bg-[#303030] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#404040]">
            <Share size={18} /> {data.type === 'challenge' ? '导出挑战数据' : '导出训练数据'}
          </button>
          <button onClick={() => { onSave && onSave({ journalText, journalImage }); onClose && onClose(); }} className="w-full py-3.5 bg-[#E8F583] text-[#202020] rounded-2xl font-bold shadow-lg">
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}

// 历史训练记录弹窗
function HistoryModal({ data, onClose, onUpdate, onExport, onExportReport, onDelete }) {
  const [editing, setEditing] = useState(() => !!(data && data._forceEditing));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [draft, setDraft] = useState(() => data ? JSON.parse(JSON.stringify(data)) : null);
  const [draftImage, setDraftImage] = useState(null);

  useEffect(() => {
    setDraft(data ? JSON.parse(JSON.stringify(data)) : null);
    setEditing(!!(data && data._forceEditing));
    setDraftImage(null);
  }, [data]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleImage = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setDraftImage(r.result);
    r.readAsDataURL(f);
  };

  if (!data || !draft) return null;
  const allowEdit = !data._forceEditing;

  const displayData = editing ? draft : data;

  const dt = (() => {
    try {
      // Always use the original data date to avoid timezone shifts during editing (draft state)
      const base = data && data.date;
      if (typeof base === 'string') {
        const m = base.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
        const d = new Date(base);
        if (!isNaN(d.getTime())) return d;
      } else if (base) {
        const d = new Date(base);
        if (!isNaN(d.getTime())) return d;
      }
    } catch {}
    return new Date();
  })();

  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  let challengeText = data?._challengeText || null;
  let challengeJournalText = data?._challengeJournalText || null;
  let challengeJournalImage = data?._challengeJournalImage || null;
  let challengeDuration = data?._challengeDuration || null;
  let challengeModeId = data?._challengeModeId || data?.modeId || null;
  let dailyKcal = typeof data?._dailyKcal === 'number' ? data._dailyKcal : null;
  
  if (!data?._source) {
    try {
      const raw = localStorage.getItem('fitnessApp_daily');
      if (raw) {
        const store = JSON.parse(raw);
        const dayKey = `${yyyy}-${mm}-${dd}`;
        const v = store?.[dayKey] || {};
        if (v && v.challenge) {
          if (!challengeText) challengeText = v.challengeText || '挑战完成';
          if (!challengeJournalText) challengeJournalText = v.challengeJournalText || null;
          if (!challengeJournalImage) challengeJournalImage = v.challengeJournalImage || null;
          if (!challengeDuration) challengeDuration = v.challengeDuration || null;
          if (!challengeModeId) challengeModeId = v.challengeModeId || v.modeId || null;
        }
        if (typeof v.kcal === 'number' && dailyKcal == null) {
          dailyKcal = v.kcal;
        }
      }
    } catch {}
  }
  
  const displayMonth = dt.getMonth() + 1;
  const displayDay = dt.getDate();
  const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()];
  const displayDayPadded = String(displayDay).padStart(2, '0');

  // Parse entries
  let entries = Array.isArray(displayData.entries) && displayData.entries.length > 0
    ? [...displayData.entries]
    : ((displayData.exercises && displayData.exercises.length) || displayData.duration || displayData.summary
        ? [{
            type: displayData.type || displayData.trainTag || '训练',
            muscleSummary: displayData.muscleSummary || displayData.summary || '',
            duration: displayData.duration || '',
            exercises: displayData.exercises || [],
            journalText: displayData.journalText || '',
            journalImage: displayData.journalImage || null,
            weight: displayData.weight,
            trainTag: displayData.trainTag,
            modeId: displayData.modeId
          }]
        : []);

  const baseKcal = entries.length > 0
    ? entries.reduce((acc, entry) => acc + computeTrainingKcal(entry), 0)
    : computeTrainingKcal(displayData);
  
  // 仅在非编辑状态下，为纯展示目的追加“挑战完成”条目，避免在保存时把它写回历史
  if (challengeText && !editing) {
      const hasChallenge = entries.some(e => e.type === 'Challenge' || e.type === '挑战' || e.isChallenge || (e.modeId && ['novice', 'evolution', 'crazy', 'custom'].includes(e.modeId)));
      if (!hasChallenge) {
          entries.unshift({
              type: '挑战',
              modeId: challengeModeId,
              summary: challengeText,
              duration: challengeDuration,
              journalText: challengeJournalText,
              journalImage: challengeJournalImage,
              kcal: (typeof dailyKcal === 'number' && dailyKcal > baseKcal) ? (dailyKcal - baseKcal) : 0,
              isChallenge: true
          });
      }
  }
  
  // Use _dailyKcal only if not editing (or we can recalculate it? usually dailyKcal is from stats)
  // When editing, we should probably rely on baseKcal (recalculated from inputs)
  const totalKcal = editing ? baseKcal : (typeof dailyKcal === 'number' ? dailyKcal : baseKcal);

  const handleSave = () => {
    if (onUpdate) {
      const payload = { ...draft };
      delete payload._forceEditing;
      onUpdate(payload);
    }
    setEditing(false);
  };

  const isChallengeRecord = entries.some(e => e.isChallenge || e.type === 'Challenge' || e.type === '挑战' || (e.modeId && ['novice', 'evolution', 'crazy', 'custom'].includes(e.modeId)));

  return (
    <div className="fixed left-1/2 top-0 bottom-0 w-full max-w-md -translate-x-1/2 z-[9999] bg-[#121212]/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200 font-['Microsoft_YaHei',sans-serif]" onClick={onClose}>
      <div className="w-full max-w-sm bg-[#202020] rounded-[32px] p-6 shadow-2xl border border-white/5 relative flex flex-col animate-in zoom-in-95 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex flex-col leading-tight">
              <span className="uppercase tracking-wider font-['DIN_Alternate',sans-serif]">
              {displayDayPadded} {monthShort} {yyyy}
              </span>
              <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[#888]">Training</span>
                  {totalKcal > 0 && (
                      <span className="text-sm font-bold text-[#E8F583] font-['DIN_Alternate',sans-serif]">· {totalKcal} kcal</span>
                  )}
              </div>
          </h3>

          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="w-8 h-8 bg-[#E8F583] rounded-full flex items-center justify-center text-[#202020] hover:brightness-110 transition-colors shadow-[0_4px_12px_rgba(232,245,131,0.3)]"
                >
                  <CheckCircle2 size={18} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-8 h-8 bg-[#FF4D4F]/10 rounded-full flex items-center justify-center text-[#FF4D4F] hover:bg-[#FF4D4F]/20 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : !isChallengeRecord && (
              <button
                onClick={() => setEditing(true)}
                className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[#888] hover:text-white transition-colors"
              >
                <Pencil size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[#888] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        


        {entries.length === 0 && !editing ? (
             <div className="flex flex-col items-center justify-center py-10 text-[#666]">
               <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-3">
                 <CalendarOff size={24} />
               </div>
               <span className="text-sm font-bold">暂无训练记录</span>
             </div>
        ) : (
          <div className="flex flex-col gap-5">
            {entries.map((entry, idx) => {
              if (entry.isChallenge || !editing) {
                return (
                  <RecordCard 
                    key={idx} 
                    data={entry} 
                    includeJournal={true} 
                    showKcal={true} 
                  />
                );
              }
              const entryKcal = computeTrainingKcal(entry);
              return (
                <div key={idx} className="bg-[#151515] rounded-2xl p-4 border border-white/5 shadow-md mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-[#AD9BF0]/10 flex items-center justify-center shrink-0">
                             <Dumbbell size={14} className="text-[#AD9BF0]" />
                           </div>
                           <input 
                             value={entry.muscleSummary || entry.summary || ''} 
                             onChange={(e) => {
                                const newEntries = JSON.parse(JSON.stringify(entries));
                                newEntries[idx].muscleSummary = e.target.value;
                                newEntries[idx].summary = e.target.value;
                                if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                    setDraft({...draft, entries: newEntries});
                                } else {
                                    setDraft({...draft, muscleSummary: e.target.value, summary: e.target.value});
                                }
                             }}
                             placeholder="训练标题"
                             className="bg-transparent border-b border-white/10 text-white font-bold text-sm w-full outline-none focus:border-[#AD9BF0]"
                           />
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-[#888]" />
                            <input 
                                value={entry.duration ? entry.duration.split(':')[0] || '' : ''}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    const currentDur = entry.duration || '00:00';
                                    const parts = currentDur.split(':');
                                    const newMin = val.slice(0, 3); // Max 3 digits for minutes
                                    const newDur = `${newMin}:${parts[1] || '00'}`;
                                    
                                    const newEntries = JSON.parse(JSON.stringify(entries));
                                    newEntries[idx].duration = newDur;
                                    newEntries[idx].kcal = computeTrainingKcal(newEntries[idx]);
                                    
                                    if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                        setDraft({...draft, entries: newEntries});
                                    } else {
                                        const updatedDraft = {...draft, duration: newDur};
                                        updatedDraft.kcal = computeTrainingKcal(updatedDraft);
                                        setDraft(updatedDraft);
                                    }
                                }}
                                placeholder="00"
                                className="bg-transparent border-b border-white/10 text-[#888] font-bold text-xs w-8 text-center outline-none focus:border-[#E8F583]"
                            />
                            <span className="text-[#888] font-bold text-xs">:</span>
                            <input 
                                value={entry.duration ? entry.duration.split(':')[1] || '' : ''}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    const currentDur = entry.duration || '00:00';
                                    const parts = currentDur.split(':');
                                    const newSec = val.slice(0, 2); // Max 2 digits for seconds
                                    const newDur = `${parts[0] || '00'}:${newSec}`;
                                    
                                    const newEntries = JSON.parse(JSON.stringify(entries));
                                    newEntries[idx].duration = newDur;
                                    newEntries[idx].kcal = computeTrainingKcal(newEntries[idx]);

                                    if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                        setDraft({...draft, entries: newEntries});
                                    } else {
                                        const updatedDraft = {...draft, duration: newDur};
                                        updatedDraft.kcal = computeTrainingKcal(updatedDraft);
                                        setDraft(updatedDraft);
                                    }
                                }}
                                placeholder="00"
                                className="bg-transparent border-b border-white/10 text-[#888] font-bold text-xs w-8 text-center outline-none focus:border-[#E8F583]"
                            />
                        </div>
                     </div>
                  </div>

                  <div className="mb-3">
                      <textarea 
                         value={entry.journalText || ''} 
                         onChange={(e) => {
                            const newEntries = JSON.parse(JSON.stringify(entries));
                            newEntries[idx].journalText = e.target.value;
                            if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                setDraft({...draft, entries: newEntries});
                            } else {
                                setDraft({...draft, journalText: e.target.value});
                            }
                         }}
                         className="w-full h-24 bg-[#1A1A1A] border border-white/10 rounded-2xl p-3 text-sm text-white placeholder:text-[#666] outline-none resize-none"
                         placeholder="写点什么..."
                      />
                      {entry.journalImage && <img src={entry.journalImage} alt="journal" className="w-full h-auto object-contain rounded-2xl shadow-md mt-2" />}
                  </div>

                  <div className="flex flex-col gap-2 mt-2 bg-[#101010] p-3 rounded-xl border border-white/10">
                      <div className="text-[#888] text-xs font-bold mb-1">动作明细</div>
                      {(entry.exercises || []).map((ex, exIdx) => (
                        <div key={exIdx} className="flex flex-col py-2 border-t border-white/5 first:border-none">
                          <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 w-full">
                                    <input 
                                        value={ex.name}
                                        onChange={(e) => {
                                            const newEntries = JSON.parse(JSON.stringify(entries));
                                            newEntries[idx].exercises[exIdx].name = e.target.value;
                                            if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                                setDraft({...draft, entries: newEntries});
                                            } else {
                                                setDraft({...draft, exercises: newEntries[0].exercises});
                                            }
                                        }}
                                        className="bg-transparent border-b border-white/10 text-white font-bold text-[13px] flex-1 outline-none focus:border-white/30"
                                    />
                                    <button 
                                        onClick={() => {
                                            const newEntries = JSON.parse(JSON.stringify(entries));
                                            newEntries[idx].exercises.splice(exIdx, 1);
                                            if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                                setDraft({...draft, entries: newEntries});
                                            } else {
                                                setDraft({...draft, exercises: newEntries[0].exercises});
                                            }
                                        }}
                                        className="text-[#FF4D4F] p-1"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                          </div>
                          
                          {Array.isArray(ex.sets) && (
                            <div className="flex flex-col gap-1.5 pl-2">
                              {ex.sets.map((s, sIdx) => (
                                <div key={sIdx} className="flex justify-between items-center text-[12px] text-[#888] font-bold">
                                  <span>Set <span className="font-['DIN_Alternate',sans-serif] text-[#aaa]">{sIdx + 1}</span></span>
                                  <div className="flex items-center gap-2">
                                      {(entry.trainTag === 'stretch' || entry.type === 'stretch' || entry.type === 'Stretch' || entry.type === '拉伸恢复') ? (
                                        <>
                                          <input 
                                              value={s.duration || ''} 
                                              onChange={(e) => {
                                                  const newEntries = JSON.parse(JSON.stringify(entries));
                                                  newEntries[idx].exercises[exIdx].sets[sIdx].duration = e.target.value;
                                                  if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                                      setDraft({...draft, entries: newEntries});
                                                  } else {
                                                      setDraft({...draft, exercises: newEntries[0].exercises});
                                                  }
                                              }}
                                              className="w-12 bg-[#202020] rounded px-1 text-white text-right text-xs"
                                              placeholder="min"
                                          />
                                          <span className="ml-1 text-xs text-[#888]">min</span>
                                        </>
                                      ) : (entry.trainTag === 'aerobic' || entry.type === 'aerobic' || entry.type === 'Aerobic' || entry.type === '有氧训练') ? (
                                        <>
                                          <input 
                                              value={s.distance || ''} 
                                              onChange={(e) => {
                                                  const newEntries = JSON.parse(JSON.stringify(entries));
                                                  newEntries[idx].exercises[exIdx].sets[sIdx].distance = e.target.value;
                                                  if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                                      setDraft({...draft, entries: newEntries});
                                                  } else {
                                                      setDraft({...draft, exercises: newEntries[0].exercises});
                                                  }
                                              }}
                                              className="w-12 bg-[#202020] rounded px-1 text-white text-right text-xs"
                                              placeholder="km"
                                          />
                                          <span className="ml-1 text-xs text-[#888]">km</span>
                                          <input 
                                              value={s.duration || ''} 
                                              onChange={(e) => {
                                                  const newEntries = JSON.parse(JSON.stringify(entries));
                                                  newEntries[idx].exercises[exIdx].sets[sIdx].duration = e.target.value;
                                                  if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                                      setDraft({...draft, entries: newEntries});
                                                  } else {
                                                      setDraft({...draft, exercises: newEntries[0].exercises});
                                                  }
                                              }}
                                              className="w-12 bg-[#202020] rounded px-1 text-white text-right text-xs ml-2"
                                              placeholder="min"
                                          />
                                          <span className="ml-1 text-xs text-[#888]">min</span>
                                        </>
                                      ) : (
                                        <>
                                          <input 
                                              value={s.weight || ''} 
                                              onChange={(e) => {
                                                  const newEntries = JSON.parse(JSON.stringify(entries));
                                                  newEntries[idx].exercises[exIdx].sets[sIdx].weight = e.target.value;
                                                  if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                                      setDraft({...draft, entries: newEntries});
                                                  } else {
                                                      setDraft({...draft, exercises: newEntries[0].exercises});
                                                  }
                                              }}
                                              className="w-10 bg-[#202020] rounded px-1 text-white text-right text-xs"
                                              placeholder="kg"
                                          />
                                          <span className="ml-1 text-xs text-[#888]">kg</span>
                                          <input 
                                              value={s.reps || ''} 
                                              onChange={(e) => {
                                                  const newEntries = JSON.parse(JSON.stringify(entries));
                                                  newEntries[idx].exercises[exIdx].sets[sIdx].reps = e.target.value;
                                                  if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                                      setDraft({...draft, entries: newEntries});
                                                  } else {
                                                      setDraft({...draft, exercises: newEntries[0].exercises});
                                                  }
                                              }}
                                              className="w-8 bg-[#202020] rounded px-1 text-white text-right text-xs ml-1"
                                              placeholder="-"
                                          />
                                        </>
                                      )}
                                      <button 
                                          onClick={() => {
                                              const newEntries = JSON.parse(JSON.stringify(entries));
                                              newEntries[idx].exercises[exIdx].sets.splice(sIdx, 1);
                                              if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                                  setDraft({...draft, entries: newEntries});
                                              } else {
                                                  setDraft({...draft, exercises: newEntries[0].exercises});
                                              }
                                          }}
                                          className="text-[#FF4D4F] ml-1"
                                      >
                                          <X size={10} />
                                      </button>
                                  </div>
                                </div>
                              ))}
                              <button 
                                  onClick={() => {
                                      const newEntries = JSON.parse(JSON.stringify(entries));
                                      newEntries[idx].exercises[exIdx].sets.push({ weight: '', reps: '' });
                                      if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                          setDraft({...draft, entries: newEntries});
                                      } else {
                                          setDraft({...draft, exercises: newEntries[0].exercises});
                                      }
                                  }}
                                  className="text-[10px] text-[#E8F583] mt-1 text-center py-0.5 bg-[#E8F583]/10 rounded hover:bg-[#E8F583]/20"
                              >
                                  + Add Set
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <button 
                          onClick={() => {
                              const newEntries = JSON.parse(JSON.stringify(entries));
                              newEntries[idx].exercises = newEntries[idx].exercises || [];
                              newEntries[idx].exercises.push({ name: 'New Exercise', sets: [{ weight: '', reps: '' }] });
                              if (Array.isArray(draft.entries) && draft.entries.length > 0) {
                                  setDraft({...draft, entries: newEntries});
                              } else {
                                  setDraft({...draft, exercises: newEntries[0].exercises});
                              }
                          }}
                          className="py-2 rounded-xl border border-dashed border-white/20 text-[#888] text-xs font-bold hover:bg-white/5 transition-colors mt-2"
                      >
                          + Add Exercise
                      </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!editing && (
          <div className="mt-6 flex gap-2">
            <button 
              onClick={() => { if (typeof onExport==='function') onExport(); }} 
              className="flex-1 py-3.5 bg-[#303030] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#404040] transition-colors"
            >
              <Share size={16}/> 导出/分享
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center" onClick={() => setShowDeleteConfirm(false)}>
          <div className="w-[260px] bg-[#202020] rounded-2xl p-5 border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-white font-bold text-sm mb-2">确认删除本条训练记录？</div>
            <div className="text-[#888] text-xs mb-4">删除后将从历史与统计中移除，且无法恢复。</div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#2A2A2A] text-[#bbb] text-sm font-bold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (typeof onDelete === 'function') {
                    onDelete(data);
                  }
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF4D4F] text-white text-sm font-bold shadow-[0_8px_20px_rgba(255,77,79,0.35)]"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
