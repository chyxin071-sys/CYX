import re

# 1. PRD File
prd_path = r"e:\XIN Lab\CMweb2.0\PM工作流\需求文档\筑家云记PRD_v1.0.html"
with open(prd_path, "r", encoding="utf-8") as f:
    prd = f.read()

# Move tag to H3
prd = re.sub(r'(<h3>.*?)(</h3>)\s*<div class="flex items-center gap-2 mb-4">\s*(<span class="tag .*?">.*?</span>)\s*</div>', r'\1 \3\2', prd)

# iphone-mockup overflow hidden removal
prd = re.sub(r'border-radius: 40px; /\* 裁剪掉.*? \*/\s*overflow: hidden;', r'border-radius: 40px;\n            /* overflow: hidden; */', prd)

# iphone-screen overflow visible -> hidden + radius
prd = re.sub(r'background: transparent;\s*overflow: visible;\s*\}', r'background: transparent;\n            overflow: hidden;\n            border-radius: 40px;\n        }', prd)

# refresh-btn style
new_btn_css = """.refresh-btn {
            position: absolute;
            bottom: 40px;
            right: -80px; /* 移到手机外部右侧 */
            width: 56px;
            height: 56px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            z-index: 100;
            color: #334155;
            font-size: 24px;
            transition: all 0.2s;
            border: 1px solid #e2e8f0;
        }"""
prd = re.sub(r'\.refresh-btn\s*\{[^}]*\}', new_btn_css, prd)

# drawer refresh btn inline style removal
prd = prd.replace('style="bottom: 10px; right: 10px;" ', '')

with open(prd_path, "w", encoding="utf-8") as f:
    f.write(prd)

# 2. Prototype File
proto_path = r"e:\XIN Lab\CMweb2.0\PM工作流\原型\筑家云记_原型_v1.0.html"
with open(proto_path, "r", encoding="utf-8") as f:
    proto = f.read()

new_debug = '''<div id="debug-switcher">
        <div onclick="location.reload()" style="background: rgba(255, 255, 255, 0.9); color: #334155; border: 1px solid #e2e8f0; backdrop-filter: blur(8px); border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s;" onmouseover="this.style.transform='scale(1.1)'; this.style.color='#000'" onmouseout="this.style.transform='scale(1)'; this.style.color='#334155'" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1.1)'" title="刷新原型">
            <i class="ri-refresh-line" style="font-size: 24px;"></i>
        </div>
    </div>'''

proto = re.sub(r'<div id="debug-switcher">.*?</div>\s*</div>', new_debug, proto, flags=re.DOTALL)
proto = re.sub(r'left: calc\(50% \+ 200px\);', r'left: calc(50% + 220px);', proto)

with open(proto_path, "w", encoding="utf-8") as f:
    f.write(proto)

print("Success!")
