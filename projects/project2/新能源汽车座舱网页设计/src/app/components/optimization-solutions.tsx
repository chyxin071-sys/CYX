import { motion } from "motion/react";
import { useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

function FlowChart() {
  // 定义流程图节点 - 重新设计布局，采用清晰的垂直流程
  const nodes: Node[] = [
    // 主流程 - 垂直排列
    {
      id: "1",
      type: "input",
      data: { label: "🔍 系统持续监测后排" },
      position: { x: 250, y: 0 },
      style: {
        background: "linear-gradient(135deg, #0e7490 0%, #164e63 100%)",
        color: "white",
        border: "2px solid #06b6d4",
        borderRadius: "12px",
        padding: "12px 20px",
        fontSize: "13px",
        fontWeight: "500",
        minWidth: "200px",
        textAlign: "center",
      },
    },
    {
      id: "2",
      type: "default",
      data: { label: "📡 感知融合\n摄像头+雷达+触摸+麦克风" },
      position: { x: 220, y: 100 },
      style: {
        background: "#164e63",
        color: "white",
        border: "1px solid #06b6d4",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "180px",
      },
    },
    {
      id: "3",
      type: "default",
      data: { label: "🧠 AI特征提取\n年龄/操作频率/监护人" },
      position: { x: 220, y: 200 },
      style: {
        background: "#164e63",
        color: "white",
        border: "1px solid #06b6d4",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "180px",
      },
    },
    {
      id: "4",
      type: "default",
      data: { label: "⚠️ 儿童无监护\n+频繁误操作?" },
      position: { x: 235, y: 300 },
      style: {
        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        color: "#000",
        border: "2px solid #f59e0b",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "150px",
      },
    },

    // 主流程 - 托管分支
    {
      id: "5",
      type: "default",
      data: { label: "💬 主驾弹窗提示\n\"后排频繁操作，开启托管？\"" },
      position: { x: 200, y: 420 },
      style: {
        background: "#0c4a6e",
        color: "white",
        border: "1px solid #0ea5e9",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "200px",
      },
    },
    {
      id: "6",
      type: "default",
      data: { label: "🤔 驾驶员\n点击托管?" },
      position: { x: 250, y: 530 },
      style: {
        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        color: "white",
        border: "2px solid #ea580c",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "140px",
      },
    },

    // 左侧分支 - 拒绝/超时
    {
      id: "7",
      type: "default",
      data: { label: "🔒 半锁定模式\n屏蔽车窗/天窗等" },
      position: { x: 30, y: 530 },
      style: {
        background: "#065f46",
        color: "white",
        border: "1px solid #10b981",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "160px",
      },
    },

    // 右侧分支 - 接受托管
    {
      id: "8",
      type: "default",
      data: { label: "🎮 娱乐锁定模式\n车控按钮全灰" },
      position: { x: 470, y: 530 },
      style: {
        background: "#065f46",
        color: "white",
        border: "1px solid #10b981",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "160px",
      },
    },
    {
      id: "9",
      type: "default",
      data: { label: "👀 后排看NOMI申请\n(视线停留2秒)" },
      position: { x: 470, y: 640 },
      style: {
        background: "#164e63",
        color: "white",
        border: "1px solid #06b6d4",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "160px",
      },
    },
    {
      id: "10",
      type: "default",
      data: { label: "✅ 驾驶员授权?\n(眼神/语音/点击)" },
      position: { x: 470, y: 750 },
      style: {
        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        color: "white",
        border: "2px solid #ea580c",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        fontWeight: "600",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "160px",
      },
    },
    {
      id: "11",
      type: "default",
      data: { label: "🔓 临时解锁\n(30秒后自动恢复)" },
      position: { x: 680, y: 750 },
      style: {
        background: "#065f46",
        color: "white",
        border: "1px solid #10b981",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "160px",
      },
    },

    // 异常处理
    {
      id: "12",
      type: "default",
      data: { label: "🚨 频繁申请>3次\n仅限语音授权" },
      position: { x: 260, y: 750 },
      style: {
        background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
        color: "white",
        border: "2px solid #ef4444",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "11px",
        fontWeight: "600",
        whiteSpace: "pre-line",
        textAlign: "center",
        minWidth: "160px",
      },
    },
  ];

  // 定义流程图边 - 重新设计连线逻辑
  const edges: Edge[] = [
    // 主流程线
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#06b6d4", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#06b6d4" },
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: true,
      style: { stroke: "#06b6d4", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#06b6d4" },
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      animated: true,
      style: { stroke: "#06b6d4", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#06b6d4" },
    },

    // 判定否 - 返回监测
    {
      id: "e4-1-no",
      source: "4",
      target: "1",
      label: "否",
      animated: false,
      style: { stroke: "#6b7280", strokeWidth: 1.5, strokeDasharray: "5,5" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
      type: "smoothstep",
      labelStyle: { fill: "#9ca3af", fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#1f2937", fillOpacity: 0.9 },
    },

    // 判定是 - 进入托管流程
    {
      id: "e4-5",
      source: "4",
      target: "5",
      label: "是",
      animated: true,
      style: { stroke: "#f59e0b", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
      labelStyle: { fill: "#f59e0b", fontSize: 12, fontWeight: 700 },
      labelBgStyle: { fill: "#1f2937", fillOpacity: 0.9 },
    },
    {
      id: "e5-6",
      source: "5",
      target: "6",
      animated: true,
      style: { stroke: "#0ea5e9", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#0ea5e9" },
    },

    // 拒绝/超时分支
    {
      id: "e6-7",
      source: "6",
      target: "7",
      label: "否/超时",
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      labelStyle: { fill: "#10b981", fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#1f2937", fillOpacity: 0.9 },
    },
    {
      id: "e7-1",
      source: "7",
      target: "1",
      animated: false,
      style: { stroke: "#6b7280", strokeWidth: 1.5, strokeDasharray: "5,5" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
      type: "smoothstep",
    },

    // 接受托管分支
    {
      id: "e6-8",
      source: "6",
      target: "8",
      label: "是",
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      labelStyle: { fill: "#10b981", fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#1f2937", fillOpacity: 0.9 },
    },
    {
      id: "e8-9",
      source: "8",
      target: "9",
      animated: true,
      style: { stroke: "#06b6d4", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#06b6d4" },
    },
    {
      id: "e9-10",
      source: "9",
      target: "10",
      animated: true,
      style: { stroke: "#06b6d4", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#06b6d4" },
    },

    // 授权拒绝 - 返回申请
    {
      id: "e10-9-no",
      source: "10",
      target: "9",
      label: "否",
      animated: false,
      style: { stroke: "#6b7280", strokeWidth: 1.5, strokeDasharray: "5,5" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
      type: "smoothstep",
      labelStyle: { fill: "#9ca3af", fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#1f2937", fillOpacity: 0.9 },
    },

    // 授权通过 - 临时解锁
    {
      id: "e10-11",
      source: "10",
      target: "11",
      label: "是",
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      labelStyle: { fill: "#10b981", fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#1f2937", fillOpacity: 0.9 },
    },

    // 解锁后返回
    {
      id: "e11-9",
      source: "11",
      target: "9",
      animated: false,
      style: { stroke: "#6b7280", strokeWidth: 1.5, strokeDasharray: "5,5" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
      type: "smoothstep",
    },

    // 异常处理流程
    {
      id: "e9-12",
      source: "9",
      target: "12",
      label: "频繁申请",
      animated: true,
      style: { stroke: "#ef4444", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
      type: "smoothstep",
      labelStyle: { fill: "#ef4444", fontSize: 10, fontWeight: 600 },
      labelBgStyle: { fill: "#1f2937", fillOpacity: 0.9 },
    },
    {
      id: "e12-10",
      source: "12",
      target: "10",
      animated: true,
      style: { stroke: "#ef4444", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
      type: "smoothstep",
    },
  ];

  return (
    <div className="h-[900px] bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl border border-white/5">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
        className="rounded-xl"
        defaultEdgeOptions={{
          animated: true,
        }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#ffffff10" gap={16} />
        <Controls className="bg-white/10 border border-white/20 [&_button]:text-white [&_button]:bg-white/10 [&_button:hover]:bg-white/20" />
      </ReactFlow>
    </div>
  );
}

export function OptimizationSolutions() {
  return (
    <section className="min-h-screen bg-black py-16">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-2">
            创新 <span className="text-cyan-400">优化方案</span>
          </h2>
          <p className="text-gray-500">基于全感知的后排行为守卫</p>
        </motion.div>

        {/* 方案 A 全屏显示：左侧分析 + 右侧流程图 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* 左侧：前期分析内容（简化版） */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 overflow-hidden h-[900px] flex flex-col">
            <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">■</span> 机会点挖掘
            </h3>

            <div className="space-y-6 flex-1">
              {/* 1. 用户痛点 */}
              <div>
                <h4 className="text-lg text-cyan-400 mb-3">痛点识别</h4>
                <div className="bg-white/5 border-l-2 border-emerald-500/50 p-4 rounded text-sm text-gray-300">
                  "后排儿童误触屏幕/误开车窗"是高频抱怨点，3%的轻微碰撞事故与视线脱离超过2秒相关，周末家庭出行场景中误触概率达35%
                </div>
              </div>

              {/* 2. 现有方案局限 */}
              <div>
                <h4 className="text-lg text-cyan-400 mb-3">现有方案局限</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">×</span>
                    <span>物理童锁需手动操作，无法动态适应</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">×</span>
                    <span>后排禁用模式只能全锁，体验差</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">×</span>
                    <span>竞品缺乏智能授权，"要么全开要么全锁"</span>
                  </div>
                </div>
              </div>

              {/* 3. 技术可行性 */}
              <div>
                <h4 className="text-lg text-cyan-400 mb-3">技术可行性</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>已有摄像头、触摸屏、传感器，无需新增硬件</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>AI识别准确率95%+，误报率5%以下</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>本地处理，符合隐私保护要求</span>
                  </div>
                </div>
              </div>

              {/* 4. 优先级评估 */}
              <div>
                <h4 className="text-lg text-cyan-400 mb-3">优先级评估</h4>
                <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-emerald-400 text-xl font-bold">高</div>
                      <div className="text-gray-400 text-xs mt-1">用户��值</div>
                    </div>
                    <div>
                      <div className="text-cyan-400 text-xl font-bold">中低</div>
                      <div className="text-gray-400 text-xs mt-1">实现难度</div>
                    </div>
                    <div>
                      <div className="text-blue-400 text-xl font-bold">高</div>
                      <div className="text-gray-400 text-xs mt-1">差异化</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-emerald-400 font-bold text-2xl">8.7/10</span>
                    <span className="text-gray-400 text-sm ml-2">综合得分</span>
                  </div>
                </div>
              </div>

              {/* 5. 核心价值 */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
                <h4 className="text-lg text-cyan-400 mb-4">核心价值</h4>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-400 font-bold">80%</span>
                    </div>
                    <span>降低视线脱离时间（2.5秒→0.5秒）</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-cyan-400 font-bold">90%</span>
                    </div>
                    <span>减少儿童误操作危险事件</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：逻辑流程图 */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
              <span className="text-blue-400">■</span> 逻辑流程图
            </h3>
            <ReactFlowProvider>
              <FlowChart />
            </ReactFlowProvider>
          </div>
        </motion.div>
      </div>
    </section>
  );
}