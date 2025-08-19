pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Building...'
        sh 'echo "Executing pipeline for branch $BRANCH_NAME" '
      }
    }

    stage('Test') {
      when {
        expression {
          BRANCH_NAME == "test"
        }
      }
      steps {
        echo 'Testing Webhook...'
      }
    }

    stage('Deploy') {
      when {
        expression {
          BRANCH_NAME == "deploy"
        }
      }
      steps {
        echo 'Deploying...'
        script {
          def dockerCmd = 'docker run -p 3000:3000 -d devwalex/e-wallet-system:latest'
          sshagent(['ec2-server-key']) {
            sh "ssh -o StrictHostKeyChecking=no ec2-user@54.227.15.156 ${dockerCmd}" 
          }
        }
      }
    }

  }
}