import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowDown } from "lucide-react";

interface FlowNode {
  layer: string;
  items: string[];
}

interface FeatureData {
  id: string;
  name: string;
  subtitle: string;
  coreLogic: string;
  highlights: string[];
  painPoints: string[];
  opportunities: string[];
  flowNodes: FlowNode[];
}

export function FeatureBreakdown() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState<string | null>("1.1");

  const tabs = [
    { name: "空间体验层", description: "座舱作为「第三空间」的物理基础" },
    { name: "智能入口层", description: "无感交互的技术实现" },
    { name: "情感连接层", description: "NOMI作为数字生命体" }
  ];

  const tabFeatures: FeatureData[][] = [
    // 空间体验层
    [
      {
        id: "1.1",
        name: "女王副驾系统",
        subtitle: "从座椅到场景入口的进化",
        coreLogic: "将副驾重构为「休息/娱乐/工作」多功能空间入口",
        highlights: [
          "一键触发，从4步操作降至1步",
          "副驾使用率从28%提升至67%",
          "平均单次使用时长23分钟"
        ],
        painPoints: ["传统副驾只是「座位」，缺乏场景定义能力"],
        opportunities: [
          "硬件3年预埋，2025年软件激活",
          "域融合突破：座椅域与座舱域打通",
          "「女王」命名强化情感认同"
        ],
        flowNodes: [
          { layer: "感知层", items: ["语音/触控/快捷指令"] },
          { layer: "决策层", items: ["模式选择", "零重力/休闲/睡眠/自定义", "姿态计算+安全校验"] },
          { layer: "执行层", items: ["18向座椅调节", "靠背/腿托/脚托/腰撑", "加热/通风/按摩/氛围灯"] },
          { layer: "反馈层", items: ["记忆保存+物理反馈", "3组用户记忆", "一键复位"] }
        ]
      },
      {
        id: "1.2",
        name: "小憩模式",
        subtitle: "移动空间的休息场景闭环",
        coreLogic: "一键完成「座椅-环境-提醒」全链路，真正无感休息",
        highlights: [
          "平均使用时长18分钟",
          "午休场景使用率78%",
          "用户满意度92%"
        ],
        painPoints: ["传统车内休息需要手动调节多项设备，操作繁琐"],
        opportunities: [
          "场景闭环：自动准备 → 智能维持 → 渐进唤醒",
          "安全设计：车门锁止 + CO₂监测自动换气",
          "生态联动：与女王副驾绑定"
        ],
        flowNodes: [
          { layer: "感知层", items: ["语音/触控/自动触发"] },
          { layer: "决策层", items: ["场景判断", "安全检测/时长计算/偏好读取"] },
          { layer: "执行层", items: ["环境准备", "关窗/锁门/熄屏/调暗灯光", "座椅半躺/空调/白噪音/香氛", "睡眠监测(心率/呼吸)"] },
          { layer: "反馈层", items: ["温柔唤醒", "音乐渐强/座椅复位/灯光渐亮/问候"] }
        ]
      },
      {
        id: "1.3",
        name: "无麦K歌2.0",
        subtitle: "移动音乐Studio",
        coreLogic: "AI赋能无麦K歌，50ms超低延迟专业级体验",
        highlights: [
          "50ms超低延迟，人耳无感知",
          "85dBA最大无啸叫声压级",
          "亲子场景使用率+200%"
        ],
        painPoints: ["传统车载K歌必须连接专属麦克风，体验差"],
        opportunities: [
          "AI人声检测、声音滤镜、智能音效",
          "7.1.4杜比全景声，23扬声器",
          "小黄人音效成为带娃神器"
        ],
        flowNodes: [
          { layer: "感知层", items: ["人声+伴奏输入"] },
          { layer: "决策层", items: ["AI处理", "人声检测/声音滤镜/音效匹配", "音效选择(智能/原声/KTV/小黄人)"] },
          { layer: "执行层", items: ["音频处理+输出", "实时混音/杜比全景声", "23扬声器/空间音频"] },
          { layer: "反馈层", items: ["屏幕显示+灯光随动"] }
        ]
      }
    ],
    // 智能入口层
    [
      {
        id: "2.1",
        name: "iPhone数字钥匙",
        subtitle: "UWB无感进入",
        coreLogic: "厘米级定位，全程零操作「无感」体验",
        highlights: [
          "10cm精度UWB定位",
          "2022年硬件预埋，2025年软件激活",
          "iPhone用户占比提升至55%"
        ],
        painPoints: ["传统钥匙或手机App操作繁琐"],
        opportunities: [
          "技术预埋：3年前布局，竞品需3年跟进",
          "生态绑定：国内首家支持iPhone数字钥匙",
          "服务延伸：共享钥匙、家庭共享"
        ],
        flowNodes: [
          { layer: "感知层", items: ["iPhone UWB信号", "靠近车辆"] },
          { layer: "决策层", items: ["距离判断", "30米: 感知定位", "8米: 触发欢迎", "2米: 触发解锁"] },
          { layer: "执行层", items: ["8米欢迎: 大灯流水动画/空调预开启", "2米解锁: 门把手弹出/后视镜展开/座椅预设到位"] },
          { layer: "反馈层", items: ["NOMI语音问候", "屏幕显示欢迎"] }
        ]
      },
      {
        id: "2.2",
        name: "城区领航换电",
        subtitle: "全球首创补能闭环",
        coreLogic: "全程无需下车，打通补能「最后一公里」",
        highlights: [
          "全球首个覆盖城区补能的智驾功能",
          "覆盖全国2000+座换电站",
          "春节使用18,407次，满意度95%+"
        ],
        painPoints: ["传统换电需人工操作，排队等待体验差"],
        opportunities: [
          "世界模型NWM，首次来站也可用",
          "车-站-云协同，智能排队",
          "无缝衔接NOP，体验无断点"
        ],
        flowNodes: [
          { layer: "感知层", items: ["语音/APP/路况/站状态"] },
          { layer: "决策层", items: ["路径规划+园区进入", "NOP领航/避障/等灯/抬杆识别", "排队策略", "有排队位置→直接排队", "无位置→漫游找位暂泊→实时监测"] },
          { layer: "执行层", items: ["自动泊入+换电+驶出", "精准泊入+下电", "换电完成+上电+接入NOP"] },
          { layer: "反馈层", items: ["屏幕+NOMI+手机通知"] }
        ]
      },
      {
        id: "2.5",
        name: "快捷指令+静默执行",
        subtitle: "效率革命",
        coreLogic: "后台静默执行，减少70%不必要的弹窗",
        highlights: [
          "操作步骤减少60%",
          "驾驶分心时间降低75%",
          "用户创建场景数月均增长45%"
        ],
        painPoints: ["传统场景指令每次执行都弹窗确认，打断驾驶"],
        opportunities: [
          "多步骤一键执行，后台静默运行",
          "正常执行时静默，异常时提示",
          "覆盖上班/儿童/洗车/休息/回家场景"
        ],
        flowNodes: [
          { layer: "感知层", items: ["触发(语音/触控/自动)", "时间/位置"] },
          { layer: "决策层", items: ["场景识别+静默策略", "上班/儿童/洗车/休息/回家模式", "静默判断(无弹窗/后台并行)"] },
          { layer: "执行层", items: ["后台静默执行", "多指令并行(导航+空调+音乐+座椅)", "状态栏显示进度(无界面打扰)"] },
          { layer: "反馈层", items: ["完成反馈+异常处理", "成功: 静默完成", "异常: 状态栏警告/弹窗提示"] }
        ]
      }
    ],
    // 情感连接层
    [
      {
        id: "3.1",
        name: "NOMI帽子生态",
        subtitle: "数字周边与情感经济",
        coreLogic: "实体周边与数字形象联动，构建情感经济闭环",
        highlights: [
          "NFC刷帽识别",
          "专属音效、表情、互动",
          "强化品牌情感连接"
        ],
        painPoints: ["传统语音助手缺乏情感连接"],
        opportunities: [
          "实体周边与数字形象联动",
          "构建情感经济闭环",
          "社交分享传播"
        ],
        flowNodes: [
          { layer: "感知层", items: ["NFC刷帽识别"] },
          { layer: "决策层", items: ["帽子匹配+主题加载", "款式识别(赤逗/萌萌/联名款)", "内容加载(音效/表情/互动)"] },
          { layer: "执行层", items: ["视觉+音频+氛围", "形象变更(戴帽动画/登场秀/变脸)", "专属音效(马叫/吉祥话)", "氛围联动(灯光/导航车标)"] },
          { layer: "反馈层", items: ["屏幕显示", "新形象展示+社交分享"] }
        ]
      },
      {
        id: "3.2",
        name: "NOMI一起摇摆",
        subtitle: "音乐互动与情绪价值",
        coreLogic: "音频特征实时匹配，11种舞姿27表情联动",
        highlights: [
          "实时音频分析匹配动作",
          "11种舞姿27表情",
          "氛围灯随动"
        ],
        painPoints: ["传统音乐播放缺乏互动性"],
        opportunities: [
          "音频特征实时匹配动作",
          "物理摇摆+屏幕表情联动",
          "全车可见的情绪价值"
        ],
        flowNodes: [
          { layer: "感知层", items: ["音频流输入", "人声/伴奏分离", "语音节目拒识"] },
          { layer: "决策层", items: ["音频特征+动作匹配", "节奏BPM/风格/情感", "11种舞姿/27表情/灯光色彩"] },
          { layer: "执行层", items: ["NOMI+氛围输出", "物理摇摆/屏幕表情", "氛围灯随动/音效增强"] },
          { layer: "反馈层", items: ["全车可见+场景适配"] }
        ]
      },
      {
        id: "3.3",
        name: "节日彩蛋",
        subtitle: "氛围营造与仪式感",
        coreLogic: "全舱联动营造节日氛围，强化情感连接",
        highlights: [
          "自动识别节日触发",
          "全舱氛围联动",
          "抓马游戏互动"
        ],
        painPoints: ["传统车机缺乏仪式感"],
        opportunities: [
          "日期/时间/位置自动触发",
          "NOMI/灯光/车机主题/音效联动",
          "抓马游戏/吉祥话/抽奖"
        ],
        flowNodes: [
          { layer: "感知层", items: ["日期/上车/时间/位置"] },
          { layer: "决策层", items: ["彩蛋策略+触发方式", "主题/内容组合/个性化", "自动/推荐/语音触发"] },
          { layer: "执行层", items: ["全舱氛围+互动", "NOMI/灯光/车机主题/音效", "抓马游戏/吉祥话/抽奖"] },
          { layer: "反馈层", items: ["参与+分享+奖励"] }
        ]
      },
      {
        id: "3.4",
        name: "抓马游戏",
        subtitle: "手势互动娱乐",
        coreLogic: "摄像头手势识别，车内互动娱乐",
        highlights: [
          "手势识别互动",
          "NOMI联动表情动作",
          "亲子娱乐场景"
        ],
        painPoints: ["车内娱乐场景单一"],
        opportunities: [
          "摄像头手势捕捉",
          "NOMI联动表情动作",
          "社交分享传播"
        ],
        flowNodes: [
          { layer: "感知层", items: ["语音/菜单触发", "摄像头启动", "手势捕捉"] },
          { layer: "决策层", items: ["游戏引擎+实时判断", "主题加载/NOMI联动", "手势匹配/游戏进度"] },
          { layer: "执行层", items: ["视觉+音效输出", "游戏界面/NOMI摇摆/表情", "游戏反馈/背景音乐"] },
          { layer: "反馈层", items: ["即时反馈+社交分享"] }
        ]
      }
    ]
  ];

  return (
    <section className="min-h-screen bg-black py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-2">
            核心功能 <span className="text-cyan-400">交互模式拆解</span>
          </h2>
          <p className="text-gray-500">特色功能的交互模式与商业价值分析</p>
        </motion.div>

        {/* 标签页切换 */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                setExpandedFeature(null);
              }}
              className={`relative px-6 py-4 transition-colors ${
                activeTab === index
                  ? "text-cyan-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{tab.name}</div>
                <div className="text-xs mt-1">{tab.description}</div>
              </div>
              {activeTab === index && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* 功能列表 */}
        <div className="space-y-4">
          {tabFeatures[activeTab].map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              {/* 功能标题栏 */}
              <button
                onClick={() =>
                  setExpandedFeature(expandedFeature === feature.id ? null : feature.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-cyan-400 text-sm font-mono">{feature.id}</span>
                  <div className="text-left">
                    <h4 className="text-white font-medium text-lg">{feature.name}</h4>
                    <p className="text-gray-400 text-sm">{feature.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {expandedFeature === feature.id ? (
                    <ChevronUp className="text-gray-400" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={20} />
                  )}
                </div>
              </button>

              {/* 展开内容 */}
              {expandedFeature === feature.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10"
                >
                  <div className="grid lg:grid-cols-2 gap-8 p-6">
                    {/* 左侧：核心逻辑、亮点、痛点、商业价值 */}
                    <div className="space-y-6">
                      {/* 核心逻辑 */}
                      <div>
                        <h5 className="text-cyan-400 text-sm font-medium mb-2">核心逻辑</h5>
                        <p className="text-gray-300 text-sm leading-relaxed bg-black/30 border border-white/10 rounded-lg p-4">
                          {feature.coreLogic}
                        </p>
                      </div>

                      {/* 成功亮点 */}
                      <div>
                        <h5 className="text-cyan-400 text-sm font-medium mb-3">成功亮点</h5>
                        <div className="space-y-2">
                          {feature.highlights.map((highlight, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 bg-green-950/20 border border-green-500/20 rounded-lg p-3"
                            >
                              <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                              <span className="text-gray-300 text-sm">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 痛点 */}
                      <div>
                        <h5 className="text-orange-400 text-sm font-medium mb-3">解决的痛点</h5>
                        <div className="space-y-2">
                          {feature.painPoints.map((painPoint, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 bg-orange-950/20 border border-orange-500/20 rounded-lg p-3"
                            >
                              <span className="text-orange-400 mt-0.5 flex-shrink-0">●</span>
                              <span className="text-gray-300 text-sm">{painPoint}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 商业价值与机会点 */}
                      <div>
                        <h5 className="text-cyan-400 text-sm font-medium mb-3">商业价值与机会点</h5>
                        <div className="space-y-2">
                          {feature.opportunities.map((opportunity, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-3"
                            >
                              <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                              <span className="text-gray-300 text-sm">{opportunity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 右侧：详细交互流程图 */}
                    <div className="space-y-4">
                      <h5 className="text-cyan-400 text-sm font-medium mb-3">交互流程图</h5>

                      {/* 流程图 - 固定高度可滚动 */}
                      <div className="bg-black/30 border border-white/10 rounded-lg p-6 max-h-[600px] overflow-y-auto">
                        <div className="space-y-4">
                          {feature.flowNodes.map((node, nodeIdx) => (
                            <div key={nodeIdx}>
                              {/* 流程节点 */}
                              <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/20 border border-cyan-500/30 rounded-lg p-4">
                                <div className="text-cyan-400 font-medium text-sm mb-3">
                                  {node.layer}
                                </div>
                                <div className="space-y-2">
                                  {node.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="text-gray-300 text-sm pl-3 border-l-2 border-cyan-500/30">
                                      {item}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 箭头连接 */}
                              {nodeIdx < feature.flowNodes.length - 1 && (
                                <div className="flex justify-center my-2">
                                  <ArrowDown className="text-cyan-400" size={20} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 总结 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-cyan-950/20 to-blue-950/10 border border-cyan-500/20 rounded-xl p-8"
        >
          <h3 className="text-cyan-400 text-xl mb-4">战略洞察</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-white font-medium mb-2">空间体验层</div>
              <p className="text-gray-400 leading-relaxed">
                从「座位」到「场景入口」，重构移动第三空间
              </p>
            </div>
            <div>
              <div className="text-white font-medium mb-2">智能入口层</div>
              <p className="text-gray-400 leading-relaxed">
                从「人找车」到「车等人」，实现无感智能交互
              </p>
            </div>
            <div>
              <div className="text-white font-medium mb-2">情感连接层</div>
              <p className="text-gray-400 leading-relaxed">
                从「工具」到「伙伴」，NOMI作为数字生命体
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}