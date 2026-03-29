require('dotenv').config();
const express = require('express');
const cors = require('cors');
const lark = require('@larksuiteoapi/node-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// 初始化飞书客户端
const client = new lark.Client({
    appId: process.env.FEISHU_APP_ID,
    appSecret: process.env.FEISHU_APP_SECRET,
});

app.post('/api/submit-lead', async (req, res) => {
    try {
        const { phone, area, exactPrice, breakdown } = req.body;

        // 提取各项材料的选择明细
        const getDetail = (name) => {
            const item = breakdown.find(b => b.name === name);
            return item ? `${item.optName} (预估: ${item.unitStr}) - ¥${item.total}` : '未选择';
        };

        // 调用飞书 API 写入多维表格记录
        const response = await client.bitable.appTableRecord.create({
            path: {
                app_token: process.env.FEISHU_APP_TOKEN,
                table_id: process.env.FEISHU_TABLE_ID,
            },
            data: {
                fields: {
                    "手机号": phone,
                    "建筑面积": Number(parseFloat(area).toFixed(1)), // 数字，小数点后一位
                    "预估总价": Number(parseFloat(exactPrice).toFixed(2)), // 货币，小数点后两位
                    
                    // 基装
                    "基装": getDetail('全屋基装'),
                    
                    // 主材编组
                    "室内木门": getDetail('室内木门'),
                    "厨卫金属门": getDetail('厨卫金属门'),
                    "瓷砖": getDetail('全屋通铺瓷砖'),
                    "厨卫集成吊顶": getDetail('厨卫集成吊顶'),
                    "墙面饰材": getDetail('墙面饰材'),
                    
                    // 定制编组
                    "全屋定制柜": getDetail('全屋定制柜'),
                    "整体橱柜": getDetail('整体橱柜'),
                    
                    // 个性化编组
                    "电视背景墙": getDetail('电视背景墙'),
                    "墙面木饰面": getDetail('墙面木饰面'),
                    "全屋踢脚线": getDetail('全屋踢脚线')
                }
            }
        });

        if (response.code === 0) {
            res.json({ success: true, message: '线索已成功同步至飞书', data: response.data });
        } else {
            console.error('飞书 API 报错:', JSON.stringify(response, null, 2));
            res.status(500).json({ success: false, message: '飞书同步失败', error: response });
        }
    } catch (error) {
        console.error('服务端错误:', error);
        res.status(500).json({ success: false, message: '服务器内部错误', error: error.message || error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`后端服务已启动，监听端口: ${PORT}`);
    console.log(`接收请求地址: http://localhost:${PORT}/api/submit-lead`);
});
