import { motion } from "motion/react";
import { TrendingUp, Zap } from "lucide-react";

export function IndustryOverview() {
  return (
    <section className="min-h-screen bg-black py-16 flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-2">行业格局</h2>
          <p className="text-gray-500">新能源汽车市场发展态势</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：趋势+变革 */}
          <div className="space-y-8">
            {/* 行业发展趋势 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl text-white font-light">行业发展趋势</h3>
              </div>
              
              <div className="space-y-5">
                <div className="border-l-2 border-cyan-500/50 pl-4">
                  <h4 className="text-white mb-2">1. 从"产品定销"到"用户共创"</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    生产者社会向消费者社会转变，用户参与产品定义与迭代
                  </p>
                </div>

                <div className="border-l-2 border-cyan-500/50 pl-4">
                  <h4 className="text-white mb-2">2. 从"理性"到"理性+感性"主导</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    功能型需求 → 体验型需求 → 情感型需求的递进演化
                  </p>
                </div>

                <div className="border-l-2 border-cyan-500/50 pl-4">
                  <h4 className="text-white mb-2">3. 交互进化三阶段</h4>
                  <div className="text-gray-400 text-sm space-y-2">
                    <div><span className="text-cyan-400">功能座舱</span> - 驾驶工具属性，物理按键</div>
                    <div><span className="text-cyan-400">感知座舱</span> - 智能终端，多模态交互</div>
                    <div><span className="text-cyan-400">认知座舱</span> - AI驱动的主动服务伙伴</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 核心变革 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-white/10 rounded-xl p-6 pb-10 bg-white/5 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <Zap className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl text-white font-light">核心变革</h3>
              </div>
              
              <div className="space-y-5 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span>从"<span className="text-white">人适应车</span>"到"<span className="text-white">车服务人</span>"</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span>从"<span className="text-white">被动响应</span>"到"<span className="text-white">主动服务</span>"</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span>从"<span className="text-white">人机交互</span>"到"<span className="text-white">人机交往</span>"</span>
                </div>
              </div>
              
              <div className="mt-auto pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400 leading-relaxed">
                  座舱成为连接人、车、家的全场景智能终端，实现物理世界与数字世界的深度融合
                </p>
              </div>
            </motion.div>
          </div>

          {/* 右侧：新势力排行榜 */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              <h3 className="text-2xl text-white font-light mb-6">2025年新势力排行榜</h3>
              
              <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5">
                      <tr className="border-b border-white/10">
                        <th className="text-gray-400 py-3 px-4 text-left font-normal">排名</th>
                        <th className="text-gray-400 py-3 px-4 text-left font-normal">品牌</th>
                        <th className="text-gray-400 py-3 px-4 text-right font-normal">交付量(万)</th>
                        <th className="text-gray-400 py-3 px-4 text-right font-normal">增幅</th>
                        <th className="text-gray-400 py-3 px-4 text-right font-normal">完成率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { rank: 1, brand: "零跑", sales: "59.66", growth: "+103%", completion: "119%", highlight: false },
                        { rank: 2, brand: "鸿蒙智行", sales: "58.91", growth: "+32%", completion: "59%", highlight: false },
                        { rank: 3, brand: "小鹏", sales: "42.94", growth: "+20%", completion: "113%", highlight: false },
                        { rank: 4, brand: "理想", sales: "40.63", growth: "-19%", completion: "63%", highlight: false },
                        { rank: 5, brand: "小米", sales: "40.00+", growth: "+200%", completion: "114%", highlight: false },
                        { rank: 6, brand: "蔚来", sales: "32.60", growth: "+47%", completion: "74%", highlight: true },
                        { rank: 7, brand: "岚图", sales: "15.02", growth: "+87%", completion: "75%", highlight: false },
                        { rank: 8, brand: "阿维塔", sales: "12.88", growth: "/", completion: "59%", highlight: false },
                      ].map((item, index) => (
                        <tr 
                          key={index} 
                          className={`border-b border-white/5 ${
                            item.highlight ? 'bg-cyan-500/10' : 'hover:bg-white/5'
                          } transition-colors`}
                        >
                          <td className="py-3 px-4 text-gray-300">{item.rank}</td>
                          <td className={`py-3 px-4 ${item.highlight ? 'text-cyan-400 font-medium' : 'text-white'}`}>
                            {item.brand}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-300">{item.sales}</td>
                          <td className={`py-3 px-4 text-right ${
                            item.growth.startsWith('+') ? 'text-emerald-400' : item.growth.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {item.growth}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-300">{item.completion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 关键洞察 */}
                <div className="p-5 bg-white/5 border-t border-white/10">
                  <h4 className="text-white text-sm mb-3">关键洞察</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li>• <span className="text-white">零跑</span>以103%增幅成为年度黑马，跃居新势力第一</li>
                    <li>• <span className="text-white">小米</span>首年交付超40万辆，成为最大惊喜</li>
                    <li>• <span className="text-white">理想</span>同比下滑19%，面临全线换代压力</li>
                    <li>• <span className="text-white">蔚来</span>74%完成率，多品牌战略仍在爬坡期</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}