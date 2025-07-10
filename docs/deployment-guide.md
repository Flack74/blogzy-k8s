# Blogzy Deployment Guide

This guide provides instructions for deploying the Blogzy application to a Kubernetes cluster.

## Prerequisites

- Kubernetes cluster (e.g., Minikube, EKS, GKE, AKS)
- kubectl configured to connect to your cluster
- Helm 3.x (for Helm-based deployment)
- Docker and Docker Hub account (or other container registry)

## Deployment Options

Blogzy can be deployed using either kubectl with YAML manifests or Helm charts.

## Deployment with kubectl

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blogzy-k8s.git
cd blogzy-k8s
```

### 2. Build and Push Docker Images

```bash
# Set your Docker Hub username
DOCKER_USERNAME=yourusername

# Build and push backend image
docker build -t $DOCKER_USERNAME/blogzy-backend:latest ./backend
docker push $DOCKER_USERNAME/blogzy-backend:latest

# Build and push frontend image
docker build -t $DOCKER_USERNAME/blogzy-frontend:latest ./frontend
docker push $DOCKER_USERNAME/blogzy-frontend:latest
```

### 3. Update Image References

Update the image references in the Kubernetes manifests:

```bash
# Replace image references in deployment files
sed -i "s|image:.*blogzy-backend.*|image: $DOCKER_USERNAME/blogzy-backend:latest|g" k8s/backend-deployment.yaml
sed -i "s|image:.*blogzy-frontend.*|image: $DOCKER_USERNAME/blogzy-frontend:latest|g" k8s/frontend-deployment.yaml
```

### 4. Create Kubernetes Resources

```bash
# Create namespace and resources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### 5. Verify Deployment

```bash
# Check if pods are running
kubectl get pods -n blogzy

# Check services
kubectl get services -n blogzy

# Check ingress
kubectl get ingress -n blogzy
```

## Deployment with Helm

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blogzy-k8s.git
cd blogzy-k8s
```

### 2. Build and Push Docker Images

```bash
# Set your Docker Hub username
DOCKER_USERNAME=yourusername

# Build and push backend image
docker build -t $DOCKER_USERNAME/blogzy-backend:latest ./backend
docker push $DOCKER_USERNAME/blogzy-backend:latest

# Build and push frontend image
docker build -t $DOCKER_USERNAME/blogzy-frontend:latest ./frontend
docker push $DOCKER_USERNAME/blogzy-frontend:latest
```

### 3. Update Helm Values

Edit `helm/blogzy/values.yaml` to update the image references and other configuration:

```yaml
global:
  namespace: blogzy
  domain: blogzy.example.com
  dockerRegistry: docker.io/yourusername

backend:
  image:
    repository: blogzy-backend
    tag: latest
    # ...

frontend:
  image:
    repository: blogzy-frontend
    tag: latest
    # ...
```

### 4. Deploy with Helm

```bash
# Deploy the application
helm install blogzy ./helm/blogzy

# Deploy monitoring (optional)
helm install monitoring ./helm/monitoring

# Deploy logging (optional)
helm install logging ./helm/logging
```

### 5. Verify Deployment

```bash
# Check Helm releases
helm list

# Check if pods are running
kubectl get pods -n blogzy

# Check services
kubectl get services -n blogzy

# Check ingress
kubectl get ingress -n blogzy
```

## Accessing the Application

After deployment, you can access the application using the Ingress hostname:

```bash
# Get the Ingress hostname
kubectl get ingress -n blogzy
```

Add the hostname to your local `/etc/hosts` file or configure DNS to point to the Ingress IP address.

## Monitoring and Logging

### Monitoring with Prometheus and Grafana

If you deployed the monitoring stack, you can access Grafana at:

```
https://grafana.blogzy.example.com
```

Default credentials:
- Username: admin
- Password: admin

### Logging with EFK Stack

If you deployed the logging stack, you can access Kibana at:

```
https://kibana.blogzy.example.com
```

## Scaling the Application

### Horizontal Pod Autoscaler

You can set up Horizontal Pod Autoscaler (HPA) for the frontend and backend:

```bash
# Create HPA for backend
kubectl autoscale deployment backend -n blogzy --cpu-percent=80 --min=2 --max=10

