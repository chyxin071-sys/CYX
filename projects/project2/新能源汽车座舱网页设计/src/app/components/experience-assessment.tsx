import { motion } from "motion/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from "recharts";
import React, { useState } from "react";

export function ExperienceAssessment() {
  const [selectedGroup, setSelectedGroup] = useState(0);
  
  // 八维度雷达图数据
  const radarData = [
    { dimension: "可用性", 蔚来ES8: 5.0, 行业均值: 4.0 },
    { dimension: "易用性", 蔚来ES8: 4.9, 行业均值: 4.1 },
    { dimension: "视觉呈现", 蔚来ES8: 4.9, 行业均值: 4.2 },
    { dimension: "交互迅捷度", 蔚来ES8: 4.5, 行业均值: 4.1 },
    { dimension: "情感体验", 蔚来ES8: 4.7, 行业均值: 3.5 },
    { dimension: "智能主动性", 蔚来ES8: 4.0, 行业均值: 3.2 },
    { dimension: "场景适应性", 蔚来ES8: 4.7, 行业均值: 4.0 },
    { dimension: "安全性", 蔚来ES8: 4.8, 行业均值: 3.8 }
  ];

  // 维度定义
  const dimensionDefinitions = [
    { name: "可用性", score: 5.0 },
    { name: "易用性", score: 4.9 },
    { name: "视觉呈现", score: 4.9 },
    { name: "交互迅捷度", score: 4.5 },
    { name: "情感体验", score: 4.7 },
    { name: "智能主动性", score: 4.0 },
    { name: "场景适应性", score: 4.7 },
    { name: "安全性", score: 4.8 }
  ];

  // 功能详情评分数据（重新组织为横向布局）
  const dimensions = ["可用性", "易用性", "视觉呈现", "交互迅捷度", "情感体验", "智能主动性", "场景适应性", "安全性"];
  
  const featureGroupsData = [
    {
      title: "视觉交互功能组",
      features: [
        {
          name: "中控屏",
          scores: { "可用性": 5.0, "易用性": 4.8, "视觉呈现": 4.9, "情感体验": 4.6, "场景适应性": 4.7 }
        },
        {
          name: "Skyline天际线数字屏",
          scores: { "可用性": 5.0, "视觉呈现": 4.9, "情感体验": 4.8, "场景适应性": 4.6 }
        },
        {
          name: "车控",
          scores: { "可用性": 5.0, "视觉呈现": 4.7, "交互迅捷度": 4.5, "易用性": 4.8 }
        },
        {
          name: "空调调节",
          scores: { "可用性": 5.0, "易用性": 4.9, "交互迅捷度": 4.6, "情感体验": 4.5, "视觉呈现": 4.8 }
        },
        {
          name: "导航操作",
          scores: { "可用性": 5.0, "视觉呈现": 4.8, "易用性": 4.7, "场景适应性": 4.9, "交互迅捷度": 4.4, "智能主动性": 4.2 }
        }
      ]
    },
    {
      title: "娱乐媒体功能组",
      features: [
        {
          name: "后排娱乐屏",
          scores: { "可用性": 5.0, "视觉呈现": 4.7, "交互迅捷度": 4.5, "场景适应性": 4.6, "易用性": 4.3 }
        },
        {
          name: "无麦K歌",
          scores: { "可用性": 5.0, "易用性": 4.2, "情感体验": 4.7, "场景适应性": 4.4 }
        }
      ]
    },
    {
      title: "硬件功能组",
      features: [
        {
          name: "车载冰箱",
          scores: { "可用性": 5.0, "易用性": 4.4, "场景适应性": 4.8, "交互迅捷度": 4.6 }
        },
        {
          name: "女王副驾",
          scores: { "可用性": 5.0, "易用性": 4.9, "情感体验": 4.8, "场景适应性": 4.7, "交互迅捷度": 4.5 }
        }
      ]
    },
    {
      title: "语音助手NOMI",
      features: [
        {
          name: "NOMI",
          scores: { "可用性": 5.0, "视觉呈现": 4.8, "交互迅捷度": 4.6, "场景适应性": 4.7, "易用性": 4.5, "智能主动性": 4.0, "情感体验": 4.7 }
        }
      ]
    }
  ];

  const ScoreBar = ({ score }: { score: number }) => (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="text-cyan-400 text-sm font-medium w-10 text-right">{score.toFixed(1)}</span>
    </div>
  );

  return (
    <section className="min-h-screen bg-black py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-2">
            体验评估 <span className="text-cyan-400">框架</span>
          </h2>
          <p className="text-gray-500">八维度座舱体验竞争力分析</p>
        </motion.div>

        {/* Part 1: 评估维度定义 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
            <span className="text-cyan-400">■</span> 评估维度与雷达图
          </h3>
          
          {/* 左右布局 */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 左侧：八个评估维度 */}
            <div className="space-y-3">
              <h4 className="text-white text-lg mb-4">八维度评估定义</h4>
              {dimensionDefinitions.map((dimension, index) => (
                <motion.div
                  key={dimension.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-400 font-medium text-sm w-24 flex-shrink-0">{dimension.name}</span>
                    <ScoreBar score={dimension.score} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 右侧：雷达图 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h4 className="text-white text-lg mb-4">蔚来ES8 vs 行业均值</h4>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fill: "#a0aec0", fontSize: 14 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#718096" }} />
                  <Radar
                    name="蔚来ES8"
                    dataKey="蔚来ES8"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="行业均值"
                    dataKey="行业均值"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Legend
                    wrapperStyle={{ color: "#fff" }}
                    iconType="circle"
                    formatter={(value) => <span style={{ color: "#fff" }}>{value}</span>}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Part 2: 用户体验评分表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
            <span className="text-cyan-400">■</span> 用户体验评分表
          </h3>

          {/* 标签页切换 */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {featureGroupsData.map((group, index) => (
              <button
                key={index}
                onClick={() => setSelectedGroup(index)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedGroup === index
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                }`}
              >
                {group.title}
              </button>
            ))}
          </div>

          {/* 当前选中组的表格 */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-950/40 to-blue-950/20 border-b border-white/10">
                    <th className="px-4 py-3 text-left text-cyan-400 font-medium whitespace-nowrap sticky left-0 bg-gradient-to-r from-cyan-950/40 to-blue-950/20">功能名称</th>
                    {dimensions.map((dim) => (
                      <th key={dim} className="px-4 py-3 text-center text-cyan-400 font-medium whitespace-nowrap">
                        {dim}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureGroupsData[selectedGroup].features.map((feature, featureIdx) => (
                    <tr
                      key={featureIdx}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      {/* 功能名称 */}
                      <td className="px-4 py-3 text-white font-medium whitespace-nowrap sticky left-0 bg-black/50 backdrop-blur-sm">
                        {feature.name}
                      </td>
                      {/* 各维度评分 */}
                      {dimensions.map((dim) => (
                        <td key={dim} className="px-4 py-3 text-center">
                          {feature.scores[dim] ? (
                            <span className="text-cyan-400 font-medium">{feature.scores[dim].toFixed(1)}</span>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Part 3: 机会点挖掘分析总结 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
            <span className="text-emerald-400">■</span> 机会点挖掘分析总结
          </h3>

          {/* 数据洞察 */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div>
                <h4 className="text-white font-medium mb-2">基于评分数据的发现</h4>
                <p className="text-sm text-gray-300">
                  "智能主动性"维度评分<span className="text-yellow-400 font-bold mx-1">4.0分</span>（八维度最低），显著低于"可用性"等基础维度。
                  当前座舱仍处于<span className="text-cyan-400">被动响应</span>阶段，缺乏对用户状态、意图、场景的深度感知与主动服务能力。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 1. 具身智能感知系统 */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-purple-400 font-bold text-lg">1.</span>
                <h4 className="text-white font-medium">具身智能感知系统</h4>
              </div>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                全舱多模态感知：视觉识别（年龄/身高/眼神/手势）、座椅压力分布、骨骼姿态检测。
                无需语音/触控，座椅自动适配体型，氛围灯感知情绪自调，实现真正的<span className="text-purple-400 font-medium">具身智能</span>。
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">主动性↑</span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">难度: 高</span>
              </div>
            </div>

            {/* 2. 后排安全守护智能 */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-400 font-bold text-lg">2.</span>
                <h4 className="text-white font-medium">后排安全守护智能</h4>
              </div>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                感知后排乘员（尤其儿童）行为特征，主动识别危险操作（频繁触摸车窗/解锁），
                动态锁定高危功能并智能授权，从<span className="text-emerald-400 font-medium">"被动童锁"升级为"主动守护"</span>。
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">安全性↑</span>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">难度: 中</span>
              </div>
            </div>

            {/* 3. 场景预判式主动服务 */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-400 font-bold text-lg">3.</span>
                <h4 className="text-white font-medium">场景预判式主动服务</h4>
              </div>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                融合行程数据、生理信号、天气路况，主动推送服务（长途前提醒休息区、夜间自动启动氛围灯、疲劳时推荐音乐）。
                从<span className="text-cyan-400 font-medium">"等待指令"转向"理解需求"</span>。
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">主动性↑</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">难度: 中高</span>
              </div>
            </div>
          </div>

          {/* 总结卡片 */}
          <div className="bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">具身智能</div>
                <div className="text-sm text-gray-400">核心技术方向</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">4.0 → 4.7+</div>
                <div className="text-sm text-gray-400">主动性提升目标</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">中高</div>
                <div className="text-sm text-gray-400">平均实施难度</div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-center text-gray-300 text-sm">
                <span className="text-purple-400 font-medium">战略建议：</span>
                优先布局<span className="text-purple-400">具身智能感知底层能力</span>（传感器融合+AI推理），
                以"后排守护"为安全切入点快速落地，逐步扩展至全场景主动服务，形成差异化护城河。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}