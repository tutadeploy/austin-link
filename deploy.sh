#!/bin/bash

# 开启详细日志
set -x

# 设置变量
DOCKER_IMAGE="austin-link"
DOCKER_TAG="${BUILD_NUMBER}"

# 确保有执行权限
sudo chmod 666 /var/run/docker.sock

echo "Starting deployment process..."

# 构建Docker镜像
echo "Building Docker image..."
docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} . || {
    echo "Docker build failed"
    exit 1
}

# 停止并删除旧容器（如果存在）
echo "Stopping and removing old container..."
docker stop ${DOCKER_IMAGE} || true
docker rm ${DOCKER_IMAGE} || true

# 运行新容器
echo "Starting new container..."
docker run -d \
    --name ${DOCKER_IMAGE} \
    -p 8090:8090 \
    --restart unless-stopped \
    ${DOCKER_IMAGE}:${DOCKER_TAG} || {
    echo "Docker run failed"
    exit 1
}

# 使用宿主机的PM2重启应用
echo "Configuring PM2..."
/usr/local/bin/pm2 restart ${DOCKER_IMAGE} || /usr/local/bin/pm2 start docker --name ${DOCKER_IMAGE} -- run ${DOCKER_IMAGE}:${DOCKER_TAG}

echo "Deployment completed"
