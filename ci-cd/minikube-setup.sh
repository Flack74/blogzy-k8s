#!/bin/bash

# Start Minikube
minikube start

# Set the Docker environment to use Minikube's Docker daemon
eval $(minikube docker-env)

# Apply Kubernetes configurations
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Get the service URL
minikube service blogzy-service --url
