import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Save,
  RefreshCw,
  Check,
  Globe,
  Phone,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi, siteContentApi, featuresApi, hardwareApi, faqApi } from '@/supabase/client';
import type { Feature, HardwareSpec, FAQItem } from '@/types';

interface HeroFormData {
  mainTitle: string;
  subTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  price: string;
}

interface ContactFormData {
  phone: string;
  email: string;
  address: string;
  wechat: string;
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
    price: '?299',
  });

  // Contact content
  const [contactData, setContactData] = useState<ContactFormData>({
    phone: '',
    email: '',
    address: '',
    wechat: '',
  });

  // Features, Hardware, FAQ data
  const [features, setFeatures] = useState<Feature[]>([]);
  const [hardwareSpecs, setHardwareSpecs] = useState<HardwareSpec[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Dialog states
  const [featureDialog, setFeatureDialog] = useState<{ open: boolean; editing?: Feature | null }>({ open: false });
  const [hardwareDialog, setHardwareDialog] = useState<{ open: boolean; editing?: HardwareSpec | null }>({ open: false });
  const [faqDialog, setFaqDialog] = useState<{ open: boolean; editing?: FAQItem | null }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: 'feature' | 'hardware' | 'faq'; id: string } | null>(null);

  // Form states
  const [featureForm, setFeatureForm] = useState({ title: '', description: '', icon: '', order: 0 });
  const [hardwareForm, setHardwareForm] = useState({ name: '', value: '', unit: '', order: 0 });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', order: 0 });

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

      // Load contact content
      const contactContents = await siteContentApi.getContentBySection('contact');
      const contactMap: Record<string, string> = {};
      contactContents.forEach(item => {
        contactMap[item.key] = item.value;
      });
      setContactData({
        phone: contactMap.phone || '',
        email: contactMap.email || '',
        address: contactMap.address || '',
        wechat: contactMap.wechat || '',
      });

      // Load features
      const featuresData = await featuresApi.getAll();
      setFeatures(featuresData);

      // Load hardware specs
      const hardwareData = await hardwareApi.getAll();
      setHardwareSpecs(hardwareData);

      // Load FAQs
      const faqData = await faqApi.getAll();
      setFaqs(faqData);
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

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      await siteContentApi.batchUpdateContent([
        { section: 'contact', key: 'phone', value: contactData.phone },
        { section: 'contact', key: 'email', value: contactData.email },
        { section: 'contact', key: 'address', value: contactData.address },
        { section: 'contact', key: 'wechat', value: contactData.wechat },
      ]);
      showMessage('success', '联系方式已保存');
    } catch (error) {
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // Feature handlers
  const openFeatureDialog = (feature?: Feature) => {
    if (feature) {
      setFeatureForm({
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        order: feature.order,
      });
      setFeatureDialog({ open: true, editing: feature });
    } else {
      setFeatureForm({ title: '', description: '', icon: '', order: features.length });
      setFeatureDialog({ open: true, editing: null });
    }
  };

  const handleSaveFeature = async () => {
    if (!featureForm.title || !featureForm.description) {
      showMessage('error', '请填写完整信息');
      return;
    }
    
    setSaving(true);
    try {
      if (featureDialog.editing) {
        await featuresApi.update(featureDialog.editing.id, featureForm);
        showMessage('success', '功能已更新');
      } else {
        await featuresApi.create({ ...featureForm, name: featureForm.title });
        showMessage('success', '功能已添加');
      }
      setFeatureDialog({ open: false });
      await loadAllData();
    } catch (error) {
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFeature = async () => {
    if (!deleteDialog) return;
    setSaving(true);
    try {
      await featuresApi.delete(deleteDialog.id);
      showMessage('success', '功能已删除');
      setDeleteDialog(null);
      await loadAllData();
    } catch (error) {
      showMessage('error', '删除失败');
    } finally {
      setSaving(false);
    }
  };

  // Hardware handlers
  const openHardwareDialog = (spec?: HardwareSpec) => {
    if (spec) {
      setHardwareForm({
        name: spec.name,
        value: spec.value,
        unit: (spec as any).unit || '',
        order: spec.order,
      });
      setHardwareDialog({ open: true, editing: spec });
    } else {
      setHardwareForm({ name: '', value: '', unit: '', order: hardwareSpecs.length });
      setHardwareDialog({ open: true, editing: null });
    }
  };

  const handleSaveHardware = async () => {
    if (!hardwareForm.name || !hardwareForm.value) {
      showMessage('error', '请填写完整信息');
      return;
    }
    
    setSaving(true);
    try {
      if (hardwareDialog.editing) {
        await hardwareApi.update(hardwareDialog.editing.id, hardwareForm);
        showMessage('success', '硬件规格已更新');
      } else {
        await hardwareApi.create(hardwareForm);
        showMessage('success', '硬件规格已添加');
      }
      setHardwareDialog({ open: false });
      await loadAllData();
    } catch (error) {
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHardware = async () => {
    if (!deleteDialog) return;
    setSaving(true);
    try {
      await hardwareApi.delete(deleteDialog.id);
      showMessage('success', '硬件规格已删除');
      setDeleteDialog(null);
      await loadAllData();
    } catch (error) {
      showMessage('error', '删除失败');
    } finally {
      setSaving(false);
    }
  };

  // FAQ handlers
  const openFaqDialog = (faq?: FAQItem) => {
    if (faq) {
      setFaqForm({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      });
      setFaqDialog({ open: true, editing: faq });
    } else {
      setFaqForm({ question: '', answer: '', order: faqs.length });
      setFaqDialog({ open: true, editing: null });
    }
  };

  const handleSaveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      showMessage('error', '请填写完整信息');
      return;
    }
    
    setSaving(true);
    try {
      if (faqDialog.editing) {
        await faqApi.update(faqDialog.editing.id, faqForm);
        showMessage('success', 'FAQ已更新');
      } else {
        await faqApi.create(faqForm);
        showMessage('success', 'FAQ已添加');
      }
      setFaqDialog({ open: false });
      await loadAllData();
    } catch (error) {
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async () => {
    if (!deleteDialog) return;
    setSaving(true);
    try {
      await faqApi.delete(deleteDialog.id);
      showMessage('success', 'FAQ已删除');
      setDeleteDialog(null);
      await loadAllData();
    } catch (error) {
      showMessage('error', '删除失败');
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">首页设置</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">联系方式</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">功能管理</span>
            </TabsTrigger>
            <TabsTrigger value="hardware" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">硬件规格</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQ管理</span>
            </TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>首页内容设置</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">修改首页Hero区域展示的内容</p>
                  </div>
                  <Button onClick={handleSaveHero} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? '保存中...' : '保存更改'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    placeholder="?299"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>联系方式设置</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">管理公司联系信息，将显示在网站底部</p>
                  </div>
                  <Button onClick={handleSaveContact} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? '保存中...' : '保存更改'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="phone">公司电话</Label>
                  <Input
                    id="phone"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="400-xxx-xxxx"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">公司邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">公司地址</Label>
                  <Textarea
                    id="address"
                    value={contactData.address}
                    onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                    placeholder="xx省xx市xx区xx路xx号"
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="wechat">客服微信</Label>
                  <Input
                    id="wechat"
                    value={contactData.wechat}
                    onChange={(e) => setContactData({ ...contactData, wechat: e.target.value })}
                    placeholder="微信号或微信二维码链接"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>功能特性管理</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">管理首页展示的功能特性列表</p>
                  </div>
                  <Button onClick={() => openFeatureDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    添加功能
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={feature.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{feature.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{feature.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openFeatureDialog(feature)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteDialog({ open: true, type: 'feature', id: feature.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>暂无功能特性，点击上方按钮添加</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hardware Tab */}
          <TabsContent value="hardware" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>硬件规格管理</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">管理产品硬件规格参数</p>
                  </div>
                  <Button onClick={() => openHardwareDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    添加规格
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hardwareSpecs.map((spec, index) => (
                    <div key={spec.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                        <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{spec.name}</h4>
                        <p className="text-sm text-gray-500 truncate">
                          {spec.value} {(spec as any).unit || ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openHardwareDialog(spec)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteDialog({ open: true, type: 'hardware', id: spec.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {hardwareSpecs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Cpu className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>暂无硬件规格，点击上方按钮添加</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>FAQ管理</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">管理常见问题解答</p>
                  </div>
                  <Button onClick={() => openFaqDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    添加FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={faq.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 pt-1">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                        <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{faq.question}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Button variant="ghost" size="sm" onClick={() => openFaqDialog(faq)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteDialog({ open: true, type: 'faq', id: faq.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {faqs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <HelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>暂无FAQ，点击上方按钮添加</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Feature Dialog */}
      <Dialog open={featureDialog.open} onOpenChange={(open) => setFeatureDialog({ ...featureDialog, open })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{featureDialog.editing ? '编辑功能' : '添加功能'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feature-title">标题</Label>
              <Input
                id="feature-title"
                value={featureForm.title}
                onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                placeholder="功能名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature-desc">描述</Label>
              <Textarea
                id="feature-desc"
                value={featureForm.description}
                onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                placeholder="功能描述"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature-icon">图标</Label>
              <Input
                id="feature-icon"
                value={featureForm.icon}
                onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                placeholder="图标名称（如：BarChart3）"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature-order">排序</Label>
              <Input
                id="feature-order"
                type="number"
                value={featureForm.order}
                onChange={(e) => setFeatureForm({ ...featureForm, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeatureDialog({ open: false })}>
              取消
            </Button>
            <Button onClick={handleSaveFeature} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hardware Dialog */}
      <Dialog open={hardwareDialog.open} onOpenChange={(open) => setHardwareDialog({ ...hardwareDialog, open })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{hardwareDialog.editing ? '编辑硬件规格' : '添加硬件规格'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hardware-name">名称</Label>
              <Input
                id="hardware-name"
                value={hardwareForm.name}
                onChange={(e) => setHardwareForm({ ...hardwareForm, name: e.target.value })}
                placeholder="如：处理器、内存"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hardware-value">数值</Label>
                <Input
                  id="hardware-value"
                  value={hardwareForm.value}
                  onChange={(e) => setHardwareForm({ ...hardwareForm, value: e.target.value })}
                  placeholder="如：8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hardware-unit">单位</Label>
                <Input
                  id="hardware-unit"
                  value={hardwareForm.unit}
                  onChange={(e) => setHardwareForm({ ...hardwareForm, unit: e.target.value })}
                  placeholder="如：GB、GHz"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hardware-order">排序</Label>
              <Input
                id="hardware-order"
                type="number"
                value={hardwareForm.order}
                onChange={(e) => setHardwareForm({ ...hardwareForm, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHardwareDialog({ open: false })}>
              取消
            </Button>
            <Button onClick={handleSaveHardware} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialog.open} onOpenChange={(open) => setFaqDialog({ ...faqDialog, open })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{faqDialog.editing ? '编辑FAQ' : '添加FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">问题</Label>
              <Input
                id="faq-question"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                placeholder="输入问题"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-answer">答案</Label>
              <Textarea
                id="faq-answer"
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                placeholder="输入答案"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-order">排序</Label>
              <Input
                id="faq-order"
                type="number"
                value={faqForm.order}
                onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialog({ open: false })}>
              取消
            </Button>
            <Button onClick={handleSaveFaq} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog?.open || false} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-gray-600">
            确定要删除这个{deleteDialog?.type === 'feature' ? '功能' : deleteDialog?.type === 'hardware' ? '硬件规格' : 'FAQ'}吗？此操作无法撤销。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              取消
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (deleteDialog?.type === 'feature') handleDeleteFeature();
                else if (deleteDialog?.type === 'hardware') handleDeleteHardware();
                else if (deleteDialog?.type === 'faq') handleDeleteFaq();
              }}
              disabled={saving}
            >
              {saving ? '删除中...' : '删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
