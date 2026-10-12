
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKERHUB_USERNAME = 'junaid404'
        IMAGE_NAME = 'junaid404/cloudflow-dashboard'
        KUBECONFIG = 'C:/Windows/System32/config/systemprofile/.kube/config'
    }
    

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Application') {
            steps {
                bat 'node --check app.js'
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    bat '''
                        @echo off
                        echo %DOCKERHUB_TOKEN% | docker login -u %DOCKERHUB_USER% --password-stdin
                        if errorlevel 1 exit /b 1

                        docker push %IMAGE_NAME%:%BUILD_NUMBER%
                        if errorlevel 1 exit /b 1

                        docker push %IMAGE_NAME%:latest
                        if errorlevel 1 exit /b 1

                        docker logout
                    '''
                }
            }
        }
        stage('Diagnose Kubernetes') {
    steps {
        bat '''
            whoami
            where kubectl
            kubectl config current-context
            kubectl config view --minify
            kubectl get nodes
        '''
    }
}

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s/deployment.yaml'
                bat 'kubectl apply -f k8s/service.yaml'

                bat 'kubectl set image deployment/cloudflow-deployment cloudflow-container=%IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'kubectl rollout status deployment/cloudflow-deployment --timeout=180s'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get deployments'
                bat 'kubectl get pods -o wide'
                bat 'kubectl get services cloudflow-service'
            }
        }
        
    }

    post {
        success {
            echo 'CloudFlow pipeline completed successfully.'
        }
        failure {
            echo 'CloudFlow pipeline failed. Check the stage logs for the cause.'
        }
        always {
            echo 'Pipeline execution finished.'
        }
    }
}
