// 导入品牌一致性图片（支持PNG、JPG、GIF）
import appearance_image from 'figma:asset/ea172aeb4897c2ad6729828cf393fef0f98320a7.png'
import material_image from 'figma:asset/21a3bfd9e1911cfbcd5c64908bb090b54c9c1837.png'
import digital_twin_image from 'figma:asset/0e9dad63d5b06b689f2fa0c18b6478fd48b538d7.png'
import multi_screen_image from 'figma:asset/35b6ed05753f36eb961bf6b8adb427374113d66d.png'
import layout_anchor_image from 'figma:asset/c3bad11e6bd473691ecca70c74da1df18cd28722.png'
import cross_device_image from 'figma:asset/22aaa4b9f0c7dd9bf50c1f09d177c984b1c1f460.png'
import behavior_gesture_image from 'figma:asset/342abea34c1f1101c36e6990773bbe73fea6716b.png'
import level_state_image from 'figma:asset/1941c15e7a3a07cba92cf68936d9c35a7c9921ed.png'
import emotion_engine_image from 'figma:asset/e774da716e66d482ee1a139177cfce5f0a0b66cd.png'

import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ConsistencyItem {
  title: string;
  points: string[];
  hasImage?: boolean;
  imageLayout?: "right" | "bottom" | "grid";
  imageImport?: any; // 图片导入对象
}

interface ConsistencySection {
  category: string;
  description: string;
  items: ConsistencyItem[];
}

