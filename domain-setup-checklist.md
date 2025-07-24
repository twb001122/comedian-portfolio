# 腾讯云域名绑定Vercel检查清单

## ✅ Vercel配置
- [ ] 1. 登录Vercel Dashboard
- [ ] 2. 进入项目Settings → Domains
- [ ] 3. 添加自定义域名
- [ ] 4. 记录DNS配置要求

## 🌐 腾讯云DNS配置
- [ ] 1. 登录腾讯云控制台
- [ ] 2. 进入DNS解析 DNSPod
- [ ] 3. 添加CNAME记录:
  - [ ] 类型: CNAME
  - [ ] 主机记录: www
  - [ ] 记录值: cname.vercel-dns.com
  - [ ] TTL: 600
- [ ] 4. 添加根域名记录:
  - [ ] 类型: CNAME  
  - [ ] 主机记录: @
  - [ ] 记录值: cname.vercel-dns.com
  - [ ] TTL: 600

## 🔒 SSL和安全配置
- [ ] 1. 等待Vercel自动配置SSL证书
- [ ] 2. 验证HTTPS访问正常
- [ ] 3. 配置安全头部（vercel.json）

## 🗄️ Supabase配置更新
- [ ] 1. 更新Site URL为新域名
- [ ] 2. 添加新域名到Additional URLs
- [ ] 3. 更新Authentication重定向URL

## 🧪 测试验证
- [ ] 1. 访问 https://yourname.com
- [ ] 2. 访问 https://www.yourname.com  
- [ ] 3. 测试网站所有功能
- [ ] 4. 测试管理后台登录
- [ ] 5. 验证移动端访问

## 📊 性能优化
- [ ] 1. 配置CDN缓存策略
- [ ] 2. 启用Gzip压缩
- [ ] 3. 优化图片加载
- [ ] 4. 配置浏览器缓存

## 🔍 SEO配置
- [ ] 1. 配置网站地图
- [ ] 2. 设置robots.txt
- [ ] 3. 添加Google Analytics（可选）
- [ ] 4. 配置Open Graph标签

## 💰 费用说明
- 腾讯云域名: 按年付费
- Vercel托管: 个人项目免费
- DNS解析: 免费
- SSL证书: 免费（Let's Encrypt）

## 📞 故障排除
如果域名无法访问：
1. 检查DNS解析是否生效
2. 验证Vercel域名配置
3. 检查防火墙设置
4. 联系腾讯云技术支持

## 🎉 完成后
域名配置成功后，您将拥有：
- 专业的自定义域名
- 自动HTTPS加密
- 全球CDN加速
- 高可用性保障