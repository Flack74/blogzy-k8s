# CI/CD for Blogzy

This directory contains the CI/CD pipeline setup for the Blogzy application using Jenkins, Docker, and Kubernetes.

## Contents
- **Jenkinsfile**: Defines the CI/CD pipeline for building and deploying the application.
- **Dockerfile**: Specifies how to build the Docker image for the Flask application.
- **minikube-setup.sh**: A script to set up and deploy the application on Minikube.
- **README.md**: Documentation for the CI/CD setup.

## Getting Started

### Prerequisites
- Docker installed
- Minikube installed
- Jenkins installed

### Running the Pipeline
1. Start Jenkins and create a new pipeline project.
2. Point to the `Jenkinsfile` in this directory.
3. Run the pipeline to build, push, and deploy the application.

### Local Development with Minikube
- Run the `minikube-setup.sh` script to set up the Minikube environment and deploy the application.

## License
This project is licensed under the Apache License 2.0. See the [LICENSE](../LICENSE) file for details. 📄