export function BrandConsistency() {
  const sections: ConsistencySection[] = [
    {
      category: "视觉融合",
      description: "物理与数字座舱的视觉统一",
      items: [
        {
          title: "外观语言",
          points: [
            "标志性双肩线：贯穿座舱每一处「环抱式」的空间曲线",
            "X-Bar前脸：蔚来视觉基因在数字化层面的延续",
            "贯穿式尾灯：确立横向左右的视觉符号，内外呼应"
          ],
          hasImage: true,
          imageLayout: "right",
          imageImport: appearance_image
        },
        {
          title: "材质与光影",
          points: [
            "数字肌肤：将物理纹理1:1映射至屏幕像素，营造统一视觉氛围",
            "几何曲率一致：统一UI图形规范与所有屏幕，完美呼应座舱实体的物理曲面",
            "质感表达一致：采用拟物化控制卡片，将真实的物理光影与材质自然延伸至数字界面"
          ],
          hasImage: true,
          imageLayout: "right",
          imageImport: material_image
        },
        {
          title: "数字孪生",
          points: [
            "座舱数字孪生（Unity 3D渲染）：以高精度3D模型呈现1:1复刻真实物理空间，材质细节与真实内饰保持对齐",
            "直觉化操作映射（所见即所得）：打破传统纯文字菜单，将真实状态可视化，直接在空间节点上操作",
            "物理状态实时可视：座椅加热的红光、通风的蓝色气流等物理状态在数字车模中实时动效，在数字空间直观呈现实时反馈"
          ],
          hasImage: true,
          imageLayout: "right",
          imageImport: digital_twin_image
        }
      ]
    },
    {
      category: "框架一致性",
      description: "多屏协同架构统一",
      items: [
        {
          title: "多屏协同架构",
          points: [
            "一屏幕布局均以品牌IP「NOMI为中心」的设计哲学",
            "所有屏幕共享相同色彩体系与图标语言",
            "跨屏操作时效连贯，窗口流转保持视觉连续性",
            "后排屏幕采用与前排一致的交互逻辑，降低学习成本"
          ],
          hasImage: true,
          imageLayout: "bottom",
          imageImport: multi_screen_image
        },
        {
          title: "全局布局锚点",
          points: [
            "框架布局一致性：无论场景如何切换，顶部栏恒定与底部Dock栏始终固定，建立稳定的视觉预期，确保高级功能「随时可召」、随时可栏",
            "视觉组件一致性：SR与媒体等核心卡片在各界面流转时，尺寸、视觉与交互逻辑高度统一，实现无缝复用"
          ],
          hasImage: true,
          imageLayout: "bottom",
          imageImport: layout_anchor_image
        },
        {
          title: "跨端状态同步",
          points: [
            "跨屏视觉一致性：后排娱乐屏、NIO phone共享居UI视觉，反用图标与排版逻辑无缝衔接，确保产品视觉体验与品牌感知高度统一",
            "状态反馈一致性：前后排的空调（AC）、媒体播放等核心控制栏实时状态同步，拒绝多端数据冲突",
            "跨屏镜像与反向控制：前排中控屏可实时显示并排控后排娱乐屏，前后排指令与UI状态实时毫秒级同步"
          ],
          hasImage: true,
          imageLayout: "bottom",
          imageImport: cross_device_image
        }
      ]
    },
    {
      category: "交互与多模态一致性",
      description: "统一的交互逻辑与情感体验",
      items: [
        {
          title: "行为与手势",
          points: [
            "跨模块逻辑统一：底部Dock栏的快捷功能（四个）与顶部下拉快捷中心，均支持深度的用户自定义",
            "交互手势一致性：全局复用「长按唤起编辑状态 + 拖拽调整位置」的交互范式"
          ],
          hasImage: true,
          imageLayout: "right",
          imageImport: behavior_gesture_image
        },
        {
          title: "层级与状态",
          points: [
            "交互行为一致性：Dock栏支持空调二级滑动调节，操作时自动唤起二级面板",
            "心智模型一致性：温度色彩采用「蓝冷红热」渐变，符合用户直觉与物理常识",
            "状态反馈一致性：滑动Dock栏控件时，展开菜单内的清洁与具体数值实时联动，确保跨层级的信息一致性"
          ],
          hasImage: true,
          imageLayout: "right",
          imageImport: level_state_image
        },
        {
          title: "情感感知引擎",
          points: [
            "软硬联动一致性：语音指令与屏幕UI状态、NOMI实体表情（如呼叫灯打卡）实现跨模态实时映射",
            "空间感知一致性：精准多音区定位，唤醒时实体头部转向声源，屏幕同步对应动效，达成「声、视、动」统一",
            "情感表达一致性：向候或关怀场景下，语音语调与实体微表情高度匹配，强化有温度的拟人化品牌感知"
          ],
          hasImage: true,
          imageLayout: "right",
          imageImport: emotion_engine_image
        }
      ]
    }
  ];

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
            品牌感知 <span className="text-cyan-400">一致性</span>
          </h2>
          <p className="text-gray-500">设计语言与品牌感知的一致性分析</p>
        </motion.div>

        {/* 三大板块 */}
        <div className="space-y-20">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {/* 板块标题 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h3 className="text-3xl font-light text-white mb-2">
                  <span className="text-cyan-400">■</span> {section.category}
                </h3>
                <p className="text-gray-500 text-lg">{section.description}</p>
              </motion.div>

              {/* 子项列表 */}
              <div className="space-y-12">
                {section.items.map((item, itemIdx) => (
                  <motion.div
                    key={itemIdx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: itemIdx * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    {/* 根据布局类型选择不同的排版 */}
                    {item.imageLayout === "right" ? (
                      // 左右布局：左侧文字，右侧图片
                      <div className="grid lg:grid-cols-2 gap-8 p-8">
                        {/* 左侧：文字内容 */}
                        <div>
                          <h4 className="text-xl text-white mb-6">{item.title}</h4>
                          <div className="space-y-4">
                            {item.points.map((point, pointIdx) => (
                              <div key={pointIdx} className="flex items-start gap-3">
                                <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 右侧：图片 - 支持PNG/JPG/GIF */}
                        {item.hasImage && item.imageImport && (
                          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={item.imageImport}
                              alt={item.title}
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      // 上下布局：上方文字，下方图片
                      <div className="p-8 space-y-8">
                        {/* 上方：文字内容 */}
                        <div>
                          <h4 className="text-xl text-white mb-6">{item.title}</h4>
                          <div className="space-y-4">
                            {item.points.map((point, pointIdx) => (
                              <div key={pointIdx} className="flex items-start gap-3">
                                <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 下方：图片 - 支持PNG/JPG/GIF */}
                        {item.hasImage && item.imageImport && (
                          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={item.imageImport}
                              alt={item.title}
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 总结 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-cyan-950/20 to-blue-950/10 border border-cyan-500/20 rounded-xl p-8"
        >
          <h3 className="text-cyan-400 text-xl mb-4">一致性价值</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-white font-medium mb-2">品牌认知强化</div>
              <p className="text-gray-400 leading-relaxed">
                从物理到数字的视觉统一，强化蔚来品牌的独特记忆点
              </p>
            </div>
            <div>
              <div className="text-white font-medium mb-2">学习成本降低</div>
              <p className="text-gray-400 leading-relaxed">
                跨屏、跨模态的一致性交互逻辑，降低用户认知负担
              </p>
            </div>
            <div>
              <div className="text-white font-medium mb-2">情感连接深化</div>
              <p className="text-gray-400 leading-relaxed">
                多模态情感表达的统一，营造有温度的智能座舱体验
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}