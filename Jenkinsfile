pipeline {
    agent any

    parameters {
        choice(
            name: 'TARGET_COLOR',
            choices: ['blue', 'green'],
            description: 'Release environment to update and activate'
        )
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
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
                bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% .'
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

                        docker logout
                    '''
                }
            }
        }

        stage('Check Kubernetes Access') {
            steps {
                bat 'kubectl config current-context'
                bat 'kubectl get nodes'
            }
        }

        stage('Deploy Selected Environment') {
            steps {
                bat 'kubectl set image deployment/cloudflow-%TARGET_COLOR% cloudflow-container=%IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'kubectl rollout status deployment/cloudflow-%TARGET_COLOR% --timeout=180s'
            }
        }

        stage('Activate Release') {
            steps {
                script {
                    if (params.TARGET_COLOR == 'blue') {
                        bat 'kubectl apply -f k8s/service-blue.yaml'
                    } else {
                        bat 'kubectl apply -f k8s/service-green.yaml'
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get deployments'
                bat 'kubectl get pods -l app=cloudflow-dashboard -o wide'
                bat 'kubectl get service cloudflow-service'
                bat 'kubectl get endpoints cloudflow-service'
            }
        }
    }

    post {
        success {
            echo "Successfully deployed and activated ${params.TARGET_COLOR}."
        }
        failure {
            echo 'Pipeline failed. Check the stage logs and active Service selector.'
        }
        always {
            echo 'Pipeline execution finished.'
        }
    }
}