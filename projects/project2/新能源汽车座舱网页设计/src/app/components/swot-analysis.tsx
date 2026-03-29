import { motion } from "motion/react";

export function SwotAnalysis() {
  return (
    <section id="swot-section" className="min-h-screen bg-black py-16 flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-2">SWOT 战略分析</h2>
          <p className="text-gray-500 text-sm">蔚来智能座舱竞争力评估</p>
        </motion.div>

        {/* SWOT矩阵 - 一页4个卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* S - Strengths */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 text-xs font-medium">S</div>
              <h3 className="text-white text-lg">优势 Strengths</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <div>
                <p className="text-white mb-1">1. 独特补能体系</p>
                <p className="text-gray-400">BaaS+3700+换电站，3分钟满电，93.1%车主认可，形成壁垒级粘性</p>
              </div>
              <div>
                <p className="text-white mb-1">2. 全栈自研能力</p>
                <p className="text-gray-400">SkyOS+骁龙8295+AR-HUD，软硬件整合优势明显</p>
              </div>
              <div>
                <p className="text-white mb-1">3. 情感化交互</p>
                <p className="text-gray-400">NOMI物理实体+丰富表情库，重新定义人车关系</p>
              </div>
              <div>
                <p className="text-white mb-1">4. 极致用户社区</p>
                <p className="text-gray-400">NIO App日活高+NIO House第三空间，社区粘性行业领先</p>
              </div>
            </div>
          </motion.div>

          {/* W - Weaknesses */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="bg-orange-950/20 border border-orange-500/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-500/20 px-2 py-0.5 rounded text-orange-400 text-xs font-medium">W</div>
              <h3 className="text-white text-lg">劣势 Weaknesses</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <div>
                <p className="text-white mb-1">1. 重资产模式压力</p>
                <p className="text-gray-400">换电站+服务体系投入巨大，短期盈利压力大</p>
              </div>
              <div>
                <p className="text-white mb-1">2. AI主动性不足</p>
                <p className="text-gray-400">场景预判、智能推荐能力弱于华为、小米</p>
              </div>
              <div>
                <p className="text-white mb-1">3. 多品牌平衡挑战</p>
                <p className="text-gray-400">乐道L60下探可能影响蔚来高端品牌形象</p>
              </div>
              <div>
                <p className="text-white mb-1">4. 软件迭代速度</p>
                <p className="text-gray-400">OTA更新频率低于特斯拉，新功能推送较慢</p>
              </div>
            </div>
          </motion.div>

          {/* O - Opportunities */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-400 text-xs font-medium">O</div>
              <h3 className="text-white text-lg">机会 Opportunities</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <div>
                <p className="text-white mb-1">1. ES9旗舰上探</p>
                <p className="text-gray-400">2026年全尺寸旗舰SUV，进一步强化高端定位</p>
              </div>
              <div>
                <p className="text-white mb-1">2. 换电联盟扩大</p>
                <p className="text-gray-400">长安、吉利加盟，分摊成本+行业标准制定权</p>
              </div>
              <div>
                <p className="text-white mb-1">3. AI大模型赋能</p>
                <p className="text-gray-400">本地大模型+NOMI升级，实现真正智能助理</p>
              </div>
              <div>
                <p className="text-white mb-1">4. 城区领航换电</p>
                <p className="text-gray-400">全球首创智驾换电闭环，体验壁垒难复制</p>
              </div>
            </div>
          </motion.div>

          {/* T - Threats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-500/20 px-2 py-0.5 rounded text-purple-400 text-xs font-medium">T</div>
              <h3 className="text-white text-lg">威胁 Threats</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <div>
                <p className="text-white mb-1">1. 增程市场虹吸</p>
                <p className="text-gray-400">理想、问界增程车型侵占纯电市场份额</p>
              </div>
              <div>
                <p className="text-white mb-1">2. 华为生态压制</p>
                <p className="text-gray-400">鸿蒙座舱+手机互联生态优势明显</p>
              </div>
              <div>
                <p className="text-white mb-1">3. 价格战挤压</p>
                <p className="text-gray-400">比亚迪、特斯拉降价，高端定位受价格侵蚀</p>
              </div>
              <div>
                <p className="text-white mb-1">4. 技术代际风险</p>
                <p className="text-gray-400">固态电池突破可能削弱换电模式价值</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 战略建议 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <h3 className="text-white text-sm mb-2">核心战略建议</h3>
          <div className="grid md:grid-cols-2 gap-3 text-xs text-gray-300">
            <div>
              <span className="text-cyan-400">SO策略：</span>
              <span>AI赋能ES9旗舰+换电标准主导权，最大化优势</span>
            </div>
            <div>
              <span className="text-orange-400">WO策略：</span>
              <span>多品牌分摊成本+软件驱动进化，扭转劣势</span>
            </div>
            <div>
              <span className="text-purple-400">ST策略：</span>
              <span>服务护城河对抗华为+差异化物理体验</span>
            </div>
            <div>
              <span className="text-blue-400">WT策略：</span>
              <span>守住基本盘+押注下一代电池技术</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}