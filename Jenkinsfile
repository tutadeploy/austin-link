pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'austin-link'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_HOST = 'unix:///var/run/docker.sock'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/tutadeploy/austin-link.git',
                    credentialsId: 'd440fbcb-17a4-4325-8bd9-396a65c189b2'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh """
                    export DOCKER_HOST=unix:///var/run/docker.sock
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                """
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
                    
                    # 使用宿主机的PM2
                    /usr/local/bin/pm2 restart ${DOCKER_IMAGE} || /usr/local/bin/pm2 start docker --name ${DOCKER_IMAGE} -- run ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }
    }
}