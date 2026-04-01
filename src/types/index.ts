// 网站内容类型定义
export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'html' | 'json';
  updated_at: string;
}

// Hero区域内容
export interface HeroContent {
  mainTitle: string;
  subTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  price: string;
}

// 功能特性
export interface Feature {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

// 硬件规格
export interface HardwareSpec {
  id: string;
  name: string;
  value: string;
  order: number;
}

// FAQ项目
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

// 用户信息
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

// 导航项
export interface NavItem {
  label: string;
  href: string;
}
