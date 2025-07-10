# AWS Deployment Guide for Blogzy

This guide provides detailed instructions for deploying the Blogzy application on AWS using EKS (Elastic Kubernetes Service) and RDS (Relational Database Service).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Account Setup](#aws-account-setup)
3. [Setting Up AWS CLI](#setting-up-aws-cli)
4. [Creating an EKS Cluster](#creating-an-eks-cluster)
5. [Setting Up PostgreSQL with RDS](#setting-up-postgresql-with-rds)
6. [Configuring GitHub Actions](#configuring-github-actions)
7. [Deploying the Application](#deploying-the-application)
8. [Setting Up DNS and SSL](#setting-up-dns-and-ssl)
9. [Monitoring and Logging](#monitoring-and-logging)
10. [Scaling the Application](#scaling-the-application)
11. [Backup and Disaster Recovery](#backup-and-disaster-recovery)
12. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following:

- AWS account with administrative access
- AWS CLI installed and configured
- kubectl installed
- Helm installed
- eksctl installed
- Docker installed
- GitHub account with access to the repository

## AWS Account Setup

1. Create an AWS account if you don't have one: [AWS Sign Up](https://aws.amazon.com/)
2. Create an IAM user with programmatic access:
   - Go to IAM in the AWS Console
   - Create a new user with programmatic access
   - Attach the `AdministratorAccess` policy (for simplicity, but consider using more restricted policies in production)
   - Save the Access Key ID and Secret Access Key

## Setting Up AWS CLI

1. Install the AWS CLI:
   ```bash
   # For macOS
   brew install awscli

   # For Ubuntu
   sudo apt-get update
   sudo apt-get install awscli

   # For Windows
   # Download and run the installer from https://aws.amazon.com/cli/
   ```

2. Configure the AWS CLI:
   ```bash
   aws configure
   ```
   Enter your Access Key ID, Secret Access Key, default region (e.g., us-east-1), and output format (json).

## Creating an EKS Cluster

1. Install eksctl if you haven't already:
   ```bash
   # For macOS
   brew tap weaveworks/tap
   brew install weaveworks/tap/eksctl

   # For Linux
   curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
   sudo mv /tmp/eksctl /usr/local/bin
   ```

2. Create an EKS cluster:
   ```bash
   eksctl create cluster \
     --name blogzy-cluster \
     --region us-east-1 \
     --nodegroup-name standard-nodes \
     --node-type t3.medium \
     --nodes 3 \
     --nodes-min 1 \
     --nodes-max 4 \
     --with-oidc \
     --ssh-access \
     --ssh-public-key ~/.ssh/id_rsa.pub \
     --managed
   ```

3. Verify the cluster creation:
   ```bash
   kubectl get nodes
   ```

4. Install the AWS Load Balancer Controller:
   ```bash
   helm repo add eks https://aws.github.io/eks-charts
   helm repo update

   eksctl utils associate-iam-oidc-provider \
     --region us-east-1 \
     --cluster blogzy-cluster \
     --approve

   eksctl create iamserviceaccount \
     --cluster=blogzy-cluster \
     --namespace=kube-system \
     --name=aws-load-balancer-controller \
     --attach-policy-arn=arn:aws:iam::111122223333:policy/AWSLoadBalancerControllerIAMPolicy \
     --override-existing-serviceaccounts \
     --approve

   helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
     -n kube-system \
     --set clusterName=blogzy-cluster \
     --set serviceAccount.create=false \
     --set serviceAccount.name=aws-load-balancer-controller
   ```

## Setting Up PostgreSQL with RDS

1. Create a security group for RDS:
   ```bash
   aws ec2 create-security-group \
     --group-name blogzy-rds-sg \
     --description "Security group for Blogzy RDS" \
     --vpc-id $(aws eks describe-cluster --name blogzy-cluster --query "cluster.resourcesVpcConfig.vpcId" --output text)
   ```

2. Add an inbound rule to allow traffic from the EKS cluster:
   ```bash
   aws ec2 authorize-security-group-ingress \
     --group-id sg-xxxxxxxxxxxxxxxxx \
     --protocol tcp \
     --port 5432 \
     --source-group $(aws eks describe-cluster --name blogzy-cluster --query "cluster.resourcesVpcConfig.securityGroupIds[0]" --output text)
   ```

3. Create an RDS PostgreSQL instance:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier blogzy-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --engine-version 15.3 \
     --master-username postgres \
     --master-user-password <your-secure-password> \
     --allocated-storage 20 \
     --vpc-security-group-ids sg-xxxxxxxxxxxxxxxxx \
     --db-subnet-group-name default \
     --backup-retention-period 7 \
     --multi-az \
     --storage-type gp2 \
     --publicly-accessible \
     --db-name blogzy
   ```

4. Get the RDS endpoint:
   ```bash
   aws rds describe-db-instances \
     --db-instance-identifier blogzy-db \
     --query "DBInstances[0].Endpoint.Address" \
     --output text
   ```

## Configuring GitHub Actions

1. Add the following secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_REGION`: Your AWS region (e.g., us-east-1)
   - `EKS_CLUSTER_NAME`: Your EKS cluster name (e.g., blogzy-cluster)
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password
   - `DB_PASSWORD`: The password for your RDS instance
   - `JWT_SECRET`: A secure random string for JWT authentication

2. The GitHub Actions workflow is already configured in `.github/workflows/ci-cd.yaml` to:
   - Run tests for backend and frontend
   - Build Docker images
   - Push images to Docker Hub
   - Deploy to AWS EKS when manually triggered

## Deploying the Application

1. Update the Helm values in `helm/blogzy/values.yaml` with your RDS endpoint:
   ```yaml
   global:
     aws:
       rds:
         enabled: true
   
   secrets:
     rds:
       endpoint: "blogzy-db.xxxxxxxx.us-east-1.rds.amazonaws.com"
   ```

2. Trigger the deployment workflow in GitHub Actions:
   - Go to the "Actions" tab in your GitHub repository
   - Select the "CI/CD Pipeline" workflow
   - Click "Run workflow"
   - Set "Deploy to AWS" to "true"
   - Click "Run workflow"

3. Monitor the deployment:
   ```bash
   kubectl get pods -n blogzy
   kubectl get services -n blogzy
   kubectl get ingress -n blogzy
   ```

## Setting Up DNS and SSL

1. Get the Load Balancer address:
   ```bash
   kubectl get ingress -n blogzy -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'
   ```

2. Create a CNAME record in your DNS provider pointing to this address:
   - Record type: CNAME
   - Name: blogzy (or your subdomain)
   - Value: The Load Balancer address
   - TTL: 300

3. Install cert-manager for SSL certificates:
   ```bash
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml
   ```

4. Create a ClusterIssuer for Let's Encrypt:
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-prod
   spec:
     acme:
       server: https://acme-v02.api.letsencrypt.org/directory
       email: your-email@example.com
       privateKeySecretRef:
         name: letsencrypt-prod
       solvers:
       - http01:
           ingress:
             class: nginx
   ```

5. Apply the ClusterIssuer:
   ```bash
   kubectl apply -f cluster-issuer.yaml
   ```

6. Update the ingress to use TLS:
   ```bash
   helm upgrade --install blogzy ./helm/blogzy \
     --namespace blogzy \
     --set ingress.tls.enabled=true \
     --set ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod
   ```

## Monitoring and Logging

1. Deploy the monitoring stack:
   ```bash
   helm upgrade --install monitoring ./helm/monitoring \
     --namespace monitoring \
     --create-namespace
   ```

2. Deploy the logging stack:
   ```bash
   helm upgrade --install logging ./helm/logging \
     --namespace logging \
     --create-namespace
   ```

3. Access Grafana:
   ```bash
   kubectl port-forward svc/grafana 3000:80 -n monitoring
   ```
   Open http://localhost:3000 in your browser (default credentials: admin/admin)

4. Access Kibana:
   ```bash
   kubectl port-forward svc/kibana 5601:5601 -n logging
   ```
   Open http://localhost:5601 in your browser

## Scaling the Application

1. Enable Horizontal Pod Autoscaling:
   ```bash
   kubectl apply -f - <<EOF
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: backend-hpa
     namespace: blogzy
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: backend
     minReplicas: 2
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 70
   EOF
   ```

2. Enable Cluster Autoscaler:
   ```bash
   eksctl create iamserviceaccount \
     --cluster=blogzy-cluster \
     --namespace=kube-system \
     --name=cluster-autoscaler \
     --attach-policy-arn=arn:aws:iam::111122223333:policy/AmazonEKSClusterAutoscalerPolicy \
     --override-existing-serviceaccounts \
     --approve

   kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

   kubectl -n kube-system annotate deployment.apps/cluster-autoscaler cluster-autoscaler.kubernetes.io/safe-to-evict="false"

   kubectl -n kube-system edit deployment.apps/cluster-autoscaler
   ```
   Add the following arguments to the cluster-autoscaler container:
   ```
   --balance-similar-node-groups
   --skip-nodes-with-system-pods=false
   ```

## Backup and Disaster Recovery

1. Enable automated backups for RDS:
   ```bash
   aws rds modify-db-instance \
     --db-instance-identifier blogzy-db \
     --backup-retention-period 7 \
     --preferred-backup-window "03:00-04:00" \
     --apply-immediately
   ```

2. Set up a snapshot schedule:
   ```bash
   aws rds create-db-snapshot \
     --db-instance-identifier blogzy-db \
     --db-snapshot-identifier blogzy-manual-snapshot
   ```

3. Set up cross-region replication (optional):
   ```bash
   aws rds create-db-instance-read-replica \
     --db-instance-identifier blogzy-db-replica \
     --source-db-instance-identifier blogzy-db \
     --availability-zone us-west-1a
   ```

## Troubleshooting

### Common Issues

#### Pods Not Starting
```bash
kubectl describe pod <pod-name> -n blogzy
kubectl logs <pod-name> -n blogzy
```

#### Database Connection Issues
```bash
# Check if the database is accessible
kubectl run -it --rm --image=postgres:15-alpine postgres-client -- psql -h <rds-endpoint> -U postgres -d blogzy
```

#### Ingress Issues
```bash
kubectl describe ingress -n blogzy
kubectl get events -n blogzy
```

#### Load Balancer Issues
```bash
kubectl describe service -n blogzy
aws elb describe-load-balancers
```

### Getting Help

If you encounter issues not covered in this guide:

1. Check the AWS EKS documentation: https://docs.aws.amazon.com/eks/
2. Check the Kubernetes documentation: https://kubernetes.io/docs/
3. Open an issue in the GitHub repository
4. Contact AWS Support if you have an AWS support plan

---

This guide provides a comprehensive approach to deploying Blogzy on AWS using EKS and RDS. By following these steps, you'll have a scalable, resilient, and production-ready application running in the cloud.