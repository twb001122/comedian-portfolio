#!/bin/bash

# 上传文件到腾讯云服务器脚本
# 使用前请修改服务器IP地址

SERVER_IP="your-server-ip"  # 替换为您的服务器IP
SERVER_USER="root"          # 服务器用户名
REMOTE_PATH="/var/www/comedian-portfolio/"

echo "开始上传文件到腾讯云服务器..."

# 确保dist目录存在
if [ ! -d "dist" ]; then
    echo "dist目录不存在，正在构建项目..."
    npm run build
fi

# 上传文件
echo "上传网站文件..."
scp -r ./dist/* $SERVER_USER@$SERVER_IP:$REMOTE_PATH

# 设置权限
echo "设置文件权限..."
ssh $SERVER_USER@$SERVER_IP "chown -R www-data:www-data $REMOTE_PATH && chmod -R 755 $REMOTE_PATH"

echo "部署完成！"
echo "访问地址: http://$SERVER_IP"