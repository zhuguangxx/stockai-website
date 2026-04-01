import { useEffect, useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  LineChart, 
  BarChart3, 
  TrendingDown,
  Brain,
  ArrowRight
} from 'lucide-react';
import { featuresApi } from '@/supabase/client';
import type { Feature } from '@/types';

const defaultFeatures: Feature[] = [
  {
    id: '1',
    name: 'MACD',
    title: 'MACD趋势判断',
    description: '捕捉金叉死叉信号，识别趋势转折点',
    icon: 'Activity',
    order: 1,
  },
  {
    id: '2',
    name: 'MA',
    title: '均线系统分析',
    description: '判断多头排列/空头排列，确认趋势方向',
    icon: 'TrendingDown',
    order: 2,
  },
  {
    id: '3',
    name: 'KDJ',
    title: 'KDJ超买超卖',
    description: '监测短线超买超卖状态，捕捉反弹机会',
    icon: 'LineChart',
    order: 3,
  },
  {
    id: '4',
    name: 'CCI',
    title: 'CCI异常波动',
    description: '识别价格异常波动，发现潜在反转信号',
    icon: 'BarChart3',
    order: 4,
  },
  {
    id: '5',
    name: 'EXPMA',
    title: 'EXPMA平滑均线',
    description: '指数平滑移动平均线，快速响应价格变化',
    icon: 'TrendingUp',
    order: 5,
  },
  {
    id: '6',
    name: 'AI',
    title: 'AI智能决策',
    description: '综合6大专家意见，给出最终投资建议',
    icon: 'Brain',
    order: 6,
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  TrendingUp,
  LineChart,
  BarChart3,
  TrendingDown,
  Brain,
};

export default function Features() {
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);
  const [, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const data = await featuresApi.getAll();
      if (data.length > 0) {
        setFeatures(data);
      }
    } catch (error) {
      console.error('Failed to load features:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            核心功能
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            6大专家，为你护航
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            不是简单的指标计算，是专家级的信号解读。
            <br />
            不需要懂技术分析，专家帮你解读。
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Activity;
            return (
              <div
                key={feature.id}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm">了解更多</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 opacity-50">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            六大技术指标专家协同工作，AI智能综合分析
          </p>
          <div className="inline-flex items-center gap-4 bg-blue-50 rounded-full px-6 py-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <span className="text-blue-800 font-medium">
              AI综合分析准确率提升 <span className="text-blue-600 font-bold">40%</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
