#!/bin/bash

# 开启详细日志
set -x

# 设置变量
DOCKER_IMAGE="austin-link"
DOCKER_TAG="7"

echo "Starting deployment process..."

# 构建Docker镜像
echo "Building Docker image..."
docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .

# 停止并删除旧容器
docker stop ${DOCKER_IMAGE} || true
docker rm ${DOCKER_IMAGE} || true

# 运行新容器
docker run -d \
    --name ${DOCKER_IMAGE} \
    -p 8090:8090 \
    --restart unless-stopped \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /usr/local/bin/pm2:/usr/local/bin/pm2 \
    -e PM2_HOME=/root/.pm2 \
    ${DOCKER_IMAGE}:${DOCKER_TAG}

# 使用PM2管理
pm2 restart ${DOCKER_IMAGE} || pm2 start docker --name ${DOCKER_IMAGE} -- run ${DOCKER_IMAGE}:${DOCKER_TAG}

echo "Deployment completed"
