pipeline {
  agent any
  
  environment {
      DOCKER_IMAGE = "devwalex/e-wallet-system"
      NODE_ENV   = 'production'
      APP_URL    = 'http://0.0.0.0:3000'
      PORT       = '3000'
      HOST       = '0.0.0.0'

      DB_USER     = credentials('db-user')
      DB_PASSWORD = credentials('db-password')
      DB_NAME     = 'e_wallet_system'
      DB_HOST     = 'db'
      DB_PORT     = '3306'

      APP_SECRET_KEY = credentials('app-secret-key')
      FLUTTERWAVE_KEY = credentials('flutterwave-key')

      TEST_DB_USER     = credentials('db-user')
      TEST_DB_PASSWORD = credentials('db-password')
      TEST_DB_NAME     = 'e_wallet_system'
      TEST_DB_HOST     = 'db'
      TEST_DB_PORT     = '3306'
  }
  stages {

    stage('Fetch Tags') {
      steps {
        echo 'Fetching tags...'
        // checkout scm
        sh 'git fetch --tags'
      }
    }

    stage('Get Version') {
      steps {
          script {
              // Get the latest Git tag (e.g., 1.2.0)
                try {
                  VERSION = sh(script: "git describe --tags --abbrev=0", returnStdout: true).trim()
                } catch (err) {
                  echo "⚠️ No git tags found, falling back to 0.0.1"
                  VERSION = "0.0.1"
                }
              
              // Optional: Append Jenkins build number for traceability
              BUILD_VERSION = "${VERSION}-${env.BUILD_NUMBER}"

              echo "Release version: ${VERSION}"
              echo "Build version: ${BUILD_VERSION}"
          }
      }
    }

    stage('Build Docker Image') {
      steps {
        echo 'Building...'
        sh """
            docker build -t ${DOCKER_IMAGE}:${VERSION} .
            docker build -t ${DOCKER_IMAGE}:latest .
        """
      }
    }

    stage('Test') {
      steps {
            sh """
              echo "Running integration tests..."
              docker compose -f docker-compose.yml up -d
              sleep 10  # wait for services to start
              docker compose exec -T api npm run test || { docker compose -f docker-compose.yml down; exit 1; }
              docker compose -f docker-compose.yml down
          """
      }
    }

    stage('Push Docker Image') {
      steps {
          withCredentials([usernamePassword(credentialsId: 'docker-hub-creds',
                                            usernameVariable: 'DOCKER_USER',
                                            passwordVariable: 'DOCKER_PASS')]) {
              sh """
                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                docker push ${DOCKER_IMAGE}:${VERSION}
                docker push ${DOCKER_IMAGE}:latest
              """
          }
      }
    }



    // stage('Test') {
    //   when {
    //     expression {
    //       BRANCH_NAME == "test"
    //     }
    //   }
    //   steps {
    //     echo 'Testing Webhook...'
    //   }
    // }

    // stage('Deploy') {
    //   // when {
    //   //   expression {
    //   //     BRANCH_NAME == "deploy"
    //   //   }
    //   // }
    //   steps {
    //     echo 'Deploying...'
    //     script {
    //       def dockerCmd = 'docker run -p 3000:3000 -d devwalex/e-wallet-system:latest'
    //       sshagent(['ec2-server-key']) {
    //         sh "ssh -o StrictHostKeyChecking=no ec2-user@54.227.15.156 ${dockerCmd}" 
    //       }
    //     }
    //   }
    // }

  }
}