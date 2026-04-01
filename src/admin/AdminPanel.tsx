import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Save,
  RefreshCw,
  Check,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi, siteContentApi, featuresApi, hardwareApi, faqApi } from '@/supabase/client';
import type { Feature, HardwareSpec, FAQItem } from '@/types';

interface HeroFormData {
  mainTitle: string;
  subTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  price: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Hero content
  const [heroData, setHeroData] = useState<HeroFormData>({
    mainTitle: '让数据为你赚钱',
    subTitle: '6大技术指标专家 + AI智能分析 + 家庭共享 / 一台设备，全家受益',
    ctaPrimary: '立即了解',
    ctaSecondary: '查看功能演示',
    price: '¥1,299',
  });

  // Features, Hardware, FAQ data
  const [features, setFeatures] = useState<Feature[]>([]);
  const [hardwareSpecs, setHardwareSpecs] = useState<HardwareSpec[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    checkAuth();
    loadAllData();
  }, []);

  const checkAuth = async () => {
    const session = await authApi.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load hero content
      const heroContents = await siteContentApi.getContentBySection('hero');
      const heroMap: Record<string, string> = {};
      heroContents.forEach(item => {
        heroMap[item.key] = item.value;
      });
      setHeroData(prev => ({
        mainTitle: heroMap.mainTitle || prev.mainTitle,
        subTitle: heroMap.subTitle || prev.subTitle,
        ctaPrimary: heroMap.ctaPrimary || prev.ctaPrimary,
        ctaSecondary: heroMap.ctaSecondary || prev.ctaSecondary,
        price: heroMap.price || prev.price,
      }));

      // Load features
      const featuresData = await featuresApi.getAll();
      if (featuresData.length > 0) setFeatures(featuresData);

      // Load hardware specs
      const hardwareData = await hardwareApi.getAll();
      if (hardwareData.length > 0) setHardwareSpecs(hardwareData);

      // Load FAQs
      const faqData = await faqApi.getAll();
      if (faqData.length > 0) setFaqs(faqData);
    } catch (error) {
      console.error('Failed to load data:', error);
      showMessage('error', '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      await siteContentApi.batchUpdateContent([
        { section: 'hero', key: 'mainTitle', value: heroData.mainTitle },
        { section: 'hero', key: 'subTitle', value: heroData.subTitle },
        { section: 'hero', key: 'ctaPrimary', value: heroData.ctaPrimary },
        { section: 'hero', key: 'ctaSecondary', value: heroData.ctaSecondary },
        { section: 'hero', key: 'price', value: heroData.price },
      ]);
      showMessage('success', '首页内容已保存');
    } catch (error) {
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await authApi.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-xl">智投云管理后台</h1>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                target="_blank"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">查看网站</span>
              </a>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            <AlertDescription className="flex items-center gap-2">
              {message.type === 'success' && <Check className="w-4 h-4 text-green-600" />}
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">首页设置</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">功能管理</span>
            </TabsTrigger>
            <TabsTrigger value="hardware" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">硬件规格</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">FAQ管理</span>
            </TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">首页内容设置</h2>
                  <p className="text-sm text-gray-500">修改首页Hero区域展示的内容</p>
                </div>
                <Button onClick={handleSaveHero} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? '保存中...' : '保存更改'}
                </Button>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="mainTitle">主标题</Label>
                  <Input
                    id="mainTitle"
                    value={heroData.mainTitle}
                    onChange={(e) => setHeroData({ ...heroData, mainTitle: e.target.value })}
                    placeholder="让数据为你赚钱"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subTitle">副标题</Label>
                  <Textarea
                    id="subTitle"
                    value={heroData.subTitle}
                    onChange={(e) => setHeroData({ ...heroData, subTitle: e.target.value })}
                    placeholder="6大技术指标专家 + AI智能分析 + 家庭共享"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ctaPrimary">主按钮文字</Label>
                    <Input
                      id="ctaPrimary"
                      value={heroData.ctaPrimary}
                      onChange={(e) => setHeroData({ ...heroData, ctaPrimary: e.target.value })}
                      placeholder="立即了解"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ctaSecondary">次按钮文字</Label>
                    <Input
                      id="ctaSecondary"
                      value={heroData.ctaSecondary}
                      onChange={(e) => setHeroData({ ...heroData, ctaSecondary: e.target.value })}
                      placeholder="查看功能演示"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price">价格显示</Label>
                  <Input
                    id="price"
                    value={heroData.price}
                    onChange={(e) => setHeroData({ ...heroData, price: e.target.value })}
                    placeholder="¥1,299"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">功能特性管理</h2>
              <p className="text-gray-500 mb-6">
                当前共有 {features.length} 个功能特性展示在首页
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={feature.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                * 功能特性的完整编辑功能需要在数据库中操作
              </p>
            </div>
          </TabsContent>

          {/* Hardware Tab */}
          <TabsContent value="hardware" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">硬件规格管理</h2>
              <p className="text-gray-500 mb-6">
                当前共有 {hardwareSpecs.length} 个硬件规格展示
              </p>
              <div className="space-y-4">
                {hardwareSpecs.map((spec, index) => (
                  <div key={spec.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium">{spec.name}</h4>
                        <p className="text-sm text-gray-500">{spec.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                * 硬件规格的完整编辑功能需要在数据库中操作
              </p>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">FAQ管理</h2>
              <p className="text-gray-500 mb-6">
                当前共有 {faqs.length} 个FAQ展示
              </p>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold flex-shrink-0">
                        Q
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium">{faq.question}</h4>
                        <p className="text-sm text-gray-500 mt-1">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                * FAQ的完整编辑功能需要在数据库中操作
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
