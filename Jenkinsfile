pipeline {
  agent { label 'api' }
  environment {
    GITHUB_SECRETS = credentials('GITHUB_SECRETS')
    GITHUB_ENV = credentials('GITHUB_ENV')
  }
  parameters {
    choice(name: 'env', choices: ['dev', 'test', 'live'], description: 'Environment to run tests on')
    string(name: 'multienv', defaultValue: '', description: 'Other environment (for multi-environment setup)')
  }
  stages {
    stage('Run tests against Pantheon') {
      steps {
        sh './scripts/test-against-pantheon.sh'
      }
    }
  }
}

