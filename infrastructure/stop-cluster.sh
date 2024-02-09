#!/bin/sh

# This will also remove the ingresses and thus the load balancers which used to block the deletion of the cluster.
sh infrastructure/remove-exposed-services-for-green-metrics-tool.sh

# Actual deletion of the cluster
eksctl delete cluster --region=eu-north-1 --name=green-eks-k8s
aws cloudformation delete-stack --region eu-north-1 --stack-name eksctl-green-eks-k8s-cluster

# Because EBS volumes are provisioned dynamically by the EKS-EBS-Provisioner, they are not included in the CloudFormation stack and must be deleted manually
sh infrastructure/remove-ebs-volumes.sh