# Create HPA for frontend
kubectl autoscale deployment frontend -n blogzy --cpu-percent=80 --min=2 --max=10
```

### Manual Scaling

You can manually scale the deployments:

```bash
# Scale backend to 5 replicas
kubectl scale deployment backend -n blogzy --replicas=5

# Scale frontend to 3 replicas
kubectl scale deployment frontend -n blogzy --replicas=3
```

## Database Management

### Backup PostgreSQL Database

```bash
# Get the PostgreSQL pod name
POSTGRES_POD=$(kubectl get pods -n blogzy -l app=postgres -o jsonpath="{.items[0].metadata.name}")

# Create a backup
kubectl exec -n blogzy $POSTGRES_POD -- pg_dump -U postgres blogzy > blogzy_backup.sql
```

### Restore PostgreSQL Database

```bash
# Get the PostgreSQL pod name
POSTGRES_POD=$(kubectl get pods -n blogzy -l app=postgres -o jsonpath="{.items[0].metadata.name}")

# Copy the backup file to the pod
kubectl cp blogzy_backup.sql blogzy/$POSTGRES_POD:/tmp/

# Restore the database
kubectl exec -n blogzy $POSTGRES_POD -- psql -U postgres -d blogzy -f /tmp/blogzy_backup.sql
```

## Upgrading the Application

### Upgrading with kubectl

1. Update the Docker images:

```bash
# Build and push new versions
docker build -t $DOCKER_USERNAME/blogzy-backend:v2 ./backend
docker push $DOCKER_USERNAME/blogzy-backend:v2

docker build -t $DOCKER_USERNAME/blogzy-frontend:v2 ./frontend
docker push $DOCKER_USERNAME/blogzy-frontend:v2
```

2. Update the deployment manifests with the new image tags.

3. Apply the updated manifests:

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### Upgrading with Helm

1. Update the Docker images:

```bash
# Build and push new versions
docker build -t $DOCKER_USERNAME/blogzy-backend:v2 ./backend
docker push $DOCKER_USERNAME/blogzy-backend:v2

docker build -t $DOCKER_USERNAME/blogzy-frontend:v2 ./frontend
docker push $DOCKER_USERNAME/blogzy-frontend:v2
```

2. Update the Helm values with the new image tags.

3. Upgrade the Helm release:

```bash
helm upgrade blogzy ./helm/blogzy
```

## Troubleshooting

### Common Issues

1. **Pods not starting**:
   ```bash
   # Check pod status
   kubectl get pods -n blogzy
   
   # Check pod details
   kubectl describe pod <pod-name> -n blogzy
   
   # Check pod logs
   kubectl logs <pod-name> -n blogzy
   ```

2. **Database connection issues**:
   ```bash
   # Check if PostgreSQL pod is running
   kubectl get pods -n blogzy -l app=postgres
   
   # Check PostgreSQL logs
   kubectl logs <postgres-pod-name> -n blogzy
   ```

3. **Ingress not working**:
   ```bash
   # Check ingress status
   kubectl describe ingress -n blogzy
   
   # Check ingress controller logs
   kubectl logs -n ingress-nginx <ingress-controller-pod-name>
   ```

4. **Persistent volume issues**:
   ```bash
   # Check persistent volume claims
   kubectl get pvc -n blogzy
   
   # Check persistent volumes
   kubectl get pv
   ```

## Cleanup

### Cleanup with kubectl

```bash
# Delete all resources in the blogzy namespace
kubectl delete namespace blogzy
```

### Cleanup with Helm

```bash
# Delete Helm releases
helm uninstall blogzy
helm uninstall monitoring
helm uninstall logging

# Delete namespace
kubectl delete namespace blogzy
kubectl delete namespace monitoring
kubectl delete namespace logging
```