import { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqApi } from '@/supabase/client';
import type { FAQItem } from '@/types';

const defaultFAQs: FAQItem[] = [
  {
    id: '1',
    question: '需要联网吗？',
    answer: '需要联网获取实时行情数据，但分析历史和报告查看可以离线。',
    order: 1,
  },
  {
    id: '2',
    question: '家里没有固定IP怎么办？',
    answer: '智投云支持内网穿透，没有固定IP也能在外访问。',
    order: 2,
  },
  {
    id: '3',
    question: '订阅服务必须买吗？',
    answer: '基础功能永久免费，订阅服务是增强功能。',
    order: 3,
  },
  {
    id: '4',
    question: '可以多人同时使用吗？',
    answer: '一台设备支持全家多人共享使用，无需额外购买会员。',
    order: 4,
  },
  {
    id: '5',
    question: '数据安全吗？',
    answer: '所有数据本地存储，不上传云端，保障您的投资隐私安全。',
    order: 5,
  },
  {
    id: '6',
    question: '支持哪些设备访问？',
    answer: '手机、电脑、平板均可访问，只需连接家中WiFi，浏览器打开即可使用。',
    order: 6,
  },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const data = await faqApi.getAll();
      if (data.length > 0) {
        setFaqs(data);
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            常见问题
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            有疑问？我们来解答
          </h2>
          <p className="text-lg text-gray-600">
            关于智投云的常见问题解答
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-200 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            还有其他问题？
          </p>
          <a
            href="mailto:support@stockai.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            联系我们的客服团队
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </section>
  );
}
