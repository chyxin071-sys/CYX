import skyos_image from 'figma:asset/7a71efd04e70b3e4059cc661500902f4229cc541.png'
import chip_image from 'figma:asset/e2c7281a32dba37a4c2a7c3b27f64e650ee22292.png'
import nomi_image from 'figma:asset/ab2f7a5d42015f799a6edbf0c8e2052037dd5b98.png'
import screen_image from 'figma:asset/ad71fd73f0585bdb3976e551a434a6fd2a20662e.png'
import arhud_image from 'figma:asset/9f2c493b0181b92a18bd5ef041eb0b112453ea43.png'
import seat_image from 'figma:asset/fb7dd10acb18219fd04d05373e7cc129c791ed21.png'
import audio_image from 'figma:asset/183a2a65a11e64dbc63a669b228b32e39a320753.png'
import ambient_image from 'figma:asset/71aef500ecc412cf7397aae83ef6e28563472c7f.png'
import baas_image from 'figma:asset/e33d22df377585691c3caf431c3b564004c54f8d.png'
import power_image from 'figma:asset/76ecea28c2680235dcb5f6c9d0ad7dc464b88eef.png'

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Cpu,
  Radio,
  Smartphone,
  Zap,
  Eye,
  Cloud,
  Shield,
  Box,
  Armchair,
  Monitor,
  TrendingUp,
  Sparkles,
  Brain,
  Network,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Technology {
  id: string;
  name: string;
  icon: any;
  category: string;
  description: string;
  details: string[];
  specs?: { label: string; value: string }[];
  imageImport?: any; // 改为导入的图片对象
}

interface DesignTrend {
  title: string;
  description: string;
  icon: any;
  examples: string[];
}

