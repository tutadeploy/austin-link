pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'austin-link'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }
        
        stage('Deploy with PM2') {
            steps {
                sh """
                    # 停止并删除旧容器（如果存在）
                    docker stop ${DOCKER_IMAGE} || true
                    docker rm ${DOCKER_IMAGE} || true
                    
                    # 运行新容器
                    docker run -d \
                        --name ${DOCKER_IMAGE} \
                        -p 8090:8090 \
                        --restart unless-stopped \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                    
                    # 使用PM2重启应用
                    pm2 restart ${DOCKER_IMAGE} || pm2 start docker --name ${DOCKER_IMAGE} -- run ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
} 