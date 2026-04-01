import { useEffect, useState } from 'react';
import { ArrowRight, Play, TrendingUp, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteContentApi } from '@/supabase/client';

interface HeroData {
  mainTitle: string;
  subTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  price: string;
}

const defaultData: HeroData = {
  mainTitle: '让数据为你赚钱',
  subTitle: '6大技术指标专家 + AI智能分析 + 家庭共享 / 一台设备，全家受益',
  ctaPrimary: '立即了解',
  ctaSecondary: '查看功能演示',
  price: '¥1,299',
};

export default function Hero() {
  const [data, setData] = useState<HeroData>(defaultData);
  const [, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const contents = await siteContentApi.getContentBySection('hero');
      const contentMap: Record<string, string> = {};
      contents.forEach(item => {
        contentMap[item.key] = item.value;
      });

      setData({
        mainTitle: contentMap.mainTitle || defaultData.mainTitle,
        subTitle: contentMap.subTitle || defaultData.subTitle,
        ctaPrimary: contentMap.ctaPrimary || defaultData.ctaPrimary,
        ctaSecondary: contentMap.ctaSecondary || defaultData.ctaSecondary,
        price: contentMap.price || defaultData.price,
      });
    } catch (error) {
      console.error('Failed to load hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-100/50 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1E40AF 1px, transparent 1px), linear-gradient(90deg, #1E40AF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">AI驱动的个人投资助手</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              智投云 <span className="text-blue-600">StockAI</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {data.mainTitle}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {data.subTitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button
                size="lg"
                onClick={() => scrollToSection('#hardware')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
              >
                {data.ctaPrimary}
                <span className="ml-2 text-amber-300 font-bold">{data.price}</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#features')}
                className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-6 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                {data.ctaSecondary}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>数据私有</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>家庭共享</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>即插即用</span>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">智投云分析中心</h3>
                    <p className="text-xs text-gray-500">实时股票分析</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">运行中</span>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
                <div className="flex items-end justify-between h-32 gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500"
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>9:30</span>
                  <span>11:30</span>
                  <span>14:00</span>
                  <span>15:00</span>
                </div>
              </div>

              {/* Indicators */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'MACD', value: '+2.34', status: 'bullish' },
                  { name: 'KDJ', value: '68.5', status: 'neutral' },
                  { name: 'CCI', value: '+156', status: 'bullish' },
                ].map((indicator) => (
                  <div key={indicator.name} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">{indicator.name}</p>
                    <p className={`font-bold ${
                      indicator.status === 'bullish' ? 'text-green-600' : 
                      indicator.status === 'bearish' ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {indicator.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* AI Insight */}
              <div className="mt-4 bg-blue-50 rounded-lg p-3 flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-white font-bold">AI</span>
                </div>
                <p className="text-sm text-blue-800">
                  综合分析：多头趋势明显，建议关注回调买入机会
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100 animate-bounce">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">今日收益</p>
                  <p className="font-bold text-green-600">+3.24%</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">家庭用户</p>
                  <p className="font-bold text-gray-900">4人共享</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
