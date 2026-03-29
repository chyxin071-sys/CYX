const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

// ==================== 配置 ====================
// 允许跨域和 JSON 解析
app.use(cors());
app.use(express.json());

// 静态文件服务：将当前目录下的文件作为静态资源
app.use(express.static(__dirname));
// 提供上传目录的静态访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 Multer，用于处理文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ==================== 豆包 API 客户端 ====================
// 使用 openai SDK 兼容调用火山引擎豆包 API
const client = new OpenAI({
    apiKey: process.env.DOUBAO_API_KEY,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

// Helper: 将本地图片转为 Base64
function encodeImageToBase64(filePath) {
    const bitmap = fs.readFileSync(filePath);
    return Buffer.from(bitmap).toString('base64');
}

// ==================== 路由 ====================

// 主页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 处理生成请求
app.post('/api/generate', upload.fields([
    { name: 'effectImage', maxCount: 1 },
    { name: 'materialImages', maxCount: 5 }
]), async (req, res) => {
    try {
        console.log('--- 收到生成请求 ---');
        
        const userPrompt = req.body.prompt || '';
        const effectImageFile = req.files['effectImage'] ? req.files['effectImage'][0] : null;
        
        if (!effectImageFile) {
            return res.status(400).json({ error: '必须上传效果图' });
        }

        const effectImagePath = effectImageFile.path;
        // 获取本地访问 URL，返回给前端展示
        const effectImageUrl = `/uploads/${effectImageFile.filename}`;
        
        console.log('图片已保存:', effectImagePath);
        console.log('用户提示词:', userPrompt);

        // 将图片转为 Base64
        const base64Image = encodeImageToBase64(effectImagePath);
        const mimeType = effectImageFile.mimetype; // e.g., 'image/jpeg'

        // 构造给豆包大模型的顶级家装设计 Prompt
        const systemPrompt = `你是一位拥有10年经验的高端私宅定制设计总监。你的任务是分析用户上传的【${req.body.spaceName || '室内'}】效果图，并结合用户的【补充想法】，提取出能打动业主的讲解话术和排版数据。

你的审美标准：高端、极简、专业、克制。
你的讲解逻辑：不只是描述画面，而是要“翻译设计语言”，解释为什么这么做（解决痛点、营造氛围、材质工艺落地）。

请必须严格返回一个 JSON 格式的对象，不要包含任何 markdown 标记（如 \`\`\`json ），直接返回 JSON 字符串本身。JSON 必须包含以下结构：

{
    "roomTitle": "基于画面推测空间名称，例如 '客厅 LIVING ROOM' 或 '主卧 MASTER BEDROOM'",
    "roomSubtitle": "一句话概括空间氛围，例如 '现代极简与法式轻奢的碰撞'",
    "concept": "一段100-150字的设计理念。重点描述：1. 空间氛围与情绪价值；2. 核心材质的碰撞关系；3. 空间布局的巧思。语言要像顶级设计师的提案，优雅且专业。",
    "colors": [
        { "hex": "#EBE9E4", "name": "珍珠白" }, // 精准提取图片中的 3-4 个主要颜色，hex必须是大写，name要赋予高级感（如燕麦色、陨石灰、胡桃木色）
        { "hex": "#8B7355", "name": "胡桃木色" }
    ],
    "materials": [
        { "name": "鱼肚白岩板", "desc": "哑光面 / 连纹铺贴" }, // 提取图片中用到的 2-3 种核心材质，并补充可能的工艺细节（如：无主灯设计、隐藏式踢脚线、水性漆工艺）
        { "name": "微水泥艺术涂料", "desc": "无缝一体 / 细腻质感" }
    ],
    "highlights": [
        "无主灯悬浮吊顶，拉伸视觉层高", // 提取 2-3 个核心设计亮点短句，用于后续前端在图上打点标注。必须是“亮点+作用”的句式。
        "隐形踢脚线，极致极简细节"
    ]
}

用户的补充想法是：${userPrompt || '无补充想法，请根据图片视觉信息深度挖掘亮点'}`;

        console.log('正在调用豆包大模型 API (Vision)...');
        
        // 使用专属接入点 (ep-)，完全兼容 OpenAI 标准格式
        const completion = await client.chat.completions.create({
            model: 'ep-20260322184433-ms26f', // 用户专属的接入点 ID
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: systemPrompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            // 恢复温度设置以保证输出的创造性和专业感
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;

        console.log('AI 返回原始数据:', aiResponse);

        let parsedData;
        try {
            parsedData = JSON.parse(aiResponse);
        } catch (e) {
            console.error('JSON 解析失败，尝试清理字符串', e);
            // 简单清理可能存在的 markdown
            const cleanStr = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsedData = JSON.parse(cleanStr);
        }

        // 返回给前端
        res.json({
            success: true,
            imageUrl: effectImageUrl,
            data: parsedData
        });

    } catch (error) {
        console.error('生成失败:', error);
        res.status(500).json({ error: error.message || '内部服务器错误' });
    }
});

app.listen(port, () => {
    console.log(`服务器已启动，请访问 http://localhost:${port}`);
});
