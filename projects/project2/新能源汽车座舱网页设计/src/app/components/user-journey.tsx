import { motion } from "motion/react";
import { useState } from "react";

interface JourneyStage {
  name: string;
  userActions: string;
  touchpoints: string;
  emotion: "happy" | "neutral" | "angry";
  painPoints: string;
  opportunities: string;
}

interface PersonaData {
  scenarioTitle: string;
  name: string;
  age: string;
  residence: string;
  role: string;
  vehicle: string;
  occupation: string;
  familyStructure?: string;
  workStatus: string;
  personality: string;
  behavior: string;
  coreStory: string;
  coreNeeds: string;
}

export function UserJourney() {
  const [selectedScenario, setSelectedScenario] = useState<"workday" | "family" | "offwork">("family");

  const personas: Record<string, PersonaData> = {
    workday: {
      scenarioTitle: "张先生用户画像及工作日用户旅程图",
      name: "张先生",
      age: "28岁，男性",
      residence: "一线城市",
      role: "核心使用者",
      vehicle: "蔚来 ET9",
      occupation: "大型科技公司总裁助理兼专职司机",
      workStatus: "工作节奏极快，24小时待命。不仅要负责老板的安全出行，还要处理行程规划、会议对接等繁杂的行政事务，是领导身边的「移动大管家」。",
      personality: "细心、谨慎、情绪稳定、有极强���服务意识和保密意识。",
      behavior: "极度依赖日程表和手机提醒，做事习惯留有「提前量」。在车内的大部分时间是默默关注路况和后排动静，极少主动发起闲聊。习惯在等待领导的碎片时间里处理手机上的工作信息。",
      coreStory: "在工作日的前一天，张先生接到消息，在第二天清晨需要前往酒店接驳老板，并将其平稳、准时、优雅地送达近郊的重磅行业峰会现场。",
      coreNeeds: "确保老板的行程万无一失，提供极致、无痕的服务。"
    },
    family: {
      scenarioTitle: "李先生（家庭场景）用户画像及用户旅程图",
      name: "李先生",
      age: "38岁，男性",
      residence: "一线城市",
      role: "核心使用者",
      vehicle: "蔚来 ES8",
      occupation: "已婚，四口之家",
      familyStructure: "妻子（35岁，职场女性）、儿子（8岁，活泼好动）、女儿（1岁，需高频照料与安静睡眠）",
      workStatus: "工作日大脑高速运转，压力大。周末是他「补偿」家庭、回归父亲和丈夫角色的核心时间。",
      personality: "务实、有责任心、情绪稳定",
      behavior: "出行前习惯做详尽的攻略和路线规划，是全家的「主心骨」。对科技数码产品有天然的好感，愿意为了「体验升级」和「安全感」买单。开车时既要关注路况，又要分心通过后视镜观察后排孩子的状态，经常觉得心累。",
      coreStory: "李先生和伴侣带着8岁的儿子和1岁的女儿在节假日开启长途旅行，驾驶ES8前往300公里外的营地。",
      coreNeeds: "安全抵达目的地，照顾好车内每个家庭成员的情绪及需求。"
    },
    offwork: {
      scenarioTitle: "陈先生（下班场景）用户画像及用户旅程图",
      name: "陈先生",
      age: "30岁，男性",
      residence: "一线城市",
      role: "核心使用者",
      vehicle: "蔚来 ES8",
      occupation: "科技公司高级打工牛马",
      workStatus: "高薪但高压，早9晚9，经常加班，脑力消耗极大，下班那一刻通常处于「社交电量0%」「决策电量0%」的极度疲惫状态。",
      personality: "务实、有责任心、情绪稳定",
      behavior: "喜欢暗色调、有秩序感、温度适宜的包裹式空间。极度依赖智能手机，但下班后对「屏幕」和「通知音」有生理性厌恶。喜欢听音乐，更偏好「低能量消耗」的放松方式。",
      coreStory: "秋冬连绵阴雨的晚上9点，全天处于高压状态，脑力消耗极大，下班后处于「电量耗尽」边缘的陈先生下班回家。",
      coreNeeds: "极低认知负荷（不想思考怎么操作）、极致的安全感（雨夜视线差）、以及被物理空间包裹的绝对情绪治愈。"
    }
  };

  const journeys: Record<string, JourneyStage[]> = {
    workday: [
      {
        name: "1. 规划（前一日）",
        userActions: "下午收到明日上午近郊会议的确切地点，核对行程，查看剩余续航，规划是否要补能。NOMI 识别日历行程，预判电量不足，在 NIO APP 推送弹窗提醒。",
        touchpoints: "手机日历、NIO APP",
        emotion: "angry" as const,
        painPoints: "被动提醒与遗忘风险现在的系统还是偏向「弹窗提醒」，如果车主忘记了，可能会造成严重工作失误。",
        opportunities: "主动补能预判NOMI 自动识别日历，计算出明日往返里程超当前剩余续航，主动推送「已为您推荐明早顺路的换电站并预约电池，或是否现在呼叫一键加电」？或在前一晚车主下班回家路上 NOMI 主动语音介入提醒行程且推荐去沿途的换电站。"
      },
      {
        name: "2. 备车",
        userActions: "确认老板即将下楼，出发前二十分钟在 NIO APP 上提前做好车辆环境准备，依次开启车内座椅通风、空调以及香氛。",
        touchpoints: "NIO APP 远程车控、空调、座椅通风、智能香氛",
        emotion: "angry" as const,
        painPoints: "操作繁琐，物理体感生硬预设了固定温度和风量后，当拉开车门的一瞬间，空调往往往正以最大风力直吹车门处，体验极其不佳。",
        opportunities: "座舱微气候的远程预设与动态风场预判一键启动「老板备车模式」。提前开启空调、座椅通风/加热、并释放老板偏好的淡雅香氛。系统根据车内外温差动态调节：在空车时用大风量极速降温/制热；当识别到用户靠近并拉开车门的瞬间，系统自动将风量调小，并将出风口扫风方向避开右后门位置，实现真正的温和和无感介入。"
      },
      {
        name: "3. 优雅接驾",
        userActions: "张先生在酒店大堂陪同老板走向车辆。在靠近车门时自动解锁，张先生语音唤醒 NOMI 开启后座车门，车门缓缓打开，车辆投射迎宾光毯，NOMI 表情呈迎宾状。",
        touchpoints: "NOMI 语音助手、电动车门、迎宾光毯、UWB 数字钥匙",
        emotion: "neutral" as const,
        painPoints: "电动门开启速度较慢且有延时唤醒 NOMI 语音助手或手动在 APP 点开车门会有延时，无法精准控制某个车门打开。用时较长且繁琐，可能会迫使老板停下脚步「等车门」。",
        opportunities: "APP 精准车控精准控制对应车门的开启和关闭，可设置快捷方式，比如长按手机侧边按键实现远距离控制。基于视觉「拟人化」开门结合车外摄像头测距，系统实时计算用户的行走轨迹与步频。让用户在刚好到达的那一刻展开到最佳角度，实现零等待、零失误的物理空间接入。"
      },
      {
        name: "4. 途中护航",
        userActions: "行驶途中，老板在后排打开电脑。张先生将导航切到主驾头枕音响，并通过后视镜观察老板，手动帮他在屏幕上调暗天幕以防止屏幕反光。",
        touchpoints: "头枕音响、后排行政屏、调光天幕、天行底盘平稳模式",
        emotion: "neutral" as const,
        painPoints: "依赖司机人工观察，打扰感强司机在驾驶中频繁通过后视镜观察后排不仅不安全，且调整天幕/遮阳帘需要司机手动操作，这个过程本身就打破了老板的「沉浸工作状态」。",
        opportunities: "视觉联动的全自动声光电重构座舱视觉感知系统一旦识别到右后座老板翻开笔记本电脑或点亮平板，便静默触发「沉浸办公模式」：不仅自动收放该区域的天幕/侧窗透光度以消除屏幕反光，还主动调配后排底盘阻尼至最平缓状态，全程无需司机和老板说一句话。"
      },
      {
        name: "5. 抵达泊车",
        userActions: "抵达 VIP 落客区，张先生随同老板下车，在手机 App 上点击启动 AVP，让车辆自己去地库找车位。",
        touchpoints: "电动门、AVP 代客泊车、UWB 数字钥匙",
        emotion: "happy" as const,
        painPoints: "启动等待的焦虑目前 AVP 启动时，司机往往需要在车旁站着等几秒钟，确认车辆接管成功并开始移动后才敢离开。这短短几秒的停留，会有等待尴尬期。",
        opportunities: "离车即走的极致信任结合 V2X（车路协同）与更底层的系统架构。司机关上车门后，只需向远离车辆的方向走去，车辆通过 UWB 或蓝牙感知到离开，无需掏手机确认，自动无缝接管并驶入地库泊车，将司机的等待时间压缩至绝对的 0。"
      }
    ],
    family: [
      {
        name: "1. 远程备车",
        userActions: "爸爸在 NIO APP 提前设定车内环境，逐一开启空调、香氛、座椅通风，确保家人下楼后能立即享受舒适空间。NOMI 根据行程自动规划换电站点。",
        touchpoints: "NIO APP 远程控制、空调、座椅通风、智能香氛、NOMI",
        emotion: "neutral" as const,
        painPoints: "婴儿对温度极其敏感，预设了固定温度和风量后，当刚入座时，通风力度和环境容易导致婴儿受凉。",
        opportunities: "婴儿专属动态气候算法系统检测到安全座椅连接后，App 提供「备车（婴儿模式）」。自动计算环境温差，以渐进、微风的方式预冷安全座椅，彻底免除手动设定的风险。"
      },
      {
        name: "2. 行李装载",
        userActions: "爸爸进行装载行李工作，靠近时，识别到前部驻留，后备箱、后备舱自动弹开。底盘空悬自动下降降低搬运门槛。",
        touchpoints: "后备箱、前备舱、第三排座椅空间、智能双腔空悬",
        emotion: "angry" as const,
        painPoints: "物品放进前备舱或下沉格后，座舱内无法感知其状态。生鲜如果漏水或温度过高变质，驾驶员一无所知。",
        opportunities: "盲区储物数字感知一旦生鲜发生变质或液体泄漏，中控屏主动弹窗预警，防止扩大污染。"
      },
      {
        name: "3. 乘员落座",
        userActions: "爸爸主驾落座，点开后排照看功能，能看到妈妈将安全座椅旋转90度，把婴儿放入座椅并扣好安全带。妈妈落座二排右座，大儿子落座第三排。",
        touchpoints: "智能感应门，360°旋转儿童安全座椅",
        emotion: "neutral" as const,
        painPoints: "即使座椅能转，爸爸在主驾也无法仅凭肉眼确认儿童安全座椅的安全带卡扣是否真的「锁死」（可能存在假扣状态）。",
        opportunities: "全能物理安全数字仪表盘中控屏底部常驻安全热力图。结合座椅传感器，实时传回儿童安全座椅的「卡扣锁定状态」及三排儿童的安全带状态，全绿后才允许挂挡。"
      },
      {
        name: "4. 高速智驾",
        userActions: "驶入高速，爸爸面临长时间的驾驶任务，需要分配精力观察路况和后排动态。开启 NOP+，一段时间后呼唤 NOMI 开启主驾座椅按摩缓解疲劳。",
        touchpoints: "NOP+、AR-HUD、主驾座椅按摩、NOMI",
        emotion: "happy" as const,
        painPoints: "长时间盯 HUD 容易视觉疲劳；现有的按摩功能需要人工介入开启，无法在驾驶员真正疲惫的那一刻主动提供支持。",
        opportunities: "情绪与疲劳的 AI 主动干预DMS（驾驶员监测）识别到眨眼频率降低时，主动静默开启提神按摩，并动态精简 HUD 显示信息（过滤非关键提示），降低认知负荷。"
      },
      {
        name: "5. 儿童娱乐",
        userActions: "行程途中大儿子想看动画片，爸爸呼叫 NOMI 降下吸顶屏，并开启后防晕车模式，照顾婴儿在睡觉，锁定第三排音区。",
        touchpoints: "NOMI、吸顶屏、防晕车瞭望模式、多音区焦点控制",
        emotion: "neutral" as const,
        painPoints: "爸爸需要下达或确认多个指令，如果通过屏幕操控会影响驾驶安全，复杂的语音指令在嘈杂环境中容易识别失败。",
        opportunities: "场景化多模态一键指令：NOMI 具备空间感知力。爸爸只需一句指令，系统自动检测婴儿在睡觉，静默执行「降屏 + 锁第三排音区 + 开防晕车功效 + 调暗后排灯光」的全套连招。全车互不干扰。"
      },
      {
        name: "6. 换电与休整",
        userActions: "在到达换电站完成 3 分钟极速换电后，爸爸换到女王副驾，开启零重力躺平与热石按摩休息。",
        touchpoints: "换电站、女王副驾、座椅热石按摩",
        emotion: "happy" as const,
        painPoints: "躺在女王副驾休息时，头枕离二排极近。后排儿童吵闹的声音会影响休息体验，产生焦虑情绪。",
        opportunities: "头枕音响主动降噪当系统感应到女王副驾进入「深度睡眠」指令，执行头枕音响主动降噪。后排音区定向限制自动切换二排屏幕为「蓝牙耳机模式」，并提示车内儿童：「爸爸正在休息，NOMI 已为你准备好耳机」。或锁定三排音区。"
      }
    ],
    offwork: [
      {
        name: "1. 远程备车",
        userActions: "陈先生在下班关电脑前，打开 NIO App 点击「下班模式」。车辆提前开启方向盘加热、主驾座椅加热。",
        touchpoints: "NIO App 远程车控、座椅/方向盘加热",
        emotion: "neutral" as const,
        painPoints: "必须依赖用户「记得」去点手机。如果加班太累忘了提前开，面对一台冰冷且起雾的车，情绪会瞬间跌落。",
        opportunities: "无感触发的「环境围栏」备车结合手机 GPS 与天气数据，结合工作日用车习惯与场景。当系统识别到当前是秋冬雨夜，且车主的手机离开写字楼特定 Wi-Fi / 地理围栏时，系统无需指令，静默启动「雨夜下班暖舱模式」（自动除雾 + 加热），实现真正的无缝衔接。"
      },
      {
        name: "2. 近车",
        userActions: "陈先生走向昏暗的车位。感知到车主靠近，车门自动解锁，并开启极具仪式感的迎宾光束和光毯，情绪价值拉满。但此时陈先生一边手拎着电脑包一边打着伞，略显狼狈的腾出一只手打开了车门。收起湿漉漉的伞放进了主驾门板收纳仓。",
        touchpoints: "智能大灯、动态光毯、UWB 钥匙，电动门",
        emotion: "angry" as const,
        painPoints: "光毯和射灯确实给足了视觉上的仪式感，但此时他双手被雨伞和电脑包占满，且刚下班极度疲惫，他被迫停下脚步，极其狼狈地收伞、腾出一只手去拉门把手。",
        opportunities: "意图开门精准感知车主双手被占用，当他靠近车门 1 米处，车门自动弹开。雨具收纳在主驾门板下方或座椅内侧，设计一个带有疏水槽和微加热烘干功能的「雨伞专属收纳舱」。情感投射物理灯光转化为具身社交。光毯在车门旁投射出信息。"
      },
      {
        name: "3. 落座启动",
        userActions: "上车关门。NOMI 想起欢迎语「晚上好」，陈先生唤醒 NOMI「Hi NOMI，导航回家」，然后伸手去点屏幕上的音乐卡片。氛围灯随着音乐亮起。",
        touchpoints: "NOMI，中控屏，氛围灯音乐联动",
        emotion: "neutral" as const,
        painPoints: "每次都需要用户自己去发起指令闭环，打破了上车后本该有的绝对放松感。",
        opportunities: "免唤醒的 AI 主动情感交互结合时间、定位与座舱摄像头的面部识别。主动识别场景模式规划路线，自动识别生物特征，自动匹配音乐歌单以及氛围灯，完成从「机器执行指令」到「管家主动照顾」的跨越。"
      },
      {
        name: "4. 沉浸式行驶",
        userActions: "行驶在雨夜的道路上，HDPL 投影大灯指引前方道路，AR-HUD 渲染动态引导，NOP 智驾缓解疲劳。听着音乐沉浸式驾驶。NOMI 表情随节奏舞动，氛围灯随音乐呼吸起伏。",
        touchpoints: "AR-HUD，HDPL 投影大灯，NOP",
        emotion: "happy" as const,
        painPoints: "雨大时，前车激起的水雾会导致 AR-HUD 虚实错位。",
        opportunities: "AR-HUD 特殊气候视线增强自动识别环境状态，开启后增强模式，提高安全性，降低心理负担。"
      },
      {
        name: "5. 停泊锁车",
        userActions: "行驶至小区车库门口，陈先生开启点击屏幕 / 唤醒 NOMI 后开启 HPA 记忆泊车路线，车辆自动行驶至固定车位。等车停好后，陈先生下车步行 100 米到单元电梯口，人离车自动锁车。",
        touchpoints: "HPA 记忆泊车，NOMI",
        emotion: "neutral" as const,
        painPoints: "记忆泊车需主动开启后，车位离电梯口较远时需要步行，若有重物时会增加体力负担。",
        opportunities: "意图预判主动服务当系统识别到当前是下班时段，且车辆驶入地库电子围栏。NOMI 主动询问提供服务。「先客后车」的动态脱钩泊车电梯口提前落客：系统根据学习过的路线，在经过离电梯最近的「最佳下车点」时主动停下。感应门自动开启。完成无人自动归位，并发送锁车通知。"
      }
    ]
  };

  const persona = personas[selectedScenario];
  const stages = journeys[selectedScenario];

  const getEmotionEmoji = (emotion: "happy" | "neutral" | "angry") => {
    switch (emotion) {
      case "happy":
        return "😊";
      case "neutral":
        return "🙂";
      case "angry":
        return "😠";
    }
  };

  return (
    <section className="min-h-screen bg-black py-16">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl font-light text-white mb-2">用户旅程图</h2>
          <p className="text-gray-500">典型场景的完整用户体验旅程分析</p>
        </motion.div>

        {/* 场景选择 */}
        <div className="flex gap-3 mb-8 justify-center">
          <button
            onClick={() => setSelectedScenario("workday")}
            className={`px-6 py-3 text-sm rounded-lg border transition-all ${
              selectedScenario === "workday"
                ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            工作日场景
          </button>
          <button
            onClick={() => setSelectedScenario("family")}
            className={`px-6 py-3 text-sm rounded-lg border transition-all ${
              selectedScenario === "family"
                ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            家庭场景
          </button>
          <button
            onClick={() => setSelectedScenario("offwork")}
            className={`px-6 py-3 text-sm rounded-lg border transition-all ${
              selectedScenario === "offwork"
                ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            下班场景
          </button>
        </div>

        {/* 场景标题 */}
        <motion.div
          key={selectedScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-2xl font-light text-white text-center mb-8">
            {persona.scenarioTitle}
          </h3>
        </motion.div>

        {/* 用户画像卡片 */}
        <motion.div
          key={`persona-${selectedScenario}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-950/20 to-blue-950/10 border border-cyan-500/20 rounded-xl p-8 mb-8"
        >
          <h4 className="text-cyan-400 text-lg mb-6 font-medium">一、用户基础信息</h4>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">姓名：</span>
                <span className="text-white">{persona.name}</span>
              </div>
              <div>
                <span className="text-gray-400">年龄/性别：</span>
                <span className="text-white">{persona.age}</span>
              </div>
              <div>
                <span className="text-gray-400">常驻地：</span>
                <span className="text-white">{persona.residence}</span>
              </div>
              <div>
                <span className="text-gray-400">用车角色：</span>
                <span className="text-white">{persona.role}</span>
              </div>
              <div>
                <span className="text-gray-400">车辆：</span>
                <span className="text-white">{persona.vehicle}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-gray-400">职业背景：</span>
                <span className="text-white">{persona.occupation}</span>
              </div>
              {persona.familyStructure && (
                <div>
                  <span className="text-gray-400">家庭结构：</span>
                  <span className="text-white">{persona.familyStructure}</span>
                </div>
              )}
              <div>
                <span className="text-gray-400">性格特征：</span>
                <span className="text-white">{persona.personality}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div>
              <span className="text-gray-400">工作状况：</span>
              <p className="text-white mt-1 leading-relaxed">{persona.workStatus}</p>
            </div>
            <div>
              <span className="text-gray-400">行为特征：</span>
              <p className="text-white mt-1 leading-relaxed">{persona.behavior}</p>
            </div>
            <div>
              <span className="text-gray-400">核心故事：</span>
              <p className="text-white mt-1 leading-relaxed">{persona.coreStory}</p>
            </div>
            <div>
              <span className="text-gray-400">核心诉求：</span>
              <p className="text-white mt-1 leading-relaxed font-medium">{persona.coreNeeds}</p>
            </div>
          </div>
        </motion.div>

        {/* 旅程图表格 */}
        <motion.div
          key={`journey-${selectedScenario}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-cyan-950/30 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-cyan-400 text-sm font-medium w-32">阶段</th>
                  {stages.map((stage, idx) => (
                    <th key={idx} className="px-4 py-3 text-center text-white text-sm font-medium">
                      {stage.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 用户行为 */}
                <tr className="border-b border-white/10">
                  <td className="px-4 py-3 bg-cyan-950/20 text-cyan-400 text-sm font-medium">用户行为</td>
                  {stages.map((stage, idx) => (
                    <td key={idx} className="px-4 py-3 text-gray-300 text-xs leading-relaxed align-top">
                      {stage.userActions}
                    </td>
                  ))}
                </tr>

                {/* 触点 */}
                <tr className="border-b border-white/10">
                  <td className="px-4 py-3 bg-cyan-950/20 text-cyan-400 text-sm font-medium">触点</td>
                  {stages.map((stage, idx) => (
                    <td key={idx} className="px-4 py-3 text-gray-400 text-xs align-top">
                      {stage.touchpoints}
                    </td>
                  ))}
                </tr>

                {/* 情绪曲线 */}
                <tr className="border-b border-white/10">
                  <td className="px-4 py-3 bg-cyan-950/20 text-cyan-400 text-sm font-medium">情绪曲线</td>
                  {stages.map((stage, idx) => (
                    <td key={idx} className="px-4 py-4 text-center align-middle">
                      <span className="text-4xl">{getEmotionEmoji(stage.emotion)}</span>
                    </td>
                  ))}
                </tr>

                {/* 痛点 */}
                <tr className="border-b border-white/10">
                  <td className="px-4 py-3 bg-cyan-950/20 text-cyan-400 text-sm font-medium">痛点</td>
                  {stages.map((stage, idx) => (
                    <td key={idx} className="px-4 py-3 bg-red-950/10 text-gray-300 text-xs leading-relaxed align-top">
                      {stage.painPoints}
                    </td>
                  ))}
                </tr>

                {/* 机会点 */}
                <tr>
                  <td className="px-4 py-3 bg-cyan-950/20 text-cyan-400 text-sm font-medium">机会点</td>
                  {stages.map((stage, idx) => (
                    <td key={idx} className="px-4 py-3 bg-orange-950/10 text-gray-300 text-xs leading-relaxed align-top">
                      {stage.opportunities}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}