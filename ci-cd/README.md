# Blogzy

## Overview
Blogzy is a Flask-based web application that allows users to create, read, update, and delete blog posts. The application is containerized using Docker and deployed on Kubernetes, with a CI/CD pipeline set up using Jenkins for automated builds and deployments. 📦

## Features
- User authentication and authorization 🔐
- Create, edit, and delete blog posts 📝
- Responsive design using Bootstrap 📱
- RESTful API for blog management 🌐
- CI/CD integration for automated deployments ⚙️

## Prerequisites
- Docker installed 🐳
- Minikube installed 🖥️
- Jenkins installed and running 🔧
- Python 3.10 or higher 🐍

## Installation

### Clone the Repository
```bash
git clone https://github.com/Flack74/Blogzy.git
cd Blogzy
```

### Setup Python Environment
1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application Locally
To run the application locally, set the environment variable for Flask and start the server:
```bash
export FLASK_APP=main.py
flask run --host=0.0.0.0 --port=5003
```
Visit `http://localhost:5003` in your browser. 🌍

## Docker Setup

### Build the Docker Image
```bash
docker build -t your-dockerhub-username/blogzy .
```

### Run the Docker Container
```bash
docker run -p 5003:5003 your-dockerhub-username/blogzy
```
Visit `http://localhost:5003` in your browser. 🌐

## Kubernetes Deployment

### Using Minikube
1. Start Minikube:
   ```bash
   minikube start
   ```

2. Apply Kubernetes configurations:
   ```bash
   kubectl apply -f k8s/
   ```

3. Access the application:
   ```bash
   minikube service blogzy-service --url
   ```

## CI/CD Pipeline with Jenkins
The CI/CD pipeline is configured to automate the building and deployment of the Blogzy application using Jenkins. 🔄

### Jenkins Setup
1. Create a new pipeline job in Jenkins.
2. Use the `Jenkinsfile` provided in the repository to configure the pipeline.
3. Ensure that Jenkins has access to your Docker Hub account to push images.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 📄
