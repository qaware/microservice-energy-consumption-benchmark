cluster_name="green-eks-k8s"
cluster_region="eu-north-1"
aws_account_id="204306537988"

# Create OIDC provider

oidc_id=$(aws eks describe-cluster --name $cluster_name --region $cluster_region --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)

echo "The OIDC issuer id for the cluster $cluster_name is $oidc_id"

if [ -z "$(aws iam list-open-id-connect-providers | grep $oidc_id | cut -d "/" -f4)" ] ; then
    echo "Creating OIDC provider"
    eksctl utils associate-iam-oidc-provider --cluster $cluster_name --approve
else
    echo "OIDC provider already exists"
fi


# Setup loadbalancer controller

# The AWSLoadBalancerControllerIAMPolicy is a custom IAM policy that allows the AWS Load Balancer Controller to create and manage the required resources in the AWS account.
# It was created once using the AWS root account because our IAM users do not have the required permissions to create IAM policies.

## Update IAM role for Load Balancer Controller

envsubst >load-balancer-role-trust-policy.json <infrastructure/exposed-services-for-green-metrics-tool/templates/load-balancer-role-trust-policy.json
aws iam update-assume-role-policy --role-name AmazonEKSLoadBalancerControllerRole --policy-document file://load-balancer-role-trust-policy.json

## Add load balancer controller service account

envsubst >aws-load-balancer-controller-service-account.yaml <infrastructure/exposed-services-for-green-metrics-tool/templates/aws-load-balancer-controller-service-account.yaml
kubectl apply -f aws-load-balancer-controller-service-account.yaml


## Install LoadBalancer Controller

helm repo add eks https://aws.github.io/eks-charts
helm repo update eks

helm upgrade aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --install \
  --wait \
  --set clusterName=$cluster_name \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller


# Install Hoverfly using Kustomize

kubectl apply -k infrastructure/exposed-services-for-green-metrics-tool/hoverfly --wait


# Add AWS EBS CSI Driver - you have to do it manually at the moment

envsubst >eks-ebs-csi-driver-role-trust-policy.json <infrastructure/exposed-services-for-green-metrics-tool/templates/eks-ebs-csi-driver-role-trust-policy.json
aws iam update-assume-role-policy --role-name AmazonEKS_EBS_CSI_DriverRole --policy-document file://eks-ebs-csi-driver-role-trust-policy.json

eksctl create addon --name aws-ebs-csi-driver --cluster $cluster_name --region $cluster_region --service-account-role-arn arn:aws:iam::$aws_account_id:role/AmazonEKS_EBS_CSI_DriverRole --force


# Install PostgreSQL Helm-Chart

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update bitnami

helm upgrade postgres bitnami/postgresql \
  -n postgres \
  --install \
  --wait \
  --create-namespace \
  --values infrastructure/exposed-services-for-green-metrics-tool/postgres-helm-release-values.yaml


# Output loadbalancer addresses
# (unfortunately, this only works properly when the services are newly created, if it doesn't work, run
# remove-exposed-services-for-green-metrics-tool.sh and then this script again)

echo ""
echo ""

echo "You can to PostgreSQL at $(kubectl get svc postgres-postgresql -n postgres -o json | jq -r '.status.loadBalancer.ingress[0].hostname'):5432"
echo "You can to Hoverfly at $(kubectl get ingress ingress-hoverfly -n hoverfly -o json | jq -r '.status.loadBalancer.ingress[0].hostname'):80"