import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center py-20">
        {/* 主标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6">
            未来出行语境下的
            <br />
            <span className="text-cyan-400">情感化连接</span>
          </h1>
        </motion.div>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-400 mb-4 max-w-4xl mx-auto font-light"
        >
          蔚来 NIO 智能座舱体验竞争力与演进趋势研究报告
        </motion.p>

        {/* 核心标语 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mb-12 space-y-2"
        >
          <p className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto">
            智能座舱正经历从"<span className="text-cyan-400">驾驶工具</span>"到"<span className="text-cyan-400">移动生活空间</span>"的范式转变
          </p>
          <p className="text-base md:text-lg text-gray-500">
            从"<span className="text-cyan-400">人适应车</span>"向"<span className="text-cyan-400">车服务人</span>"进化
          </p>
        </motion.div>

        {/* CTA按钮 */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            document.getElementById('industry')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-3 px-10 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white transition-colors"
        >
          <span className="tracking-wide">开始探索</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </div>

      {/* 滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-gray-600 animate-bounce" />
      </motion.div>
    </section>
  );
}