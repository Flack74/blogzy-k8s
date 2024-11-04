# Kubernetes Configuration for Blogzy

This directory contains Kubernetes configuration files for deploying the Blogzy application. It includes the necessary manifests to run the application in a Kubernetes cluster.

## Contents

- `deployment.yaml`: Defines the deployment configuration for the Blogzy application.
- `service.yaml`: Defines the service configuration to expose the Blogzy application.
- `ingress.yaml` (if applicable): Defines the ingress configuration for routing external traffic to the application.

## Prerequisites

- A Kubernetes cluster (Minikube or any cloud provider)
- `kubectl` command-line tool installed and configured
- Access to the Docker image repository where the application image is stored

## Deployment Steps

1. **Build and Push Docker Image**: Ensure that the Docker image for the Blogzy application is built and pushed to a Docker registry.

   ```bash
   docker build -t your-dockerhub-username/blogzy-app .
   docker push your-dockerhub-username/blogzy-app
   ```

2. **Apply Kubernetes Manifests**: Use `kubectl` to apply the configuration files to your Kubernetes cluster.

   ```bash
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   ```

   If you're using an ingress controller, apply the ingress configuration as well:

   ```bash
   kubectl apply -f ingress.yaml
   ```

3. **Verify Deployment**: Check the status of the deployment and services.

   ```bash
   kubectl get deployments
   kubectl get services
   ```

## Accessing the Application

Once deployed, you can access the application through the service created. If you're using Minikube, you may need to run:

```bash
minikube service <service-name>
```

Replace `<service-name>` with the name of the service defined in `service.yaml`.

## Cleanup

To remove the application from the Kubernetes cluster, run:

```bash
kubectl delete -f deployment.yaml
kubectl delete -f service.yaml
kubectl delete -f ingress.yaml
```

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../LICENSE) file for details.
