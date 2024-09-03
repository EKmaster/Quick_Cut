pipeline {
    agent any
    
    environment {
        GIT_REPO_URL = 'https://github.com/EKmaster/barber_proj'
        GIT_BRANCH = 'main'
        GIT_REPO_NAME = "barber_proj"
        DOCKERHUB_CREDS = credentials("dockerhub")
        GITHUB_CREDS = credentials("github")
    }

    stages {        
        stage("clone repository"){
            steps {
                git branch: "${GIT_BRANCH}",
                    url: "${GIT_REPO_URL}",
                    credentialsId: "${GITHUB_CREDS}"
            }
        }
        
        stage("build docker image"){
            steps {
                script {
                    dir ("${GIT_REPO_NAME}"){
                        dir ("client"){
                            def clientImage = docker.build("client-image")
                            clientImage.push("latest")
                            
                        }
                        dir ("server"){
                            def serverimage = docker.build("server-image")
                            clientImage.push("latest")
                            
                        }
                        dir ("nginx"){
                            def nginxImage = docker.build("nginx-image")
                            clientImage.push("latest")                  
                        }
                    }
                }
            }
        }
    }
}