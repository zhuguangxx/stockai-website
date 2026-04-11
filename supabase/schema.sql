-- 智投云网站 - Supabase 数据库 Schema
-- 执行此SQL文件来初始化数据库表结构

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 网站内容表 (用于存储可自定义的文本内容)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section VARCHAR(50) NOT NULL,  -- 页面区域: hero, features, etc.
  key VARCHAR(100) NOT NULL,     -- 内容键名
  value TEXT NOT NULL,           -- 内容值
  type VARCHAR(20) DEFAULT 'text', -- 内容类型: text, html, json
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key)
);

-- 2. 功能特性表
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,     -- 功能代号: MACD, MA, KDJ, etc.
  title VARCHAR(200) NOT NULL,   -- 功能标题
  description TEXT NOT NULL,     -- 功能描述
  icon VARCHAR(50) NOT NULL,     -- 图标名称
  "order" INTEGER DEFAULT 0,     -- 排序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 硬件规格表
CREATE TABLE IF NOT EXISTS hardware_specs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,    -- 规格名称
  value VARCHAR(500) NOT NULL,   -- 规格值
  unit VARCHAR(50),              -- 单位（可选）
  "order" INTEGER DEFAULT 0,     -- 排序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FAQ表
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,        -- 问题
  answer TEXT NOT NULL,          -- 答案
  "order" INTEGER DEFAULT 0,     -- 排序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为各表添加更新时间触发器
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_features_updated_at
  BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hardware_specs_updated_at
  BEFORE UPDATE ON hardware_specs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 设置 RLS (Row Level Security) 策略
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE hardware_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "Allow public read access" ON site_content
  FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON features
  FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON hardware_specs
  FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON faq_items
  FOR SELECT USING (true);

-- 只允许认证用户修改
CREATE POLICY "Allow authenticated users to modify" ON site_content
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to modify" ON features
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to modify" ON hardware_specs
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to modify" ON faq_items
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 插入默认数据

-- 首页 Hero 内容
INSERT INTO site_content (section, key, value, type) VALUES
  ('hero', 'mainTitle', '让数据为你赚钱', 'text'),
  ('hero', 'subTitle', '6大技术指标专家 + AI智能分析 + 家庭共享 / 一台设备，全家受益', 'text'),
  ('hero', 'ctaPrimary', '立即了解', 'text'),
  ('hero', 'ctaSecondary', '查看功能演示', 'text'),
  ('hero', 'price', '?299', 'text')
ON CONFLICT (section, key) DO NOTHING;

-- 功能特性
INSERT INTO features (name, title, description, icon, "order") VALUES
  ('MACD', 'MACD趋势判断', '捕捉金叉死叉信号，识别趋势转折点', 'Activity', 1),
  ('MA', '均线系统分析', '判断多头排列/空头排列，确认趋势方向', 'MovingAverage', 2),
  ('KDJ', 'KDJ超买超卖', '监测短线超买超卖状态，捕捉反弹机会', 'LineChart', 3),
  ('CCI', 'CCI异常波动', '识别价格异常波动，发现潜在反转信号', 'BarChart3', 4),
  ('EXPMA', 'EXPMA平滑均线', '指数平滑移动平均线，快速响应价格变化', 'TrendingUp', 5),
  ('AI', 'AI智能决策', '综合6大专家意见，给出最终投资建议', 'Brain', 6)
ON CONFLICT DO NOTHING;

-- 硬件规格
INSERT INTO hardware_specs (name, value, "order") VALUES
  ('N100四核处理器', '流畅运行分析引擎', 1),
  ('8GB内存', '支持多任务并行', 2),
  ('256GB固态硬盘', '存储5年历史数据', 3),
  ('低功耗设计', '24小时运行不费电', 4),
  ('预装系统', '插电联网即用', 5)
ON CONFLICT DO NOTHING;

-- FAQ
INSERT INTO faq_items (question, answer, "order") VALUES
  ('需要联网吗？', '需要联网获取实时行情数据，但分析历史和报告查看可以离线。', 1),
  ('家里没有固定IP怎么办？', '智投云支持内网穿透，没有固定IP也能在外访问。', 2),
  ('订阅服务必须买吗？', '基础功能永久免费，订阅服务是增强功能。', 3),
  ('可以多人同时使用吗？', '一台设备支持全家多人共享使用，无需额外购买会员。', 4),
  ('数据安全吗？', '所有数据本地存储，不上传云端，保障您的投资隐私安全。', 5),
  ('支持哪些设备访问？', '手机、电脑、平板均可访问，只需连接家中WiFi，浏览器打开即可使用。', 6)
ON CONFLICT DO NOTHING;
