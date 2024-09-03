pipeline {
    agent any

    environment {
        GIT_PAT = credentials('githubPat')
        DOCKERHUB_CREDS = credentials('dockerhub')
    }

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/EKmaster/barber_proj.git',
                    branch: 'main',
                    credentialsId: 'githubPat'
                )
            }
        }

        stage('Install Dependencies and Run Tests') {
            steps {
                dir('server') {
                    bat 'npm install'
                    bat 'npm run test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker build -t ekmaster/nextjs-app ./client'
                bat 'docker build -t ekmaster/express-app ./server'
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    bat 'docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%'
                    bat 'docker push ekmaster/nextjs-app'
                    bat 'docker push ekmaster/express-app'
                }
            }
        }
        
        stage('Deploy to EC2') {
    steps {
        withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'my-aws-creds', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
            bat '''
            aws ssm send-command ^
                --region us-east-1 ^
                --document-name "AWS-RunShellScript" ^
                --targets "Key=instanceids,Values=i-05744b4dfa9b151ff" ^
                --parameters commands="docker stop backend frontend || true; docker rm backend frontend || true; docker rmi ekmaster/nextjs-app ekmaster/express-app || true; docker run -d --name backend --network app-network ekmaster/express-app; docker run -d --name frontend --network app-network ekmaster/nextjs-app"
            '''
        }
    }
}


    }
}
