#!/bin/sh

eksctl delete cluster --region=eu-north-1 --name=green-eks-k8s
aws cloudformation delete-stack --region eu-north-1 --stack-name eksctl-green-eks-k8s-cluster
