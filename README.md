# Blogzy - Modern Kubernetes Blog Platform

![Blogzy Logo](https://via.placeholder.com/800x200?text=Blogzy+Modern+Blog+Platform)

## Overview
Blogzy is a modern, scalable blogging platform built with a microservices architecture and deployed on Kubernetes. This project demonstrates best practices for cloud-native application development, DevOps, and modern web development. It's designed to be a comprehensive, production-ready application worthy of showcasing in your portfolio. 🚀

## 🌟 Features

- **User Authentication**: Secure JWT-based authentication system 🔐
- **Blog Management**: Create, read, update, and delete blog posts 📝
- **Tagging System**: Organize posts with tags 🏷️
- **Comments**: Engage with readers through comments 💬
- **Responsive Design**: Modern UI that works on all devices 📱
- **Markdown Support**: Write posts using Markdown ✍️
- **Search Functionality**: Find posts by title, content, or tags 🔍
- **User Profiles**: Customize your profile and view your posts 👤
- **RESTful API**: Well-documented API for blog management 🌐
- **CI/CD Pipeline**: Automated builds and deployments with GitHub Actions ⚙️
- **Kubernetes Deployment**: Production-ready Kubernetes manifests and Helm charts 🚢
- **Monitoring**: Comprehensive monitoring with Prometheus and Grafana 📊
- **Logging**: Centralized logging with EFK stack 📋
- **AWS Integration**: Deployment to AWS EKS with RDS for PostgreSQL ☁️
- **Scalability**: Horizontal scaling for all components 📈
- **Security**: Best practices for application and infrastructure security 🔒

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library with hooks and functional components
- **React Router**: For client-side routing and navigation
- **React Query**: For efficient data fetching and caching
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Formik & Yup**: Form handling and validation
- **React Quill**: Rich text editor for blog posts
- **Axios**: HTTP client for API requests
- **Context API**: For state management
- **React Testing Library**: For component testing

### Backend
- **Flask**: Lightweight Python web framework
- **Blueprints**: For modular API organization
- **SQLAlchemy ORM**: For database interactions
- **Marshmallow**: For serialization/deserialization
- **JWT**: For secure authentication
- **PostgreSQL**: Robust relational database
- **Flask-Migrate**: For database migrations
- **Flask-CORS**: For cross-origin resource sharing
- **Pytest**: For unit and integration testing

### DevOps & Infrastructure
- **Docker**: For containerization and consistent environments
- **Kubernetes**: For container orchestration and scaling
- **AWS EKS**: Managed Kubernetes service
- **AWS RDS**: Managed PostgreSQL database
- **GitHub Actions**: For CI/CD automation
- **Helm**: For Kubernetes package management
- **Prometheus**: For metrics collection and alerting
- **Grafana**: For metrics visualization and dashboards
- **EFK Stack**: For centralized logging
  - **Elasticsearch**: For log storage and indexing
  - **Fluentd**: For log collection and forwarding
  - **Kibana**: For log visualization and analysis
- **Nginx**: For serving static content and reverse proxy
- **Let's Encrypt**: For SSL/TLS certificates

## 🏗️ Architecture

The application follows a modern microservices architecture with the following components:

![Architecture Diagram](https://via.placeholder.com/800x400?text=Blogzy+Architecture+Diagram)

1. **Frontend Service**: React SPA served by Nginx
   - Responsive UI with Tailwind CSS
   - Client-side routing with React Router
   - State management with Context API and React Query
   - Form handling with Formik and Yup

2. **Backend Service**: Flask API with RESTful endpoints
   - Modular organization with Blueprints
   - JWT authentication and authorization
   - Database access via SQLAlchemy ORM
   - API documentation with Swagger/OpenAPI

3. **Database Service**: PostgreSQL for data persistence
   - Relational data model with proper indexing
   - Managed by AWS RDS in production
   - Migrations handled by Flask-Migrate

4. **Monitoring Stack**: Prometheus and Grafana
   - Metrics collection from all services
   - Custom dashboards for application insights
   - Alerting for critical issues

5. **Logging Stack**: EFK (Elasticsearch, Fluentd, Kibana)
   - Centralized log collection and storage
   - Log analysis and visualization
   - Search capabilities for troubleshooting

6. **CI/CD Pipeline**: GitHub Actions
   - Automated testing for backend and frontend
   - Docker image building and pushing
   - Deployment to Kubernetes with Helm

## 📋 Prerequisites
- Docker and Docker Compose 🐳
- Kubernetes cluster (for production deployment) 🖥️
- Node.js 18+ and npm 📦
- Python 3.11+ 🐍
- AWS Account (for cloud deployment) ☁️
- kubectl and Helm CLI tools 🧰

## 🚀 Getting Started

### Local Development with Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blogzy-k8s.git
   cd blogzy-k8s
   ```

2. Start the development environment:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:12000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

### Running Frontend and Backend Separately

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend:
   ```bash
   flask run --host=0.0.0.0 --port=5000
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend:
   ```bash
   npm start
   ```

## 🌐 Kubernetes Deployment

### Using kubectl
1. Apply Kubernetes configurations:
   ```bash
   kubectl apply -f k8s/
   ```

2. Access the application:
   ```bash
   kubectl get ingress -n blogzy
   ```

### Using Helm
1. Update the Helm values in `helm/blogzy/values.yaml`

2. Deploy the application:
   ```bash
   helm install blogzy ./helm/blogzy
   ```

3. Deploy monitoring (Prometheus & Grafana):
   ```bash
   helm install monitoring ./helm/monitoring
   ```

4. Deploy logging (EFK stack):
   ```bash
   helm install logging ./helm/logging
   ```

### AWS Deployment

Blogzy is configured to deploy on AWS EKS with RDS for PostgreSQL:

1. Create an EKS cluster:
   ```bash
   eksctl create cluster --name blogzy-cluster --region us-east-1 --nodegroup-name standard-nodes --node-type t3.medium --nodes 3 --nodes-min 1 --nodes-max 4
   ```

2. Create an RDS PostgreSQL instance:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier blogzy-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username postgres \
     --master-user-password <your-password> \
     --allocated-storage 20
   ```

3. Configure GitHub repository secrets for CI/CD:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `EKS_CLUSTER_NAME`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `DB_PASSWORD`
   - `JWT_SECRET`

4. Trigger the deployment workflow in GitHub Actions

### 📊 Monitoring and Logging

The application includes a comprehensive monitoring and logging setup:

#### Monitoring with Prometheus and Grafana
- **Prometheus**: Collects metrics from the application and Kubernetes
  - Application metrics: Request rate, error rate, response time
  - System metrics: CPU, memory, disk usage
  - Database metrics: Query performance, connection count
- **Grafana**: Provides visualization dashboards for the collected metrics
  - Pre-configured dashboards for all components
  - Alerting for critical issues
  - Access Grafana at: `https://grafana.blogzy.example.com` (default credentials: admin/admin)

#### Logging with EFK Stack
- **Elasticsearch**: Stores and indexes logs
  - Full-text search capabilities
  - Log retention policies
- **Fluentd**: Collects logs from containers and forwards them to Elasticsearch
  - Automatic parsing of log formats
  - Enrichment with metadata
- **Kibana**: Provides a UI for searching and visualizing logs
  - Custom dashboards for application logs
  - Log analysis and visualization
  - Access Kibana at: `https://kibana.blogzy.example.com`

## ⚙️ CI/CD Pipeline with GitHub Actions

The CI/CD pipeline is configured to automate the building and deployment of the Blogzy application using GitHub Actions:

1. **Continuous Integration**:
   - Run tests for backend and frontend
   - Lint code for quality and style
   - Build Docker images
   - Push images to Docker Hub on every push to main

2. **Continuous Deployment**:
   - Manual trigger for deployment to AWS EKS
   - Deploy application, monitoring, and logging stacks
   - Verify deployment success
   - Zero-downtime deployment with rolling updates

![CI/CD Pipeline](https://via.placeholder.com/800x300?text=Blogzy+CI/CD+Pipeline)

## 📁 Project Structure

```
blogzy-k8s/
├── .github/
│   └── workflows/
│       └── ci-cd.yaml              # CI/CD pipeline configuration
├── backend/
│   ├── app/
│   │   ├── api/                    # API endpoints
│   │   │   └── v1/                 # API version 1
│   │   ├── models/                 # Database models
│   │   ├── schemas/                # Serialization schemas
│   │   └── config/                 # Application configuration
│   ├── tests/                      # Backend tests
│   ├── Dockerfile                  # Backend Docker configuration
│   └── requirements.txt            # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API services
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Utility functions
│   │   ├── context/                # React context providers
│   │   └── assets/                 # Static assets
│   ├── Dockerfile                  # Frontend Docker configuration
│   └── package.json                # npm dependencies
├── k8s/                            # Kubernetes manifests
│   ├── namespace.yaml
│   ├── postgres-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ingress.yaml
├── helm/                           # Helm charts
│   ├── blogzy/                     # Application chart
│   │   ├── templates/
│   │   ├── Chart.yaml
│   │   └── values.yaml
│   ├── monitoring/                 # Monitoring chart
│   │   ├── templates/
│   │   ├── Chart.yaml
│   │   └── values.yaml
│   └── logging/                    # Logging chart
│       ├── templates/
│       ├── Chart.yaml
│       └── values.yaml
├── docs/                           # Documentation
│   ├── architecture.md
│   ├── development-guide.md
│   ├── api-reference.md
│   └── deployment-guide.md
└── docker-compose.yml              # Local development configuration
```

## 📚 Documentation

Comprehensive documentation is available in the `docs` directory:

- [Architecture Overview](docs/architecture.md) - Detailed system architecture
- [Development Guide](docs/development-guide.md) - Guide for developers
- [API Reference](docs/api-reference.md) - Complete API documentation
- [Deployment Guide](docs/deployment-guide.md) - Deployment instructions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -am 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Flask](https://flask.palletsprojects.com/)
- [React](https://reactjs.org/)
- [Kubernetes](https://kubernetes.io/)
- [Helm](https://helm.sh/)
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [Elasticsearch](https://www.elastic.co/)
- [AWS](https://aws.amazon.com/)
