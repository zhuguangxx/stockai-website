import { createClient } from '@supabase/supabase-js';
import type { SiteContent, Feature, HardwareSpec, FAQItem } from '@/types';

// 这些环境变量需要在Vercel中配置
// 注意：VITE_ 开头的变量需要在构建时注入
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://psjifolrwvdhsvcafuyq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzamlmb2xyd3ZkaHN2Y2FmdXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0OTYwMDAsImV4cCI6MjA1OTA3MjAwMH0.tCpR86WdRh5ESNZ8pg4XOQ_mOYz5vPW7Z5HjRj6tX4Y';

// 检查是否配置了Supabase
const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// 网站内容API
export const siteContentApi = {
  // 获取所有内容
  async getAllContent(): Promise<SiteContent[]> {
    if (!isConfigured) return [];
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // 按section获取内容
  async getContentBySection(section: string): Promise<SiteContent[]> {
    if (!isConfigured) return [];
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', section);
    
    if (error) throw error;
    return data || [];
  },

  // 获取单个内容项
  async getContent(section: string, key: string): Promise<SiteContent | null> {
    if (!isConfigured) return null;
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', section)
      .eq('key', key)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // 更新内容
  async updateContent(section: string, key: string, value: string): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('site_content')
      .upsert({
        section,
        key,
        value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'section,key'
      });
    
    if (error) throw error;
  },

  // 批量更新内容
  async batchUpdateContent(items: { section: string; key: string; value: string }[]): Promise<void> {
    if (!isConfigured) return;
    const updates = items.map(item => ({
      ...item,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('site_content')
      .upsert(updates, {
        onConflict: 'section,key'
      });
    
    if (error) throw error;
  }
};

// 功能特性API
export const featuresApi = {
  async getAll(): Promise<Feature[]> {
    if (!isConfigured) return [];
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<Feature>): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('features')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  async create(feature: Omit<Feature, 'id'>): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('features')
      .insert(feature);
    
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 硬件规格API
export const hardwareApi = {
  async getAll(): Promise<HardwareSpec[]> {
    if (!isConfigured) return [];
    const { data, error } = await supabase
      .from('hardware_specs')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<HardwareSpec>): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('hardware_specs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  async create(spec: Omit<HardwareSpec, 'id'>): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('hardware_specs')
      .insert(spec);
    
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('hardware_specs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// FAQ API
export const faqApi = {
  async getAll(): Promise<FAQItem[]> {
    if (!isConfigured) return [];
    const { data, error } = await supabase
      .from('faq_items')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<FAQItem>): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('faq_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  async create(faq: Omit<FAQItem, 'id'>): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('faq_items')
      .insert(faq);
    
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    if (!isConfigured) return;
    const { error } = await supabase
      .from('faq_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 认证API
export const authApi = {
  async signIn(email: string, password: string) {
    if (!isConfigured) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!isConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    if (!isConfigured) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isConfigured) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  }
};
