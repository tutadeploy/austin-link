# 使用Node.js 20.18.0作为基础镜像
FROM node:20.18.0-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 8090

# 启动命令
CMD ["npm", "start"]
