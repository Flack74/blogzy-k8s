# Troubleshooting Guide for Blogzy Application

## Common Issues

### 1. Application Not Starting
- **Check logs**: Use `kubectl logs <pod-name>` to view application logs.
- **Configuration errors**: Ensure environment variables are set correctly.

### 2. Service Not Accessible
- **Check service status**: Use `kubectl get services` to confirm the service is running.
- **NodePort configuration**: Make sure you're accessing the correct port on the node.

### 3. Scaling Issues
- **Pod replica issues**: Use `kubectl get pods` to check if all replicas are running.
- **Resource limits**: Verify if resource limits are too restrictive.

### 4. Networking Issues
- **Network policy issues**: Ensure that network policies are configured correctly to allow traffic.
