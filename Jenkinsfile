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
      }
    }

  }
}