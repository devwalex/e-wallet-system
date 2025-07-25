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
        echo 'Testing...'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploying...'
      }
    }

  }
}