export function KeyTechnologies() {
  const technologies: Technology[] = [
    // 智能系统
    {
      id: "skyos",
      name: "SkyOS 天枢",
      icon: Cloud,
      category: "智能系统",
      description:
        "全栈自研的智能座舱操作系统，实现硬件解耦与生态开放",
      details: [
        "基于 Android 深度定制的车规级操作系统",
        "支持硬件抽象层（HAL）实现跨平台兼容",
        "OTA 空中升级能力，持续进化",
        "开放API接口，第三方应用生态接入",
      ],
      specs: [
        { label: "启动速度", value: "< 3秒" },
        { label: "应用响应", value: "< 200ms" },
        { label: "OTA频率", value: "月度更新" },
      ],
      imageImport: skyos_image,
    },
    {
      id: "chip",
      name: "高通骁龙 8295",
      icon: Cpu,
      category: "智能系统",
      description:
        "业界领先的5nm制程座舱芯片，提供强大计算能力",
      details: [
        "8核Kryo CPU，主频高达3.0GHz",
        "Adreno GPU支持4K@60fps多屏异显",
        "AI算力达30TOPS，支持本地大模型推理",
        "支持最多12路像头并发处理",
      ],
      specs: [
        { label: "制程工艺", value: "5nm" },
        { label: "AI算力", value: "30 TOPS" },
        { label: "GPU性能", value: "3倍提升" },
      ],
      imageImport: chip_image,
    },
    // 交互硬件
    {
      id: "nomi",
      name: "NOMI Mate 3.0",
      icon: Radio,
      category: "交互硬件",
      description: "具备物理实体的AI情感伙伴，重新定义人车关系",
      details: [
        "1.45英寸圆形AMOLED显示屏，丰富表情库",
        "三轴电机驱动，支持360°旋转与点头动作",
        "声源定位+面部识别，精准交互对象",
        "情绪识别算法，理解用户情感状态",
      ],
      specs: [
        { label: "显示屏", value: "1.45寸AMOLED" },
        { label: "旋转角度", value: "360°" },
        { label: "识别准确率", value: "> 95%" },
      ],
      imageImport: nomi_image,
    },
    {
      id: "screen",
      name: "12.8英寸 AMOLED 中控屏",
      icon: Smartphone,
      category: "交互硬件",
      description: "超高清AMOLED屏幕，呈现极致视觉体验",
      details: [
        "2K分辨率（2880×1728），像素密度260 PPI",
        "DCI-P3广色域覆盖，色准ΔE<2",
        "10bit色深，10.7亿色彩显示",
        "HDR10+支持，峰值亮度1000nit",
      ],
      specs: [
        { label: "尺寸", value: "12.8英寸" },
        { label: "分辨率", value: "2K" },
        { label: "色域", value: "DCI-P3" },
      ],
      imageImport: screen_image,
    },
    {
      id: "arhud",
      name: "AR-HUD 增强抬头显示",
      icon: Eye,
      category: "交互硬件",
      description: "将导航信息投射到真实路面，所见即所得",
      details: [
        "虚像距离6米，等效屏幕尺寸56英寸",
        "分辨率1920×730，清晰度业界领先",
        "AR导航箭头贴合车道，精准引导",
        "亮度自适应调节，强光下依然清晰",
      ],
      specs: [
        { label: "虚像距离", value: "6米" },
        { label: "等效尺寸", value: "56英寸" },
        { label: "分辨率", value: "1920×730" },
      ],
      imageImport: arhud_image,
    },
    {
      id: "seat",
      name: "智能座椅系统",
      icon: Armchair,
      category: "交互硬件",
      description:
        "多维度电动调节，记忆用户偏好，打造专属舒适空间",
      details: [
        "14向电动调节，覆盖腰部、腿托、头枕",
        "座椅通风/加热/按摩三合一功能",
        "驾驶位记忆3组设置，自动识别用户",
        "女王副驾支持一键平，腿托+脚托联动",
      ],
      specs: [
        { label: "调节维度", value: "14向" },
        { label: "记忆组数", value: "3组" },
        { label: "按摩模式", value: "5种" },
      ],
      imageImport: seat_image,
    },
    // 感知体验
    {
      id: "audio",
      name: "7.1.4 沉浸声场系统",
      icon: Zap,
      category: "感知体验",
      description: "23个扬声器打造殿堂级听音体验",
      details: [
        "23个扬声器，总功率1000W+",
        "支持杜比全景声（Dolby Atmos）",
        "4个天空声道扬声器，营造3D音场",
        "主动降噪系统，静谧舱内环境",
      ],
      specs: [
        { label: "扬声器", value: "23个" },
        { label: "功率", value: "1000W+" },
        { label: "声道", value: "7.1.4" },
      ],
      imageImport: audio_image,
    },
    {
      id: "ambient",
      name: "256色智能氛围灯",
      icon: Sparkles,
      category: "感知体验",
      description: "沉浸式光影系统，营造情感化座舱氛围",
      details: [
        "256色RGB可调，覆盖全车内饰",
        "10+预设场景模式（欢迎/驾驶/休息/浪漫）",
        "音乐律动模式，灯光随节拍律动",
        "与NOMI表情联动，增强情感表达",
      ],
      specs: [
        { label: "色彩数", value: "256色" },
        { label: "场景模式", value: "10+" },
        { label: "律动响应", value: "< 50ms" },
      ],
      imageImport: ambient_image,
    },
    // 能源服务
    {
      id: "baas",
      name: "BaaS 车电分离",
      icon: Box,
      category: "能源服务",
      description: "电池即服务，降低购车门槛，解决衰减焦虑",
      details: [
        "购车价降低7-12万元",
        "电池租金980元/月起（75kWh标准续航）",
        "电池终身质保，性能低于80%免费换新",
        "灵活升级，根据需求切换电池容量",
      ],
      specs: [
        { label: "降价幅度", value: "7-12万" },
        { label: "月租", value: "980元起" },
        { label: "质保", value: "终身" },
      ],
      imageImport: baas_image,
    },
    {
      id: "power",
      name: "NIO Power 换电网络",
      icon: Shield,
      category: "能源服务",
      description: "全球最大的换电网络，3分钟满电出发",
      details: [
        "全国3700+座换电站（截至2025年）",
        "高速公路每200km一座换电站",
        "换电时长仅需3-5分钟",
        "日均换电服务5万+次，93.1%车主认可",
      ],
      specs: [
        { label: "换电站", value: "3700+" },
        { label: "换电时长", value: "3-5分钟" },
        { label: "日均服务", value: "5万+次" },
      ],
      imageImport: power_image,
    },
  ];

  const designTrends: DesignTrend[] = [
    {
      title: "从多模态到全模态融合",
      icon: Network,
      description:
        "打破单一交互方式的局限，实现语音、触控、手势、视线、脑机接口的无缝切换",
      examples: [
        "驾驶时用视线+手势控制，解放双手",
        "停车时用触控精准操作",
        "疲劳时纯语音免唤醒交互",
        "未来：脑机接口实现意念控制",
      ],
    },
    {
      title: "AI主动服务取代被动响应",
      icon: Brain,
      description:
        '从"人找功能"到"功能找人"，AI预判需求，主动推荐服务',
      examples: [
        "根据日程自动预热/预冷车辆",
        "检测疲劳主动推荐换电站/咖啡厅",
        "识别情绪播放对应音乐/调节氛围灯",
        "学习习惯优化座椅/空调/导航设置",
      ],
    },
    {
      title: "物理+数字双重人格化",
      icon: Radio,
      description:
        "通过物理实体（NOMI）和数字角色，建立情感连接",
      examples: [
        "NOMI物理机器人：表情+动作+语音三位一体",
        "数字形象：可自定义的虚拟助手形象",
        "情感记忆：记住用户喜好与重要时刻",
        "主动社交：提醒纪念日、推荐活动",
      ],
    },
    {
      title: "车家互联的生态延伸",
      icon: Monitor,
      description:
        "座舱不再是孤岛，与智能家居、办公、娱乐生态深度融合",
      examples: [
        "离家前家居设备自动关闭，到家前自动开启",
        "车内接听视频会议，多屏协同办公",
        "手机/Pad内容无缝投屏到车机",
        "NIO App生态：积分、社区、活动一体化",
      ],
    },
    {
      title: "订阅制与持续进化",
      icon: TrendingUp,
      description:
        '从"一次性购买"到"持续订阅"，通过OTA实现功能常新',
      examples: [
        "NOP+/NOA高阶智驾按月订阅",
        "高级音效、氛围灯场景付费解锁",
        "OTA推送新功能（如哨兵模式、露营模式）",
        "硬件预埋，软件激活（如激光雷达）",
      ],
    },
  ];

  const [selectedTech, setSelectedTech] = useState<Technology>(
    technologies[0],
  );
  const [showTrends, setShowTrends] = useState(false);

  // 按类别分组
  const groupedTechnologies = technologies.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<string, Technology[]>,
  );

  return (
    <section className="min-h-screen bg-black py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-2">
            关键技术
          </h2>
          <p className="text-gray-500">
            支撑智能座舱体验的核心技术栈
          </p>
        </motion.div>

        {/* 切换：技术详情 / 设计趋势 */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setShowTrends(false)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              !showTrends
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            核心技术
          </button>
          <button
            onClick={() => setShowTrends(true)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              showTrends
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            设计趋势
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showTrends ? (
            // 技术详情视图
            <motion.div
              key="technologies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* 左侧：技术列表（分类） */}
              <div className="lg:col-span-1 space-y-6">
                {Object.entries(groupedTechnologies).map(
                  ([category, techs]) => (
                    <div key={category}>
                      <h3 className="text-sm text-gray-500 mb-2 px-2">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {techs.map((tech) => (
                          <motion.button
                            key={tech.id}
                            onClick={() =>
                              setSelectedTech(tech)
                            }
                            whileHover={{ x: 4 }}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedTech.id === tech.id
                                ? "bg-cyan-500/10 border-cyan-500/50 text-white"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <tech.icon
                                className={`w-4 h-4 ${
                                  selectedTech.id === tech.id
                                    ? "text-cyan-400"
                                    : "text-gray-500"
                                }`}
                              />
                              <span className="text-sm truncate">
                                {tech.name}
                              </span>
                              {selectedTech.id === tech.id && (
                                <div className="w-1 h-6 bg-cyan-500 rounded-full ml-auto"></div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* 右侧：技术详情 */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTech.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="border border-white/10 rounded-xl p-8 bg-white/5"
                  >
                    {/* 技术头部 */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <selectedTech.icon className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-cyan-400 mb-1">
                          {selectedTech.category}
                        </div>
                        <h3 className="text-2xl text-white mb-2">
                          {selectedTech.name}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {selectedTech.description}
                        </p>
                      </div>
                    </div>

                    {/* 核心特性 */}
                    <div className="mb-6">
                      <h4 className="text-white text-sm mb-3">
                        核心特性
                      </h4>
                      <ul className="space-y-2">
                        {selectedTech.details.map(
                          (detail, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-sm text-gray-300"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                              <span className="leading-relaxed">
                                {detail}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* 技术规格 */}
                    {selectedTech.specs && (
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                        {selectedTech.specs.map(
                          (spec, index) => (
                            <div
                              key={index}
                              className="text-center"
                            >
                              <div className="text-2xl text-cyan-400 font-light mb-1">
                                {spec.value}
                              </div>
                              <div className="text-xs text-gray-500">
                                {spec.label}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    {/* 技术图片 - 支持PNG/JPG/GIF */}
                    {selectedTech.imageImport && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <ImageWithFallback
                          src={selectedTech.imageImport}
                          alt={selectedTech.name}
                          className="w-full rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            // 设计趋势视图
            <motion.div
              key="trends"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {designTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-white/10 rounded-xl p-6 bg-white/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <trend.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl text-white mb-2">
                        {trend.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {trend.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {trend.examples.map((example, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-gray-300"
                          >
                            <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></div>
                            <span>{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}