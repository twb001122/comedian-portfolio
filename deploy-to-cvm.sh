#!/bin/bash

# 腾讯云CVM部署脚本
echo "开始配置腾讯云服务器..."

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Nginx
sudo apt install nginx -y

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 创建网站目录
sudo mkdir -p /var/www/comedian-portfolio

# 设置权限
sudo chown -R $USER:$USER /var/www/comedian-portfolio
sudo chmod -R 755 /var/www/comedian-portfolio

# 配置Nginx
sudo tee /etc/nginx/sites-available/comedian-portfolio > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名或服务器IP
    root /var/www/comedian-portfolio;
    index index.html;

    # 支持React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# 启用站点
sudo ln -sf /etc/nginx/sites-available/comedian-portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 配置防火墙
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

echo "服务器配置完成！"
echo "请将dist目录下的文件上传到 /var/www/comedian-portfolio/"
echo "上传命令示例："
echo "scp -r ./dist/* root@your-server-ip:/var/www/comedian-portfolio/"