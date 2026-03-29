import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");

  const navItems = [
    { name: "首页", id: "hero" },
    { name: "行业格局", id: "industry" },
    { name: "蔚来研究", id: "nio-brand" },
    { name: "SWOT", id: "swot" },
    { name: "关键技术", id: "technologies" },
    { name: "体验评估", id: "assessment" },
    { name: "功能拆解", id: "features" },
    { name: "用户旅程", id: "journey" },
    { name: "品牌一致性", id: "consistency" },
    { name: "优化方案", id: "solutions" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200; // 调整偏移量，更精确地检测当前区域

      // 如果在页面顶部，直接设置为首页
      if (window.scrollY < 100) {
        setActiveSection("hero");
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    // 确保在组件挂载后立即执行一次
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-1.5 text-xs whitespace-nowrap transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}