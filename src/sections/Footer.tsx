import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, TrendingUp } from 'lucide-react';
import { siteContentApi } from '@/supabase/client';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  wechat: string;
}

const defaultContact: ContactInfo = {
  phone: '400-xxx-xxxx',
  email: 'support@stockai.com',
  address: '请配置公司地址',
  wechat: '',
};

const footerLinks = {
  product: [
    { label: '功能介绍', href: '#features' },
    { label: '硬件方案', href: '#hardware' },
    { label: ' pricing', href: '#hardware' },
    { label: '更新日志', href: '#' },
  ],
  support: [
    { label: '帮助中心', href: '#' },
    { label: '使用教程', href: '#' },
    { label: '常见问题', href: '#faq' },
    { label: '联系客服', href: '#' },
  ],
  company: [
    { label: '关于我们', href: '#' },
    { label: '加入我们', href: '#' },
    { label: '合作伙伴', href: '#' },
    { label: '新闻动态', href: '#' },
  ],
  legal: [
    { label: '服务条款', href: '#' },
    { label: '隐私政策', href: '#' },
    { label: '免责声明', href: '#' },
  ],
};

export default function Footer() {
  const [contact, setContact] = useState<ContactInfo>(defaultContact);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const contactData = await siteContentApi.getContentBySection('contact');
      const contactMap: Record<string, string> = {};
      contactData.forEach((item) => {
        contactMap[item.key] = item.value;
      });
      setContact({
        phone: contactMap.phone || defaultContact.phone,
        email: contactMap.email || defaultContact.email,
        address: contactMap.address || defaultContact.address,
        wechat: contactMap.wechat || defaultContact.wechat,
      });
    } catch (error) {
      console.error('Failed to load contact info:', error);
    }
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">智投云</span>
                <span className="text-xs text-blue-400 ml-1">StockAI</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              AI驱动的个人投资助手，让数据为你赚钱。一台设备，全家受益。
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{contact.address}</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">产品</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">支持</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">公司</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">法律</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 智投云 StockAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400">
                服务条款
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400">
                隐私政策
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-400">
                Cookie设置
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
