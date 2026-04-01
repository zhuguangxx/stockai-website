# 智投云官网 - 部署指南

## 技术栈

- **前端**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **后端/数据库**: Supabase (PostgreSQL + Auth)
- **部署**: GitHub + Vercel

---

## 部署步骤

### 第一步：创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并注册/登录账号
2. 点击 "New Project" 创建新项目
   - 项目名称: `stockai-website` (或自定义)
   - 数据库密码: 设置一个强密码并保存
3. 等待项目创建完成

### 第二步：初始化数据库

1. 在 Supabase 控制台中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase/schema.sql` 文件中的全部内容
4. 粘贴到 SQL Editor 中并点击 "Run"
5. 确认所有表都已创建成功

### 第三步：获取 Supabase 连接信息

1. 在 Supabase 控制台，点击左侧菜单的 "Project Settings"
2. 选择 "API" 标签页
3. 复制以下信息:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIs...`

### 第四步：创建管理员账号

1. 在 Supabase 控制台，点击左侧菜单的 "Authentication"
2. 点击 "Add user" 或 "Invite user"
3. 输入管理员邮箱和密码
4. 记下邮箱和密码，用于登录后台

### 第五步：部署到 Vercel

#### 方法 A: 通过 Vercel 网站部署 (推荐)

1. 访问 [Vercel](https://vercel.com) 并注册/登录账号
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 如果还没有上传代码到 GitHub:
   - 在 GitHub 创建新仓库 `stockai-website`
   - 将代码推送到仓库
5. 授权 Vercel 访问 GitHub 并选择该仓库
6. 配置项目:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
7. 添加环境变量:
   - `VITE_SUPABASE_URL`: 你的 Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: 你的 Supabase anon key
8. 点击 "Deploy"

#### 方法 B: 通过 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 在项目根目录执行
vercel

# 按照提示配置项目
# 设置环境变量:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 第六步：配置环境变量

如果部署时未设置环境变量，需要在 Vercel 控制台添加:

1. 进入 Vercel 项目控制台
2. 点击 "Settings" → "Environment Variables"
3. 添加以下变量:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. 点击 "Save" 并重新部署

---

## 项目结构

```
app/
├── src/
│   ├── admin/           # 后台管理页面
│   │   ├── Login.tsx    # 登录页面
│   │   └── AdminPanel.tsx # 管理面板
│   ├── components/      # UI 组件
│   ├── sections/        # 页面区块
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Hardware.tsx
│   │   ├── FAQ.tsx
│   │   └── Footer.tsx
│   ├── supabase/        # Supabase 客户端
│   │   └── client.ts
│   ├── types/           # TypeScript 类型
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 入口文件
├── supabase/
│   └── schema.sql       # 数据库初始化脚本
├── .env.example         # 环境变量示例
├── DEPLOY.md            # 本部署文档
└── README.md            # 项目说明
```

---

## 后台管理

- **后台地址**: `https://your-domain.com/admin`
- **登录账号**: 在 Supabase Auth 中创建的管理员邮箱
- **登录密码**: 对应的管理员密码

### 可自定义内容

1. **首页 Hero 区域**
   - 主标题
   - 副标题
   - 按钮文字
   - 价格显示

2. **功能特性** (需要数据库操作)
3. **硬件规格** (需要数据库操作)
4. **FAQ** (需要数据库操作)

---

## 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/stockai-website.git
cd stockai-website

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 Supabase 配置

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 常见问题

### Q: 如何修改功能特性/硬件规格/FAQ?

A: 目前需要通过 Supabase SQL Editor 直接修改数据库。未来版本将在后台添加完整编辑功能。

### Q: 部署后页面显示空白?

A: 检查:
1. 环境变量是否正确设置
2. Supabase 项目是否正常运行
3. 数据库表是否正确创建

### Q: 无法登录后台?

A: 检查:
1. 是否在 Supabase Auth 中创建了用户
2. 邮箱和密码是否正确
3. 浏览器控制台是否有错误信息

### Q: 如何绑定自定义域名?

A: 在 Vercel 项目设置中:
1. 点击 "Settings" → "Domains"
2. 输入你的域名并点击 "Add"
3. 按照提示配置 DNS 记录

---

## 技术支持

如有问题，请联系:
- 邮箱: support@stockai.com
- 电话: 400-888-8888
