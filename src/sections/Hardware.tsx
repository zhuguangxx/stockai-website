import { useEffect, useState } from 'react';
import { 
  Zap, 
  Plug, 
  Wifi, 
  Shield,
  Check,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hardwareApi } from '@/supabase/client';
import type { HardwareSpec } from '@/types';

const defaultSpecs: HardwareSpec[] = [
  {
    id: '1',
    name: 'N100四核处理器',
    value: '流畅运行分析引擎',
    order: 1,
  },
  {
    id: '2',
    name: '8GB内存',
    value: '支持多任务并行',
    order: 2,
  },
  {
    id: '3',
    name: '256GB固态硬盘',
    value: '存储5年历史数据',
    order: 3,
  },
  {
    id: '4',
    name: '低功耗设计',
    value: '24小时运行不费电',
    order: 4,
  },
  {
    id: '5',
    name: '预装系统',
    value: '插电联网即用',
    order: 5,
  },
];

export default function Hardware() {
  const [specs, setSpecs] = useState<HardwareSpec[]>(defaultSpecs);
  const [, setLoading] = useState(true);

  useEffect(() => {
    loadSpecs();
  }, []);

  const loadSpecs = async () => {
    try {
      const data = await hardwareApi.getAll();
      if (data.length > 0) {
        setSpecs(data);
      }
    } catch (error) {
      console.error('Failed to load hardware specs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hardware" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-4">
            硬件方案
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            开箱即用，一键启动
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            智投云专用主机 - 专为StockAI优化的迷你主机
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Product Image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700">
              {/* Device Mockup */}
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                
                {/* Device */}
                <div className="relative w-48 h-48 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center">
                  {/* Device Top */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-500 rounded-full" />
                  
                  {/* Logo */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-4">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Status LED */}
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-300">运行中</span>
                  </div>
                  
                  {/* Ports */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                    <div className="w-8 h-3 bg-gray-800 rounded" />
                    <div className="w-8 h-3 bg-gray-800 rounded" />
                    <div className="w-8 h-3 bg-gray-800 rounded" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur rounded-lg px-3 py-2">
                  <p className="text-xs text-green-300">功耗 &lt; 10W</p>
                </div>
                <div className="absolute bottom-4 left-4 bg-blue-500/20 backdrop-blur rounded-lg px-3 py-2">
                  <p className="text-xs text-blue-300">静音设计</p>
                </div>
              </div>

              {/* Product Name */}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold">智投云专用主机</h3>
                <p className="text-gray-400 text-sm mt-1">StockAI Mini Server</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          </div>

          {/* Right - Specs & Pricing */}
          <div>
            {/* Specs List */}
            <div className="space-y-4 mb-8">
              {specs.map((spec) => (
                <div
                  key={spec.id}
                  className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{spec.name}</h4>
                    <p className="text-sm text-gray-400">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Wifi, text: 'WiFi 6 无线连接' },
                { icon: Shield, text: '本地数据存储' },
                { icon: Plug, text: '即插即用' },
                { icon: Package, text: '全家共享' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                  <item.icon className="w-4 h-4 text-blue-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-200 text-sm">智投云专用主机</p>
                  <p className="text-3xl font-bold">¥1,299</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-sm">使用方式</p>
                  <p className="font-semibold">一次购买</p>
                  <p className="text-blue-200 text-sm">永久使用</p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold"
              >
                立即购买
              </Button>
              
              <p className="text-center text-blue-200 text-sm mt-3">
                基础功能永久免费，订阅服务为增强功能
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
