# 🎭 喜剧演员作品集网站

一个现代化的喜剧演员个人作品集网站，包含完整的前台展示和后台管理功能。

## ✨ 功能特色

### 🎪 前台功能
- **首页展示** - 个人介绍和亮点内容
- **演出安排** - 查看即将到来的演出信息
- **照片画廊** - 浏览演出照片和活动图片
- **联系方式** - 获取联系信息和社交媒体链接

### 🛠️ 后台管理
- **演出管理** - 添加、编辑、删除演出安排
- **媒体管理** - 上传和管理照片资源
- **个人资料** - 更新个人信息和社交链接
- **数据统计** - 查看网站访问和数据概览

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Material-UI (MUI)
- **状态管理**: React Hooks
- **路由**: React Router
- **后端服务**: Supabase (数据库 + 认证 + 存储)
- **样式**: CSS-in-JS + Tailwind CSS
- **部署**: 支持静态网站托管

## 📦 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境配置
创建 `.env` 文件并配置Supabase连接：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 开发运行
```bash
npm run dev
```

### 构建部署
```bash
npm run build
```

## 🗄️ 数据库结构

### 主要数据表
- `profiles` - 个人资料信息
- `shows` - 演出安排数据
- `show_types` - 演出类型分类
- `photos` - 照片媒体资源
- `events` - 活动事件记录

## 🌐 部署方案

### 静态网站托管（推荐）
- 腾讯云静态网站托管
- Vercel
- Netlify
- GitHub Pages

### 服务器部署
- 腾讯云CVM
- 阿里云ECS
- 其他云服务商

## 📱 响应式设计

网站完全支持响应式设计，在以下设备上都有良好体验：
- 🖥️ 桌面端 (1200px+)
- 💻 笔记本 (768px-1199px)
- 📱 平板 (576px-767px)
- 📱 手机 (575px以下)

## 🔒 安全特性

- JWT身份认证
- 行级安全策略 (RLS)
- 环境变量保护
- CORS跨域配置
- 输入验证和过滤

## 🎨 设计特色

- 现代简洁的界面设计
- 流畅的动画效果
- 直观的用户交互
- 无障碍访问支持
- 深色/浅色主题切换

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: your-email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

⭐ 如果这个项目对您有帮助，请给个星标支持！