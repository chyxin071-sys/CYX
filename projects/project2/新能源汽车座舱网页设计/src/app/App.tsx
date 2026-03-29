import { HeroSection } from "./components/hero-section";
import { IndustryOverview } from "./components/industry-overview";
import { NioBrandResearch } from "./components/nio-brand-research";
import { SwotAnalysis } from "./components/swot-analysis";
import { KeyTechnologies } from "./components/key-technologies";
import { ExperienceAssessment } from "./components/experience-assessment";
import { FeatureBreakdown } from "./components/feature-breakdown";
import { UserJourney } from "./components/user-journey";
import { BrandConsistency } from "./components/brand-consistency";
import { OptimizationSolutions } from "./components/optimization-solutions";
import { Navigation } from "./components/navigation";

// 蔚来NIO智能座舱体验研究路演
export default function App() {
  return (
    <div className="bg-black min-h-screen pt-12">
      {/* 导航栏 */}
      <Navigation />
      
      {/* Hero Section */}
      <div id="hero">
        <HeroSection />
      </div>
      
      {/* 行业格局 */}
      <div id="industry">
        <IndustryOverview />
      </div>
      
      {/* 蔚来品牌研究 */}
      <div id="nio-brand">
        <NioBrandResearch />
      </div>
      
      {/* SWOT Analysis */}
      <div id="swot">
        <SwotAnalysis />
      </div>
      
      {/* 关键技术 */}
      <div id="technologies">
        <KeyTechnologies />
      </div>
      
      {/* Experience Assessment */}
      <div id="assessment">
        <ExperienceAssessment />
      </div>
      
      {/* 核心功能商业策略拆解 */}
      <div id="features">
        <FeatureBreakdown />
      </div>
      
      {/* User Journey */}
      <div id="journey">
        <UserJourney />
      </div>
      
      {/* Brand Consistency - 新增 */}
      <div id="consistency">
        <BrandConsistency />
      </div>
      
      {/* Optimization Solutions */}
      <div id="solutions">
        <OptimizationSolutions />
      </div>
      
      {/* Footer */}
      <footer className="relative bg-black border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-gray-600 text-sm">
            蔚来 NIO 智能座舱体验竞争力研究报告 © 2026
          </p>
          <p className="text-gray-700 text-xs mt-2">
            未来出行 · 情感连接 · 智能进化
          </p>
        </div>
      </footer>
    </div>
  );
}