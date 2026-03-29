import nio_brand_image from 'figma:asset/6d57c0c5ff6bbda83ae3ac080bdfadac3f824cc3.png'
import { motion } from "motion/react";

export function NioBrandResearch() {
  return (
    <section className="min-h-screen bg-black py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-right mb-12"
        >
          <div className="text-gray-500 text-sm mb-2">蔚来品牌研究</div>
        </motion.div>

        {/* 基本信息 + Logo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 左侧：基本信息 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-8">蔚来基本信息</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-baseline gap-3">
                <span className="text-white w-32">品牌名称：</span>
                <span>蔚来（NIO）</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-white w-32">所属国家：</span>
                <span>中国</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-white w-32">创始人：</span>
                <span>李斌</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-white w-32">创立时间：</span>
                <span>2014年</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-white w-32">核心定位：</span>
                <span>用户企业</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-white w-32">企业使命：</span>
                <span>共创可持续和更美好的未来</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-white w-32">品牌Slogan：</span>
                <span>Blue Sky Coming（蔚来已来）</span>
              </div>
              <div className="pt-4">
                <span className="text-white block mb-3">产品矩阵：</span>
                <ul className="space-y-2 ml-6">
                  <li className="text-gray-300">• 高端（蔚来/NIO）</li>
                  <li className="text-gray-300">• 家庭主流（乐道/ONVO）</li>
                  <li className="text-gray-300">• 精品小车（萤火虫/FIREFLY）</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 右侧：蔚来品牌图片 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            <div className="w-full">
              <img 
                src={nio_brand_image} 
                alt="蔚来品牌展示" 
                className="w-full h-auto block rounded-lg"
              />
            </div>
          </motion.div>
        </div>

        {/* 品牌定位分析 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-white mb-8">品牌定位分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 卡片1 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <h3 className="text-white text-xl mb-4">目标用户画像</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p><span className="text-white">核心人群：</span>30-45岁，二线城市中高收入群体（商务人士、高净值家庭）。</p>
                <p><span className="text-white">用户特征：</span>重视品牌价值观，追求生活品质，对服务敏感价格受高，乐于尝试前沿科技。</p>
              </div>
            </div>

            {/* 卡片2 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <h3 className="text-white text-xl mb-4">高端化路径</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p><span className="text-white"></span></p>
                <p><span className="text-white">空间：</span>NIO House 提供了一越年赋物理归属感构的、高车羊的生活场域，塑造"身份归属感"。</p>
                <p><span className="text-white">服务：</span>换电网络解决效率焦虑，高触达、高响应的服务体系。</p>
              </div>
            </div>

            {/* 卡片3 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <h3 className="text-white text-xl mb-4">核心品牌信息与情感价值主张</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p><span className="text-white">核心价值：</span>强调"用户企业"的身份，强化用户共创与区参与，赋予用户"参与感"，构建超高活跃度、高净推荐值的社群。</p>
                <p><span className="text-white">NOMI：</span>不只是语音助手，而是有情感、有性格的"情感伙伴"，建立了人与车之间的情感纽带</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 商业模式创新 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-white mb-8">商业模式创新</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 模式1 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white text-lg mb-2">车电分离 BaaS模式</h3>
              <div className="mb-2 text-xs">
                <span className="text-cyan-400">核心：</span>
                <span className="text-gray-400">把电池从"消费品"变成"金融资产"</span>
              </div>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>• 降低购车门槛7-12万，解决衰减焦虑</li>
                <li>• 订阅制计费，现金流稳定性提升</li>
                <li>• 用户长期绑定，提高留存率</li>
                <li>• 电池梯次利用，形成完整价值链</li>
                <li>• 灵活升级电池包，适应技术迭代</li>
                <li>• BaaS用户占比持续提升，商业模式验证成功</li>
              </ul>
            </div>

            {/* 模式2 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white text-lg mb-2">社群渗透模式</h3>
              <div className="mb-2 text-xs">
                <span className="text-cyan-400">核心：</span>
                <span className="text-gray-400">低频"买车"转化为高频"生活"</span>
              </div>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>• NIO App：社交平台+积分+商城+共创</li>
                <li>• NIO House："第三空间"，强化身份认同</li>
                <li>• 渗透裂变：用户转介绍率高</li>
                <li>• 用户参与产品共创，增强归属感</li>
                <li>• 车主社群自发组织活动，扩大品牌影响力</li>
                <li>• Fellow计划培养超级用户，形成KOL矩阵</li>
              </ul>
            </div>

            {/* 模式3 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white text-lg mb-2">基础设施全域化（NIO Power）</h3>
              <div className="mb-2 text-xs">
                <span className="text-cyan-400">核心：</span>
                <span className="text-gray-400">基础设施成为品牌壁垒</span>
              </div>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>• 3700+换电站，与长安吉利组"换电联盟"</li>
                <li>• 多样化补能生态（充电桩/充电车/移动充电）</li>
                <li>• 城市节点布局，增强品牌可见性</li>
              </ul>
            </div>

            {/* 模式4 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-white text-lg mb-2">多品牌矩阵</h3>
              <div className="mb-2 text-xs">
                <span className="text-cyan-400">核心：</span>
                <span className="text-gray-400">分层覆盖市场，研发成本分摊</span>
              </div>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>• 蔚来NIO：30万+高端，保证溢价（毛利20%）</li>
                <li>• 乐道ONVO：20-30万主流，走量+分摊成本</li>
                <li>• 萤火虫Firefly：精品小车，海外突破</li>
                <li>• 技术平台共享，降低研发成本</li>
                <li>• 补能网络共用，提升资产利用率</li>
                <li>• 差异化定位，避免品牌内耗</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 用户生态系统 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6">用户生态系统</h2>
          
          {/* 生态循环图示 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg px-4 py-2">
                <span className="text-cyan-400 font-medium">产品</span>
              </div>
              <span className="text-gray-500 text-2xl">→</span>
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg px-4 py-2">
                <span className="text-blue-400 font-medium">服务</span>
              </div>
              <span className="text-gray-500 text-2xl">→</span>
              <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg px-4 py-2">
                <span className="text-purple-400 font-medium">社区</span>
              </div>
              <span className="text-gray-500 text-2xl">→</span>
              <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg px-4 py-2">
                <span className="text-orange-400 font-medium">口碑</span>
              </div>
              <span className="text-gray-500 text-2xl">→</span>
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2">
                <span className="text-green-400 font-medium">新用户</span>
              </div>
              <span className="text-gray-500 text-2xl">↺</span>
            </div>
            <p className="text-gray-400 text-sm text-center mt-4">
              通过多触点连接，提升用户生命周期价值，提供口碑感知体验认同，促进口碑裂变，实现用户生态闭环
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-lg mb-3">NIO App</h3>
              <p className="text-gray-400 text-sm mb-4">数字社区、互动和数据沉淀</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-lg mb-3">NIO House</h3>
              <p className="text-gray-400 text-sm mb-4">线下生活体验空间</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-lg mb-3">NIO Life</h3>
              <p className="text-gray-400 text-sm mb-4">周边和生活方式产品</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-lg mb-3">NIO Day</h3>
              <p className="text-gray-400 text-sm mb-4">用户活动与品牌共创</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}